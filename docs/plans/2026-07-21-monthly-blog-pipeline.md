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
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  getUserId,
  fetchRecentPosts,
  expandLinks,
  fullText,
  fetchSelfReplies,
} = require('./fetch-posts');

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
    selfReplyPages: 0,
  });
  assert.deepEqual(posts, [
    {
      id: '999',
      text: 'hello world',
      createdAt: '2026-07-01T00:00:00Z',
      url: 'https://x.com/i/web/status/999',
      media: [],
      quoted: null,
      thread: [],
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
          {
            id: '1',
            text: 'with a photo',
            created_at: 'x',
            attachments: { media_keys: ['k1', 'k2'] },
          },
          { id: '2', text: 'no media', created_at: 'x' },
        ],
        includes: {
          media: [
            {
              media_key: 'k1',
              type: 'photo',
              url: 'https://pbs.twimg.com/media/a.jpg',
              alt_text: 'a chart',
            },
            // Video carries no `url` — only a poster in preview_image_url.
            {
              media_key: 'k2',
              type: 'video',
              preview_image_url: 'https://pbs.twimg.com/poster.jpg',
              variants: [
                { content_type: 'video/mp4', bit_rate: 1, url: 'https://video.twimg.com/v.mp4' },
              ],
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
    selfReplyPages: 0,
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
  assert.equal(posts[1].quoted, null);
});

test('expandLinks replaces t.co shortlinks with where they actually go', () => {
  // Handed an opaque t.co link the model cannot tell what it points at, so it
  // drops it — which is why drafts carried no outbound links at all.
  const text = expandLinks({
    text: 'Meet the new Novu and its new homepage. https://t.co/wdVPM9aH66',
    entities: {
      urls: [{ url: 'https://t.co/wdVPM9aH66', expanded_url: 'https://novu.co/' }],
    },
  });
  assert.equal(text, 'Meet the new Novu and its new homepage. https://novu.co/');
});

test('expandLinks leaves text alone when there are no entities', () => {
  assert.equal(expandLinks({ text: 'no links here' }), 'no links here');
});

test('fetchRecentPosts carries quoted text and borrows the quoted media', async () => {
  const fakeFetch = async (url) => {
    assert.ok(url.includes('referenced_tweets.id'));
    assert.ok(url.includes('entities'));
    return {
      ok: true,
      json: async () => ({
        data: [
          {
            id: '1',
            text: 'Meet the new Novu. https://t.co/abc',
            created_at: 'x',
            entities: {
              urls: [{ url: 'https://t.co/abc', expanded_url: 'https://x.com/dima/status/9' }],
            },
            referenced_tweets: [{ type: 'quoted', id: '9' }],
          },
        ],
        includes: {
          tweets: [
            { id: '9', text: 'The new homepage is live', attachments: { media_keys: ['k1'] } },
          ],
          media: [{ media_key: 'k1', type: 'photo', url: 'https://pbs.twimg.com/shot.jpg' }],
        },
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: '1',
    bearerToken: 't',
    sinceISODate: '2026-06-01T00:00:00Z',
    fetchImpl: fakeFetch,
    selfReplyPages: 0,
  });
  // The announcement post has no media of its own; the screenshot is in the
  // post it quotes, which is exactly the Novu case that shipped without one.
  assert.equal(posts[0].media.length, 1);
  assert.equal(posts[0].media[0].url, 'https://pbs.twimg.com/shot.jpg');
  assert.equal(posts[0].quoted.text, 'The new homepage is live');
  assert.ok(posts[0].text.includes('https://x.com/dima/status/9'));
  assert.ok(!posts[0].text.includes('t.co'));
});

test('a post with its own media does not borrow from the quoted post', async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({
      data: [
        {
          id: '1',
          text: 'ours',
          created_at: 'x',
          attachments: { media_keys: ['own'] },
          referenced_tweets: [{ type: 'quoted', id: '9' }],
        },
      ],
      includes: {
        tweets: [{ id: '9', text: 'theirs', attachments: { media_keys: ['other'] } }],
        media: [
          { media_key: 'own', type: 'photo', url: 'https://pbs.twimg.com/ours.jpg' },
          { media_key: 'other', type: 'photo', url: 'https://pbs.twimg.com/theirs.jpg' },
        ],
      },
    }),
  });
  const posts = await fetchRecentPosts({
    userId: '1',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 0,
  });
  assert.equal(posts[0].media.length, 1);
  assert.equal(posts[0].media[0].url, 'https://pbs.twimg.com/ours.jpg');
});

test('fullText prefers note_tweet — `text` is truncated at ~280 chars', () => {
  // 24 of 51 real posts were truncated this way. The animation-skill post lost
  // its `npx skills add ...` install line off the end of `text`.
  const post = {
    text: 'Don’t miss our text animation skill. Every animation includes timing, curves, and specifications crafted by designers - not',
    entities: { urls: [] },
    note_tweet: {
      text: 'Don’t miss our text animation skill. Every animation includes timing, curves, and specifications crafted by designers - not AI.\n\nnpx skills add pixel-point/animate-text --skill animate-text',
      entities: { urls: [] },
    },
  };
  assert.ok(fullText(post).text.includes('npx skills add pixel-point/animate-text'));
});

test('fullText falls back to text when there is no note_tweet', () => {
  assert.equal(fullText({ text: 'short post' }).text, 'short post');
});

test('expandLinks uses the note_tweet entities, not the short-form ones', () => {
  // The two forms carry different entity lists; reading the wrong one leaves
  // a t.co link unexpanded in the text actually handed to the model.
  const text = expandLinks({
    text: 'short https://t.co/AAA',
    entities: { urls: [{ url: 'https://t.co/AAA', expanded_url: 'https://wrong.example' }] },
    note_tweet: {
      text: 'the full post links https://t.co/BBB',
      entities: { urls: [{ url: 'https://t.co/BBB', expanded_url: 'https://right.example' }] },
    },
  });
  assert.equal(text, 'the full post links https://right.example');
});

test('fetchRecentPosts requests note_tweet', async () => {
  let requested;
  const fakeFetch = async (url) => {
    requested = url;
    return { ok: true, json: async () => ({ data: [], includes: {} }) };
  };
  await fetchRecentPosts({
    userId: '1',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 0,
  });
  assert.ok(requested.includes('note_tweet'), 'without it, half the posts arrive truncated');
});

test('fetchSelfReplies keeps replies to self and discards replies to others', async () => {
  // Roughly 4 in 5 items on the reply-inclusive timeline are replies to other
  // people; only the author's own follow-ups belong to the announcement.
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({
      data: [
        {
          id: '2',
          conversation_id: 'c1',
          in_reply_to_user_id: 'me',
          text: 'https://t.co/A',
          entities: {
            urls: [{ url: 'https://t.co/A', expanded_url: 'https://pixelpoint.io/aval/' }],
          },
        },
        {
          id: '3',
          conversation_id: 'c1',
          in_reply_to_user_id: 'me',
          text: 'https://t.co/B',
          entities: {
            urls: [{ url: 'https://t.co/B', expanded_url: 'https://github.com/pixel-point/aval' }],
          },
        },
        { id: '4', conversation_id: 'c9', in_reply_to_user_id: 'someone-else', text: 'thanks!' },
      ],
      meta: {},
    }),
  });
  const threads = await fetchSelfReplies({
    userId: 'me',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    maxPages: 1,
  });
  assert.equal(threads.get('c1').length, 2);
  assert.equal(threads.has('c9'), false);
  assert.ok(threads.get('c1')[0].text.includes('pixelpoint.io/aval'));
});

test('fetchSelfReplies gives up quietly rather than failing the run', async () => {
  const threads = await fetchSelfReplies({
    userId: 'me',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: async () => ({ ok: false, status: 429 }),
    maxPages: 3,
  });
  // The originals are already in hand; losing follow-up context is not worth
  // discarding the month's run over.
  assert.equal(threads.size, 0);
});

test('fetchRecentPosts attaches self-replies to their parent post', async () => {
  const fakeFetch = async (url) => {
    if (url.includes('exclude=replies')) {
      return {
        ok: true,
        json: async () => ({
          data: [{ id: '1', text: 'Introducing Aval', created_at: 'x', conversation_id: 'c1' }],
          includes: {},
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        data: [
          {
            id: '2',
            conversation_id: 'c1',
            in_reply_to_user_id: 'me',
            text: 'https://github.com/pixel-point/aval',
          },
        ],
        meta: {},
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: 'me',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 1,
  });
  assert.equal(posts[0].thread.length, 1);
  assert.ok(posts[0].thread[0].text.includes('github.com/pixel-point/aval'));
});

test('a post is never its own follow-up, and follow-ups are capped oldest-first', async () => {
  const replies = (ids) =>
    ids.map((id) => ({
      id,
      conversation_id: 'c1',
      in_reply_to_user_id: 'me',
      text: `reply ${id}`,
    }));
  const fakeFetch = async (url) =>
    url.includes('exclude=replies')
      ? {
          ok: true,
          json: async () => ({
            data: [{ id: '100', text: 'announcement', conversation_id: 'c1' }],
            includes: {},
          }),
        }
      : // X returns newest first and counts the parent in the same conversation.
        {
          ok: true,
          json: async () => ({
            data: replies(['107', '106', '105', '104', '103', '102', '101', '100']),
            meta: {},
          }),
        };

  const posts = await fetchRecentPosts({
    userId: 'me',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 1,
  });
  const ids = posts[0].thread.map((r) => r.url.split('/').pop());
  assert.deepEqual(
    ids,
    ['101', '102', '103', '104', '105'],
    'oldest five, excluding the post itself'
  );
  assert.ok(!ids.includes('100'));
});

test('self-replies come from full-archive search when it is available', async () => {
  let searched = false;
  let pagedTimeline = false;
  const fakeFetch = async (url) => {
    if (url.includes('/tweets/search/all')) {
      searched = true;
      // from:X to:X is exactly "replies X made to X", filtered server-side.
      assert.ok(
        url.includes('from%3Aalex_barashkov+to%3Aalex_barashkov') ||
          decodeURIComponent(url).includes('from:alex_barashkov to:alex_barashkov')
      );
      return {
        ok: true,
        json: async () => ({
          data: [{ id: '2', conversation_id: 'c1', text: 'https://github.com/pixel-point/aval' }],
        }),
      };
    }
    if (url.includes('exclude=retweets')) pagedTimeline = true;
    return {
      ok: true,
      json: async () => ({
        data: [{ id: '1', text: 'Introducing Aval', created_at: 'x', conversation_id: 'c1' }],
        includes: {},
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: 'me',
    username: 'alex_barashkov',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
  });
  assert.ok(searched);
  assert.equal(pagedTimeline, false, 'search makes the 300-read timeline scan unnecessary');
  assert.equal(posts[0].thread.length, 1);
});

test('losing full-archive access falls back to paging rather than losing follow-ups', async () => {
  let pagedTimeline = false;
  const fakeFetch = async (url) => {
    // 403 is what a downgraded access tier returns.
    if (url.includes('/tweets/search/all')) return { ok: false, status: 403 };
    if (url.includes('exclude=retweets')) {
      pagedTimeline = true;
      return {
        ok: true,
        json: async () => ({
          data: [
            {
              id: '2',
              conversation_id: 'c1',
              in_reply_to_user_id: 'me',
              text: 'https://pixelpoint.io/aval/',
            },
          ],
          meta: {},
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        data: [{ id: '1', text: 'Introducing Aval', created_at: 'x', conversation_id: 'c1' }],
        includes: {},
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: 'me',
    username: 'alex_barashkov',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 1,
  });
  assert.ok(pagedTimeline, 'must fall back, not give up');
  assert.equal(posts[0].thread.length, 1);
});

test('the paging fallback still discards replies to other people', async () => {
  const fakeFetch = async (url) => {
    if (url.includes('/tweets/search/all')) return { ok: false, status: 403 };
    if (url.includes('exclude=retweets')) {
      return {
        ok: true,
        json: async () => ({
          data: [
            { id: '2', conversation_id: 'c1', in_reply_to_user_id: 'me', text: 'mine' },
            {
              id: '3',
              conversation_id: 'c1',
              in_reply_to_user_id: 'someone-else',
              text: 'thanks!',
            },
          ],
          meta: {},
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        data: [{ id: '1', text: 'post', created_at: 'x', conversation_id: 'c1' }],
        includes: {},
      }),
    };
  };
  const posts = await fetchRecentPosts({
    userId: 'me',
    username: 'a',
    bearerToken: 't',
    sinceISODate: 'x',
    fetchImpl: fakeFetch,
    selfReplyPages: 1,
  });
  assert.equal(posts[0].thread.length, 1);
  assert.ok(posts[0].thread[0].text.includes('mine'));
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

// `text` is capped at ~280 characters. Anything longer is truncated there and
// the full version lives in note_tweet — 24 of 51 recent posts. Reading only
// `text` silently fed the model half a post: the one announcing the animation
// skill lost its `npx skills add ...` install command off the end.
function fullText(post) {
  const note = post.note_tweet;
  return note && note.text
    ? { text: note.text, entities: note.entities }
    : { text: post.text || '', entities: post.entities };
}

// X rewrites every link in a post as an opaque t.co shortlink. Handed one of
// those, the model can't tell what it points at and drops it — which is why
// drafts carried no outbound links at all. entities.urls maps each back to
// where it actually goes. Note the entities differ between the short and long
// forms, so they have to be read from whichever text is used.
function expandLinks(post) {
  const { text, entities } = fullText(post);
  const urls = (entities && entities.urls) || [];
  return urls.reduce(
    (acc, link) => (link.expanded_url ? acc.split(link.url).join(link.expanded_url) : acc),
    text
  );
}

function mapMedia(keys, mediaByKey) {
  return (keys || [])
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
    }));
}

// Announcements routinely put the links in a self-reply rather than the post
// itself — the Aval launch posted its landing page and its repo that way — and
// the timeline endpoint cannot filter to them: `exclude` only accepts
// `replies` and `retweets`. Paging the reply-inclusive timeline works but
// reads ~300 posts to find a handful, because roughly four in five items are
// replies to other people.
//
// Full-archive search filters server-side with `from:X to:X`, which is exactly
// "replies X made to X": 7 results instead of 300, and it covers the whole
// lookback window by construction rather than however far 3 pages happen to
// reach. It sits on a higher access tier though, so a loss of access falls
// back to paging rather than failing the run.
const SELF_REPLY_PAGES = 3;

// The links land in the first few replies; anything after that is conversation
// with other people rather than part of the announcement.
const MAX_FOLLOW_UPS = 5;

function indexByConversation(items, userId) {
  const byConversation = new Map();
  for (const item of items) {
    // The search query already constrains this, but the timeline fallback
    // does not — replies to other people must not become follow-ups.
    if (userId && item.in_reply_to_user_id !== userId) continue;
    const list = byConversation.get(item.conversation_id) || [];
    list.push({
      id: item.id,
      text: expandLinks(item),
      url: `https://x.com/i/web/status/${item.id}`,
    });
    byConversation.set(item.conversation_id, list);
  }
  return byConversation;
}

async function searchSelfReplies({ username, bearerToken, sinceISODate, fetchImpl }) {
  const url = new URL('https://api.twitter.com/2/tweets/search/all');
  url.searchParams.set('query', `from:${username} to:${username}`);
  url.searchParams.set('start_time', sinceISODate);
  url.searchParams.set(
    'tweet.fields',
    'text,entities,note_tweet,conversation_id,in_reply_to_user_id'
  );
  url.searchParams.set('max_results', '100');

  const res = await fetchImpl(url.toString(), {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  // 403 here means the key lost full-archive access; the caller falls back.
  if (!res.ok) return null;

  const body = await res.json();
  return indexByConversation(body.data || [], null);
}

async function pageSelfReplies({ userId, bearerToken, sinceISODate, fetchImpl, maxPages }) {
  const collected = [];
  let token;

  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL(`https://api.twitter.com/2/users/${userId}/tweets`);
    url.searchParams.set('exclude', 'retweets');
    url.searchParams.set('start_time', sinceISODate);
    url.searchParams.set(
      'tweet.fields',
      'text,entities,note_tweet,conversation_id,in_reply_to_user_id'
    );
    url.searchParams.set('max_results', '100');
    if (token) url.searchParams.set('pagination_token', token);

    const res = await fetchImpl(url.toString(), {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    // A failure here costs context, not the run — the originals are already in
    // hand and are what the article is actually built from.
    if (!res.ok) break;

    const body = await res.json();
    collected.push(...(body.data || []));
    token = body.meta && body.meta.next_token;
    if (!token) break;
  }

  return indexByConversation(collected, userId);
}

async function fetchSelfReplies({
  userId,
  username,
  bearerToken,
  sinceISODate,
  fetchImpl,
  maxPages,
}) {
  if (username) {
    const found = await searchSelfReplies({ username, bearerToken, sinceISODate, fetchImpl });
    if (found) return found;
  }
  return pageSelfReplies({ userId, bearerToken, sinceISODate, fetchImpl, maxPages });
}

async function fetchRecentPosts({
  userId,
  username,
  bearerToken,
  sinceISODate,
  fetchImpl = fetch,
  selfReplyPages = SELF_REPLY_PAGES,
}) {
  const url = new URL(`https://api.twitter.com/2/users/${userId}/tweets`);
  url.searchParams.set('exclude', 'replies,retweets');
  url.searchParams.set('start_time', sinceISODate);
  // `entities` carries the real destination behind each t.co link.
  // `note_tweet` carries the untruncated body of posts longer than ~280 chars.
  url.searchParams.set(
    'tweet.fields',
    // `attachments` is returned on included (quoted) tweets even when not
    // requested, but that is undocumented behaviour — asking for it costs
    // nothing and is what makes quoted-post media reliable.
    'created_at,text,entities,referenced_tweets,note_tweet,conversation_id,attachments'
  );
  url.searchParams.set('max_results', '100');
  // Media arrives in a separate `includes.media` list keyed by media_key, not
  // inline on the post — the expansion is what populates it at all.
  // `referenced_tweets.id` pulls in quoted posts: announcing work by quoting
  // someone else is common, and without this the screenshot and the link being
  // pointed at are both invisible to the pipeline.
  url.searchParams.set('expansions', 'attachments.media_keys,referenced_tweets.id');
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
  const threadsByConversation = await fetchSelfReplies({
    userId,
    username,
    bearerToken,
    sinceISODate,
    fetchImpl,
    maxPages: selfReplyPages,
  });
  const mediaByKey = new Map((includes.media || []).map((item) => [item.media_key, item]));
  const tweetsById = new Map((includes.tweets || []).map((item) => [item.id, item]));

  return data.map((post) => {
    const quotedRef = (post.referenced_tweets || []).find((ref) => ref.type === 'quoted');
    const quoted = quotedRef && tweetsById.get(quotedRef.id);
    const ownMedia = mapMedia((post.attachments || {}).media_keys, mediaByKey);
    // A quote post usually carries no media of its own — the screenshot lives
    // in the post being quoted, so treat that as this post's media when there
    // is none. The quoted text stays separate: it is someone else's writing
    // and is context for the draft, not material to rewrite.
    const quotedMedia = quoted ? mapMedia((quoted.attachments || {}).media_keys, mediaByKey) : [];

    return {
      id: post.id,
      text: expandLinks(post),
      createdAt: post.created_at,
      url: `https://x.com/i/web/status/${post.id}`,
      media: ownMedia.length > 0 ? ownMedia : quotedMedia,
      quoted: quoted
        ? { text: expandLinks(quoted), url: `https://x.com/i/web/status/${quoted.id}` }
        : null,
      // Replies the author made to his own post — where the links usually are.
      // Oldest first and capped: X returns newest first, and a conversation
      // drifts into replying to other people after the first few.
      thread: (threadsByConversation.get(post.conversation_id) || [])
        // X counts a self-thread continuation as an original too, so a post can
        // otherwise turn up as its own follow-up.
        .filter((reply) => reply.id !== post.id)
        .sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1))
        .slice(0, MAX_FOLLOW_UPS)
        .map(({ text, url }) => ({ text, url })),
    };
  });
}

module.exports = {
  getUserId,
  fetchRecentPosts,
  fetchSelfReplies,
  expandLinks,
  fullText,
  SELF_REPLY_PAGES,
  MAX_FOLLOW_UPS,
};
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

This is deliberately a _cheap noise filter_, not a substance judgment — a dry
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
const assert = require('node:assert/strict');
const test = require('node:test');

const { filterCandidates } = require('./filter-posts');

test('drops one-liners with no real content', () => {
  const posts = [
    { id: '1', text: 'People are having fun with Toolcraft.' },
    {
      id: '2',
      text: 'Behind the scenes of the launch video production for Railway. From initial request to final release in less than two weeks.',
    },
  ];
  const result = filterCandidates(posts);
  assert.deepEqual(
    result.map((p) => p.id),
    ['2']
  );
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
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

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
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

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
const assert = require('node:assert/strict');
const test = require('node:test');

const { requestJson, extractText } = require('./anthropic-json');

const SCHEMA = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] };

function clientReturning(message) {
  return { messages: { stream: () => ({ finalMessage: async () => message }) } };
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
// max_tokens caps thinking *and* response text together, and thinking is on by
// default on this model. A blog-post body at default effort can approach the
// old 16k ceiling on a busy month, which failed the entire run. Streaming is
// what makes a ceiling this high safe: a non-streaming request at 64k risks an
// HTTP timeout.
const MAX_TOKENS = 64000;

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
  const message = await anthropicClient.messages
    .stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { format: { type: 'json_schema', schema } },
      messages: [{ role: 'user', content: prompt }],
    })
    .finalMessage();

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
const assert = require('node:assert/strict');
const test = require('node:test');

const { classifyAndGroupPosts, buildClassifyPrompt } = require('./classify-posts');

function fakeClientReturning(payload) {
  return {
    messages: {
      stream: () => ({
        finalMessage: async () => ({
          stop_reason: 'end_turn',
          content: [{ type: 'text', text: JSON.stringify(payload) }],
        }),
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
  const result = await classifyAndGroupPosts({
    candidates,
    existingPosts: [],
    anthropicClient: fakeClient,
  });
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
      group(['3'], {
        already_covered: true,
        existing_post_title: 'Build personal design tools with AI using Toolcraft',
      }),
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
      stream: (params) => {
        sentParams = params;
        return {
          finalMessage: async () => ({
            stop_reason: 'end_turn',
            content: [{ type: 'text', text: '{"groups":[]}' }],
          }),
        };
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
      stream: () => {
        called = true;
        return { finalMessage: async () => ({ stop_reason: 'end_turn', content: [] }) };
      },
    },
  };
  const result = await classifyAndGroupPosts({
    candidates: [],
    existingPosts: [],
    anthropicClient: fakeClient,
  });
  assert.deepEqual(result, { groups: [], skipped: [] });
  assert.equal(called, false);
});

test('classifyAndGroupPosts resolves related existing posts so the draft can link them', async () => {
  const existingPosts = [
    {
      title: 'Build personal design tools with AI using Toolcraft',
      summary: 'x',
      path: '/blog/how-to-craft/',
    },
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
        required: [
          'post_ids',
          'already_covered',
          'existing_post_title',
          'related_existing_post_titles',
        ],
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
    "Personal side projects (open-source tools, solo builds; examples of personal side project work) count and should be kept if they clear that bar — they still reflect the team's expertise even when not officially branded company work.",
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
const assert = require('node:assert/strict');
const test = require('node:test');

const { draftPost, buildDraftPrompt } = require('./draft-post');

test('buildDraftPrompt tells the model to preserve I/we framing and write editorially', () => {
  const prompt = buildDraftPrompt([{ text: 'I built a tool', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('keep it first-person'));
  assert.ok(prompt.includes('I built a tool'));
  assert.ok(prompt.includes("Don't just reformat"));
});

test("buildDraftPrompt tells the model it is writing under the author's own byline", () => {
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
      stream: () => ({
        finalMessage: async () => ({
          stop_reason: 'end_turn',
          content: [{ type: 'text', text: JSON.stringify(fakeDraft) }],
        }),
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
      stream: () => ({
        finalMessage: async () => ({
          stop_reason: 'end_turn',
          content: [
            { type: 'thinking', thinking: 'Let me consider the framing...' },
            { type: 'text', text: JSON.stringify(fakeDraft) },
          ],
        }),
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

test('buildDraftPrompt asks for commands to survive verbatim', () => {
  const prompt = buildDraftPrompt([{ text: 'npx skills add x', url: 'https://x.com/1' }]);
  assert.ok(prompt.includes('verbatim, in a fenced code block'));
});

const VID = (n, sourceUrl) => ({
  src: `/x-video/amplify_video/${n}/v.mp4`,
  width: '1440',
  height: '1080',
  posterFilename: `video-cover-${n}.jpg`,
  isGif: false,
  sourceUrl,
});

test('videos from one post are presented as a set to keep together', () => {
  // Four clips on a single post came out scattered across four sections with
  // headings between them, reading as four unrelated demos.
  const prompt = buildDraftPrompt(
    [{ text: 'New version is out', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1'), VID(2, 'https://x.com/1'), VID(3, 'https://x.com/1')]
  );
  assert.ok(prompt.includes('Set 1 — 3 video(s) published together'));
  assert.ok(prompt.includes('Keep such a set together'));
  assert.ok(prompt.includes('one exhibit'));
});

test('videos from different posts are listed as separate sets', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1'), VID(2, 'https://x.com/2')]
  );
  assert.ok(prompt.includes('Set 1 — 1 video(s)'));
  assert.ok(prompt.includes('Set 2 — 1 video(s)'));
});

test('a single video is not dressed up as a set', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [],
    [VID(1, 'https://x.com/1')]
  );
  assert.ok(!prompt.includes('Set 1'));
  assert.ok(!prompt.includes('Keep such a set together'));
});

test('images carry the post that published them', () => {
  const prompt = buildDraftPrompt(
    [{ text: 'a', url: 'https://x.com/1' }],
    [{ filename: 'image-1.jpg', sourceUrl: 'https://x.com/1' }]
  );
  assert.ok(prompt.includes('sourcePost'));
  assert.ok(prompt.includes('belong together in the article'));
});

test('repo commands are offered as candidates the model may reject', () => {
  // A README's shell blocks include demo invocations and contributing steps.
  // Asserting one of them is the install command would publish a wrong one.
  const prompt = buildDraftPrompt(
    [{ text: 'Introducing Aval', url: 'https://x.com/1' }],
    [],
    [],
    [],
    [{ repo: 'pixel-point/aval', snippets: ['npx @pixel-point/aval-compiler compile', 'npm ci'] }]
  );
  assert.ok(prompt.includes('npx @pixel-point/aval-compiler compile'));
  assert.ok(prompt.includes('If one of them is genuinely how a reader installs'));
  assert.ok(prompt.includes('leave them all out'));
  assert.ok(prompt.includes('Do not adapt or guess at a command'));
});

test('no repo section when the posts link no repository', () => {
  const prompt = buildDraftPrompt([{ text: 'x', url: 'https://x.com/1' }]);
  assert.ok(!prompt.includes('Commands found in linked repositories'));
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

// Candidates, not conclusions: the model decides whether any of these is
// genuinely the install command for what the article is about. A README's
// shell blocks routinely include demo invocations and contributing steps.
function buildRepoUsageInstructions(repoUsage) {
  if (repoUsage.length === 0) return [];
  return [
    '',
    'The source posts link the repositories below, and these are shell commands taken from their READMEs. If one of them is genuinely how a reader installs or runs the thing this article is about, include it verbatim in a fenced code block where it helps. If none of them is — they may be demo invocations, build steps, or contributing instructions — leave them all out and just link the repository. Do not adapt or guess at a command.',
    '',
    'Commands found in linked repositories (JSON):',
    JSON.stringify(repoUsage),
  ];
}

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

function videoTag(video) {
  return `<Video src="${video.src}" width="${video.width}" height="${video.height}"${
    video.isGif ? ' autoPlay muted loop playsInline' : ' controls muted'
  } poster="./${video.posterFilename}"></Video>`;
}

// Grouped by the post that published them. Flattening the list lost the fact
// that four clips attached to a single post are one set the author posted at
// once — the article then scattered them across four sections with headings in
// between, which reads as four unrelated demos rather than one release.
function groupBySource(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.sourceUrl || '';
    groups.set(key, [...(groups.get(key) || []), item]);
  }
  return [...groups.values()];
}

function buildVideoInstructions(videos) {
  if (videos.length === 0) return [];
  const sets = groupBySource(videos);
  const multiple = sets.some((set) => set.length > 1);

  return [
    '',
    'These videos come from the source posts. Place each one at the point it illustrates using exactly the markup listed below, copied verbatim on its own line — it is a component, not markdown, and altering the attributes will break the page. Leave a video out if it does not earn its place.',
    ...(multiple
      ? [
          'Videos listed under one heading below were published together in a single post, with no caption of their own. Keep such a set together in the article and in the order given — they are one exhibit, not separate illustrations to spread across sections.',
        ]
      : []),
    '',
    'Videos available (use these lines exactly):',
    ...sets
      .flatMap((set, index) => [
        sets.length > 1 || set.length > 1
          ? `Set ${index + 1} — ${set.length} video(s) published together:`
          : '',
        ...set.map(videoTag),
      ])
      .filter(Boolean),
  ];
}

function buildImageInstructions(photos) {
  if (photos.length === 0) return [];
  return [
    '',
    'These images come from the source posts and are saved alongside the article. Place each one in the body at the point it illustrates, not collected at the end, using exactly this markdown: ![alt text](filename). Use the filenames exactly as listed — a filename you invent renders as a broken image. Leave an image out entirely if it does not earn its place.',
    'Write the alt text yourself. The site renders it as the visible caption under the image, so describe what the image actually shows instead of restating the sentence next to it.',
    '',
    'Images available (JSON) — images sharing a sourcePost were published together and belong together in the article:',
    JSON.stringify(
      photos.map((photo) => ({ filename: photo.filename, sourcePost: photo.sourceUrl }))
    ),
  ];
}

function buildDraftPrompt(
  posts,
  photos = [],
  videos = [],
  relatedExistingPosts = [],
  repoUsage = []
) {
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
    'Keep any exact command, package name, or code snippet from the source posts verbatim, in a fenced code block — an install line a reader can copy is the most useful thing an announcement post can carry, and paraphrasing it makes it wrong.',
    'A post\'s "followUps" are the author\'s own replies to it, and are usually where the landing page or repository link was posted. Treat them as part of the same announcement and use those links in the article.',
    'When a source post links to something — a launched page, a repo, a demo — link to it from the article at the point you mention it, using the real URL from the post. Do not describe a thing as launched or shipped without linking it if the link is available.',
    "Where a source post quotes another post, that quoted text is background so you know what is being pointed at. Write about our work, not about the other person's post, and do not quote them.",
    '',
    'Source posts (JSON):',
    JSON.stringify(
      posts.map((p) => ({
        text: p.text,
        url: p.url,
        ...(p.quoted ? { quotedForContext: p.quoted.text } : {}),
        // Follow-up replies by the same author, which is usually where the
        // landing page and repo links live.
        ...(p.thread && p.thread.length ? { followUps: p.thread.map((r) => r.text) } : {}),
      }))
    ),
    ...buildRelatedPostsInstructions(relatedExistingPosts),
    ...buildRepoUsageInstructions(repoUsage),
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
  repoUsage = [],
  anthropicClient,
}) {
  const draft = await requestJson({
    anthropicClient,
    prompt: buildDraftPrompt(qualifyingPosts, photos, videos, relatedExistingPosts, repoUsage),
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
text as the visible caption. Filenames are assigned _before_ drafting so the
model can be handed the exact names; letting it invent them would mean
reconciling made-up references against downloaded files afterwards.

A survey of 35 days of real posts found 42 media items — 19 photos, 23 videos
— and **none** carried author-supplied alt text, so the model writes all of
it. Video is excluded here pending a hosting decision (see the design doc's
deferred items).

```js
// scripts/blog-pipeline/lib/post-media.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  collectPhotos,
  downloadPhotos,
  stripUnknownImages,
  collectVideos,
  bestMp4,
  stripUnusableVideos,
  proxiedVideoSrc,
  imageTarget,
  dedupeVideosByPoster,
  extensionFor,
} = require('./post-media');

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
  const photos = collectPhotos([
    { media: [{ type: 'photo', url: 'https://pbs.twimg.com/media/abc' }] },
  ]);
  assert.equal(photos[0].filename, 'image-1.jpg');
});

test('downloadPhotos writes each image and reports what landed', async () => {
  const destDir = tmpDir();
  const fakeFetch = async () => ({
    ok: true,
    arrayBuffer: async () => new TextEncoder().encode('png-bytes').buffer,
  });
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

const VARIANTS = [
  { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/x.m3u8' },
  { content_type: 'video/mp4', bit_rate: 632000, url: 'https://video.twimg.com/low.mp4' },
  { content_type: 'video/mp4', bit_rate: 2176000, url: 'https://video.twimg.com/high.mp4' },
];

test('bestMp4 falls back to bit rate when the urls carry no dimensions', () => {
  assert.equal(bestMp4(VARIANTS).url, 'https://video.twimg.com/high.mp4');
  assert.equal(bestMp4([]), undefined);
});

// X encodes dimensions in the path: .../vid/avc1/1280x720/name.mp4
const ladder = (widths) =>
  widths.map((w, i) => ({
    content_type: 'video/mp4',
    bit_rate: (i + 1) * 1000000,
    url: `https://video.twimg.com/amplify_video/1/vid/avc1/${w}x${Math.round(w * 0.5625)}/v.mp4`,
  }));

test('bestMp4 takes the smallest variant that still covers the column at 2x', () => {
  // The post column is 696px, so 1392 is the target. 1280 is too small; 1920
  // covers it; 3840 is waste a reader cannot see.
  const chosen = bestMp4(ladder([480, 1280, 1920, 3840]));
  assert.match(chosen.url, /1920x/);
});

test('bestMp4 takes the largest available when every variant is below the target', () => {
  const chosen = bestMp4(ladder([320, 480, 960]));
  assert.match(chosen.url, /960x/);
});

test('bestMp4 ignores non-mp4 streaming variants entirely', () => {
  const chosen = bestMp4([
    { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/x.m3u8' },
    ...ladder([1920]),
  ]);
  assert.match(chosen.url, /1920x/);
  assert.ok(!chosen.url.endsWith('.m3u8'));
});

test('bestMp4 does not pick a 4K encode over one that covers the column', () => {
  // The regression this exists for: a real post shipped a 3840x2160 file into
  // a 696px column because it was the top of the ladder.
  const chosen = bestMp4(ladder([960, 1600, 3840]));
  assert.match(chosen.url, /1600x/);
});

test('collectVideos builds a poster filename and a proxied src', () => {
  const videos = collectVideos([
    {
      media: [
        {
          type: 'video',
          url: 'https://pbs.twimg.com/poster.jpg',
          variants: VARIANTS,
          width: 1920,
          height: 1080,
        },
      ],
    },
  ]);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].posterFilename, 'video-cover-1.jpg');
  assert.equal(videos[0].src, '/x-video/high.mp4');
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
    collectVideos([
      { media: [{ type: 'video', url: 'https://pbs.twimg.com/p.jpg', variants: [] }] },
    ]),
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

test('proxiedVideoSrc routes twimg through the site so no Referer reaches X', () => {
  // X 403s any request with a Referer from another domain, and referrerPolicy
  // is ignored on <video> — so the mp4 has to be fetched server-side.
  assert.equal(
    proxiedVideoSrc('https://video.twimg.com/amplify_video/1/vid/avc1/1280x720/a.mp4'),
    '/x-video/amplify_video/1/vid/avc1/1280x720/a.mp4'
  );
});

test('proxiedVideoSrc leaves a non-twimg url alone', () => {
  const other = 'https://pixel-point-website.s3.amazonaws.com/posts/x/video.mp4';
  assert.equal(proxiedVideoSrc(other), other);
});

test('collectVideos emits a proxied src, never a bare twimg url', () => {
  const videos = collectVideos([
    {
      media: [
        {
          type: 'video',
          url: 'https://pbs.twimg.com/poster.jpg',
          variants: [
            {
              content_type: 'video/mp4',
              bit_rate: 2176000,
              url: 'https://video.twimg.com/amplify_video/1/vid/avc1/1920x1080/v.mp4',
            },
          ],
        },
      ],
    },
  ]);
  assert.equal(videos[0].src, '/x-video/amplify_video/1/vid/avc1/1920x1080/v.mp4');
  assert.ok(!videos[0].src.includes('video.twimg.com'));
});

test('imageTarget normalises the forms the model actually produces', () => {
  assert.equal(imageTarget('image-1.jpg'), 'image-1.jpg');
  // The same prompt shows ./ for video posters, so the model uses it here too.
  assert.equal(imageTarget('./image-1.jpg'), 'image-1.jpg');
  assert.equal(imageTarget('./image-1.jpg "A caption"'), 'image-1.jpg');
});

test('stripUnknownImages keeps a ./-prefixed reference to a real file', () => {
  // An exact compare stripped every image in the post, silently and with no
  // line in the PR body to say so.
  const body = 'Intro.\n\n![a chart](./image-1.jpg)\n\nEnd.';
  const result = stripUnknownImages(body, ['image-1.jpg']);
  assert.ok(result.includes('![a chart](./image-1.jpg)'));
});

const vid = (n, posterUrl) => ({
  posterFilename: `video-cover-${n}.jpg`,
  posterUrl,
  src: `/x-video/amplify_video/${n}/v.mp4`,
  width: '1920',
  height: '1080',
  isGif: false,
});

function fetchReturning(bytesByUrl) {
  return async (url) => ({
    ok: true,
    arrayBuffer: async () => new TextEncoder().encode(bytesByUrl[url]).buffer,
  });
}

test('the same clip posted twice is kept once, compared by poster bytes', async () => {
  // Different media ids and different poster urls, byte-identical images —
  // exactly how one video rendered twice in the Databricks post.
  const videos = [vid(1, 'https://pbs.twimg.com/a.jpg'), vid(2, 'https://pbs.twimg.com/b.jpg')];
  const kept = await dedupeVideosByPoster({
    videos,
    fetchImpl: fetchReturning({
      'https://pbs.twimg.com/a.jpg': 'SAME-FRAME',
      'https://pbs.twimg.com/b.jpg': 'SAME-FRAME',
    }),
  });
  assert.equal(kept.length, 1);
  assert.equal(kept[0].src, '/x-video/amplify_video/1/v.mp4', 'the first occurrence wins');
});

test('genuinely different clips are both kept', async () => {
  const kept = await dedupeVideosByPoster({
    videos: [vid(1, 'https://pbs.twimg.com/a.jpg'), vid(2, 'https://pbs.twimg.com/b.jpg')],
    fetchImpl: fetchReturning({
      'https://pbs.twimg.com/a.jpg': 'FRAME-A',
      'https://pbs.twimg.com/b.jpg': 'FRAME-B',
    }),
  });
  assert.equal(kept.length, 2);
});

test('poster filenames stay contiguous after a duplicate is dropped', async () => {
  const kept = await dedupeVideosByPoster({
    videos: [vid(1, 'https://p/a.jpg'), vid(2, 'https://p/b.jpg'), vid(3, 'https://p/c.jpg')],
    fetchImpl: fetchReturning({
      'https://p/a.jpg': 'X',
      'https://p/b.jpg': 'X',
      'https://p/c.jpg': 'Y',
    }),
  });
  assert.deepEqual(
    kept.map((v) => v.posterFilename),
    ['video-cover-1.jpg', 'video-cover-2.jpg']
  );
});

test('an unreachable poster keeps the video rather than dropping it', async () => {
  // A transient network error must not silently cost a clip.
  const kept = await dedupeVideosByPoster({
    videos: [vid(1, 'https://p/a.jpg'), vid(2, 'https://p/b.jpg')],
    fetchImpl: async () => {
      throw new Error('ECONNRESET');
    },
  });
  assert.equal(kept.length, 2);
});

test('extensionFor survives a malformed url instead of throwing', () => {
  // It runs inside the dedup renumbering; throwing there would kill the run.
  assert.equal(extensionFor('not-a-url'), '.jpg');
});
```

```js
// scripts/blog-pipeline/lib/post-media.js
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const SUPPORTED_TYPES = ['photo'];
const VIDEO_TYPES = ['video', 'animated_gif'];

function extensionFor(url) {
  let ext;
  try {
    ext = path.extname(new URL(url).pathname).toLowerCase();
  } catch {
    // A malformed url should cost the extension guess, not the whole run.
    return '.jpg';
  }
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
        sourceUrl: post.url,
      });
    }
  }
  return photos;
}

// Blog posts render in a 696px column (see blog-post.jsx), so 2x that is all
// the resolution a reader can actually see.
const TARGET_WIDTH = 696 * 2;

function variantWidth(variant) {
  // X encodes the dimensions in the path: .../vid/avc1/1280x720/name.mp4
  const match = /\/(\d+)x(\d+)\//.exec(variant.url || '');
  return match ? Number(match[1]) : 0;
}

// X publishes a ladder of encodings per video — one clip offered 1600x1200 at
// 10,368 kbps alongside 960x720 at 2,176. Taking the top of the ladder shipped
// 4K files into a 696px column: slower to start, far more expensive on mobile,
// and indistinguishable once scaled down. Take the smallest variant that still
// covers the column at 2x, and only fall back to the largest available when
// every option is smaller than that.
function bestMp4(variants) {
  const mp4s = (variants || []).filter(
    (variant) => variant.content_type === 'video/mp4' && variant.url
  );
  if (mp4s.length === 0) return undefined;

  const byWidthAscending = [...mp4s].sort((a, b) => variantWidth(a) - variantWidth(b));
  const bigEnough = byWidthAscending.find((variant) => variantWidth(variant) >= TARGET_WIDTH);

  // Width is unknown when the URL doesn't carry dimensions; bit rate is then
  // the only ordering signal available.
  if (!bigEnough && byWidthAscending.every((variant) => variantWidth(variant) === 0)) {
    return [...mp4s].sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))[0];
  }

  return bigEnough || byWidthAscending[byWidthAscending.length - 1];
}

const VIDEO_ORIGIN = 'https://video.twimg.com/';
const VIDEO_PROXY_PATH = '/x-video/';

// X returns 403 for any request carrying a Referer from another domain, and a
// browser always sends one — referrerPolicy is not honoured on <video>. So the
// mp4 cannot be linked directly; it goes through the Vercel rewrite in
// vercel.json, which fetches server-side and therefore without the browser's
// Referer. Same pattern as the /aval and /api proxies already in that file.
function proxiedVideoSrc(url) {
  return url.startsWith(VIDEO_ORIGIN) ? VIDEO_PROXY_PATH + url.slice(VIDEO_ORIGIN.length) : url;
}

// The mp4 is proxied rather than rehosted — the site's S3 bucket isn't
// writable from here. The upstream urls are not contractually stable, so a
// video can still stop playing later; the poster is downloaded locally so at
// least a still frame survives that.
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
        src: proxiedVideoSrc(variant.url),
        width: String(item.width || 1280),
        height: String(item.height || 720),
        // animated_gif has no audio track and should loop like the gif it replaced.
        isGif: item.type === 'animated_gif',
        // Which post published it. Four clips attached to one post are a set
        // the author posted at once, not four separate illustrations.
        sourceUrl: post.url,
      });
    }
  }
  return videos;
}

// The same clip posted in two tweets arrives as two media items with different
// ids, different urls, and byte-identical posters — which is how one video came
// out twice in a single article. Nothing in the metadata reveals it, so compare
// the poster bytes. Runs before drafting so the model never sees the duplicate
// and never writes prose around it.
async function dedupeVideosByPoster({ videos, fetchImpl = fetch }) {
  const seen = new Set();
  const kept = [];

  for (const video of videos) {
    let digest;
    try {
      const res = await fetchImpl(video.posterUrl);
      if (res.ok) {
        digest = crypto
          .createHash('sha256')
          .update(Buffer.from(await res.arrayBuffer()))
          .digest('hex');
      }
    } catch {
      // Unreachable poster: keep the video and let the publish step decide.
      // Dropping it here would lose a clip over a transient network error.
    }

    if (digest && seen.has(digest)) continue;
    if (digest) seen.add(digest);
    kept.push(video);
  }

  // Renumber so the filenames stay contiguous after a drop.
  return kept.map((video, index) => ({
    ...video,
    posterFilename: `video-cover-${index + 1}${extensionFor(video.posterUrl)}`,
  }));
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
//
// Matching has to be looser than a string compare. The same prompt hands the
// model `./video-cover-1.jpg` for video posters, so it will sometimes write
// `![alt](./image-1.jpg)` for images by analogy — and an exact compare then
// strips every image in the post silently. Gatsby resolves both forms, and a
// markdown title is legal too, so normalise before comparing.
function imageTarget(raw) {
  return raw.trim().split(/\s+/)[0].replace(/^\.\//, '');
}

function stripUnknownImages(body, savedFilenames) {
  return body.replace(/!\[[^\]]*\]\(([^)]+)\)\n?/g, (match, target) =>
    savedFilenames.includes(imageTarget(target)) ? match : ''
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
  dedupeVideosByPoster,
  downloadPhotos,
  stripUnknownImages,
  imageTarget,
  stripUnusableVideos,
  bestMp4,
  extensionFor,
  proxiedVideoSrc,
  SUPPORTED_TYPES,
  VIDEO_TYPES,
};
```

Run: `node --test scripts/blog-pipeline/lib/post-media.test.js`
Expected: PASS (8 tests)

**Step 1: Write the failing test**

```js
// scripts/blog-pipeline/lib/publish-post.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const matter = require('gray-matter');

const { publishPost, claimFolderName } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = await publishPost({
    draft: {
      title: "Alex's Update",
      summary: 'Summary text',
      slug: 'alex-update',
      body: 'Body text',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  // Round-tripped rather than string-matched: asserting on a particular
  // escaping style cannot fail when the escaping itself is wrong.
  const { data, content } = matter(written);
  assert.equal(data.title, "Alex's Update");
  assert.equal(data.summary, 'Summary text');
  assert.equal(data.author, 'Alex Barashkov');
  assert.equal(data.category, 'Updates');
  assert.equal(data.cover, 'cover.png');
  assert.ok(content.includes('Body text'));
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

  assert.deepEqual(
    photos.map((p) => p.filename),
    ['image-1.jpg']
  );
  assert.ok(fs.existsSync(path.join(postDir, 'image-1.jpg')));
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes('![kept](image-1.jpg)'));
  assert.ok(!written.includes('image-2.jpg'));
  assert.ok(written.includes('End.'));
});

test('two drafts with the same slug get separate folders instead of overwriting', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-collide-'));
  const cover = path.join(repoRoot, 'c.png');
  fs.writeFileSync(cover, 'x');
  const draft = { title: 'A', summary: 'S', slug: 'toolcraft-update', body: 'first' };

  const one = await publishPost({
    draft,
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });
  const two = await publishPost({
    draft: { ...draft, body: 'second' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });

  assert.notEqual(one.folderName, two.folderName);
  assert.equal(two.folderName, '2026-08-11-toolcraft-update-2');
  // The first post must survive: losing it silently while the PR still lists
  // its title is the failure this guards against.
  assert.ok(fs.readFileSync(path.join(one.postDir, 'index.md'), 'utf8').includes('first'));
  assert.ok(fs.readFileSync(path.join(two.postDir, 'index.md'), 'utf8').includes('second'));
});

test('a slug with no usable characters still produces a valid folder', () => {
  const postsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-slug-'));
  // Would otherwise yield a folder named "2026-08-11-", which breaks the
  // site's date-prefix slug parsing.
  assert.equal(
    claimFolderName({ postsDir, publishDate: '2026-08-11', slug: '!!!' }),
    '2026-08-11-updates'
  );
});

test('a title containing a newline or a colon still parses', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-yaml-'));
  const cover = path.join(repoRoot, 'c.png');
  fs.writeFileSync(cover, 'x');
  // Hand-built frontmatter produced an unparseable file for these, which
  // fails the Gatsby build rather than one post.
  const { postDir } = await publishPost({
    draft: {
      title: 'Toolcraft: an update\nwith a newline',
      summary: 'He said "it works" — 100% of the time',
      slug: 'edge',
      body: 'Body',
    },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });
  const { data } = matter(fs.readFileSync(path.join(postDir, 'index.md'), 'utf8'));
  assert.equal(data.title, 'Toolcraft: an update\nwith a newline');
  assert.equal(data.summary, 'He said "it works" — 100% of the time');
});

test('a video poster becomes the cover, without duplicating the bytes', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { postDir, cover } = await publishPost({
    draft: {
      title: 'T',
      summary: 'S',
      slug: 'with-video',
      body: '<Video poster="./video-cover-1.jpg"></Video>',
    },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/a.jpg' }],
    fetchImpl: async () => ({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('FRAME').buffer,
    }),
  });

  assert.equal(cover, 'video-cover-1.jpg');
  assert.equal(
    matter(fs.readFileSync(path.join(postDir, 'index.md'), 'utf8')).data.cover,
    'video-cover-1.jpg'
  );
  // Referenced in place rather than copied to cover.png.
  assert.equal(fs.existsSync(path.join(postDir, 'cover.png')), false);
});

test('the placeholder is used when the post has no video', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-none-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { postDir, cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'no-video', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
  });

  assert.equal(cover, 'cover.png');
  assert.equal(fs.readFileSync(path.join(postDir, 'cover.png'), 'utf8'), 'PLACEHOLDER');
});

test('a poster that failed to download does not become a missing cover', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-404-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  // A cover pointing at a file that isn't there fails the whole Gatsby build.
  const { postDir, cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'lost-poster', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/gone.jpg' }],
    fetchImpl: async () => ({ ok: false, status: 404 }),
  });

  assert.equal(cover, 'cover.png');
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
});

test('a photo is preferred over a video poster for the cover', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-pref-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  // The author chose to post the photo; the poster is whatever frame X pulled.
  const { cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'both', body: '![a](image-1.jpg)' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    photos: [{ filename: 'image-1.jpg', url: 'https://p/photo.jpg' }],
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/poster.jpg' }],
    fetchImpl: async () => ({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('X').buffer,
    }),
  });
  assert.equal(cover, 'image-1.jpg');
});

test('a failed photo download falls through to the video poster', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-fall-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'fallthrough', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    photos: [{ filename: 'image-1.jpg', url: 'https://p/gone.jpg' }],
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/poster.jpg' }],
    fetchImpl: async (url) =>
      url.includes('gone')
        ? { ok: false, status: 404 }
        : { ok: true, arrayBuffer: async () => new TextEncoder().encode('X').buffer },
  });
  assert.equal(cover, 'video-cover-1.jpg');
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

const matter = require('gray-matter');

const { downloadPhotos, stripUnknownImages, stripUnusableVideos } = require('./post-media');

// Every post in a run shares publishDate, so the folder name comes down to the
// model-chosen slug. Two drafts landing on the same slug — a standalone post
// and a roundup about the same product, say — would otherwise overwrite each
// other, while the PR body and the Slack message still listed both titles: the
// reviewer would be told about a post that no longer exists.
function claimFolderName({ postsDir, publishDate, slug }) {
  const sanitized =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'updates';

  const base = `${publishDate}-${sanitized}`;
  let name = base;
  for (let n = 2; fs.existsSync(path.join(postsDir, name)); n += 1) {
    name = `${base}-${n}`;
  }
  return name;
}

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
  const postsDir = path.join(repoRoot, 'content', 'posts');
  const folderName = claimFolderName({ postsDir, publishDate, slug: draft.slug });
  const postDir = path.join(postsDir, folderName);
  fs.mkdirSync(postDir, { recursive: true });

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

  // Something from the post itself beats the shared placeholder, and it is
  // already in the folder — referencing it directly avoids a second copy of
  // the same bytes. A photo comes first: the author chose to post that still,
  // whereas a video poster is whatever frame X extracted. Only a file that
  // actually downloaded is eligible; a cover pointing at a missing file fails
  // the entire Gatsby build rather than one post.
  const ownImage = saved[0] || savedPosters[0];
  let coverName = ownImage && ownImage.filename;
  if (!coverName) {
    coverName = `cover${path.extname(coverImageSourcePath) || '.png'}`;
    fs.copyFileSync(coverImageSourcePath, path.join(postDir, coverName));
  }

  // Serialised by gray-matter rather than hand-escaped: a model-written title
  // containing a newline, a colon or a quote would otherwise produce a file
  // that fails to parse, and the whole site build with it.
  const file = matter.stringify(`\n${body}\n`, {
    title: draft.title,
    summary: draft.summary,
    author,
    cover: coverName,
    category,
  });
  fs.writeFileSync(path.join(postDir, 'index.md'), file, 'utf8');

  return { postDir, folderName, photos: saved, videos: savedPosters, cover: coverName };
}

module.exports = { publishPost, claimFolderName };
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
const assert = require('node:assert/strict');
const test = require('node:test');

const { notifySlack, buildDraftsMessage } = require('./notify-slack');

test('POSTs the text as JSON to the webhook URL', async () => {
  let capturedUrl;
  let capturedBody;
  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedBody = JSON.parse(options.body);
    return { ok: true };
  };
  await notifySlack({
    webhookUrl: 'https://hooks.slack.com/x',
    text: 'hello',
    fetchImpl: fakeFetch,
  });
  assert.equal(capturedUrl, 'https://hooks.slack.com/x');
  assert.deepEqual(capturedBody, { text: 'hello' });
});

test('throws when the webhook responds with an error', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500 });
  await assert.rejects(
    () =>
      notifySlack({ webhookUrl: 'https://hooks.slack.com/x', text: 'hi', fetchImpl: fakeFetch }),
    /Slack webhook failed: 500/
  );
});

const DRAFTS = [{ title: 'Toolcraft update: a leaner AI harness' }, { title: 'Introducing Aval' }];

test('buildDraftsMessage leads with the PR link and lists every title', () => {
  const text = buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://github.com/o/r/pull/9' });
  assert.ok(
    text.startsWith('2 new monthly blog drafts ready for review: https://github.com/o/r/pull/9')
  );
  assert.ok(text.includes('• Toolcraft update: a leaner AI harness'));
  assert.ok(text.includes('• Introducing Aval'));
  assert.ok(text.includes('Vercel comments the preview link'));
});

test('buildDraftsMessage uses the singular for one draft', () => {
  const text = buildDraftsMessage({ drafts: [DRAFTS[0]], prUrl: 'https://x/1' });
  assert.ok(text.startsWith('New monthly blog draft ready for review:'));
});

test('buildDraftsMessage mentions skipped posts when there were any', () => {
  const text = buildDraftsMessage({
    drafts: DRAFTS,
    prUrl: 'https://x/1',
    skipped: [{ posts: [{}, {}] }, { posts: [{}] }],
  });
  assert.ok(text.includes('3 post(s) skipped as already covered'));
});

test('buildDraftsMessage says nothing about skips when there were none', () => {
  assert.ok(!buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://x/1' }).includes('skipped'));
});

test('the message never contains undefined', () => {
  // openDraftPr became async for the PR-create retry and run.js kept
  // destructuring it synchronously, so a real run posted "...review: undefined".
  const text = buildDraftsMessage({ drafts: DRAFTS, prUrl: 'https://x/1' });
  assert.ok(!text.includes('undefined'), text);
});

test('notifySlack retries a transient failure — the run has no other signal', async () => {
  let calls = 0;
  const slept = [];
  await notifySlack({
    webhookUrl: 'https://hooks.slack.com/x',
    text: 'hi',
    fetchImpl: async () => {
      calls += 1;
      return calls < 3 ? { ok: false, status: 503 } : { ok: true };
    },
    sleepImpl: async (ms) => slept.push(ms),
  });
  assert.equal(calls, 3);
  assert.deepEqual(slept, [1000, 2000]);
});

test('notifySlack does not retry a permanent failure', async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      notifySlack({
        webhookUrl: 'https://hooks.slack.com/x',
        text: 'hi',
        fetchImpl: async () => {
          calls += 1;
          return { ok: false, status: 404 };
        },
        sleepImpl: async () => {},
      }),
    /Slack webhook failed: 404/
  );
  assert.equal(calls, 1, 'a bad webhook url fails the same way every time');
});

test('notifySlack gives up after the last attempt', async () => {
  let calls = 0;
  await assert.rejects(
    () =>
      notifySlack({
        webhookUrl: 'https://hooks.slack.com/x',
        text: 'hi',
        fetchImpl: async () => {
          calls += 1;
          return { ok: false, status: 500 };
        },
        sleepImpl: async () => {},
        attempts: 2,
      }),
    /Slack webhook failed: 500/
  );
  assert.equal(calls, 2);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test scripts/blog-pipeline/lib/notify-slack.test.js`
Expected: FAIL with "Cannot find module './notify-slack'"

**Step 3: Write the implementation**

```js
// scripts/blog-pipeline/lib/notify-slack.js
// The preview URL is not knowable here: Vercel posts it as a comment on the
// PR moments after the branch is pushed, so the message points at the PR and
// lets the reviewer follow the bot comment from there.
function buildDraftsMessage({ drafts, prUrl, skipped = [] }) {
  const lead =
    drafts.length === 1
      ? 'New monthly blog draft ready for review'
      : `${drafts.length} new monthly blog drafts ready for review`;

  const lines = [`${lead}: ${prUrl}`, '', ...drafts.map((draft) => `• ${draft.title}`)];

  if (skipped.length > 0) {
    const posts = skipped.reduce((total, group) => total + group.posts.length, 0);
    lines.push('', `${posts} post(s) skipped as already covered — listed in the PR.`);
  }

  lines.push('', 'Vercel comments the preview link on the PR once the build finishes.');
  return lines.join('\n');
}

// This is the only signal a monthly run gives. If the webhook blips on the
// failure path the run goes completely silent, so a transient error is worth
// retrying before giving up.
const NOTIFY_ATTEMPTS = 3;
const NOTIFY_BACKOFF_MS = 1000;

async function notifySlack({
  webhookUrl,
  text,
  fetchImpl = fetch,
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempts = NOTIFY_ATTEMPTS,
}) {
  let lastStatus;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    // A malformed payload fails identically every time; only server-side and
    // rate-limit responses are worth another go.
    const res = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) return;
    lastStatus = res.status;
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === attempts) break;
    await sleepImpl(NOTIFY_BACKOFF_MS * attempt);
  }
  throw new Error(`Slack webhook failed: ${lastStatus}`);
}

module.exports = { notifySlack, buildDraftsMessage };
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
    args: [
      'pr',
      'create',
      '--title',
      prTitle,
      '--body',
      prBody,
      '--base',
      'main',
      '--head',
      branchName,
    ],
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
const assert = require('node:assert/strict');
const test = require('node:test');

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
const fs = require('node:fs');
const path = require('node:path');

const Anthropic = require('@anthropic-ai/sdk');

const { usageSummary } = require('./lib/anthropic-json');
const { classifyAndGroupPosts } = require('./lib/classify-posts');
const { draftPost } = require('./lib/draft-post');
const { getUserId, fetchRecentPosts } = require('./lib/fetch-posts');
const { filterCandidates } = require('./lib/filter-posts');
const { openDraftPr } = require('./lib/git-pr');
const { notifySlack, buildDraftsMessage } = require('./lib/notify-slack');
const { collectPhotos, collectVideos, dedupeVideosByPoster } = require('./lib/post-media');
const { buildPrBody } = require('./lib/pr-body');
const { publishPost } = require('./lib/publish-post');
const { readAuthorHandle } = require('./lib/read-author-handle');
const { readExistingPosts } = require('./lib/read-existing-posts');
const { readPendingPosts } = require('./lib/read-pending-posts');
const { readRepoUsage } = require('./lib/read-repo-usage');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
// Every run saves what it drafted so a later one can be replayed for free.
// Iterating on publishing or rendering should not cost an API call, and it
// should certainly not open a pull request.
const DRAFT_CACHE_PATH = path.join(REPO_ROOT, '.blog-pipeline-drafts.json');
const COVER_IMAGE_PATH = path.join(REPO_ROOT, 'static', 'blog-updates-cover.png');
const AUTHOR_NAME = 'Alex Barashkov';
const LOOKBACK_DAYS = 35;

function assertRequiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

// Collaborators are injected so the wiring itself can be tested. This file is
// where a missing `await` on openDraftPr shipped — the Slack message read
// "ready for review: undefined" — which is exactly the class of defect an
// orchestration test catches and a unit test on any single module cannot.
const defaultDeps = {
  getUserId,
  fetchRecentPosts,
  filterCandidates,
  readExistingPosts,
  readPendingPosts,
  readRepoUsage,
  readAuthorHandle,
  classifyAndGroupPosts,
  draftPost,
  publishPost,
  openDraftPr,
  notifySlack,
  collectPhotos,
  collectVideos,
  dedupeVideosByPoster,
  // Overridable so tests never write into the real repo.
  draftCachePath: DRAFT_CACHE_PATH,
};

async function main(overrides = {}) {
  const {
    getUserId,
    fetchRecentPosts,
    filterCandidates,
    readExistingPosts,
    readPendingPosts,
    readRepoUsage,
    readAuthorHandle,
    classifyAndGroupPosts,
    draftPost,
    publishPost,
    openDraftPr,
    notifySlack,
    collectPhotos,
    collectVideos,
    dedupeVideosByPoster,
    draftCachePath,
  } = { ...defaultDeps, ...overrides };

  const dryRun = process.argv.includes('--dry-run');
  // Writes the post folders but stops there — no branch, no commit, no PR, no
  // Slack. This is the mode for previewing real output with `gatsby develop`.
  const localOnly = process.argv.includes('--local');
  // Reuses the last run's drafts instead of calling the X and Anthropic APIs.
  const replay = process.argv.includes('--replay');
  // Drafts awaiting review legitimately suppress a re-run of the same month,
  // which is the point — but it also means you cannot test while a draft PR is
  // open. This opts out for local iteration only.
  const ignorePending = process.argv.includes('--ignore-pending');
  const writesNothing = dryRun;
  const opensPr = !dryRun && !localOnly;

  // A dry run stops after drafting — it never opens a PR or posts to Slack —
  // so requiring a webhook it will not use just blocks local testing.
  assertRequiredEnv(
    // A replay talks to neither API, so it needs no credentials at all.
    replay
      ? []
      : !opensPr
        ? ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY']
        : // GH_TOKEN is what `gh pr create` authenticates with. Without it the run
          // fails only after posts are written, committed and a branch is pushed,
          // leaving an orphan branch and no PR.
          ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY', 'SLACK_WEBHOOK_URL', 'GH_TOKEN']
  );

  const { X_API_BEARER_TOKEN, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  if (replay) {
    if (!fs.existsSync(draftCachePath)) {
      throw new Error(`No cached drafts at ${draftCachePath} — run once without --replay first.`);
    }
    const cached = JSON.parse(fs.readFileSync(draftCachePath, 'utf8'));
    console.log(`Replaying ${cached.drafted.length} cached draft(s) from ${cached.generatedAt}.`);
    return publishAndMaybeOpenPr({
      drafted: cached.drafted,
      skipped: cached.skipped,
      opensPr,
      deps: { publishPost, openDraftPr, notifySlack },
      webhookUrl: SLACK_WEBHOOK_URL,
    });
  }

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({
    userId,
    // Lets the fetch use full-archive search to find self-replies, which is
    // ~7 reads instead of ~300 paging the timeline.
    username,
    bearerToken: X_API_BEARER_TOKEN,
    sinceISODate,
  });

  const candidates = filterCandidates(posts);
  // Posts awaiting review count as covered: without them a run whose previous
  // PR is still open re-drafts the same topics against an empty comparison.
  const pendingPosts = ignorePending ? [] : readPendingPosts({ repoRoot: REPO_ROOT });
  const existingPosts = [...readExistingPosts(REPO_ROOT), ...pendingPosts];
  if (pendingPosts.length > 0) {
    console.log(`Including ${pendingPosts.length} post(s) from open draft PRs in the dedup check.`);
  }
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
    if (opensPr) {
      await notifySlack({
        webhookUrl: SLACK_WEBHOOK_URL,
        text: 'No qualifying posts this month — skipping.',
      });
    }
    return;
  }

  // Filenames are assigned before drafting so the model can be given the exact
  // names to reference, rather than inventing them and needing reconciliation.
  const drafted = [];
  for (const { posts: group, relatedExistingPosts } of groups) {
    const photos = collectPhotos(group);
    const videos = await dedupeVideosByPoster({ videos: collectVideos(group) });
    // Only the repos this group actually links, so an article is never offered
    // commands from an unrelated project.
    const repoUsage = await readRepoUsage({ posts: group });
    drafted.push({
      draft: await draftPost({
        qualifyingPosts: group,
        photos,
        videos,
        relatedExistingPosts,
        repoUsage,
        anthropicClient,
      }),
      photos,
      videos,
    });
  }
  const drafts = drafted.map((item) => item.draft);

  console.log(`Model usage: ${usageSummary()}`);

  if (writesNothing) {
    console.log(`--- DRY RUN: ${drafts.length} drafted post(s) (nothing written or published) ---`);
    console.log(JSON.stringify(drafts, null, 2));
    return;
  }

  // Cached before publishing so a --replay can redo everything downstream —
  // publishing, media, frontmatter, the PR body — without paying for drafting
  // again or opening a pull request to look at the result.
  fs.writeFileSync(
    draftCachePath,
    JSON.stringify({ generatedAt: new Date().toISOString(), drafted, skipped }, null, 2)
  );

  return publishAndMaybeOpenPr({
    drafted,
    skipped,
    opensPr,
    deps: { publishPost, openDraftPr, notifySlack },
    webhookUrl: SLACK_WEBHOOK_URL,
  });
}

// Shared by a normal run and a --replay: everything after drafting.
async function publishAndMaybeOpenPr({ drafted, skipped, opensPr, deps, webhookUrl }) {
  const { publishPost, openDraftPr, notifySlack } = deps;
  const drafts = drafted.map((item) => item.draft);
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

  if (!opensPr) {
    console.log('');
    console.log(`${postDirs.length} post(s) written locally. No branch, PR, or Slack message.`);
    console.log('Preview with:  npx gatsby develop');
    console.log('Discard with:  git clean -fd content/posts');
    return;
  }

  const runId = process.env.GITHUB_RUN_ID || Date.now().toString();
  const branchName = `blog-draft/${publishDate.slice(0, 7)}-${runId}`;
  const prTitle =
    drafts.length === 1
      ? `Updates: ${drafts[0].title}`
      : `Updates: ${drafts.length} new posts for ${publishDate.slice(0, 7)}`;
  const { prUrl } = await openDraftPr({
    repoRoot: REPO_ROOT,
    branchName,
    postDirs,
    prTitle,
    prBody: buildPrBody({ drafts, skipped }),
  });

  await notifySlack({ webhookUrl, text: buildDraftsMessage({ drafts, prUrl, skipped }) });
}

async function reportFailure(err) {
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
}

if (require.main === module) {
  main().catch(reportFailure);
}

module.exports = { main };
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
