// scripts/blog-pipeline/lib/publish-post.js
const fs = require('node:fs');
const path = require('node:path');
const { downloadPhotos, stripUnknownImages, stripUnusableVideos } = require('./post-media');

// Async because it owns the post's images as well as its text: the body can
// only be finalised once we know which downloads actually succeeded, so
// fetching has to happen before index.md is written, not after.
async function publishPost({
  draft,
  publishDate,
  repoRoot,
  coverImageSourcePath,
  photos = [],
  videos = [],
  fetchImpl,
  author = 'Alex Barashkov',
  category = 'Updates',
}) {
  const slug = draft.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const folderName = `${publishDate}-${slug}`;
  const postDir = path.join(repoRoot, 'content', 'posts', folderName);
  fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = draft.title.replace(/'/g, "''");
  const escapedSummary = draft.summary.replace(/'/g, "''");
  const frontmatter = [
    '---',
    `title: '${escapedTitle}'`,
    `summary: '${escapedSummary}'`,
    `author: ${author}`,
    'cover: cover.png',
    `category: ${category}`,
    '---',
    '',
  ].join('\n');

  const saved = await downloadPhotos({ photos, destDir: postDir, fetchImpl });
  // Video posters are ordinary images as far as the site is concerned — they
  // live in the post folder and gatsby-node picks them up by filename.
  const savedPosters = await downloadPhotos({
    photos: videos.map((video) => ({ filename: video.posterFilename, url: video.posterUrl })),
    destDir: postDir,
    fetchImpl,
  });

  // Drop references to images that never landed — a download that 404s should
  // cost one image, not ship a broken image tag into a published post.
  const body = stripUnusableVideos(
    stripUnknownImages(
      draft.body,
      saved.map((photo) => photo.filename)
    ),
    savedPosters.map((poster) => poster.filename)
  );

  fs.writeFileSync(path.join(postDir, 'index.md'), `${frontmatter}\n${body}\n`, 'utf8');
  fs.copyFileSync(coverImageSourcePath, path.join(postDir, 'cover.png'));

  return { postDir, folderName, photos: saved, videos: savedPosters };
}

module.exports = { publishPost };
