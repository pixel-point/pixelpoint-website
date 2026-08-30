const assert = require('node:assert/strict');
const test = require('node:test');

const { readRepoUsage, repoLinksIn, shellSnippetsIn } = require('./read-repo-usage');

test('repoLinksIn finds repos in the post and in its follow-ups', () => {
  // The Aval launch put the repo link in a follow-up, not the post itself.
  const repos = repoLinksIn([
    { text: 'Introducing Aval', thread: [{ text: 'https://github.com/pixel-point/aval' }] },
  ]);
  assert.deepEqual(repos, [{ owner: 'pixel-point', repo: 'aval' }]);
});

test('repoLinksIn dedupes and strips a trailing .git', () => {
  const repos = repoLinksIn([
    { text: 'https://github.com/a/b https://github.com/a/b.git', thread: [] },
  ]);
  assert.deepEqual(repos, [{ owner: 'a', repo: 'b' }]);
});

test('shellSnippetsIn skips comments and blank lines', () => {
  const snippets = shellSnippetsIn('```sh\n# install it\n\nnpm i thing\n```');
  assert.deepEqual(snippets, ['npm i thing']);
});

test('shellSnippetsIn returns every candidate, not just the first', () => {
  // The real Aval README opens with the install command and later has
  // contributing steps; picking one in code would be a guess.
  const snippets = shellSnippetsIn('```sh\nnpx tool compile\n```\ntext\n```bash\nnpm ci\n```');
  assert.deepEqual(snippets, ['npx tool compile', 'npm ci']);
});

test('readRepoUsage returns nothing when the repo cannot be read', async () => {
  // Private, renamed, or rate-limited: the article still has the link.
  const usage = await readRepoUsage({
    posts: [{ text: 'https://github.com/a/b', thread: [] }],
    fetchImpl: async () => ({ ok: false, status: 404 }),
  });
  assert.deepEqual(usage, []);
});

test('readRepoUsage survives a network error', async () => {
  const usage = await readRepoUsage({
    posts: [{ text: 'https://github.com/a/b', thread: [] }],
    fetchImpl: async () => {
      throw new Error('ENOTFOUND');
    },
  });
  assert.deepEqual(usage, []);
});

test('readRepoUsage collects the shell commands it found', async () => {
  const usage = await readRepoUsage({
    posts: [{ text: 'https://github.com/a/b', thread: [] }],
    fetchImpl: async () => ({ ok: true, text: async () => '```sh\nnpm i b\n```' }),
  });
  assert.deepEqual(usage, [{ repo: 'a/b', snippets: ['npm i b'] }]);
});

test('a post with no repo link makes no network call at all', async () => {
  let called = false;
  await readRepoUsage({
    posts: [{ text: 'no links here', thread: [] }],
    fetchImpl: async () => {
      called = true;
      return { ok: false };
    },
  });
  assert.equal(called, false);
});
