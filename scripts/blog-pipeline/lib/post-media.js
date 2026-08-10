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
