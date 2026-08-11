// scripts/blog-pipeline/lib/publish-post.js
const fs = require('node:fs');
const path = require('node:path');
const { downloadPhotos, stripUnknownImages, stripUnusableVideos } = require('./post-media');

// Every post in a run shares publishDate, so the folder name comes down to the
// model-chosen slug. Two drafts landing on the same slug — a standalone post
// and a roundup about the same product, say — would otherwise overwrite each
// other, while the PR body and the Slack message still listed both titles: the
// reviewer would be told about a post that no longer exists.
function claimFolderName({ postsDir, publishDate, slug }) {
  const sanitized =
    slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'updates';

  const base = `${publishDate}-${sanitized}`;
  let name = base;
  for (let n = 2; fs.existsSync(path.join(postsDir, name)); n += 1) {
    name = `${base}-${n}`;
  }
  return name;
}

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
  const postsDir = path.join(repoRoot, 'content', 'posts');
  const folderName = claimFolderName({ postsDir, publishDate, slug: draft.slug });
  const postDir = path.join(postsDir, folderName);
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

module.exports = { publishPost, claimFolderName };
