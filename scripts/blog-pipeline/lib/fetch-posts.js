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

// X rewrites every link in a post as an opaque t.co shortlink. Handed one of
// those, the model can't tell what it points at and drops it — which is why
// drafts carried no outbound links at all. entities.urls maps each back to
// where it actually goes.
function expandLinks(post) {
  const urls = (post.entities && post.entities.urls) || [];
  return urls.reduce(
    (text, link) => (link.expanded_url ? text.split(link.url).join(link.expanded_url) : text),
    post.text || ''
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

async function fetchRecentPosts({ userId, bearerToken, sinceISODate, fetchImpl = fetch }) {
  const url = new URL(`https://api.twitter.com/2/users/${userId}/tweets`);
  url.searchParams.set('exclude', 'replies,retweets');
  url.searchParams.set('start_time', sinceISODate);
  // `entities` carries the real destination behind each t.co link.
  url.searchParams.set('tweet.fields', 'created_at,text,entities,referenced_tweets');
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
    };
  });
}

module.exports = { getUserId, fetchRecentPosts, expandLinks };
