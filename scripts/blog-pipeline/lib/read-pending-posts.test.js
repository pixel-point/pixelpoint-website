const test = require('node:test');
const assert = require('node:assert/strict');
const { readPendingPosts } = require('./read-pending-posts');

function fakeGh({ branches = [], files = {}, failOn = null }) {
  return (cmd, args) => {
    if (failOn && args.join(' ').includes(failOn)) throw new Error('boom');
    if (cmd === 'gh') return JSON.stringify(branches.map((b) => ({ headRefName: b })));
    if (args[0] === 'fetch') return '';
    if (args[0] === 'diff') return Object.keys(files).join('\n');
    if (args[0] === 'show') {
      const path = args[1].replace('FETCH_HEAD:', '');
      return files[path];
    }
    return '';
  };
}

const POST = '---\ntitle: Toolcraft update\nsummary: A leaner harness\n---\nbody\n';

test('reads drafts out of open draft PRs so they count as covered', () => {
  const posts = readPendingPosts({
    repoRoot: '/repo',
    runImpl: fakeGh({
      branches: ['blog-draft/2026-08-1'],
      files: { 'content/posts/2026-08-10-toolcraft/index.md': POST },
    }),
  });
  assert.deepEqual(posts, [
    { title: 'Toolcraft update', summary: 'A leaner harness', pending: true },
  ]);
});

test('ignores open PRs that are not generated drafts', () => {
  const posts = readPendingPosts({
    repoRoot: '/repo',
    runImpl: fakeGh({
      branches: ['feature/some-work', 'fix/a-bug'],
      files: { 'content/posts/x/index.md': POST },
    }),
  });
  assert.deepEqual(posts, [], 'only blog-draft/* branches hold generated posts');
});

test('a gh failure costs dedup coverage, not the run', () => {
  // Failing here would mean a gh outage stops the month's drafts entirely.
  const posts = readPendingPosts({
    repoRoot: '/repo',
    runImpl: fakeGh({ branches: [], failOn: 'pr list' }),
  });
  assert.deepEqual(posts, []);
});

test('one unreadable branch does not lose the others', () => {
  let call = 0;
  const posts = readPendingPosts({
    repoRoot: '/repo',
    runImpl: (cmd, args) => {
      if (cmd === 'gh') return JSON.stringify([
        { headRefName: 'blog-draft/broken' },
        { headRefName: 'blog-draft/fine' },
      ]);
      if (args[0] === 'fetch') {
        call += 1;
        if (call === 1) throw new Error('ref not found');
        return '';
      }
      if (args[0] === 'diff') return 'content/posts/a/index.md';
      if (args[0] === 'show') return POST;
      return '';
    },
  });
  assert.equal(posts.length, 1);
});

test('only the posts the branch adds are read, not every post on it', () => {
  // A draft branch carries the whole content/posts tree; listing it returned
  // all ~46 published posts, which readExistingPosts already covers.
  let diffArgs;
  readPendingPosts({
    repoRoot: '/repo',
    runImpl: (cmd, args) => {
      if (cmd === 'gh') return JSON.stringify([{ headRefName: 'blog-draft/1' }]);
      if (args[0] === 'diff') { diffArgs = args; return ''; }
      return '';
    },
  });
  assert.ok(diffArgs.includes('--diff-filter=A'), 'added files only');
  assert.ok(diffArgs.some((a) => a.includes('origin/main...FETCH_HEAD')));
});
