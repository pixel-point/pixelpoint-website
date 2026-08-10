// scripts/blog-pipeline/lib/notify-slack.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { notifySlack } = require('./notify-slack');

test('POSTs the text as JSON to the webhook URL', async () => {
  let capturedUrl;
  let capturedBody;
  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedBody = JSON.parse(options.body);
    return { ok: true };
  };
  await notifySlack({ webhookUrl: 'https://hooks.slack.com/x', text: 'hello', fetchImpl: fakeFetch });
  assert.equal(capturedUrl, 'https://hooks.slack.com/x');
  assert.deepEqual(capturedBody, { text: 'hello' });
});

test('throws when the webhook responds with an error', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500 });
  await assert.rejects(
    () => notifySlack({ webhookUrl: 'https://hooks.slack.com/x', text: 'hi', fetchImpl: fakeFetch }),
    /Slack webhook failed: 500/
  );
});

const { buildDraftsMessage } = require('./notify-slack');

const DRAFTS = [{ title: 'Toolcraft update: a leaner AI harness' }, { title: 'Introducing Aval' }];

test('buildDraftsMessage leads with the PR link and lists every title', () => {
  const text = buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://github.com/o/r/pull/9' });
  assert.ok(text.startsWith('2 new monthly blog drafts ready for review: https://github.com/o/r/pull/9'));
  assert.ok(text.includes('• Toolcraft update: a leaner AI harness'));
  assert.ok(text.includes('• Introducing Aval'));
  assert.ok(text.includes('Vercel comments the preview link'));
});

test('buildDraftsMessage uses the singular for one draft', () => {
  const text = buildDraftsMessage({ drafts: [DRAFTS[0]], prUrl: 'https://x/1' });
  assert.ok(text.startsWith('New monthly blog draft ready for review:'));
});

test('buildDraftsMessage mentions skipped posts when there were any', () => {
  const text = buildDraftsMessage({
    drafts: DRAFTS,
    prUrl: 'https://x/1',
    skipped: [{ posts: [{}, {}] }, { posts: [{}] }],
  });
  assert.ok(text.includes('3 post(s) skipped as already covered'));
});

test('buildDraftsMessage says nothing about skips when there were none', () => {
  assert.ok(!buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://x/1' }).includes('skipped'));
});

test('the message never contains undefined', () => {
  // openDraftPr became async for the PR-create retry and run.js kept
  // destructuring it synchronously, so a real run posted "...review: undefined".
  const text = buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://x/1' });
  assert.ok(!text.includes('undefined'), text);
});
