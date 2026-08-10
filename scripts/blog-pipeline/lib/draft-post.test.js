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

test('buildDraftPrompt tells the model it is writing under the author\'s own byline', () => {
  // A dry run against real posts produced drafts that referred to "Alex
  // Barashkov, our CEO" in the third person while being published under his
  // byline, so the narrator has to be stated explicitly.
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes("under Alex's own byline"));
  assert.ok(prompt.includes('never refer to'));
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

test('buildDraftPrompt tells the model to link existing coverage instead of restating it', () => {
  // A real run produced a second Toolcraft post whose summary reused the
  // existing post's own "starter kit and UI library" framing. The classify
  // verdict was defensible — there was genuine news — so the fix belongs here.
  const prompt = buildDraftPrompt(
    [{ text: 'New Toolcraft release', url: 'https://x.com/1' }],
    [],
    [],
    [{ title: 'Build personal design tools with AI using Toolcraft', path: '/blog/how-to-craft/' }]
  );
  assert.ok(prompt.includes('do not reintroduce or re-explain'));
  assert.ok(prompt.includes('/blog/how-to-craft/'));
  assert.ok(prompt.includes('Open with what is actually new'));
});

test('buildDraftPrompt says nothing about related posts when there are none', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(!prompt.includes('Already published on this subject'));
});
