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

test('classifyAndGroupPosts returns groups of full post objects', async () => {
  const fakeClient = fakeClientReturning({ groups: [{ post_ids: ['2'] }, { post_ids: ['3', '4'] }] });
  const candidates = [
    { id: '1', text: 'skip me' },
    { id: '2', text: 'standalone story' },
    { id: '3', text: 'small update one' },
    { id: '4', text: 'small update two' },
  ];
  const result = await classifyAndGroupPosts({ candidates, existingPosts: [], anthropicClient: fakeClient });
  assert.deepEqual(
    result.map((group) => group.map((p) => p.id)),
    [['2'], ['3', '4']]
  );
});

test('classifyAndGroupPosts drops post ids the model invented', async () => {
  const fakeClient = fakeClientReturning({ groups: [{ post_ids: ['2', 'not-a-real-id'] }] });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'real post' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(
    result.map((group) => group.map((p) => p.id)),
    [['2']]
  );
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
  assert.deepEqual(result, []);
  assert.equal(called, false);
});
