# Monthly Blog Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a monthly GitHub Actions pipeline that turns Alex Barashkov's
qualifying X posts into a company-blog PR in a new "Updates" category, gated
on his informal review before merge.

**Architecture:** A single Node script (`scripts/blog-pipeline/run.js`),
composed of small pure/injectable modules (fetch, filter, classify+dedup,
draft, publish, git/PR, Slack), run by a GitHub Actions workflow on a
monthly cron (plus manual `workflow_dispatch`). No new service, no database.

**Tech Stack:** Node 22 (matches `engines.node` already pinned in
`package.json`), Node's built-in `node:test` runner (zero new test-framework
dependency), `openai` SDK, `gray-matter` for frontmatter parsing, `gh` CLI
(preinstalled on GitHub-hosted runners) for PR creation.

**Reference:** Design doc at
[`docs/superpowers/specs/2026-07-21-monthly-blog-pipeline-design.md`](../superpowers/specs/2026-07-21-monthly-blog-pipeline-design.md).

---

## Prerequisites (accounts/secrets — not code, do before Task 12)

- X API bearer token with read access to `GET /2/users/by/username` and
  `GET /2/users/:id/tweets` (App-only auth is sufficient).
- OpenAI API key.
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
const BLOG_CATEGORIES = ['Development', 'Design', 'Misc', 'Updates'];
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
for it. Do this before Task 12 (the workflow won't produce a usable PR
without it), but it doesn't block the code tasks below — a temporary
placeholder PNG of any size unblocks local testing in the meantime.

**Step 1: Install dependencies**

Run: `npm install openai gray-matter`
Expected: `package.json` `dependencies` gains `openai` and `gray-matter`.

**Step 2: Add a test script**

```json
// package.json, inside "scripts"
"test": "node --test scripts/ src/constants/"
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add openai and gray-matter for blog pipeline"
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
    },
  ]);
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

  const res = await fetchImpl(url.toString(), {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  if (!res.ok) {
    throw new Error(`X API posts fetch failed: ${res.status} ${await res.text()}`);
  }
  const { data = [] } = await res.json();
  return data.map((post) => ({
    id: post.id,
    text: post.text,
    createdAt: post.created_at,
    url: `https://x.com/i/web/status/${post.id}`,
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

**Files:**
- Create: `scripts/blog-pipeline/lib/filter-posts.js`
- Test: `scripts/blog-pipeline/lib/filter-posts.test.js`

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/filter-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { filterCandidates } = require('./filter-posts');

test('drops posts shorter than the minimum length', () => {
  const posts = [
    { id: '1', text: 'People are having fun with Toolcraft.' },
    { id: '2', text: 'x'.repeat(250) },
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
const MIN_LENGTH = 200;

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
git commit -m "feat: add heuristic length filter for blog pipeline"
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
  assert.deepEqual(posts, [{ title: 'Toolcraft', summary: 'A design tool' }]);
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

function readExistingPosts(repoRoot) {
  const postsDir = path.join(repoRoot, 'content', 'posts');
  return fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexPath = path.join(postsDir, entry.name, 'index.md');
      if (!fs.existsSync(indexPath)) return null;
      const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
      return { title: data.title, summary: data.summary };
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

### Task 7: `classify-posts` module

**Files:**
- Create: `scripts/blog-pipeline/lib/classify-posts.js`
- Test: `scripts/blog-pipeline/lib/classify-posts.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/classify-posts.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyPosts, buildClassifyPrompt } = require('./classify-posts');

test('buildClassifyPrompt lists existing posts and candidate ids', () => {
  const prompt = buildClassifyPrompt(
    [{ id: '1', text: 'design update' }],
    [{ title: 'Toolcraft', summary: 'A design tool' }]
  );
  assert.ok(prompt.includes('Toolcraft: A design tool'));
  assert.ok(prompt.includes('"id":"1"') || prompt.includes('"id": "1"'));
});

test('classifyPosts returns only posts the model marks qualifying', async () => {
  const fakeClient = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: JSON.stringify({ qualifying_post_ids: ['2'] }) } }],
        }),
      },
    },
  };
  const candidates = [
    { id: '1', text: 'skip me' },
    { id: '2', text: 'keep me' },
  ];
  const result = await classifyPosts({ candidates, existingPosts: [], openaiClient: fakeClient });
  assert.deepEqual(result.map((p) => p.id), ['2']);
});

test('classifyPosts returns empty array without calling the model when there are no candidates', async () => {
  let called = false;
  const fakeClient = { chat: { completions: { create: async () => { called = true; } } } };
  const result = await classifyPosts({ candidates: [], existingPosts: [], openaiClient: fakeClient });
  assert.deepEqual(result, []);
  assert.equal(called, false);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/classify-posts.test.js`
Expected: FAIL with "Cannot find module './classify-posts'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/classify-posts.js
function buildClassifyPrompt(candidates, existingPosts) {
  return [
    'You are screening X posts for a company blog "Updates" category.',
    'Keep only posts that describe genuine design-process notes, product announcements, or release videos.',
    "Drop posts that are just commentary on someone else's work, one-line reactions, or posts already covered by an existing blog post.",
    '',
    'Existing blog posts (do not re-cover these topics):',
    existingPosts.map((p) => `- ${p.title}: ${p.summary}`).join('\n'),
    '',
    'Candidate posts (JSON):',
    JSON.stringify(candidates.map((p) => ({ id: p.id, text: p.text }))),
    '',
    'Respond with JSON: { "qualifying_post_ids": ["..."] }',
  ].join('\n');
}

async function classifyPosts({ candidates, existingPosts, openaiClient }) {
  if (candidates.length === 0) return [];

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: buildClassifyPrompt(candidates, existingPosts) }],
    response_format: { type: 'json_object' },
  });

  const { qualifying_post_ids: qualifyingIds } = JSON.parse(completion.choices[0].message.content);
  return candidates.filter((post) => qualifyingIds.includes(post.id));
}

module.exports = { classifyPosts, buildClassifyPrompt };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/classify-posts.test.js`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/classify-posts.js scripts/blog-pipeline/lib/classify-posts.test.js
git commit -m "feat: add LLM classify+dedup step for blog pipeline"
```

---

### Task 8: `draft-post` module

**Files:**
- Create: `scripts/blog-pipeline/lib/draft-post.js`
- Test: `scripts/blog-pipeline/lib/draft-post.test.js`

**Step 1: Write the failing tests**

```js
// scripts/blog-pipeline/lib/draft-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { draftPost, buildDraftPrompt } = require('./draft-post');

test('buildDraftPrompt tells the model to preserve I/we framing', () => {
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('keep it first-person'));
  assert.ok(prompt.includes('I built a tool'));
});

test('draftPost parses the model JSON response into a draft object', async () => {
  const fakeDraft = { title: 'T', summary: 'S', slug: 'slug', body: 'Body' };
  const fakeClient = {
    chat: {
      completions: {
        create: async () => ({ choices: [{ message: { content: JSON.stringify(fakeDraft) } }] }),
      },
    },
  };
  const result = await draftPost({
    qualifyingPosts: [{ text: 'I built X', url: 'https://x.com/1' }],
    openaiClient: fakeClient,
  });
  assert.deepEqual(result, fakeDraft);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/draft-post.test.js`
Expected: FAIL with "Cannot find module './draft-post'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/draft-post.js
function buildDraftPrompt(posts) {
  return [
    'Write a company blog post for Pixel Point\'s "Updates" category, based on the following X posts from Alex Barashkov (CEO).',
    'Preserve his framing: if a post says "I built X," keep it first-person; if it credits the team ("our design process"), keep that framing. Do not force everything into "we."',
    'Combine multiple posts into one cohesive monthly update if there is more than one.',
    '',
    'Source posts (JSON):',
    JSON.stringify(posts.map((p) => ({ text: p.text, url: p.url }))),
    '',
    'Respond with JSON: { "title": "...", "summary": "...", "slug": "kebab-case-slug", "body": "markdown body" }',
  ].join('\n');
}

async function draftPost({ qualifyingPosts, openaiClient }) {
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: buildDraftPrompt(qualifyingPosts) }],
    response_format: { type: 'json_object' },
  });

  const draft = JSON.parse(completion.choices[0].message.content);
  return { title: draft.title, summary: draft.summary, slug: draft.slug, body: draft.body };
}

module.exports = { draftPost, buildDraftPrompt };
```

**Step 4: Run tests to verify they pass**

Run: `node --test scripts/blog-pipeline/lib/draft-post.test.js`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add scripts/blog-pipeline/lib/draft-post.js scripts/blog-pipeline/lib/draft-post.test.js
git commit -m "feat: add LLM drafting step for blog pipeline"
```

---

### Task 9: `publish-post` module

**Files:**
- Create: `scripts/blog-pipeline/lib/publish-post.js`
- Test: `scripts/blog-pipeline/lib/publish-post.test.js`

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/publish-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { publishPost } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = publishPost({
    draft: { title: "Alex's Update", summary: 'Summary text', slug: 'alex-update', body: 'Body text' },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes("title: 'Alex''s Update'") || written.includes("title: 'Alex\\'s Update'"));
  assert.ok(written.includes('author: Alex Barashkov'));
  assert.ok(written.includes('category: Updates'));
  assert.ok(written.includes('Body text'));
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
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

function publishPost({
  draft,
  publishDate,
  repoRoot,
  coverImageSourcePath,
  author = 'Alex Barashkov',
  category = 'Updates',
}) {
  const folderName = `${publishDate}-${draft.slug}`;
  const postDir = path.join(repoRoot, 'content', 'posts', folderName);
  fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = draft.title.replace(/'/g, "''");
  const frontmatter = [
    '---',
    `title: '${escapedTitle}'`,
    `summary: ${draft.summary}`,
    `author: ${author}`,
    'cover: cover.png',
    `category: ${category}`,
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(postDir, 'index.md'), `${frontmatter}\n${draft.body}\n`, 'utf8');
  fs.copyFileSync(coverImageSourcePath, path.join(postDir, 'cover.png'));

  return { postDir, folderName };
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

### Task 10: `notify-slack` module

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

### Task 11: `git-pr` module (manually verified, not unit tested)

This module shells out to `git`/`gh` against the real repo checkout — there's
no meaningful way to unit test it without either mocking `child_process`
(low-value, tests the mock) or standing up a throwaway git remote. It's
verified end-to-end in Task 13 instead.

**Files:**
- Create: `scripts/blog-pipeline/lib/git-pr.js`

**Step 1: Write the implementation directly**

```js
// scripts/blog-pipeline/lib/git-pr.js
const { execFileSync } = require('node:child_process');

function run(cmd, args, options) {
  return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8', ...options });
}

function openDraftPr({ repoRoot, branchName, postDir, prTitle, prBody }) {
  run('git', ['checkout', '-b', branchName], { cwd: repoRoot });
  run('git', ['add', postDir], { cwd: repoRoot });
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
```

**Step 2: Commit**

```bash
git add scripts/blog-pipeline/lib/git-pr.js
git commit -m "feat: add git/PR module for blog pipeline"
```

---

### Task 12: Orchestrator + GitHub Actions workflow

**Files:**
- Create: `scripts/blog-pipeline/run.js`
- Create: `.github/workflows/monthly-blog-draft.yml`

**Step 1: Write the orchestrator**

```js
// scripts/blog-pipeline/run.js
#!/usr/bin/env node
const path = require('node:path');
const OpenAI = require('openai');
const { getUserId, fetchRecentPosts } = require('./lib/fetch-posts');
const { filterCandidates } = require('./lib/filter-posts');
const { classifyPosts } = require('./lib/classify-posts');
const { draftPost } = require('./lib/draft-post');
const { readExistingPosts } = require('./lib/read-existing-posts');
const { readAuthorHandle } = require('./lib/read-author-handle');
const { publishPost } = require('./lib/publish-post');
const { openDraftPr } = require('./lib/git-pr');
const { notifySlack } = require('./lib/notify-slack');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const COVER_IMAGE_PATH = path.join(REPO_ROOT, 'static', 'blog-updates-cover.png');
const AUTHOR_NAME = 'Alex Barashkov';
const LOOKBACK_DAYS = 35;

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { X_API_BEARER_TOKEN, OPENAI_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({ userId, bearerToken: X_API_BEARER_TOKEN, sinceISODate });

  const candidates = filterCandidates(posts);
  const existingPosts = readExistingPosts(REPO_ROOT);
  const qualifying = await classifyPosts({ candidates, existingPosts, openaiClient });

  if (qualifying.length === 0) {
    console.log('No qualifying posts this month — skipping.');
    if (!dryRun) {
      await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: 'No qualifying posts this month — skipping.' });
    }
    return;
  }

  const draft = await draftPost({ qualifyingPosts: qualifying, openaiClient });

  if (dryRun) {
    console.log('--- DRY RUN: drafted post (nothing written or published) ---');
    console.log(JSON.stringify(draft, null, 2));
    return;
  }

  const publishDate = new Date().toISOString().slice(0, 10);
  const { postDir } = publishPost({
    draft,
    publishDate,
    repoRoot: REPO_ROOT,
    coverImageSourcePath: COVER_IMAGE_PATH,
  });

  const branchName = `blog-draft/${publishDate.slice(0, 7)}`;
  const { prUrl } = openDraftPr({
    repoRoot: REPO_ROOT,
    branchName,
    postDir,
    prTitle: `Updates: ${draft.title}`,
    prBody: 'Auto-generated monthly Updates draft. Review the Vercel preview before merging.',
  });

  await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: `New monthly blog draft ready for review: ${prUrl}` });
}

main().catch(async (err) => {
  console.error(err);
  try {
    await notifySlack({
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      text: `Monthly blog draft pipeline failed: ${err.message}`,
    });
  } catch (notifyErr) {
    console.error('Also failed to notify Slack:', notifyErr);
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
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
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

### Task 13: End-to-end manual verification

1. Add the three repo secrets (`X_API_BEARER_TOKEN`, `OPENAI_API_KEY`,
   `SLACK_WEBHOOK_URL`) in GitHub repo Settings → Secrets and variables →
   Actions.
2. Run the full test suite: `npm test` — expect all tests from Tasks 1–10
   passing.
3. Locally, with real credentials exported as env vars, run:
   `node scripts/blog-pipeline/run.js --dry-run`
   Expected: prints either "No qualifying posts this month — skipping." or
   a JSON draft object — nothing written to disk, no branch/PR/Slack
   message created. Confirms the fetch/filter/classify/draft chain works
   against the real APIs before ever touching the repo.
4. Trigger the real workflow once via GitHub Actions → "Monthly Blog Draft"
   → "Run workflow" (`workflow_dispatch`).
   Expected: either the "nothing found" Slack message, or a Slack message
   with a PR link; opening the PR should show a `content/posts/...`
   folder, and within ~30–60 seconds a Vercel bot comment with the preview
   URL.
5. Open the preview link, confirm the post renders under `/blog/updates/`
   with the fixed cover image, then close/decline the PR (or merge it) —
   your call, this was just a pipeline test.
