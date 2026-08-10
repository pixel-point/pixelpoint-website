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
        posterFilename: `video-${index}-cover${extensionFor(item.url)}`,
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
