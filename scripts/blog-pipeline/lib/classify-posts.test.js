const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyAndGroupPosts, buildClassifyPrompt } = require('./classify-posts');

function fakeClientReturning(payload) {
  return {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(payload) }],
      }),
    },
  };
}

test('buildClassifyPrompt lists existing posts and candidate ids', () => {
  const prompt = buildClassifyPrompt(
    [{ id: '1', text: 'design update' }],
    [{ title: 'Toolcraft', summary: 'A design tool' }]
  );
  assert.ok(prompt.includes('Toolcraft: A design tool'));
  assert.ok(prompt.includes('zero context'));
  assert.ok(prompt.includes('personal side project'));
  assert.ok(prompt.includes('"id":"1"') || prompt.includes('"id": "1"'));
});

function group(postIds, extra = {}) {
  return {
    post_ids: postIds,
    already_covered: false,
    existing_post_title: '',
    related_existing_post_titles: [],
    ...extra,
  };
}

test('classifyAndGroupPosts returns groups of full post objects', async () => {
  const fakeClient = fakeClientReturning({ groups: [group(['2']), group(['3', '4'])] });
  const candidates = [
    { id: '1', text: 'skip me' },
    { id: '2', text: 'standalone story' },
    { id: '3', text: 'small update one' },
    { id: '4', text: 'small update two' },
  ];
  const result = await classifyAndGroupPosts({ candidates, existingPosts: [], anthropicClient: fakeClient });
  assert.deepEqual(
    result.groups.map((group) => group.posts.map((p) => p.id)),
    [['2'], ['3', '4']]
  );
  assert.deepEqual(result.skipped, []);
});

test('classifyAndGroupPosts drops groups the model flagged as already covered', async () => {
  const fakeClient = fakeClientReturning({
    groups: [
      group(['2']),
      group(['3'], { already_covered: true, existing_post_title: 'Build personal design tools with AI using Toolcraft' }),
    ],
  });
  const result = await classifyAndGroupPosts({
    candidates: [
      { id: '2', text: 'a genuinely new topic' },
      { id: '3', text: 'a restatement of an existing post' },
    ],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(
    result.groups.map((g) => g.posts.map((p) => p.id)),
    [['2']]
  );
  // The skipped group is reported, not discarded, so the PR can show it.
  assert.equal(result.skipped.length, 1);
  assert.deepEqual(
    result.skipped[0].posts.map((p) => p.id),
    ['3']
  );
  assert.equal(
    result.skipped[0].existingPostTitle,
    'Build personal design tools with AI using Toolcraft'
  );
});

test('classifyAndGroupPosts drops post ids the model invented', async () => {
  const fakeClient = fakeClientReturning({ groups: [group(['2', 'not-a-real-id'])] });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'real post' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(
    result.groups.map((group) => group.posts.map((p) => p.id)),
    [['2']]
  );
});

test('classifyAndGroupPosts reports neither a group nor a skip when no ids resolve', async () => {
  const fakeClient = fakeClientReturning({
    groups: [group(['nope'], { already_covered: true, existing_post_title: 'Some post' })],
  });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'a real post' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, { groups: [], skipped: [] });
});

test('classifyAndGroupPosts sends the request with a json_schema output format', async () => {
  let sentParams;
  const fakeClient = {
    messages: {
      create: async (params) => {
        sentParams = params;
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"groups":[]}' }] };
      },
    },
  };
  await classifyAndGroupPosts({
    candidates: [{ id: '1', text: 'a post long enough to classify' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.equal(sentParams.model, 'claude-opus-5');
  assert.equal(sentParams.output_config.format.type, 'json_schema');
  assert.deepEqual(sentParams.output_config.format.schema.required, ['groups']);
  // The dedup verdict has to be required, or the model can omit it and every
  // group silently defaults to "not covered".
  assert.deepEqual(sentParams.output_config.format.schema.properties.groups.items.required, [
    'post_ids',
    'already_covered',
    'existing_post_title',
    'related_existing_post_titles',
  ]);
});

test('buildClassifyPrompt asks for a per-group check against the existing posts', () => {
  const prompt = buildClassifyPrompt(
    [{ id: '1', text: 'a candidate' }],
    [{ title: 'Toolcraft', summary: 'A design tool' }]
  );
  assert.ok(prompt.includes('already_covered'));
  assert.ok(prompt.includes('restating an existing thesis'));
});

test('classifyAndGroupPosts returns no groups without calling the model when there are no candidates', async () => {
  let called = false;
  const fakeClient = {
    messages: {
      create: async () => {
        called = true;
      },
    },
  };
  const result = await classifyAndGroupPosts({ candidates: [], existingPosts: [], anthropicClient: fakeClient });
  assert.deepEqual(result, { groups: [], skipped: [] });
  assert.equal(called, false);
});

test('classifyAndGroupPosts resolves related existing posts so the draft can link them', async () => {
  const existingPosts = [
    { title: 'Build personal design tools with AI using Toolcraft', summary: 'x', path: '/blog/how-to-craft/' },
  ];
  const fakeClient = fakeClientReturning({
    groups: [
      group(['2'], {
        related_existing_post_titles: [
          'Build personal design tools with AI using Toolcraft',
          'A post that does not exist',
        ],
      }),
    ],
  });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'a new Toolcraft release' }],
    existingPosts,
    anthropicClient: fakeClient,
  });
  // An invented title must not become a dead link in a published post.
  assert.deepEqual(result.groups[0].relatedExistingPosts, [existingPosts[0]]);
});

test('buildClassifyPrompt asks for related posts separately from the covered verdict', () => {
  const prompt = buildClassifyPrompt([{ id: '1', text: 'x' }], [{ title: 'T', summary: 'S' }]);
  assert.ok(prompt.includes('related_existing_post_titles'));
  assert.ok(prompt.includes('rather than reintroducing the product'));
});
