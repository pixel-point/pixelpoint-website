// scripts/blog-pipeline/lib/draft-post.test.js
const assert = require('node:assert/strict');
const test = require('node:test');

const { draftPost, buildDraftPrompt } = require('./draft-post');

test('buildDraftPrompt tells the model to preserve I/we framing and write editorially', () => {
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('keep it first-person'));
  assert.ok(prompt.includes('I built a tool'));
  assert.ok(prompt.includes("Don't just reformat"));
});

test("buildDraftPrompt tells the model it is writing under the author's own byline", () => {
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
      stream: () => ({
        finalMessage: async () => ({
          stop_reason: 'end_turn',
          content: [{ type: 'text', text: JSON.stringify(fakeDraft) }],
        }),
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
      stream: () => ({
        finalMessage: async () => ({
          stop_reason: 'end_turn',
          content: [
            { type: 'thinking', thinking: 'Let me consider the framing...' },
            { type: 'text', text: JSON.stringify(fakeDraft) },
          ],
        }),
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

test('buildDraftPrompt asks for sentence case, matching the rest of the blog', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('sentence case'));
  // The counter-example matters as much as the rule: without it, drafts kept
  // producing Title Case On Every Word.
  assert.ok(prompt.includes('five creative tools we built'));
  assert.ok(prompt.includes('Five Creative Tools We Built'));
});

test('buildDraftPrompt asks for commands to survive verbatim', () => {
  const prompt = buildDraftPrompt([{ text: 'npx skills add x', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('verbatim, in a fenced code block'));
});

const VID = (n, sourceUrl) => ({
  src: `/x-video/amplify_video/${n}/v.mp4`,
  width: '1440',
  height: '1080',
  posterFilename: `video-cover-${n}.jpg`,
  isGif: false,
  sourceUrl,
});

test('videos from one post are presented as a set to keep together', () => {
  // Four clips on a single post came out scattered across four sections with
  // headings between them, reading as four unrelated demos.
  const prompt = buildDraftPrompt(
    [{ text: 'New version is out', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1'), VID(2, 'https://x.com/1'), VID(3, 'https://x.com/1')]
  );
  assert.ok(prompt.includes('Set 1 — 3 video(s) published together'));
  assert.ok(prompt.includes('Keep such a set together'));
  assert.ok(prompt.includes('one exhibit'));
});

test('videos from different posts are listed as separate sets', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1'), VID(2, 'https://x.com/2')]
  );
  assert.ok(prompt.includes('Set 1 — 1 video(s)'));
  assert.ok(prompt.includes('Set 2 — 1 video(s)'));
});

test('a single video is not dressed up as a set', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1')]
  );
  assert.ok(!prompt.includes('Set 1'));
  assert.ok(!prompt.includes('Keep such a set together'));
});

test('images carry the post that published them', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [{ filename: 'image-1.jpg', sourceUrl: 'https://x.com/1' }]
  );
  assert.ok(prompt.includes('sourcePost'));
  assert.ok(prompt.includes('belong together in the article'));
});

test('repo commands are offered as candidates the model may reject', () => {
  // A README's shell blocks include demo invocations and contributing steps.
  // Asserting one of them is the install command would publish a wrong one.
  const prompt = buildDraftPrompt(
    [{ text: 'Introducing Aval', url: 'https://x.com/1' }],
    [],
    [],
    [],
    [{ repo: 'pixel-point/aval', snippets: ['npx @pixel-point/aval-compiler compile', 'npm ci'] }]
  );
  assert.ok(prompt.includes('npx @pixel-point/aval-compiler compile'));
  assert.ok(prompt.includes('If one of them is genuinely how a reader installs'));
  assert.ok(prompt.includes('leave them all out'));
  assert.ok(prompt.includes('Do not adapt or guess at a command'));
});

test('no repo section when the posts link no repository', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(!prompt.includes('Commands found in linked repositories'));
});

test('a quoted post is background, not a source of calls to action', () => {
  // A post about redesigning a client's homepage grew a "Try it in your
  // terminal" section reproducing that client's own launch instructions.
  const prompt = buildDraftPrompt([{ text: 'Meet the new Novu', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes("someone else's launch copy"));
  assert.ok(
    prompt.includes('do not carry over its calls to action, setup instructions, or commands')
  );
  assert.ok(prompt.includes('not how to sign up for their product'));
});

test('code blocks are for executables, and only for our own work', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('never put a sentence in one'));
  assert.ok(prompt.includes("someone else's product are not ours to promote"));
});
