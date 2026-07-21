// scripts/blog-pipeline/lib/filter-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { filterCandidates } = require('./filter-posts');

test('drops one-liners with no real content', () => {
  const posts = [
    { id: '1', text: 'People are having fun with Toolcraft.' },
    { id: '2', text: 'Behind the scenes of the launch video production for Railway. From initial request to final release in less than two weeks.' },
  ];
  const result = filterCandidates(posts);
  assert.deepEqual(result.map((p) => p.id), ['2']);
});

test('respects a custom minLength option', () => {
  const posts = [{ id: '1', text: 'short but ok' }];
  const result = filterCandidates(posts, { minLength: 5 });
  assert.equal(result.length, 1);
});
