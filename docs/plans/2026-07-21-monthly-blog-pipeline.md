# Monthly Blog Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a monthly GitHub Actions pipeline that turns Alex Barashkov's
qualifying X posts into a company-blog PR in a new "Updates" category, gated
on his informal review before merge.

**Architecture:** A single Node script (`scripts/blog-pipeline/run.js`),
composed of small pure/injectable modules (fetch, one-liner filter,
classify+dedup+group, draft, publish, git/PR, Slack), run by a GitHub
Actions workflow on a monthly cron (plus manual `workflow_dispatch`). A run
can produce zero, one, or several posts in a single PR depending on how the
classify step groups the month's qualifying posts. No new service, no
database.

**Tech Stack:** Node 22 (matches `engines.node` already pinned in
`package.json`), Node's built-in `node:test` runner (zero new test-framework
dependency), `@anthropic-ai/sdk` (Claude), `gray-matter` for frontmatter
parsing, `gh` CLI (preinstalled on GitHub-hosted runners) for PR creation.

**Reference:** Design doc at
[`docs/superpowers/specs/2026-07-21-monthly-blog-pipeline-design.md`](../superpowers/specs/2026-07-21-monthly-blog-pipeline-design.md).

---

## Prerequisites (accounts/secrets — not code, do before Task 13)

- X API bearer token with read access to `GET /2/users/by/username` and
  `GET /2/users/:id/tweets` (App-only auth is sufficient). Note X removed its
  free tier for new developers in February 2026 and moved to pay-per-use, so
  the developer account needs a payment method attached before the token
  works. At ~$0.005 per post read and ~50–100 posts a month, this pipeline
  still lands well under $1/month.
- Anthropic API key (console.anthropic.com → API keys).
- Slack incoming webhook URL for the channel that should get notified.

---

### Task 1: Add the "Updates" blog category

**Files:**
- Modify: `src/constants/blog.js`
- Test: `src/constants/blog.test.js`

**Step 1: Write the failing test**

```js
// src/constants/blog.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { BLOG_CATEGORIES } = require('./blog');

test('BLOG_CATEGORIES includes Updates', () => {
  assert.ok(BLOG_CATEGORIES.includes('Updates'));
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/constants/blog.test.js`
Expected: FAIL (assertion `BLOG_CATEGORIES.includes('Updates')` is `false`)

**Step 3: Update the constant**

```js
// src/constants/blog.js
const BLOG_BASE_PATH = '/blog/';
const BLOG_CATEGORIES = ['Development', 'Design', 'Misc', 'Updates'];
const BLOG_POSTS_PER_PAGE = 15;

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  BLOG_BASE_PATH,
  BLOG_CATEGORIES,
  BLOG_POSTS_PER_PAGE,
};
```

**Step 4: Run test to verify it passes**

Run: `node --test src/constants/blog.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/constants/blog.js src/constants/blog.test.js
git commit -m "feat: add Updates blog category"
```

---

### Task 2: Add the fixed cover image and pipeline dependencies

**Files:**
- Create: `static/blog-updates-cover.png` (manual — see note below)
- Modify: `package.json`

**This task has one manual, non-code step:** drop a real branded image at
`static/blog-updates-cover.png` (1200×630 or similar, matching the site's
existing cover aspect ratio — check any `content/posts/*/cover.png` for
reference dimensions). This is the one asset in the whole pipeline that
needs a human to actually make it; nothing in later tasks can substitute
for it. Do this before Task 13 (the workflow won't produce a usable PR
without it), but it doesn't block the code tasks below — a temporary
placeholder PNG of any size unblocks local testing in the meantime.

**Step 1: Install dependencies**

Run: `npm install @anthropic-ai/sdk gray-matter`
Expected: `package.json` `dependencies` gains `@anthropic-ai/sdk` and
`gray-matter`.

**Step 2: Add a test script**

```json
// package.json, inside "scripts"
"test": "node --test scripts/ src/constants/"
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk and gray-matter for blog pipeline"
```

---

### Task 3: `fetch-posts` module

**Files:**
- Create: `scripts/blog-pipeline/lib/fetch-posts.js`
- Test: `scripts/blog-pipeline/lib/fetch-posts.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/fetch-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { getUserId, fetchRecentPosts } = require('./fetch-posts');

test('getUserId returns the id from the X API response', async () => {
  const fakeFetch = async (url) => {
    assert.ok(url.includes('/users/by/username/alex_barashkov'));
    return { ok: true, json: async () => ({ data: { id: '123' } }) };
  };
  const id = await getUserId({
    username: 'alex_barashkov',
    bearerToken: 'token',
    fetchImpl: fakeFetch,
  });
  assert.equal(id, '123');
});

test('getUserId throws on a non-ok response', async () => {
  const fakeFetch = async () => ({
    ok: false,
    status: 401,
    text: async () => 'unauthorized',
  });
  await assert.rejects(
    () => getUserId({ username: 'x', bearerToken: 't', fetchImpl: fakeFetch }),
    /X API user lookup failed: 401/
  );
});

test('fetchRecentPosts maps API posts to the pipeline shape', async () => {
  const fakeFetch = async (url) => {
    assert.ok(url.includes('/users/123/tweets'));
    assert.ok(url.includes('exclude=replies%2Cretweets'));
    return {
      ok: true,
      json: async () => ({
        data: [{ id: '999', text: 'hello world', created_at: '2026-07-01T00:00:00Z' }],
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: '123',
    bearerToken: 'token',
    sinceISODate: '2026-06-01T00:00:00Z',
    fetchImpl: fakeFetch,
  });
  assert.deepEqual(posts, [
    {
      id: '999',
      text: 'hello world',
      createdAt: '2026-07-01T00:00:00Z',
      url: 'https://x.com/i/web/status/999',
      media: [],
    },
  ]);
});

test('fetchRecentPosts attaches expanded media to the post that references it', async () => {
  const fakeFetch = async (url) => {
    assert.ok(url.includes('expansions=attachments.media_keys'));
    assert.ok(url.includes('variants'));
    assert.ok(url.includes('width'));
    return {
      ok: true,
      json: async () => ({
        data: [
          { id: '1', text: 'with a photo', created_at: 'x', attachments: { media_keys: ['k1', 'k2'] } },
          { id: '2', text: 'no media', created_at: 'x' },
        ],
        includes: {
          media: [
            { media_key: 'k1', type: 'photo', url: 'https://pbs.twimg.com/media/a.jpg', alt_text: 'a chart' },
            // Video carries no `url` — only a poster in preview_image_url.
            {
              media_key: 'k2',
              type: 'video',
              preview_image_url: 'https://pbs.twimg.com/poster.jpg',
              variants: [{ content_type: 'video/mp4', bit_rate: 1, url: 'https://video.twimg.com/v.mp4' }],
              width: 1280,
              height: 720,
            },
          ],
        },
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: '123',
    bearerToken: 't',
    sinceISODate: '2026-06-01T00:00:00Z',
    fetchImpl: fakeFetch,
  });
  assert.deepEqual(posts[0].media, [
    {
      type: 'photo',
      url: 'https://pbs.twimg.com/media/a.jpg',
      altText: 'a chart',
      variants: [],
      width: undefined,
      height: undefined,
    },
    {
      type: 'video',
      url: 'https://pbs.twimg.com/poster.jpg',
      altText: '',
      variants: [{ content_type: 'video/mp4', bit_rate: 1, url: 'https://video.twimg.com/v.mp4' }],
      width: 1280,
      height: 720,
    },
  ]);
  assert.deepEqual(posts[1].media, []);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/fetch-posts.test.js`
Expected: FAIL with "Cannot find module './fetch-posts'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/fetch-posts.js
async function getUserId({ username, bearerToken, fetchImpl = fetch }) {
  const res = await fetchImpl(`https://api.twitter.com/2/users/by/username/${username}`, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) {
    throw new Error(`X API user lookup failed: ${res.status} ${await res.text()}`);
  }
  const { data } = await res.json();
  return data.id;
}

async function fetchRecentPosts({ userId, bearerToken, sinceISODate, fetchImpl = fetch }) {
  const url = new URL(`https://api.twitter.com/2/users/${userId}/tweets`);
  url.searchParams.set('exclude', 'replies,retweets');
  url.searchParams.set('start_time', sinceISODate);
  url.searchParams.set('tweet.fields', 'created_at,text');
  url.searchParams.set('max_results', '100');
  // Media arrives in a separate `includes.media` list keyed by media_key, not
  // inline on the post — the expansion is what populates it at all.
  url.searchParams.set('expansions', 'attachments.media_keys');
  // `variants` carries the playable mp4 urls for video; width/height are
  // required props on the site's <Video> component.
  url.searchParams.set('media.fields', 'type,url,preview_image_url,alt_text,variants,width,height');

  const res = await fetchImpl(url.toString(), {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) {
    throw new Error(`X API posts fetch failed: ${res.status} ${await res.text()}`);
  }
  const { data = [], includes = {} } = await res.json();
  const mediaByKey = new Map((includes.media || []).map((item) => [item.media_key, item]));

  return data.map((post) => ({
    id: post.id,
    text: post.text,
    createdAt: post.created_at,
    url: `https://x.com/i/web/status/${post.id}`,
    media: ((post.attachments && post.attachments.media_keys) || [])
      .map((key) => mediaByKey.get(key))
      .filter(Boolean)
      .map((item) => ({
        type: item.type,
        // Photos carry `url`; video and animated_gif carry only a poster in
        // `preview_image_url` (the mp4 itself lives in `variants`).
        url: item.url || item.preview_image_url,
        altText: item.alt_text || '',
        variants: item.variants || [],
        width: item.width,
        height: item.height,
      })),
  }));
}

module.exports = { getUserId, fetchRecentPosts };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/fetch-posts.test.js`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/fetch-posts.js scripts/blog-pipeline/lib/fetch-posts.test.js
git commit -m "feat: add X API fetch module for blog pipeline"
```

---

### Task 4: `filter-posts` module

This is deliberately a *cheap noise filter*, not a substance judgment — a dry
run against real June 2026 posts showed that a strict length cutoff (the
original design used 200 chars) drops genuinely good short posts (e.g. a
~115-character "behind the scenes" client note). Substance is judged by the
classify step (Task 8) instead; this step only exists to skip obvious
one-liners like "People are having fun with Toolcraft." before spending an
LLM call on them.

**Files:**
- Create: `scripts/blog-pipeline/lib/filter-posts.js`
- Test: `scripts/blog-pipeline/lib/filter-posts.test.js`

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/filter-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { filterCandidates } = require('./filter-posts');

test('drops one-liners with no real content', () => {
  const posts = [
    { id: '1', text: 'People are having fun with Toolcraft.' },
    { id: '2', text: 'Behind the scenes of the launch video production for Railway. From initial request to final release in less than two weeks.' },
  ];
  const result = filterCandidates(posts);
  assert.deepEqual(result.map((p) => p.id), ['2']);
});

test('respects a custom minLength option', () => {
  const posts = [{ id: '1', text: 'short but ok' }];
  const result = filterCandidates(posts, { minLength: 5 });
  assert.equal(result.length, 1);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test scripts/blog-pipeline/lib/filter-posts.test.js`
Expected: FAIL with "Cannot find module './filter-posts'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/filter-posts.js
const MIN_LENGTH = 60;

function filterCandidates(posts, { minLength = MIN_LENGTH } = {}) {
  return posts.filter((post) => post.text.trim().length >= minLength);
}

module.exports = { filterCandidates, MIN_LENGTH };
```

**Step 4: Run test to verify it passes**

Run: `node --test scripts/blog-pipeline/lib/filter-posts.test.js`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/filter-posts.js scripts/blog-pipeline/lib/filter-posts.test.js
git commit -m "feat: add cheap one-liner filter for blog pipeline"
```

---

### Task 5: `read-existing-posts` module

**Files:**
- Create: `scripts/blog-pipeline/lib/read-existing-posts.js`
- Test: `scripts/blog-pipeline/lib/read-existing-posts.test.js`

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/read-existing-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readExistingPosts } = require('./read-existing-posts');

test('reads title/summary from every post folder', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-blog-'));
  const postDir = path.join(repoRoot, 'content', 'posts', '2026-06-30-toolcraft');
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(
    path.join(postDir, 'index.md'),
    "---\ntitle: 'Toolcraft'\nsummary: A design tool\n---\nBody\n"
  );

  const posts = readExistingPosts(repoRoot);
  assert.deepEqual(posts, [
    { title: 'Toolcraft', summary: 'A design tool', path: '/blog/toolcraft' },
  ]);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test scripts/blog-pipeline/lib/read-existing-posts.test.js`
Expected: FAIL with "Cannot find module './read-existing-posts'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/read-existing-posts.js
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
// Reused rather than reimplemented so the pipeline's links stay correct if
// BLOG_BASE_PATH or the date-prefix convention ever changes.
const getBlogPostPath = require('../../../src/utils/get-blog-post-path');

function readExistingPosts(repoRoot) {
  const postsDir = path.join(repoRoot, 'content', 'posts');
  return fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexPath = path.join(postsDir, entry.name, 'index.md');
      if (!fs.existsSync(indexPath)) return null;
      const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
      // The path lets a draft link to an existing post instead of
      // re-explaining what it already covers.
      return { title: data.title, summary: data.summary, path: getBlogPostPath(entry.name) };
    })
    .filter(Boolean);
}

module.exports = { readExistingPosts };
```

**Step 4: Run test to verify it passes**

Run: `node --test scripts/blog-pipeline/lib/read-existing-posts.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/read-existing-posts.js scripts/blog-pipeline/lib/read-existing-posts.test.js
git commit -m "feat: add existing-posts reader for dedup checks"
```

---

### Task 6: `read-author-handle` module

**Files:**
- Create: `scripts/blog-pipeline/lib/read-author-handle.js`
- Test: `scripts/blog-pipeline/lib/read-author-handle.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/read-author-handle.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readAuthorHandle } = require('./read-author-handle');

function makeRepoWithAuthors(authors) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-authors-'));
  fs.mkdirSync(path.join(repoRoot, 'content', 'posts'), { recursive: true });
  fs.writeFileSync(
    path.join(repoRoot, 'content', 'posts', 'post-authors.json'),
    JSON.stringify(authors)
  );
  return repoRoot;
}

test('extracts the handle from twitterUrl', () => {
  const repoRoot = makeRepoWithAuthors([
    { name: 'Alex Barashkov', twitterUrl: 'https://twitter.com/alex_barashkov' },
  ]);
  assert.equal(readAuthorHandle(repoRoot, 'Alex Barashkov'), 'alex_barashkov');
});

test('throws when the author has no twitterUrl', () => {
  const repoRoot = makeRepoWithAuthors([{ name: 'Kirill Bolotsky' }]);
  assert.throws(() => readAuthorHandle(repoRoot, 'Kirill Bolotsky'), /No twitterUrl found/);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/read-author-handle.test.js`
Expected: FAIL with "Cannot find module './read-author-handle'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/read-author-handle.js
const fs = require('node:fs');
const path = require('node:path');

function readAuthorHandle(repoRoot, authorName) {
  const authorsPath = path.join(repoRoot, 'content', 'posts', 'post-authors.json');
  const authors = JSON.parse(fs.readFileSync(authorsPath, 'utf8'));
  const author = authors.find((a) => a.name === authorName);
  if (!author || !author.twitterUrl) {
    throw new Error(`No twitterUrl found for author "${authorName}" in post-authors.json`);
  }
  return new URL(author.twitterUrl).pathname.replace(/^\//, '');
}

module.exports = { readAuthorHandle };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/read-author-handle.test.js`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/read-author-handle.js scripts/blog-pipeline/lib/read-author-handle.test.js
git commit -m "feat: read X handle from post-authors.json"
```

---

### Task 7: `anthropic-json` shared request helper

Both LLM steps (classify in Task 8, draft in Task 9) send one prompt and
expect JSON back in a known shape, so that request shape lives in one module
instead of being duplicated. Two things it centralises are specific to the
Anthropic API and have no OpenAI equivalent:

- A refused request returns **HTTP 200** with empty or partial content, not an
  error. It has to be checked before reading `content`, otherwise it surfaces
  as a confusing JSON parse failure instead of the real reason. Same for
  `max_tokens` truncation.
- Thinking is on by default on `claude-opus-5`, so `content` holds thinking
  blocks alongside text ones. Only the text blocks carry the JSON.

The JSON shape is enforced by structured outputs (`output_config.format`)
rather than requested in prose, so callers can `JSON.parse` the result without
defensive checks.

**Files:**
- Create: `scripts/blog-pipeline/lib/anthropic-json.js`
- Test: `scripts/blog-pipeline/lib/anthropic-json.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/anthropic-json.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { requestJson, extractText } = require('./anthropic-json');

const SCHEMA = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] };

function clientReturning(message) {
  return { messages: { create: async () => message } };
}

test('extractText concatenates text blocks and skips thinking blocks', () => {
  const text = extractText({
    content: [
      { type: 'thinking', thinking: 'internal' },
      { type: 'text', text: '{"ok":' },
      { type: 'text', text: 'true}' },
    ],
  });
  assert.equal(text, '{"ok":true}');
});

test('requestJson returns the parsed JSON payload', async () => {
  const client = clientReturning({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: '{"ok":true}' }],
  });
  const result = await requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA });
  assert.deepEqual(result, { ok: true });
});

test('requestJson throws a named error on a refusal rather than a JSON parse error', async () => {
  const client = clientReturning({
    stop_reason: 'refusal',
    stop_details: { category: 'cyber' },
    content: [],
  });
  await assert.rejects(
    () => requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA }),
    /Claude declined this request \(category: cyber\)/
  );
});

test('requestJson reports truncation instead of failing to parse partial JSON', async () => {
  const client = clientReturning({
    stop_reason: 'max_tokens',
    content: [{ type: 'text', text: '{"ok":' }],
  });
  await assert.rejects(
    () => requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA }),
    /token limit; the returned JSON is truncated/
  );
});

test('usage accumulates across calls so a run can report what it cost', async () => {
  const { usage, costUsd, usageSummary } = require('./anthropic-json');
  const before = { ...usage };
  const client = clientReturning({
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: '{"ok":true}' }],
    usage: { input_tokens: 10000, output_tokens: 40000 },
  });
  await requestJson({ anthropicClient: client, prompt: 'hi', schema: SCHEMA });
  assert.equal(usage.calls, before.calls + 1);
  assert.equal(usage.inputTokens, before.inputTokens + 10000);
  assert.equal(usage.outputTokens, before.outputTokens + 40000);
  // 10k in at $5/Mtok + 40k out at $25/Mtok = $0.05 + $1.00
  assert.ok(costUsd() >= 1.05, `expected at least $1.05, got ${costUsd()}`);
  assert.ok(usageSummary().includes('model call'));
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/anthropic-json.test.js`
Expected: FAIL with "Cannot find module './anthropic-json'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/anthropic-json.js
// Shared request shape for the two LLM steps (classify, draft).
//
// Both steps want the same thing: send one prompt, get back JSON in a known
// shape. Structured outputs (`output_config.format`) constrain the response to
// `schema` at the API level, so callers can JSON.parse the result without
// defensive checks — unlike the old json_object mode, which only asked politely.
const MODEL = 'claude-opus-5';
const MAX_TOKENS = 16000;

// claude.com/pricing, per million tokens. Thinking bills as output, and with
// adaptive thinking on it dominates the bill — which is why a run costs about
// ten times what the input alone suggests.
const USD_PER_MTOK_INPUT = 5;
const USD_PER_MTOK_OUTPUT = 25;

const usage = { calls: 0, inputTokens: 0, outputTokens: 0 };

function costUsd() {
  return (
    (usage.inputTokens / 1e6) * USD_PER_MTOK_INPUT +
    (usage.outputTokens / 1e6) * USD_PER_MTOK_OUTPUT
  );
}

function usageSummary() {
  return `${usage.calls} model call(s), ${usage.inputTokens.toLocaleString()} in / ${usage.outputTokens.toLocaleString()} out — about $${costUsd().toFixed(2)}`;
}

function extractText(message) {
  // Thinking is on by default on this model, so content holds thinking blocks
  // alongside the text ones. Only the text blocks carry the JSON.
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

async function requestJson({ anthropicClient, prompt, schema }) {
  const message = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive' },
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: prompt }],
  });

  if (message.usage) {
    usage.calls += 1;
    usage.inputTokens += message.usage.input_tokens || 0;
    usage.outputTokens += message.usage.output_tokens || 0;
  }

  // A refused request returns HTTP 200 with empty or partial content, so this
  // has to be checked before reading content — otherwise it surfaces as a
  // confusing JSON parse error instead of the real reason.
  if (message.stop_reason === 'refusal') {
    const category = (message.stop_details && message.stop_details.category) || 'unspecified';
    throw new Error(`Claude declined this request (category: ${category})`);
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error(`Claude hit the ${MAX_TOKENS} token limit; the returned JSON is truncated`);
  }

  return JSON.parse(extractText(message));
}

module.exports = { requestJson, extractText, usage, costUsd, usageSummary, MODEL, MAX_TOKENS };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/anthropic-json.test.js`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/anthropic-json.js scripts/blog-pipeline/lib/anthropic-json.test.js
git commit -m "feat: add shared Claude JSON request helper for blog pipeline"
```

---

### Task 8: `classify-posts` module

This step carries the actual quality bar (see the design doc's "Content
quality bar" section): not just "is this on-topic," but "would this stand
alone as worth reading for someone with zero context on Alex's X feed." It
also decides how the survivors split into one or more article groups, so a
single big story doesn't get diluted by being bundled with unrelated small
updates.

**Files:**
- Create: `scripts/blog-pipeline/lib/classify-posts.js`
- Test: `scripts/blog-pipeline/lib/classify-posts.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/classify-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyAndGroupPosts, buildClassifyPrompt } = require('./classify-posts');

function fakeClientReturning(payload) {
  return {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(payload) }],
      }),
    },
  };
}

test('buildClassifyPrompt lists existing posts and candidate ids', () => {
  const prompt = buildClassifyPrompt(
    [{ id: '1', text: 'design update' }],
    [{ title: 'Toolcraft', summary: 'A design tool' }]
  );
  assert.ok(prompt.includes('Toolcraft: A design tool'));
  assert.ok(prompt.includes('zero context'));
  assert.ok(prompt.includes('personal side project'));
  assert.ok(prompt.includes('"id":"1"') || prompt.includes('"id": "1"'));
});

function group(postIds, extra = {}) {
  return {
    post_ids: postIds,
    already_covered: false,
    existing_post_title: '',
    related_existing_post_titles: [],
    ...extra,
  };
}

test('classifyAndGroupPosts returns groups of full post objects', async () => {
  const fakeClient = fakeClientReturning({ groups: [group(['2']), group(['3', '4'])] });
  const candidates = [
    { id: '1', text: 'skip me' },
    { id: '2', text: 'standalone story' },
    { id: '3', text: 'small update one' },
    { id: '4', text: 'small update two' },
  ];
  const result = await classifyAndGroupPosts({ candidates, existingPosts: [], anthropicClient: fakeClient });
  assert.deepEqual(
    result.groups.map((group) => group.posts.map((p) => p.id)),
    [['2'], ['3', '4']]
  );
  assert.deepEqual(result.skipped, []);
});

test('classifyAndGroupPosts drops groups the model flagged as already covered', async () => {
  const fakeClient = fakeClientReturning({
    groups: [
      group(['2']),
      group(['3'], { already_covered: true, existing_post_title: 'Build personal design tools with AI using Toolcraft' }),
    ],
  });
  const result = await classifyAndGroupPosts({
    candidates: [
      { id: '2', text: 'a genuinely new topic' },
      { id: '3', text: 'a restatement of an existing post' },
    ],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(
    result.groups.map((g) => g.posts.map((p) => p.id)),
    [['2']]
  );
  // The skipped group is reported, not discarded, so the PR can show it.
  assert.equal(result.skipped.length, 1);
  assert.deepEqual(
    result.skipped[0].posts.map((p) => p.id),
    ['3']
  );
  assert.equal(
    result.skipped[0].existingPostTitle,
    'Build personal design tools with AI using Toolcraft'
  );
});

test('classifyAndGroupPosts drops post ids the model invented', async () => {
  const fakeClient = fakeClientReturning({ groups: [group(['2', 'not-a-real-id'])] });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'real post' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(
    result.groups.map((group) => group.posts.map((p) => p.id)),
    [['2']]
  );
});

test('classifyAndGroupPosts reports neither a group nor a skip when no ids resolve', async () => {
  const fakeClient = fakeClientReturning({
    groups: [group(['nope'], { already_covered: true, existing_post_title: 'Some post' })],
  });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'a real post' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, { groups: [], skipped: [] });
});

test('classifyAndGroupPosts sends the request with a json_schema output format', async () => {
  let sentParams;
  const fakeClient = {
    messages: {
      create: async (params) => {
        sentParams = params;
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"groups":[]}' }] };
      },
    },
  };
  await classifyAndGroupPosts({
    candidates: [{ id: '1', text: 'a post long enough to classify' }],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.equal(sentParams.model, 'claude-opus-5');
  assert.equal(sentParams.output_config.format.type, 'json_schema');
  assert.deepEqual(sentParams.output_config.format.schema.required, ['groups']);
  // The dedup verdict has to be required, or the model can omit it and every
  // group silently defaults to "not covered".
  assert.deepEqual(sentParams.output_config.format.schema.properties.groups.items.required, [
    'post_ids',
    'already_covered',
    'existing_post_title',
    'related_existing_post_titles',
  ]);
});

test('buildClassifyPrompt asks for a per-group check against the existing posts', () => {
  const prompt = buildClassifyPrompt(
    [{ id: '1', text: 'a candidate' }],
    [{ title: 'Toolcraft', summary: 'A design tool' }]
  );
  assert.ok(prompt.includes('already_covered'));
  assert.ok(prompt.includes('restating an existing thesis'));
});

test('classifyAndGroupPosts returns no groups without calling the model when there are no candidates', async () => {
  let called = false;
  const fakeClient = {
    messages: {
      create: async () => {
        called = true;
      },
    },
  };
  const result = await classifyAndGroupPosts({ candidates: [], existingPosts: [], anthropicClient: fakeClient });
  assert.deepEqual(result, { groups: [], skipped: [] });
  assert.equal(called, false);
});

test('classifyAndGroupPosts resolves related existing posts so the draft can link them', async () => {
  const existingPosts = [
    { title: 'Build personal design tools with AI using Toolcraft', summary: 'x', path: '/blog/how-to-craft/' },
  ];
  const fakeClient = fakeClientReturning({
    groups: [
      group(['2'], {
        related_existing_post_titles: [
          'Build personal design tools with AI using Toolcraft',
          'A post that does not exist',
        ],
      }),
    ],
  });
  const result = await classifyAndGroupPosts({
    candidates: [{ id: '2', text: 'a new Toolcraft release' }],
    existingPosts,
    anthropicClient: fakeClient,
  });
  // An invented title must not become a dead link in a published post.
  assert.deepEqual(result.groups[0].relatedExistingPosts, [existingPosts[0]]);
});

test('buildClassifyPrompt asks for related posts separately from the covered verdict', () => {
  const prompt = buildClassifyPrompt([{ id: '1', text: 'x' }], [{ title: 'T', summary: 'S' }]);
  assert.ok(prompt.includes('related_existing_post_titles'));
  assert.ok(prompt.includes('rather than reintroducing the product'));
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/classify-posts.test.js`
Expected: FAIL with "Cannot find module './classify-posts'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/classify-posts.js
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
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/classify-posts.test.js`
Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/classify-posts.js scripts/blog-pipeline/lib/classify-posts.test.js
git commit -m "feat: add LLM classify+dedup+group step for blog pipeline"
```

---

### Task 9: `draft-post` module

**Files:**
- Create: `scripts/blog-pipeline/lib/draft-post.js`
- Test: `scripts/blog-pipeline/lib/draft-post.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/draft-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { draftPost, buildDraftPrompt } = require('./draft-post');

test('buildDraftPrompt tells the model to preserve I/we framing and write editorially', () => {
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('keep it first-person'));
  assert.ok(prompt.includes('I built a tool'));
  assert.ok(prompt.includes("Don't just reformat"));
});

test('buildDraftPrompt tells the model it is writing under the author\'s own byline', () => {
  // A dry run against real posts produced drafts that referred to "Alex
  // Barashkov, our CEO" in the third person while being published under his
  // byline, so the narrator has to be stated explicitly.
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes("under Alex's own byline"));
  assert.ok(prompt.includes('never refer to'));
});

test('draftPost parses the model JSON response into a draft object', async () => {
  const fakeDraft = { title: 'T', summary: 'S', slug: 'slug', body: 'Body' };
  const fakeClient = {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(fakeDraft) }],
      }),
    },
  };
  const result = await draftPost({
    qualifyingPosts: [{ text: 'I built X', url: 'https://x.com/1' }],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, fakeDraft);
});

test('draftPost ignores thinking blocks when reading the JSON', async () => {
  const fakeDraft = { title: 'T', summary: 'S', slug: 'slug', body: 'Body' };
  const fakeClient = {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [
          { type: 'thinking', thinking: 'Let me consider the framing...' },
          { type: 'text', text: JSON.stringify(fakeDraft) },
        ],
      }),
    },
  };
  const result = await draftPost({
    qualifyingPosts: [{ text: 'I built X', url: 'https://x.com/1' }],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, fakeDraft);
});

test('buildDraftPrompt tells the model to link existing coverage instead of restating it', () => {
  // A real run produced a second Toolcraft post whose summary reused the
  // existing post's own "starter kit and UI library" framing. The classify
  // verdict was defensible — there was genuine news — so the fix belongs here.
  const prompt = buildDraftPrompt(
    [{ text: 'New Toolcraft release', url: 'https://x.com/1' }],
    [],
    [],
    [{ title: 'Build personal design tools with AI using Toolcraft', path: '/blog/how-to-craft/' }]
  );
  assert.ok(prompt.includes('do not reintroduce or re-explain'));
  assert.ok(prompt.includes('/blog/how-to-craft/'));
  assert.ok(prompt.includes('Open with what is actually new'));
});

test('buildDraftPrompt says nothing about related posts when there are none', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(!prompt.includes('Already published on this subject'));
});

test('buildDraftPrompt asks for sentence case, matching the rest of the blog', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('sentence case'));
  // The counter-example matters as much as the rule: without it, drafts kept
  // producing Title Case On Every Word.
  assert.ok(prompt.includes('five creative tools we built'));
  assert.ok(prompt.includes('Five Creative Tools We Built'));
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/draft-post.test.js`
Expected: FAIL with "Cannot find module './draft-post'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/draft-post.js
const { requestJson } = require('./anthropic-json');

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    slug: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['title', 'summary', 'slug', 'body'],
  additionalProperties: false,
};

function buildRelatedPostsInstructions(relatedExistingPosts) {
  if (relatedExistingPosts.length === 0) return [];
  return [
    '',
    'The blog has already published the posts below on this same subject. Assume the reader can be sent there: do not reintroduce or re-explain what these posts already cover, and do not restate their framing in new words. Open with what is actually new here, and link to the relevant post inline in markdown the first time you refer to the background — for example, "the starter kit [we introduced earlier](/blog/some-post/)".',
    '',
    'Already published on this subject (JSON):',
    JSON.stringify(relatedExistingPosts.map((post) => ({ title: post.title, path: post.path }))),
  ];
}

function buildVideoInstructions(videos) {
  if (videos.length === 0) return [];
  return [
    '',
    'These videos come from the source posts. Place each one at the point it illustrates using exactly the markup listed below, copied verbatim on its own line — it is a component, not markdown, and altering the attributes will break the page. Leave a video out if it does not earn its place.',
    '',
    'Videos available (use these lines exactly):',
    ...videos.map(
      (video) =>
        `<Video src="${video.src}" width="${video.width}" height="${video.height}"${
          video.isGif ? ' autoPlay muted loop playsInline' : ' controls muted'
        } poster="./${video.posterFilename}"></Video>`
    ),
  ];
}

function buildImageInstructions(photos) {
  if (photos.length === 0) return [];
  return [
    '',
    'These images come from the source posts and are saved alongside the article. Place each one in the body at the point it illustrates, not collected at the end, using exactly this markdown: ![alt text](filename). Use the filenames exactly as listed — a filename you invent renders as a broken image. Leave an image out entirely if it does not earn its place.',
    'Write the alt text yourself. The site renders it as the visible caption under the image, so describe what the image actually shows instead of restating the sentence next to it.',
    '',
    'Images available (JSON):',
    JSON.stringify(photos.map((photo) => ({ filename: photo.filename }))),
  ];
}

function buildDraftPrompt(posts, photos = [], videos = [], relatedExistingPosts = []) {
  return [
    'Write a company blog post for Pixel Point\'s "Updates" category, based on the following X posts from Alex Barashkov (CEO). This group of posts is one article topic — if there is more than one post, weave them into one cohesive piece rather than listing them separately.',
    'The article is published under Alex\'s own byline, so he is the narrator. Write as him, not about him: never refer to "Alex", "Alex Barashkov", or "our CEO" in the third person, and never introduce a quote as something he said elsewhere — his posts are your own material, so state it directly.',
    'Preserve his framing: if a post says "I built X," keep it first-person; if it credits the team ("our design process"), keep that framing. Do not force everything into "we."',
    "Don't just reformat the source posts into blog-post shape — write editorially: explain the problem being solved, translate any jargon into plain language, and add a concrete example if it helps a reader with zero context on these posts understand why this matters. The goal is a piece that reads as genuinely worth someone's time, not a tidied-up repost.",
    // The rest of the blog is sentence case ("Taking automated web page
    // screenshots with Puppeteer and Sharp"), but drafts drifted into title
    // case on roughly a third of titles.
    'Write the title and every heading in sentence case, like the rest of this blog: capitalise the first word, and after that only proper nouns, product names, and acronyms. Write "Toolcraft: five creative tools we built to prove AI demos can be more than toys", not "Toolcraft: Five Creative Tools We Built to Prove AI Demos Can Be More Than Toys". Note that AI, Blender, and Novu stay capitalised because of what they are, not because of where they sit in the sentence.',
    '',
    'Source posts (JSON):',
    JSON.stringify(posts.map((p) => ({ text: p.text, url: p.url }))),
    ...buildRelatedPostsInstructions(relatedExistingPosts),
    ...buildImageInstructions(photos),
    ...buildVideoInstructions(videos),
    '',
    'Respond with JSON: { "title": "...", "summary": "...", "slug": "kebab-case-slug", "body": "markdown body" }',
  ].join('\n');
}

async function draftPost({
  qualifyingPosts,
  photos = [],
  videos = [],
  relatedExistingPosts = [],
  anthropicClient,
}) {
  const draft = await requestJson({
    anthropicClient,
    prompt: buildDraftPrompt(qualifyingPosts, photos, videos, relatedExistingPosts),
    schema: DRAFT_SCHEMA,
  });

  return { title: draft.title, summary: draft.summary, slug: draft.slug, body: draft.body };
}

module.exports = { draftPost, buildDraftPrompt, DRAFT_SCHEMA };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/draft-post.test.js`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/draft-post.js scripts/blog-pipeline/lib/draft-post.test.js
git commit -m "feat: add LLM drafting step for blog pipeline"
```

---

### Task 10: `publish-post` and `post-media` modules

**Files:**
- Create: `scripts/blog-pipeline/lib/post-media.js`
- Test: `scripts/blog-pipeline/lib/post-media.test.js`
- Create: `scripts/blog-pipeline/lib/publish-post.js`
- Test: `scripts/blog-pipeline/lib/publish-post.test.js`

**Step 0: Write the media collector and downloader**

Photos from the source posts are committed next to `index.md` and referenced
as `![alt](filename)`, matching what every existing post on the site already
does — `gatsby-remark-images` turns those into responsive WebP with the alt
text as the visible caption. Filenames are assigned *before* drafting so the
model can be handed the exact names; letting it invent them would mean
reconciling made-up references against downloaded files afterwards.

A survey of 35 days of real posts found 42 media items — 19 photos, 23 videos
— and **none** carried author-supplied alt text, so the model writes all of
it. Video is excluded here pending a hosting decision (see the design doc's
deferred items).

```js
// scripts/blog-pipeline/lib/post-media.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { collectPhotos, downloadPhotos, stripUnknownImages } = require('./post-media');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'pp-media-'));
}

test('collectPhotos numbers photos across every post in the group', () => {
  const photos = collectPhotos([
    { media: [{ type: 'photo', url: 'https://pbs.twimg.com/media/a.jpg', altText: '' }] },
    { media: [{ type: 'photo', url: 'https://pbs.twimg.com/media/b.png', altText: 'a chart' }] },
  ]);
  assert.deepEqual(
    photos.map((p) => p.filename),
    ['image-1.jpg', 'image-2.png']
  );
  assert.equal(photos[1].altText, 'a chart');
});

test('collectPhotos ignores video and posts with no media', () => {
  const photos = collectPhotos([
    { media: [{ type: 'video', url: 'https://pbs.twimg.com/preview.jpg' }] },
    { media: [{ type: 'animated_gif', url: 'https://pbs.twimg.com/gif.jpg' }] },
    {},
  ]);
  assert.deepEqual(photos, []);
});

test('collectPhotos falls back to .jpg for a url with no usable extension', () => {
  const photos = collectPhotos([{ media: [{ type: 'photo', url: 'https://pbs.twimg.com/media/abc' }] }]);
  assert.equal(photos[0].filename, 'image-1.jpg');
});

test('downloadPhotos writes each image and reports what landed', async () => {
  const destDir = tmpDir();
  const fakeFetch = async () => ({ ok: true, arrayBuffer: async () => new TextEncoder().encode('png-bytes').buffer });
  const saved = await downloadPhotos({
    photos: [{ filename: 'image-1.jpg', url: 'https://example.com/a.jpg' }],
    destDir,
    fetchImpl: fakeFetch,
  });
  assert.equal(saved.length, 1);
  assert.equal(fs.readFileSync(path.join(destDir, 'image-1.jpg'), 'utf8'), 'png-bytes');
});

test('downloadPhotos drops a failed image instead of failing the run', async () => {
  const destDir = tmpDir();
  const fakeFetch = async (url) =>
    url.includes('good')
      ? { ok: true, arrayBuffer: async () => new TextEncoder().encode('ok').buffer }
      : { ok: false, status: 404 };
  const saved = await downloadPhotos({
    photos: [
      { filename: 'image-1.jpg', url: 'https://example.com/good.jpg' },
      { filename: 'image-2.jpg', url: 'https://example.com/gone.jpg' },
    ],
    destDir,
    fetchImpl: fakeFetch,
  });
  assert.deepEqual(
    saved.map((p) => p.filename),
    ['image-1.jpg']
  );
  assert.equal(fs.existsSync(path.join(destDir, 'image-2.jpg')), false);
});

test('downloadPhotos survives a network error', async () => {
  const destDir = tmpDir();
  const fakeFetch = async () => {
    throw new Error('ECONNRESET');
  };
  const saved = await downloadPhotos({
    photos: [{ filename: 'image-1.jpg', url: 'https://example.com/a.jpg' }],
    destDir,
    fetchImpl: fakeFetch,
  });
  assert.deepEqual(saved, []);
});

test('stripUnknownImages keeps references that resolve and removes ones that do not', () => {
  const body = 'Intro.\n\n![a chart](image-1.jpg)\n\nMiddle.\n\n![invented](image-9.jpg)\n\nEnd.';
  const result = stripUnknownImages(body, ['image-1.jpg']);
  assert.ok(result.includes('![a chart](image-1.jpg)'));
  assert.ok(!result.includes('image-9.jpg'));
  assert.ok(result.includes('Middle.'));
  assert.ok(result.includes('End.'));
});

test('stripUnknownImages removes every image when nothing was saved', () => {
  const result = stripUnknownImages('![a](image-1.jpg)\n\nText.', []);
  assert.ok(!result.includes('image-1.jpg'));
  assert.ok(result.includes('Text.'));
});

const { collectVideos, bestMp4, stripUnusableVideos } = require('./post-media');

const VARIANTS = [
  { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/x.m3u8' },
  { content_type: 'video/mp4', bit_rate: 632000, url: 'https://video.twimg.com/low.mp4' },
  { content_type: 'video/mp4', bit_rate: 2176000, url: 'https://video.twimg.com/high.mp4' },
];

test('bestMp4 picks the highest-bitrate mp4 and ignores streaming variants', () => {
  assert.equal(bestMp4(VARIANTS).url, 'https://video.twimg.com/high.mp4');
  assert.equal(bestMp4([]), undefined);
});

test('collectVideos builds a poster filename and hotlinked src', () => {
  const videos = collectVideos([
    {
      media: [
        { type: 'video', url: 'https://pbs.twimg.com/poster.jpg', variants: VARIANTS, width: 1920, height: 1080 },
      ],
    },
  ]);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].posterFilename, 'video-cover-1.jpg');
  assert.equal(videos[0].src, 'https://video.twimg.com/high.mp4');
  assert.equal(videos[0].width, '1920');
  assert.equal(videos[0].isGif, false);
});

test('collectVideos flags animated_gif so it loops without controls', () => {
  const videos = collectVideos([
    { media: [{ type: 'animated_gif', url: 'https://pbs.twimg.com/p.jpg', variants: VARIANTS }] },
  ]);
  assert.equal(videos[0].isGif, true);
  assert.equal(videos[0].width, '1280'); // falls back when X omits dimensions
});

test('collectVideos skips media with no playable mp4', () => {
  assert.deepEqual(
    collectVideos([{ media: [{ type: 'video', url: 'https://pbs.twimg.com/p.jpg', variants: [] }] }]),
    []
  );
});

test('stripUnusableVideos removes a Video whose poster never downloaded', () => {
  const body =
    'A.\n\n<Video src="https://video.twimg.com/a.mp4" poster="./video-cover-1.jpg"></Video>\n\nB.\n\n<Video src="https://video.twimg.com/b.mp4" poster="./video-cover-2.jpg"></Video>\n\nC.';
  const result = stripUnusableVideos(body, ['video-cover-1.jpg']);
  assert.ok(result.includes('video-cover-1.jpg'));
  assert.ok(!result.includes('video-cover-2.jpg'));
  assert.ok(result.includes('B.') && result.includes('C.'));
});

// Pins the naming to the site's own query. gatsby-node.js collects posters
// with `name: { regex: "/video-cover/" }`; a name that misses the filter
// downloads fine but leaves videoCovers empty, and video.jsx then throws and
// fails the entire site build rather than degrading. Caught by a real build.
test('poster filenames match the regex gatsby-node uses to collect them', () => {
  const SITE_POSTER_REGEX = /video-cover/;
  const videos = collectVideos([
    {
      media: [
        { type: 'video', url: 'https://pbs.twimg.com/a.jpg', variants: VARIANTS },
        { type: 'video', url: 'https://pbs.twimg.com/b.png', variants: VARIANTS },
      ],
    },
  ]);
  assert.equal(videos.length, 2);
  videos.forEach((video) => {
    const nameWithoutExt = video.posterFilename.replace(/\.[^.]+$/, '');
    assert.ok(
      SITE_POSTER_REGEX.test(nameWithoutExt),
      `${video.posterFilename} would be invisible to gatsby-node's allFile query`
    );
  });
});
```

```js
// scripts/blog-pipeline/lib/post-media.js
const fs = require('node:fs');
const path = require('node:path');

const SUPPORTED_TYPES = ['photo'];
const VIDEO_TYPES = ['video', 'animated_gif'];

function extensionFor(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
}

// Names are assigned here, before drafting, so the model can be told exactly
// which filenames to reference. Letting it invent them would mean reconciling
// made-up names against downloaded files afterwards.
function collectPhotos(posts) {
  const photos = [];
  for (const post of posts) {
    for (const item of post.media || []) {
      if (!SUPPORTED_TYPES.includes(item.type) || !item.url) continue;
      photos.push({
        filename: `image-${photos.length + 1}${extensionFor(item.url)}`,
        url: item.url,
        altText: item.altText || '',
      });
    }
  }
  return photos;
}

// X serves several encodings per video; take the highest-bitrate mp4, since
// the others are lower-resolution transcodes of the same clip.
function bestMp4(variants) {
  return (variants || [])
    .filter((variant) => variant.content_type === 'video/mp4' && variant.url)
    .sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))[0];
}

// The mp4 is hotlinked from video.twimg.com rather than rehosted — the site's
// S3 bucket isn't writable from here. Those urls are not contractually stable,
// so a video can silently stop playing later; the poster is downloaded locally
// so at least a still frame survives that.
function collectVideos(posts) {
  const videos = [];
  for (const post of posts) {
    for (const item of post.media || []) {
      if (!VIDEO_TYPES.includes(item.type)) continue;
      const variant = bestMp4(item.variants);
      // No playable mp4 and no poster means there is nothing to render.
      if (!variant || !item.url) continue;
      const index = videos.length + 1;
      videos.push({
        // Must contain the literal "video-cover": gatsby-node.js:135 collects
        // posters with `name: { regex: "/video-cover/" }`, and a poster the
        // query misses leaves videoCovers empty, which makes video.jsx throw
        // and fails the whole site build. `video-1-cover` does not match.
        posterFilename: `video-cover-${index}${extensionFor(item.url)}`,
        posterUrl: item.url,
        src: variant.url,
        width: String(item.width || 1280),
        height: String(item.height || 720),
        // animated_gif has no audio track and should loop like the gif it replaced.
        isGif: item.type === 'animated_gif',
      });
    }
  }
  return videos;
}

// Drops a photo rather than failing the run: a dead image URL should cost one
// image, not the whole month's PR. Returns the ones that actually landed.
async function downloadPhotos({ photos, destDir, fetchImpl = fetch }) {
  const saved = [];
  for (const photo of photos) {
    try {
      const res = await fetchImpl(photo.url);
      if (!res.ok) {
        console.warn(`Skipping ${photo.filename}: ${photo.url} returned ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(destDir, photo.filename), buffer);
      saved.push(photo);
    } catch (err) {
      console.warn(`Skipping ${photo.filename}: ${err.message}`);
    }
  }
  return saved;
}

// The model is told which filenames exist, but nothing stops it inventing one.
// An unresolvable image reference renders as a broken image in Gatsby, so drop
// any that don't match a file we actually saved.
function stripUnknownImages(body, savedFilenames) {
  return body.replace(/!\[[^\]]*\]\(([^)]+)\)\n?/g, (match, target) =>
    savedFilenames.includes(target) ? match : ''
  );
}

// A <Video> whose poster never downloaded throws during the Gatsby build
// (video.jsx:20) rather than degrading, so it takes the whole site down — drop
// the block entirely instead of shipping one.
function stripUnusableVideos(body, savedPosterFilenames) {
  return body.replace(/<Video\b[^>]*>(?:<\/Video>)?\n?/g, (match) => {
    const poster = match.match(/poster="\.\/([^"]+)"/);
    return poster && savedPosterFilenames.includes(poster[1]) ? match : '';
  });
}

module.exports = {
  collectPhotos,
  collectVideos,
  downloadPhotos,
  stripUnknownImages,
  stripUnusableVideos,
  bestMp4,
  SUPPORTED_TYPES,
  VIDEO_TYPES,
};
```

Run: `node --test scripts/blog-pipeline/lib/post-media.test.js`
Expected: PASS (8 tests)

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/publish-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const matter = require('gray-matter');
const { publishPost } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = await publishPost({
    draft: { title: "Alex's Update", summary: 'Summary text', slug: 'alex-update', body: 'Body text' },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes("title: 'Alex''s Update'") || written.includes("title: 'Alex\\'s Update'"));
  assert.ok(written.includes("summary: 'Summary text'"));
  assert.ok(written.includes('author: Alex Barashkov'));
  assert.ok(written.includes('category: Updates'));
  assert.ok(written.includes('Body text'));
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
});

test('produces valid YAML frontmatter when the summary contains a colon', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-colon-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir } = await publishPost({
    draft: {
      title: 'New Tool',
      summary: 'New AI tool: what it means for designers',
      slug: 'new-tool',
      body: 'Body text',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  const { data } = matter(written);
  assert.equal(data.summary, 'New AI tool: what it means for designers');
});

test('downloads photos into the post folder and drops references that failed', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-media-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const fakeFetch = async (url) =>
    url.includes('good')
      ? { ok: true, arrayBuffer: async () => new TextEncoder().encode('img').buffer }
      : { ok: false, status: 404 };

  const { postDir, photos } = await publishPost({
    draft: {
      title: 'With images',
      summary: 'Summary',
      slug: 'with-images',
      body: 'Intro.\n\n![kept](image-1.jpg)\n\n![lost](image-2.jpg)\n\nEnd.',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
    photos: [
      { filename: 'image-1.jpg', url: 'https://pbs.twimg.com/good.jpg' },
      { filename: 'image-2.jpg', url: 'https://pbs.twimg.com/gone.jpg' },
    ],
    fetchImpl: fakeFetch,
  });

  assert.deepEqual(photos.map((p) => p.filename), ['image-1.jpg']);
  assert.ok(fs.existsSync(path.join(postDir, 'image-1.jpg')));
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes('![kept](image-1.jpg)'));
  assert.ok(!written.includes('image-2.jpg'));
  assert.ok(written.includes('End.'));
});
```

**Step 2: Run test to verify it fails**

Run: `node --test scripts/blog-pipeline/lib/publish-post.test.js`
Expected: FAIL with "Cannot find module './publish-post'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/publish-post.js
const fs = require('node:fs');
const path = require('node:path');
const { downloadPhotos, stripUnknownImages, stripUnusableVideos } = require('./post-media');

// Async because it owns the post's images as well as its text: the body can
// only be finalised once we know which downloads actually succeeded, so
// fetching has to happen before index.md is written, not after.
async function publishPost({
  draft,
  publishDate,
  repoRoot,
  coverImageSourcePath,
  photos = [],
  videos = [],
  fetchImpl,
  author = 'Alex Barashkov',
  category = 'Updates',
}) {
  const slug = draft.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const folderName = `${publishDate}-${slug}`;
  const postDir = path.join(repoRoot, 'content', 'posts', folderName);
  fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = draft.title.replace(/'/g, "''");
  const escapedSummary = draft.summary.replace(/'/g, "''");
  const frontmatter = [
    '---',
    `title: '${escapedTitle}'`,
    `summary: '${escapedSummary}'`,
    `author: ${author}`,
    'cover: cover.png',
    `category: ${category}`,
    '---',
    '',
  ].join('\n');

  const saved = await downloadPhotos({ photos, destDir: postDir, fetchImpl });
  // Video posters are ordinary images as far as the site is concerned — they
  // live in the post folder and gatsby-node picks them up by filename.
  const savedPosters = await downloadPhotos({
    photos: videos.map((video) => ({ filename: video.posterFilename, url: video.posterUrl })),
    destDir: postDir,
    fetchImpl,
  });

  // Drop references to images that never landed — a download that 404s should
  // cost one image, not ship a broken image tag into a published post.
  const body = stripUnusableVideos(
    stripUnknownImages(
      draft.body,
      saved.map((photo) => photo.filename)
    ),
    savedPosters.map((poster) => poster.filename)
  );

  fs.writeFileSync(path.join(postDir, 'index.md'), `${frontmatter}\n${body}\n`, 'utf8');
  fs.copyFileSync(coverImageSourcePath, path.join(postDir, 'cover.png'));

  return { postDir, folderName, photos: saved, videos: savedPosters };
}

module.exports = { publishPost };
```

**Step 4: Run test to verify it passes**

Run: `node --test scripts/blog-pipeline/lib/publish-post.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/publish-post.js scripts/blog-pipeline/lib/publish-post.test.js
git commit -m "feat: add MDX post writer for blog pipeline"
```

---

### Task 11: `notify-slack` module

**Files:**
- Create: `scripts/blog-pipeline/lib/notify-slack.js`
- Test: `scripts/blog-pipeline/lib/notify-slack.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/notify-slack.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { notifySlack } = require('./notify-slack');

test('POSTs the text as JSON to the webhook URL', async () => {
  let capturedUrl;
  let capturedBody;
  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedBody = JSON.parse(options.body);
    return { ok: true };
  };
  await notifySlack({ webhookUrl: 'https://hooks.slack.com/x', text: 'hello', fetchImpl: fakeFetch });
  assert.equal(capturedUrl, 'https://hooks.slack.com/x');
  assert.deepEqual(capturedBody, { text: 'hello' });
});

test('throws when the webhook responds with an error', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500 });
  await assert.rejects(
    () => notifySlack({ webhookUrl: 'https://hooks.slack.com/x', text: 'hi', fetchImpl: fakeFetch }),
    /Slack webhook failed: 500/
  );
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/notify-slack.test.js`
Expected: FAIL with "Cannot find module './notify-slack'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/notify-slack.js
async function notifySlack({ webhookUrl, text, fetchImpl = fetch }) {
  const res = await fetchImpl(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status}`);
  }
}

module.exports = { notifySlack };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/notify-slack.test.js`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/notify-slack.js scripts/blog-pipeline/lib/notify-slack.test.js
git commit -m "feat: add Slack notifier for blog pipeline"
```

---

### Task 12: `git-pr` module

Originally written untested on the reasoning that mocking `child_process`
would only test the mock. A real end-to-end run disproved that: `git push`
returns before GitHub has indexed the new ref, so the `gh pr create`
immediately after failed with `GraphQL: not all refs are readable`. The retry
that fixes it is real logic worth pinning, so `runImpl`/`sleepImpl` are
injectable and the retry policy is unit tested. The shell-out itself is still
verified end-to-end in Task 14.

**Files:**
- Create: `scripts/blog-pipeline/lib/git-pr.js`
- Test: `scripts/blog-pipeline/lib/git-pr.test.js`

**Step 1: Write the tests**

```js
// scripts/blog-pipeline/lib/git-pr.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
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
  assert.equal(calls, 1, 'a bad token fails the same way every time — retrying only delays the alert');
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
  assert.deepEqual(commands, ['git checkout', 'git add', 'git add', 'git commit', 'git push', 'gh pr']);
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
```

**Step 2: Write the implementation**

```js
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
```

**Step 2: Commit**

```bash
git add scripts/blog-pipeline/lib/git-pr.js
git commit -m "feat: add git/PR module for blog pipeline"
```

---

### Task 13: Orchestrator + GitHub Actions workflow

**Files:**
- Create: `scripts/blog-pipeline/lib/pr-body.js`
- Test: `scripts/blog-pipeline/lib/pr-body.test.js`
- Create: `scripts/blog-pipeline/run.js`
- Create: `.github/workflows/monthly-blog-draft.yml`

**Step 0: Write the PR body builder**

The PR is the review gate, so its body is the one place a human reliably
reads. It carries both halves of the classify decision — the drafts that were
written, and the groups dropped as duplicates. Without the second half a wrong
drop is invisible, which is the same blind spot as letting a duplicate
through, just pointing the other way.

```js
// scripts/blog-pipeline/lib/pr-body.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPrBody } = require('./pr-body');

const DRAFTS = [{ title: 'Introducing Aval' }, { title: "Toolcraft's New Release" }];

test('lists every draft title and the review checklist', () => {
  const body = buildPrBody({ drafts: DRAFTS });
  assert.ok(body.includes('- Introducing Aval'));
  assert.ok(body.includes("- Toolcraft's New Release"));
  assert.ok(body.includes('### Before merging'));
  assert.equal((body.match(/^- \[ \] /gm) || []).length, 5);
});

test('omits the skipped section entirely when nothing was skipped', () => {
  const body = buildPrBody({ drafts: DRAFTS, skipped: [] });
  assert.ok(!body.includes('Skipped as already covered'));
});

test('defaults to no skipped section when the caller omits the field', () => {
  assert.ok(!buildPrBody({ drafts: DRAFTS }).includes('Skipped as already covered'));
});

test('reports skipped groups with their source post urls and the overlapping title', () => {
  const body = buildPrBody({
    drafts: DRAFTS,
    skipped: [
      {
        posts: [{ url: 'https://x.com/i/web/status/1' }, { url: 'https://x.com/i/web/status/2' }],
        existingPostTitle: 'Build personal design tools with AI using Toolcraft',
      },
    ],
  });
  assert.ok(body.includes('### Skipped as already covered'));
  assert.ok(body.includes('https://x.com/i/web/status/1, https://x.com/i/web/status/2'));
  assert.ok(body.includes('overlaps "Build personal design tools with AI using Toolcraft"'));
  // Checklist items plus one per skipped group, so the reviewer ticks it off.
  assert.equal((body.match(/^- \[ \] /gm) || []).length, 6);
});

test('falls back to a readable phrase when the model names no overlapping post', () => {
  const body = buildPrBody({
    drafts: DRAFTS,
    skipped: [{ posts: [{ url: 'https://x.com/i/web/status/1' }], existingPostTitle: '' }],
  });
  assert.ok(body.includes('overlaps "an existing post"'));
});
```

```js
// scripts/blog-pipeline/lib/pr-body.js
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
```

Run: `node --test scripts/blog-pipeline/lib/pr-body.test.js`
Expected: PASS (5 tests)

**Step 1: Write the orchestrator**

```js
#!/usr/bin/env node
// scripts/blog-pipeline/run.js  (the shebang must be the first line of the file)
const path = require('node:path');
const Anthropic = require('@anthropic-ai/sdk');
const { getUserId, fetchRecentPosts } = require('./lib/fetch-posts');
const { filterCandidates } = require('./lib/filter-posts');
const { classifyAndGroupPosts } = require('./lib/classify-posts');
const { draftPost } = require('./lib/draft-post');
const { readExistingPosts } = require('./lib/read-existing-posts');
const { readAuthorHandle } = require('./lib/read-author-handle');
const { publishPost } = require('./lib/publish-post');
const { collectPhotos, collectVideos } = require('./lib/post-media');
const { openDraftPr } = require('./lib/git-pr');
const { buildPrBody } = require('./lib/pr-body');
const { notifySlack } = require('./lib/notify-slack');
const { usageSummary } = require('./lib/anthropic-json');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const COVER_IMAGE_PATH = path.join(REPO_ROOT, 'static', 'blog-updates-cover.png');
const AUTHOR_NAME = 'Alex Barashkov';
const LOOKBACK_DAYS = 35;

function assertRequiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  // A dry run stops after drafting — it never opens a PR or posts to Slack —
  // so requiring a webhook it will not use just blocks local testing.
  assertRequiredEnv(
    dryRun
      ? ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY']
      : ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY', 'SLACK_WEBHOOK_URL']
  );

  const { X_API_BEARER_TOKEN, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({ userId, bearerToken: X_API_BEARER_TOKEN, sinceISODate });

  const candidates = filterCandidates(posts);
  const existingPosts = readExistingPosts(REPO_ROOT);
  const { groups, skipped } = await classifyAndGroupPosts({
    candidates,
    existingPosts,
    anthropicClient,
  });

  for (const { posts, existingPostTitle } of skipped) {
    console.log(
      `Skipped ${posts.length} post(s) as already covered by "${existingPostTitle || 'an existing post'}".`
    );
  }

  if (groups.length === 0) {
    console.log('No qualifying posts this month — skipping.');
    if (!dryRun) {
      await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: 'No qualifying posts this month — skipping.' });
    }
    return;
  }

  // Filenames are assigned before drafting so the model can be given the exact
  // names to reference, rather than inventing them and needing reconciliation.
  const drafted = [];
  for (const { posts: group, relatedExistingPosts } of groups) {
    const photos = collectPhotos(group);
    const videos = collectVideos(group);
    drafted.push({
      draft: await draftPost({
        qualifyingPosts: group,
        photos,
        videos,
        relatedExistingPosts,
        anthropicClient,
      }),
      photos,
      videos,
    });
  }
  const drafts = drafted.map((item) => item.draft);

  console.log(`Model usage: ${usageSummary()}`);

  if (dryRun) {
    console.log(`--- DRY RUN: ${drafts.length} drafted post(s) (nothing written or published) ---`);
    console.log(JSON.stringify(drafts, null, 2));
    return;
  }

  const publishDate = new Date().toISOString().slice(0, 10);
  const postDirs = [];
  for (const { draft, photos, videos } of drafted) {
    const published = await publishPost({
      draft,
      publishDate,
      repoRoot: REPO_ROOT,
      coverImageSourcePath: COVER_IMAGE_PATH,
      photos,
      videos,
    });
    console.log(
      `Wrote ${published.folderName} with ${published.photos.length} image(s) and ${published.videos.length} video(s).`
    );
    postDirs.push(published.postDir);
  }

  const runId = process.env.GITHUB_RUN_ID || Date.now().toString();
  const branchName = `blog-draft/${publishDate.slice(0, 7)}-${runId}`;
  const prTitle =
    drafts.length === 1
      ? `Updates: ${drafts[0].title}`
      : `Updates: ${drafts.length} new posts for ${publishDate.slice(0, 7)}`;
  const { prUrl } = openDraftPr({
    repoRoot: REPO_ROOT,
    branchName,
    postDirs,
    prTitle,
    prBody: buildPrBody({ drafts, skipped }),
  });

  const summary =
    drafts.length === 1
      ? `New monthly blog draft ready for review: ${prUrl}`
      : `${drafts.length} new monthly blog drafts ready for review: ${prUrl}`;
  await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: summary });
}

main().catch(async (err) => {
  console.error(err);
  // No webhook configured (a dry run, typically) — the console error above is
  // the whole report, so don't bury it under a second failure from posting to
  // an undefined URL.
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await notifySlack({
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        text: `Monthly blog draft pipeline failed: ${err.message}`,
      });
    } catch (notifyErr) {
      console.error('Also failed to notify Slack:', notifyErr);
    }
  }
  process.exitCode = 1;
});
```

**Step 2: Write the workflow**

```yaml
# .github/workflows/monthly-blog-draft.yml
name: Monthly Blog Draft

on:
  schedule:
    - cron: '0 9 1 * *'
  workflow_dispatch: {}

jobs:
  generate-draft:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: node scripts/blog-pipeline/run.js
        env:
          X_API_BEARER_TOKEN: ${{ secrets.X_API_BEARER_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GIT_AUTHOR_NAME: 'blog-pipeline-bot'
          GIT_AUTHOR_EMAIL: 'bot@pixelpoint.io'
          GIT_COMMITTER_NAME: 'blog-pipeline-bot'
          GIT_COMMITTER_EMAIL: 'bot@pixelpoint.io'
```

**Step 3: Commit**

```bash
git add scripts/blog-pipeline/run.js .github/workflows/monthly-blog-draft.yml
git commit -m "feat: wire up monthly blog pipeline orchestrator and workflow"
```

---

### Task 14: End-to-end manual verification

1. Add the three repo secrets (`X_API_BEARER_TOKEN`, `ANTHROPIC_API_KEY`,
   `SLACK_WEBHOOK_URL`) in GitHub repo Settings → Secrets and variables →
   Actions.
2. Run the full test suite: `npm test` — expect all tests from Tasks 1–11
   passing.
3. Locally, with real credentials exported as env vars, run:
   `node scripts/blog-pipeline/run.js --dry-run`
   Expected: prints either "No qualifying posts this month — skipping." or
   a JSON array of one or more drafted posts — nothing written to disk, no
   branch/PR/Slack message created. Confirms the
   fetch/filter/classify+group/draft chain works against the real APIs
   before ever touching the repo.
4. Trigger the real workflow once via GitHub Actions → "Monthly Blog Draft"
   → "Run workflow" (`workflow_dispatch`).
   Expected: either the "nothing found" Slack message, or a Slack message
   with a PR link; opening the PR should show one `content/posts/...`
   folder per drafted post, and within ~30–60 seconds a Vercel bot comment
   with the preview URL.
5. Open the preview link, confirm the post renders under `/blog/updates/`
   with the fixed cover image, then close/decline the PR (or merge it) —
   your call, this was just a pipeline test.
