const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyAndGroupPosts, buildClassifyPrompt } = require('./classify-posts');

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
  const fakeClient = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: JSON.stringify({ groups: [{ post_ids: ['2'] }, { post_ids: ['3', '4'] }] }) } }],
        }),
      },
    },
  };
  const candidates = [
    { id: '1', text: 'skip me' },
    { id: '2', text: 'standalone story' },
    { id: '3', text: 'small update one' },
    { id: '4', text: 'small update two' },
  ];
  const result = await classifyAndGroupPosts({ candidates, existingPosts: [], openaiClient: fakeClient });
  assert.deepEqual(
    result.map((group) => group.map((p) => p.id)),
    [['2'], ['3', '4']]
  );
});

test('classifyAndGroupPosts returns no groups without calling the model when there are no candidates', async () => {
  let called = false;
  const fakeClient = { chat: { completions: { create: async () => { called = true; } } } };
  const result = await classifyAndGroupPosts({ candidates: [], existingPosts: [], openaiClient: fakeClient });
  assert.deepEqual(result, []);
  assert.equal(called, false);
});
