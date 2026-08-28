// The PR is the review gate, so its body is the only place a human reliably
// reads. It has to carry both halves of the classify decision: the drafts that
// were written, and the groups that were dropped as duplicates — a wrong drop
// is invisible otherwise.
function buildPrBody({ drafts, skipped = [] }) {
  const lines = [
    'Auto-generated monthly Updates draft(s). Review the Vercel preview(s) before merging.',
    '',
    ...drafts.map((draft) => `- ${draft.title}`),
    '',
    '### Before merging',
    '',
    // These are the failure modes a dry run against real posts produced, not
    // hypotheticals. The classify step screens for the first one but will not
    // settle a near-duplicate with a genuinely fresh angle — that call is why
    // this gate exists.
    '- [ ] Does any draft re-cover ground an existing post already made?',
    '- [ ] Is each draft carried by real substance, or is it a short post padded out to article length?',
    '- [ ] Does the voice read as the author writing, rather than an article written about them?',
    '- [ ] Should any of these get their own cover image instead of the shared placeholder?',
    // Video is hotlinked from video.twimg.com because the site's S3 bucket
    // isn't writable from here. Those urls are not contractually stable.
    '- [ ] Do the embedded videos actually play? Their URLs point at X and can rot without warning.',
  ];

  if (skipped.length > 0) {
    lines.push(
      '',
      '### Skipped as already covered',
      '',
      'These were judged to repeat an existing post, so no draft was written. Worth a look — a wrong call here loses a post silently.',
      '',
      ...skipped.map(
        ({ posts, existingPostTitle }) =>
          `- [ ] ${posts.map((post) => post.url).join(', ')} — overlaps "${existingPostTitle || 'an existing post'}"`
      )
    );
  }

  return lines.join('\n');
}

module.exports = { buildPrBody };
