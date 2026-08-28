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

async function notifySlack({ webhookUrl, text, fetchImpl = fetch }) {
  const res = await fetchImpl(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status}`);
  }
}

module.exports = { notifySlack, buildDraftsMessage };
