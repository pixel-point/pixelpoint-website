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

// A draft can arrive with its last <Video> cut off mid-attribute — observed
// once, where the body ended at `...grOQe8Ny3gnLUT24.mp4` with no closing
// quote, bracket or tag. MDX then reads the file as JSX and the build fails
// with a parse error pointing at line 1, which is a miserable thing to debug.
// One lost clip beats a broken build, so drop any fragment that is not a
// complete tag.
function stripTruncatedVideos(body) {
  const complete = /<Video\b[^>]*><\/Video>/g;
  const kept = [];

  for (const match of body.matchAll(complete)) {
    kept.push({ start: match.index, end: match.index + match[0].length });
  }

  // Anything starting with `<Video` that is not one of those spans is a
  // fragment: an unclosed tag, or one missing its </Video>.
  return body.replace(/<Video\b[\s\S]*?(?:<\/Video>|$)/g, (match, offset) => {
    const isComplete = kept.some(
      (span) => span.start === offset && span.end === offset + match.length
    );
    if (isComplete) return match;
    console.warn(`Dropping a malformed <Video> fragment: ${match.slice(0, 60)}...`);
    return '';
  });
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
  stripTruncatedVideos,
  bestMp4,
  extensionFor,
  proxiedVideoSrc,
  SUPPORTED_TYPES,
  VIDEO_TYPES,
};
