const assert = require('node:assert/strict');
const test = require('node:test');

const { openDraftPr, createPrWithRetry } = require('./git-pr');

const REF_RACE = Object.assign(new Error('exit 1'), {
  stderr: 'pull request create failed: GraphQL: not all refs are readable (createPullRequest)\n',
});

test('createPrWithRetry retries the ref-visibility race and returns the url', async () => {
  let calls = 0;
  const slept = [];
  const url = await createPrWithRetry({
    args: ['pr', 'create'],
    cwd: '/repo',
    runImpl: () => {
      calls += 1;
      if (calls < 3) throw REF_RACE;
      return 'https://github.com/o/r/pull/1\n';
    },
    sleepImpl: async (ms) => slept.push(ms),
  });
  assert.equal(url, 'https://github.com/o/r/pull/1');
  assert.equal(calls, 3);
  assert.deepEqual(slept, [3000, 6000]); // backs off rather than hammering
});

test('createPrWithRetry does not retry an unrelated failure', async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      createPrWithRetry({
        args: ['pr', 'create'],
        cwd: '/repo',
        runImpl: () => {
          calls += 1;
          throw Object.assign(new Error('exit 1'), { stderr: 'HTTP 401: Bad credentials\n' });
        },
        sleepImpl: async () => {},
      }),
    /exit 1/
  );
  assert.equal(
    calls,
    1,
    'a bad token fails the same way every time — retrying only delays the alert'
  );
});

test('createPrWithRetry gives up after the last attempt', async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      createPrWithRetry({
        args: ['pr', 'create'],
        cwd: '/repo',
        runImpl: () => {
          calls += 1;
          throw REF_RACE;
        },
        sleepImpl: async () => {},
        attempts: 3,
      }),
    // The race text lives on stderr; the thrown error's own message is the
    // exec failure, so match that and check stderr separately.
    (err) => err.message === 'exit 1' && err.stderr.includes('not all refs are readable')
  );
  assert.equal(calls, 3);
});

test('openDraftPr commits each post folder and targets main explicitly', async () => {
  const commands = [];
  const { prUrl } = await openDraftPr({
    repoRoot: '/repo',
    branchName: 'blog-draft/2026-08-1',
    postDirs: ['/repo/content/posts/a', '/repo/content/posts/b'],
    prTitle: 'Updates: 2 new posts',
    prBody: 'body',
    runImpl: (cmd, args) => {
      commands.push(`${cmd} ${args[0]}`);
      return 'https://github.com/o/r/pull/9\n';
    },
    sleepImpl: async () => {},
  });
  assert.equal(prUrl, 'https://github.com/o/r/pull/9');
  assert.deepEqual(commands, [
    'git checkout',
    'git add',
    'git add',
    'git commit',
    'git push',
    'gh pr',
  ]);
});

test('openDraftPr passes an explicit base so it does not depend on repo defaults', async () => {
  let prArgs;
  await openDraftPr({
    repoRoot: '/repo',
    branchName: 'b',
    postDirs: [],
    prTitle: 't',
    prBody: 'b',
    runImpl: (cmd, args) => {
      if (cmd === 'gh') prArgs = args;
      return 'url\n';
    },
    sleepImpl: async () => {},
  });
  assert.ok(prArgs.includes('--base'));
  assert.equal(prArgs[prArgs.indexOf('--base') + 1], 'main');
});
