// scripts/blog-pipeline/lib/publish-post.js
const fs = require('node:fs');
const path = require('node:path');

function publishPost({
  draft,
  publishDate,
  repoRoot,
  coverImageSourcePath,
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

  fs.writeFileSync(path.join(postDir, 'index.md'), `${frontmatter}\n${draft.body}\n`, 'utf8');
  fs.copyFileSync(coverImageSourcePath, path.join(postDir, 'cover.png'));

  return { postDir, folderName };
}

module.exports = { publishPost };
