// Shared request shape for the two LLM steps (classify, draft).
//
// Both steps want the same thing: send one prompt, get back JSON in a known
// shape. Structured outputs (`output_config.format`) constrain the response to
// `schema` at the API level, so callers can JSON.parse the result without
// defensive checks — unlike the old json_object mode, which only asked politely.
const MODEL = 'claude-opus-5';
// max_tokens caps thinking *and* response text together, and thinking is on by
// default on this model. A blog-post body at default effort can approach the
// old 16k ceiling on a busy month, which failed the entire run. Streaming is
// what makes a ceiling this high safe: a non-streaming request at 64k risks an
// HTTP timeout.
const MAX_TOKENS = 64000;

// claude.com/pricing, per million tokens. Thinking bills as output, and with
// adaptive thinking on it dominates the bill — which is why a run costs about
// ten times what the input alone suggests.
const USD_PER_MTOK_INPUT = 5;
const USD_PER_MTOK_OUTPUT = 25;

const usage = { calls: 0, inputTokens: 0, outputTokens: 0 };

function costUsd() {
  return (
    (usage.inputTokens / 1e6) * USD_PER_MTOK_INPUT +
    (usage.outputTokens / 1e6) * USD_PER_MTOK_OUTPUT
  );
}

function usageSummary() {
  return `${usage.calls} model call(s), ${usage.inputTokens.toLocaleString()} in / ${usage.outputTokens.toLocaleString()} out — about $${costUsd().toFixed(2)}`;
}

function extractText(message) {
  // Thinking is on by default on this model, so content holds thinking blocks
  // alongside the text ones. Only the text blocks carry the JSON.
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

async function requestJson({ anthropicClient, prompt, schema }) {
  const message = await anthropicClient.messages
    .stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { format: { type: 'json_schema', schema } },
      messages: [{ role: 'user', content: prompt }],
    })
    .finalMessage();

  if (message.usage) {
    usage.calls += 1;
    usage.inputTokens += message.usage.input_tokens || 0;
    usage.outputTokens += message.usage.output_tokens || 0;
  }

  // A refused request returns HTTP 200 with empty or partial content, so this
  // has to be checked before reading content — otherwise it surfaces as a
  // confusing JSON parse error instead of the real reason.
  if (message.stop_reason === 'refusal') {
    const category = (message.stop_details && message.stop_details.category) || 'unspecified';
    throw new Error(`Claude declined this request (category: ${category})`);
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error(`Claude hit the ${MAX_TOKENS} token limit; the returned JSON is truncated`);
  }

  return JSON.parse(extractText(message));
}

module.exports = { requestJson, extractText, usage, costUsd, usageSummary, MODEL, MAX_TOKENS };
