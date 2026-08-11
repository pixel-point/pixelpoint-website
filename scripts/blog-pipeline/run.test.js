const test = require('node:test');
const assert = require('node:assert/strict');
const { main } = require('./run');

const ENV = {
  X_API_BEARER_TOKEN: 'x',
  ANTHROPIC_API_KEY: 'a',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/s',
  GH_TOKEN: 'g',
};

function withEnv(env, fn) {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  return Promise.resolve(fn()).finally(() => {
    process.env = saved;
  });
}

function deps(over = {}) {
  const post = { id: '1', text: 'a qualifying post', url: 'https://x.com/1', media: [], thread: [] };
  return {
    getUserId: async () => 'uid',
    fetchRecentPosts: async () => [post],
    filterCandidates: (posts) => posts,
    readExistingPosts: () => [],
    readAuthorHandle: () => 'alex_barashkov',
    classifyAndGroupPosts: async () => ({
      groups: [{ posts: [post], relatedExistingPosts: [] }],
      skipped: [],
    }),
    draftPost: async () => ({ title: 'T', summary: 'S', slug: 'slug', body: 'B' }),
    publishPost: async () => ({ postDir: '/tmp/p', folderName: 'f', photos: [], videos: [] }),
    openDraftPr: async () => ({ prUrl: 'https://github.com/o/r/pull/7' }),
    notifySlack: async () => {},
    collectPhotos: () => [],
    collectVideos: () => [],
    ...over,
  };
}

test('a dry run drafts but never publishes, opens a PR, or posts to Slack', async () => {
  const calls = [];
  process.argv.push('--dry-run');
  try {
    await withEnv({ X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a' }, () =>
      main(deps({
        publishPost: async () => { calls.push('publish'); return { postDir: '', folderName: '', photos: [], videos: [] }; },
        openDraftPr: async () => { calls.push('pr'); return { prUrl: '' }; },
        notifySlack: async () => { calls.push('slack'); },
      }))
    );
  } finally {
    process.argv = process.argv.filter((a) => a !== '--dry-run');
  }
  assert.deepEqual(calls, [], 'a dry run must not write, push, or notify');
});

test('the PR url reaches Slack — a missing await made this read "undefined"', async () => {
  let text;
  await withEnv(ENV, () =>
    main(deps({ notifySlack: async ({ text: t }) => { text = t; } }))
  );
  assert.ok(text.includes('https://github.com/o/r/pull/7'), text);
  assert.ok(!text.includes('undefined'), text);
});

test('nothing is published when no group qualifies, and Slack is still told', async () => {
  const calls = [];
  let text;
  await withEnv(ENV, () =>
    main(deps({
      classifyAndGroupPosts: async () => ({ groups: [], skipped: [] }),
      publishPost: async () => { calls.push('publish'); },
      openDraftPr: async () => { calls.push('pr'); },
      notifySlack: async ({ text: t }) => { text = t; },
    }))
  );
  assert.deepEqual(calls, [], 'an empty month must not open a PR');
  assert.match(text, /No qualifying posts/);
});

test('a real run refuses to start without GH_TOKEN, before writing anything', async () => {
  const calls = [];
  await assert.rejects(
    () => withEnv(
      { X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a', SLACK_WEBHOOK_URL: 's', GH_TOKEN: '' },
      () => main(deps({ publishPost: async () => { calls.push('publish'); } }))
    ),
    /GH_TOKEN/
  );
  // Failing later would leave an orphan branch with no PR.
  assert.deepEqual(calls, []);
});

test('every drafted post is published and its folder handed to the PR', async () => {
  const published = [];
  let postDirs;
  const two = { posts: [{ id: '1', text: 't', url: 'u', media: [], thread: [] }], relatedExistingPosts: [] };
  await withEnv(ENV, () =>
    main(deps({
      classifyAndGroupPosts: async () => ({ groups: [two, two], skipped: [] }),
      publishPost: async ({ draft }) => {
        published.push(draft.title);
        return { postDir: '/tmp/' + published.length, folderName: 'f', photos: [], videos: [] };
      },
      openDraftPr: async ({ postDirs: dirs }) => { postDirs = dirs; return { prUrl: 'u' }; },
    }))
  );
  assert.equal(published.length, 2);
  assert.deepEqual(postDirs, ['/tmp/1', '/tmp/2']);
});

test('--local writes the posts but opens no PR and sends no Slack message', async () => {
  const calls = [];
  process.argv.push('--local');
  try {
    await withEnv({ X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a' }, () =>
      main(deps({
        publishPost: async () => { calls.push('publish'); return { postDir: '/tmp/p', folderName: 'f', photos: [], videos: [] }; },
        openDraftPr: async () => { calls.push('pr'); return { prUrl: 'u' }; },
        notifySlack: async () => { calls.push('slack'); },
      }))
    );
  } finally {
    process.argv = process.argv.filter((a) => a !== '--local');
  }
  // The whole point: real post folders on disk, nothing pushed anywhere.
  assert.deepEqual(calls, ['publish']);
});

test('--local needs no GH_TOKEN or Slack webhook', async () => {
  process.argv.push('--local');
  try {
    await withEnv({ X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a' }, () => main(deps()));
  } finally {
    process.argv = process.argv.filter((a) => a !== '--local');
  }
  // Reaching here without throwing is the assertion.
  assert.ok(true);
});

test('--ignore-pending skips the open-PR dedup so a test run is possible', async () => {
  let consulted = false;
  process.argv.push('--dry-run', '--ignore-pending');
  try {
    await withEnv({ X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a' }, () =>
      main(deps({ readPendingPosts: () => { consulted = true; return []; } }))
    );
  } finally {
    process.argv = process.argv.filter((a) => a !== '--dry-run' && a !== '--ignore-pending');
  }
  assert.equal(consulted, false);
});

test('open draft PRs are consulted by default', async () => {
  let consulted = false;
  process.argv.push('--dry-run');
  try {
    await withEnv({ X_API_BEARER_TOKEN: 'x', ANTHROPIC_API_KEY: 'a' }, () =>
      main(deps({ readPendingPosts: () => { consulted = true; return []; } }))
    );
  } finally {
    process.argv = process.argv.filter((a) => a !== '--dry-run');
  }
  assert.ok(consulted, 'a real run must not re-draft what is already awaiting review');
});
