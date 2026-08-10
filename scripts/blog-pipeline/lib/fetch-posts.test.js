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
      quoted: null,
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
  assert.equal(posts[1].quoted, null);
});

const { expandLinks } = require('./fetch-posts');

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
            entities: { urls: [{ url: 'https://t.co/abc', expanded_url: 'https://x.com/dima/status/9' }] },
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
        { id: '1', text: 'ours', created_at: 'x', attachments: { media_keys: ['own'] }, referenced_tweets: [{ type: 'quoted', id: '9' }] },
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
  const posts = await fetchRecentPosts({ userId: '1', bearerToken: 't', sinceISODate: 'x', fetchImpl: fakeFetch });
  assert.equal(posts[0].media.length, 1);
  assert.equal(posts[0].media[0].url, 'https://pbs.twimg.com/ours.jpg');
});

const { fullText } = require('./fetch-posts');

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
  await fetchRecentPosts({ userId: '1', bearerToken: 't', sinceISODate: 'x', fetchImpl: fakeFetch });
  assert.ok(requested.includes('note_tweet'), 'without it, half the posts arrive truncated');
});
