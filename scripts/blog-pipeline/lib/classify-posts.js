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
          // Distinct from already_covered: a group can be genuinely new (a
          // release, an update) while still touching a product an existing
          // post explains. Naming those lets the draft link to them instead
          // of reintroducing the subject from scratch — the actual source of
          // the near-duplicate a real run produced.
          related_existing_post_titles: { type: 'array', items: { type: 'string' } },
        },
        required: ['post_ids', 'already_covered', 'existing_post_title', 'related_existing_post_titles'],
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
    'Separately from that verdict, list in "related_existing_post_titles" the titles of any existing posts that already explain the same product or subject, even when the group is genuinely new. A release announcement for a product with an existing post should name that post here, so the article can link to it rather than reintroducing the product.',
    'Respond with JSON: { "groups": [{ "post_ids": ["..."], "already_covered": false, "existing_post_title": "", "related_existing_post_titles": [] }, ...] } — omit any post id that does not qualify.',
  ].join('\n');
}

// Returns { groups, skipped }. `skipped` carries the groups the model judged
// as already covered so the caller can surface them for review — dropping them
// silently would hide a wrong call, which is the same blind spot as letting a
// duplicate through, just pointing the other way.
async function classifyAndGroupPosts({ candidates, existingPosts, anthropicClient }) {
  if (candidates.length === 0) return { groups: [], skipped: [] };

  const { groups } = await requestJson({
    anthropicClient,
    prompt: buildClassifyPrompt(candidates, existingPosts),
    schema: CLASSIFY_SCHEMA,
  });

  const postsById = new Map(candidates.map((post) => [post.id, post]));
  const existingByTitle = new Map(existingPosts.map((post) => [post.title, post]));
  const kept = [];
  const skipped = [];

  for (const group of groups) {
    // A group can resolve to nothing when the model returns a post id that
    // was never a candidate; there is no article to draft or to report.
    const posts = group.post_ids.map((id) => postsById.get(id)).filter(Boolean);
    if (posts.length === 0) continue;

    if (group.already_covered) {
      skipped.push({ posts, existingPostTitle: group.existing_post_title });
    } else {
      kept.push({
        posts,
        // Resolved against the real list so an invented title can't become a
        // dead link in a published post.
        relatedExistingPosts: (group.related_existing_post_titles || [])
          .map((title) => existingByTitle.get(title))
          .filter(Boolean),
      });
    }
  }

  return { groups: kept, skipped };
}

module.exports = { classifyAndGroupPosts, buildClassifyPrompt, CLASSIFY_SCHEMA };
