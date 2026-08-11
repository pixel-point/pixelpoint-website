const { execFileSync } = require('node:child_process');
const matter = require('gray-matter');

// readExistingPosts only sees posts on the checked-out branch — that is,
// merged ones. With a monthly cron and a 35-day lookback, a PR still awaiting
// review on the 1st means this run re-drafts the same X posts with nothing to
// dedup against, spends the API budget, and opens a second PR covering the
// same ground. Reading the drafts still sitting in open PRs closes that gap.
const DRAFT_BRANCH_PREFIX = 'blog-draft/';

function defaultRun(cmd, args) {
  return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' });
}

function readPendingPosts({ repoRoot, runImpl = defaultRun, baseRef = 'origin/main' } = {}) {
  const options = { cwd: repoRoot };

  let branches;
  try {
    branches = JSON.parse(
      runImpl('gh', ['pr', 'list', '--state', 'open', '--json', 'headRefName'], options)
    )
      .map((pr) => pr.headRefName)
      .filter((name) => name.startsWith(DRAFT_BRANCH_PREFIX));
  } catch (err) {
    // Losing this costs dedup coverage, not the run. Failing here would mean a
    // gh outage stops the month's drafts entirely, which is a worse trade.
    console.warn(`Could not list open draft PRs, continuing without them: ${err.message}`);
    return [];
  }

  const posts = [];
  for (const branch of branches) {
    try {
      // The branch may never have been fetched into this checkout.
      runImpl('git', ['fetch', 'origin', branch], options);
      // Only what the branch *adds*. Listing the tree would return every post
      // on it, including the ~46 already published, which are already covered
      // by readExistingPosts and would just bloat the classify prompt.
      const paths = runImpl(
        'git',
        ['diff', '--name-only', '--diff-filter=A', `${baseRef}...FETCH_HEAD`, '--', 'content/posts/'],
        options
      )
        .split('\n')
        .filter((line) => line.endsWith('/index.md'));

      for (const file of paths) {
        const { data } = matter(runImpl('git', ['show', `FETCH_HEAD:${file}`], options));
        if (data.title) posts.push({ title: data.title, summary: data.summary, pending: true });
      }
    } catch (err) {
      console.warn(`Skipping open PR branch ${branch}: ${err.message}`);
    }
  }

  return posts;
}

module.exports = { readPendingPosts, DRAFT_BRANCH_PREFIX };
