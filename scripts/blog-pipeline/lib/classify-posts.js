function buildClassifyPrompt(candidates, existingPosts) {
  return [
    'You are screening X posts for a company blog "Updates" category.',
    'The bar is not just "is this on-topic" — keep a post only if it would stand alone as worth reading for someone with zero context on the author\'s X feed: a real design-process note, product announcement, or release, not a status update that only makes sense to an existing follower.',
    'Personal side projects (open-source tools, solo builds; examples of personal side project work) count and should be kept if they clear that bar — they still reflect the team\'s expertise even when not officially branded company work.',
    'Exclude opinion or thought-leadership essays not tied to a specific project or release, for now.',
    "Drop posts that are just commentary on someone else's work, one-line reactions, or posts already covered by an existing blog post.",
    '',
    'Existing blog posts (do not re-cover these topics):',
    existingPosts.map((p) => `- ${p.title}: ${p.summary}`).join('\n'),
    '',
    'Candidate posts (JSON):',
    JSON.stringify(candidates.map((p) => ({ id: p.id, text: p.text }))),
    '',
    'Group the posts that qualify into one or more article topics: a single substantial story should be its own group; several smaller updates can share one group as a bundled roundup.',
    'Respond with JSON: { "groups": [{ "post_ids": ["..."] }, ...] } — omit any post id that does not qualify.',
  ].join('\n');
}

async function classifyAndGroupPosts({ candidates, existingPosts, openaiClient }) {
  if (candidates.length === 0) return [];

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: buildClassifyPrompt(candidates, existingPosts) }],
    response_format: { type: 'json_object' },
  });

  const { groups } = JSON.parse(completion.choices[0].message.content);
  const postsById = new Map(candidates.map((post) => [post.id, post]));
  return groups.map((group) => group.post_ids.map((id) => postsById.get(id)).filter(Boolean));
}

module.exports = { classifyAndGroupPosts, buildClassifyPrompt };
