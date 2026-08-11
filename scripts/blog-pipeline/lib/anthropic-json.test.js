const assert = require('node:assert/strict');
const test = require('node:test');

const { requestJson, extractText } = require('./anthropic-json');

const SCHEMA = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] };

function clientReturning(message) {
  return { messages: { stream: () => ({ finalMessage: async () => message }) } };
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

test('usage accumulates across calls so a run can report what it cost', async () => {
  const { usage, costUsd, usageSummary } = require('./anthropic-json');
  const before = { ...usage };
  const client = clientReturning({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: '{"ok":true}' }],
    usage: { input_tokens: 10000, output_tokens: 40000 },
  });
  await requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA });
  assert.equal(usage.calls, before.calls + 1);
  assert.equal(usage.inputTokens, before.inputTokens + 10000);
  assert.equal(usage.outputTokens, before.outputTokens + 40000);
  // 10k in at $5/Mtok + 40k out at $25/Mtok = $0.05 + $1.00
  assert.ok(costUsd() >= 1.05, `expected at least $1.05, got ${costUsd()}`);
  assert.ok(usageSummary().includes('model call'));
});
