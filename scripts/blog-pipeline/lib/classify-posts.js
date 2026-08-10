const { requestJson } = require('./anthropic-json');

const CLASSIFY_SCHEMA = {
  type: 'object',
  properties: {
    groups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          post_ids: { type: 'array', items: { type: 'string' } },
          // Asking for an explicit verdict per group, rather than trusting the
          // model to silently drop covered topics, is deliberate: a dry run
          // against real June 2026 posts produced a second article on
          // Toolcraft that an existing post already covered, even though the
          // prompt listed it. A required field forces the comparison to
          // happen, and the filtering below makes it the code's decision.
          already_covered: { type: 'boolean' },
          existing_post_title: { type: 'string' },
        },
        required: ['post_ids', 'already_covered', 'existing_post_title'],
        additionalProperties: false,
      },
    },
  },
  required: ['groups'],
  additionalProperties: false,
};

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
    'Then check every group you propose against the existing blog posts listed above, one at a time. Set "already_covered" to true and put that post\'s title in "existing_post_title" when an existing post already makes the same argument about the same subject — restating an existing thesis in new words counts as covered. A genuinely new release, update, or development for a product that already has a post does not count as covered; set "already_covered" to false and leave "existing_post_title" empty.',
    'Respond with JSON: { "groups": [{ "post_ids": ["..."], "already_covered": false, "existing_post_title": "" }, ...] } — omit any post id that does not qualify.',
  ].join('\n');
}

async function classifyAndGroupPosts({ candidates, existingPosts, anthropicClient }) {
  if (candidates.length === 0) return [];

  const { groups } = await requestJson({
    anthropicClient,
    prompt: buildClassifyPrompt(candidates, existingPosts),
    schema: CLASSIFY_SCHEMA,
  });

  const postsById = new Map(candidates.map((post) => [post.id, post]));
  const kept = [];

  for (const group of groups) {
    if (group.already_covered) {
      console.log(
        `Skipping a group already covered by "${group.existing_post_title || 'an existing post'}".`
      );
      continue;
    }
    kept.push(group.post_ids.map((id) => postsById.get(id)).filter(Boolean));
  }

  return kept;
}

module.exports = { classifyAndGroupPosts, buildClassifyPrompt, CLASSIFY_SCHEMA };
