// scripts/blog-pipeline/lib/publish-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { publishPost } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = publishPost({
    draft: { title: "Alex's Update", summary: 'Summary text', slug: 'alex-update', body: 'Body text' },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes("title: 'Alex''s Update'") || written.includes("title: 'Alex\\'s Update'"));
  assert.ok(written.includes('author: Alex Barashkov'));
  assert.ok(written.includes('category: Updates'));
  assert.ok(written.includes('Body text'));
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
});
