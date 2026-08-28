// scripts/blog-pipeline/lib/read-author-handle.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readAuthorHandle } = require('./read-author-handle');

function makeRepoWithAuthors(authors) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-authors-'));
  fs.mkdirSync(path.join(repoRoot, 'content', 'posts'), { recursive: true });
  fs.writeFileSync(
    path.join(repoRoot, 'content', 'posts', 'post-authors.json'),
    JSON.stringify(authors)
  );
  return repoRoot;
}

test('extracts the handle from twitterUrl', () => {
  const repoRoot = makeRepoWithAuthors([
    { name: 'Alex Barashkov', twitterUrl: 'https://twitter.com/alex_barashkov' },
  ]);
  assert.equal(readAuthorHandle(repoRoot, 'Alex Barashkov'), 'alex_barashkov');
});

test('throws when the author has no twitterUrl', () => {
  const repoRoot = makeRepoWithAuthors([{ name: 'Kirill Bolotsky' }]);
  assert.throws(() => readAuthorHandle(repoRoot, 'Kirill Bolotsky'), /No twitterUrl found/);
});
