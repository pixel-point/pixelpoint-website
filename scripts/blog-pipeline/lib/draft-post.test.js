// scripts/blog-pipeline/lib/draft-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { draftPost, buildDraftPrompt } = require('./draft-post');

test('buildDraftPrompt tells the model to preserve I/we framing and write editorially', () => {
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('keep it first-person'));
  assert.ok(prompt.includes('I built a tool'));
  assert.ok(prompt.includes("Don't just reformat"));
});

test('draftPost parses the model JSON response into a draft object', async () => {
  const fakeDraft = { title: 'T', summary: 'S', slug: 'slug', body: 'Body' };
  const fakeClient = {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(fakeDraft) }],
      }),
    },
  };
  const result = await draftPost({
    qualifyingPosts: [{ text: 'I built X', url: 'https://x.com/1' }],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, fakeDraft);
});

test('draftPost ignores thinking blocks when reading the JSON', async () => {
  const fakeDraft = { title: 'T', summary: 'S', slug: 'slug', body: 'Body' };
  const fakeClient = {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [
          { type: 'thinking', thinking: 'Let me consider the framing...' },
          { type: 'text', text: JSON.stringify(fakeDraft) },
        ],
      }),
    },
  };
  const result = await draftPost({
    qualifyingPosts: [{ text: 'I built X', url: 'https://x.com/1' }],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, fakeDraft);
});
