// scripts/blog-pipeline/lib/read-author-handle.js
const fs = require('node:fs');
const path = require('node:path');

function readAuthorHandle(repoRoot, authorName) {
  const authorsPath = path.join(repoRoot, 'content', 'posts', 'post-authors.json');
  const authors = JSON.parse(fs.readFileSync(authorsPath, 'utf8'));
  const author = authors.find((a) => a.name === authorName);
  if (!author || !author.twitterUrl) {
    throw new Error(`No twitterUrl found for author "${authorName}" in post-authors.json`);
  }
  return new URL(author.twitterUrl).pathname.replace(/^\//, '');
}

module.exports = { readAuthorHandle };
