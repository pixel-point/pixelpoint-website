// scripts/blog-pipeline/lib/git-pr.js
const { execFileSync } = require('node:child_process');

function defaultRun(cmd, args, options) {
  return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8', ...options });
}

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// `git push` returns before GitHub has finished indexing the new ref, so a
// `gh pr create` fired immediately after can fail with "not all refs are
// readable". Observed on a real run; a CI runner is faster than a laptop, so
// it is more likely there, not less. The same command succeeds moments later,
// so retry rather than fail the month's run.
const PR_CREATE_ATTEMPTS = 4;
const PR_CREATE_BACKOFF_MS = 3000;

async function createPrWithRetry({
  args,
  cwd,
  runImpl,
  sleepImpl,
  attempts = PR_CREATE_ATTEMPTS,
  backoffMs = PR_CREATE_BACKOFF_MS,
}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return runImpl('gh', args, { cwd }).trim();
    } catch (err) {
      lastError = err;
      const output = `${err.stderr || ''}${err.stdout || ''}`;
      // Only the ref-visibility race is worth retrying. A bad token or a
      // malformed request will fail identically every time, and retrying just
      // delays a failure the Slack alert should report now.
      if (!output.includes('not all refs are readable') || attempt === attempts) throw err;
      await sleepImpl(backoffMs * attempt);
    }
  }
  throw lastError;
}

async function openDraftPr({
  repoRoot,
  branchName,
  postDirs,
  prTitle,
  prBody,
  runImpl = defaultRun,
  sleepImpl = defaultSleep,
}) {
  runImpl('git', ['checkout', '-b', branchName], { cwd: repoRoot });
  for (const postDir of postDirs) {
    runImpl('git', ['add', postDir], { cwd: repoRoot });
  }
  runImpl('git', ['commit', '-m', prTitle], { cwd: repoRoot });
  runImpl('git', ['push', '-u', 'origin', branchName], { cwd: repoRoot });

  const prUrl = await createPrWithRetry({
    // --base is explicit so the PR target does not depend on the repo's
    // configured default branch changing underneath the pipeline.
    args: ['pr', 'create', '--title', prTitle, '--body', prBody, '--base', 'main', '--head', branchName],
    cwd: repoRoot,
    runImpl,
    sleepImpl,
  });

  return { prUrl };
}

module.exports = { openDraftPr, createPrWithRetry };
