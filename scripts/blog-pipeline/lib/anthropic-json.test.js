const test = require('node:test');
const assert = require('node:assert/strict');
const { requestJson, extractText } = require('./anthropic-json');

const SCHEMA = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] };

function clientReturning(message) {
  return { messages: { create: async () => message } };
}

test('extractText concatenates text blocks and skips thinking blocks', () => {
  const text = extractText({
    content: [
      { type: 'thinking', thinking: 'internal' },
      { type: 'text', text: '{"ok":' },
      { type: 'text', text: 'true}' },
    ],
  });
  assert.equal(text, '{"ok":true}');
});

test('requestJson returns the parsed JSON payload', async () => {
  const client = clientReturning({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: '{"ok":true}' }],
  });
  const result = await requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA });
  assert.deepEqual(result, { ok: true });
});

test('requestJson throws a named error on a refusal rather than a JSON parse error', async () => {
  const client = clientReturning({
    stop_reason: 'refusal',
    stop_details: { category: 'cyber' },
    content: [],
  });
  await assert.rejects(
    () => requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA }),
    /Claude declined this request \(category: cyber\)/
  );
});

test('requestJson reports truncation instead of failing to parse partial JSON', async () => {
  const client = clientReturning({
    stop_reason: 'max_tokens',
    content: [{ type: 'text', text: '{"ok":' }],
  });
  await assert.rejects(
    () => requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA }),
    /token limit; the returned JSON is truncated/
  );
});
