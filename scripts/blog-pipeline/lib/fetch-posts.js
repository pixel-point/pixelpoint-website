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
    list.push({ id: item.id, text: expandLinks(item), url: `https://x.com/i/web/status/${item.id}` });
    byConversation.set(item.conversation_id, list);
  }
  return byConversation;
}

async function searchSelfReplies({ username, bearerToken, sinceISODate, fetchImpl }) {
  const url = new URL('https://api.twitter.com/2/tweets/search/all');
  url.searchParams.set('query', `from:${username} to:${username}`);
  url.searchParams.set('start_time', sinceISODate);
  url.searchParams.set('tweet.fields', 'text,entities,note_tweet,conversation_id,in_reply_to_user_id');
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

module.exports = { getUserId, fetchRecentPosts, fetchSelfReplies, expandLinks, fullText, SELF_REPLY_PAGES, MAX_FOLLOW_UPS };
