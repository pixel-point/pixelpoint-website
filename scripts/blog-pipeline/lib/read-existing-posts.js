// scripts/blog-pipeline/lib/read-existing-posts.js
const fs = require('node:fs');
const path = require('node:path');

const matter = require('gray-matter');

// Reused rather than reimplemented so the pipeline's links stay correct if
// BLOG_BASE_PATH or the date-prefix convention ever changes.
const getBlogPostPath = require('../../../src/utils/get-blog-post-path');

function readExistingPosts(repoRoot) {
  const postsDir = path.join(repoRoot, 'content', 'posts');
  return fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexPath = path.join(postsDir, entry.name, 'index.md');
      if (!fs.existsSync(indexPath)) return null;
      const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
      // The path lets a draft link to an existing post instead of
      // re-explaining what it already covers.
      return { title: data.title, summary: data.summary, path: getBlogPostPath(entry.name) };
    })
    .filter(Boolean);
}

module.exports = { readExistingPosts };
