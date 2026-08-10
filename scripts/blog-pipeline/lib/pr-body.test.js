const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPrBody } = require('./pr-body');

const DRAFTS = [{ title: 'Introducing Aval' }, { title: "Toolcraft's New Release" }];

test('lists every draft title and the review checklist', () => {
  const body = buildPrBody({ drafts: DRAFTS });
  assert.ok(body.includes('- Introducing Aval'));
  assert.ok(body.includes("- Toolcraft's New Release"));
  assert.ok(body.includes('### Before merging'));
  assert.equal((body.match(/^- \[ \] /gm) || []).length, 4);
});

test('omits the skipped section entirely when nothing was skipped', () => {
  const body = buildPrBody({ drafts: DRAFTS, skipped: [] });
  assert.ok(!body.includes('Skipped as already covered'));
});

test('defaults to no skipped section when the caller omits the field', () => {
  assert.ok(!buildPrBody({ drafts: DRAFTS }).includes('Skipped as already covered'));
});

test('reports skipped groups with their source post urls and the overlapping title', () => {
  const body = buildPrBody({
    drafts: DRAFTS,
    skipped: [
      {
        posts: [{ url: 'https://x.com/i/web/status/1' }, { url: 'https://x.com/i/web/status/2' }],
        existingPostTitle: 'Build personal design tools with AI using Toolcraft',
      },
    ],
  });
  assert.ok(body.includes('### Skipped as already covered'));
  assert.ok(body.includes('https://x.com/i/web/status/1, https://x.com/i/web/status/2'));
  assert.ok(body.includes('overlaps "Build personal design tools with AI using Toolcraft"'));
  // Checklist items plus one per skipped group, so the reviewer ticks it off.
  assert.equal((body.match(/^- \[ \] /gm) || []).length, 5);
});

test('falls back to a readable phrase when the model names no overlapping post', () => {
  const body = buildPrBody({
    drafts: DRAFTS,
    skipped: [{ posts: [{ url: 'https://x.com/i/web/status/1' }], existingPostTitle: '' }],
  });
  assert.ok(body.includes('overlaps "an existing post"'));
});
