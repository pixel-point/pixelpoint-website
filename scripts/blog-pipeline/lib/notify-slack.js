// The preview URL is not knowable here: Vercel posts it as a comment on the
// PR moments after the branch is pushed, so the message points at the PR and
// lets the reviewer follow the bot comment from there.
function buildDraftsMessage({ drafts, prUrl, skipped = [] }) {
  const lead =
    drafts.length === 1
      ? 'New monthly blog draft ready for review'
      : `${drafts.length} new monthly blog drafts ready for review`;

  const lines = [`${lead}: ${prUrl}`, '', ...drafts.map((draft) => `• ${draft.title}`)];

  if (skipped.length > 0) {
    const posts = skipped.reduce((total, group) => total + group.posts.length, 0);
    lines.push('', `${posts} post(s) skipped as already covered — listed in the PR.`);
  }

  lines.push('', 'Vercel comments the preview link on the PR once the build finishes.');
  return lines.join('\n');
}

// This is the only signal a monthly run gives. If the webhook blips on the
// failure path the run goes completely silent, so a transient error is worth
// retrying before giving up.
const NOTIFY_ATTEMPTS = 3;
const NOTIFY_BACKOFF_MS = 1000;

async function notifySlack({
  webhookUrl,
  text,
  fetchImpl = fetch,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempts = NOTIFY_ATTEMPTS,
}) {
  let lastStatus;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    // A malformed payload fails identically every time; only server-side and
    // rate-limit responses are worth another go.
    const res = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) return;
    lastStatus = res.status;
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === attempts) break;
    await sleepImpl(NOTIFY_BACKOFF_MS * attempt);
  }
  throw new Error(`Slack webhook failed: ${lastStatus}`);
}

module.exports = { notifySlack, buildDraftsMessage };
