// scripts/blog-pipeline/lib/read-existing-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readExistingPosts } = require('./read-existing-posts');

test('reads title/summary from every post folder', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-blog-'));
  const postDir = path.join(repoRoot, 'content', 'posts', '2026-06-30-toolcraft');
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(
    path.join(postDir, 'index.md'),
    "---\ntitle: 'Toolcraft'\nsummary: A design tool\n---\nBody\n"
  );

  const posts = readExistingPosts(repoRoot);
  assert.deepEqual(posts, [{ title: 'Toolcraft', summary: 'A design tool' }]);
});
