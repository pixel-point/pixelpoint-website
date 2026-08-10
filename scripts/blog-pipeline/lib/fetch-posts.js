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
