// scripts/blog-pipeline/lib/publish-post.js
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { downloadPhotos, stripUnknownImages, stripUnusableVideos } = require('./post-media');

// Every post in a run shares publishDate, so the folder name comes down to the
// model-chosen slug. Two drafts landing on the same slug — a standalone post
// and a roundup about the same product, say — would otherwise overwrite each
// other, while the PR body and the Slack message still listed both titles: the
// reviewer would be told about a post that no longer exists.
function claimFolderName({ postsDir, publishDate, slug }) {
  const sanitized =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'updates';

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

  // A frame from the post's own video says far more than the shared
  // placeholder, and it is already in the folder — referencing it directly
  // avoids a second copy of the same bytes. Only a poster that survived the
  // download is eligible; a reference to a missing cover fails the build.
  const posterCover = savedPosters[0] && savedPosters[0].filename;
  let coverName = posterCover;
  if (!coverName) {
    coverName = `cover${path.extname(coverImageSourcePath) || '.png'}`;
    fs.copyFileSync(coverImageSourcePath, path.join(postDir, coverName));
  }

  // Serialised by gray-matter rather than hand-escaped: a model-written title
  // containing a newline, a colon or a quote would otherwise produce a file
  // that fails to parse, and the whole site build with it.
  const file = matter.stringify(`\n${body}\n`, {
    title: draft.title,
    summary: draft.summary,
    author,
    cover: coverName,
    category,
  });
  fs.writeFileSync(path.join(postDir, 'index.md'), file, 'utf8');

  return { postDir, folderName, photos: saved, videos: savedPosters, cover: coverName };
}

module.exports = { publishPost, claimFolderName };
