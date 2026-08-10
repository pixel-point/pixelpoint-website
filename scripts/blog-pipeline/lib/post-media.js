const fs = require('node:fs');
const path = require('node:path');

// Only photos for now. Video needs a hosting decision the pipeline can't make
// on its own — see the deferred item in the design doc.
const SUPPORTED_TYPES = ['photo'];

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

module.exports = { collectPhotos, downloadPhotos, stripUnknownImages, SUPPORTED_TYPES };
