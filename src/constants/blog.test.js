const test = require('node:test');
const assert = require('node:assert/strict');
const { BLOG_CATEGORIES } = require('./blog');

test('BLOG_CATEGORIES includes Updates', () => {
  assert.ok(BLOG_CATEGORIES.includes('Updates'));
});
