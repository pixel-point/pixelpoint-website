// scripts/blog-pipeline/lib/git-pr.js
const { execFileSync } = require('node:child_process');

function run(cmd, args, options) {
  return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8', ...options });
}

function openDraftPr({ repoRoot, branchName, postDirs, prTitle, prBody }) {
  run('git', ['checkout', '-b', branchName], { cwd: repoRoot });
  for (const postDir of postDirs) {
    run('git', ['add', postDir], { cwd: repoRoot });
  }
  run('git', ['commit', '-m', prTitle], { cwd: repoRoot });
  run('git', ['push', '-u', 'origin', branchName], { cwd: repoRoot });
  const prUrl = run(
    'gh',
    ['pr', 'create', '--title', prTitle, '--body', prBody, '--head', branchName],
    { cwd: repoRoot }
  ).trim();
  return { prUrl };
}

module.exports = { openDraftPr };
