// Shared request shape for the two LLM steps (classify, draft).
//
// Both steps want the same thing: send one prompt, get back JSON in a known
// shape. Structured outputs (`output_config.format`) constrain the response to
// `schema` at the API level, so callers can JSON.parse the result without
// defensive checks — unlike the old json_object mode, which only asked politely.
const MODEL = 'claude-opus-5';
const MAX_TOKENS = 16000;

function extractText(message) {
  // Thinking is on by default on this model, so content holds thinking blocks
  // alongside the text ones. Only the text blocks carry the JSON.
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

async function requestJson({ anthropicClient, prompt, schema }) {
  const message = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive' },
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: prompt }],
  });

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

module.exports = { requestJson, extractText, MODEL, MAX_TOKENS };
