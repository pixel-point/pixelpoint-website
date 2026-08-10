const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { collectPhotos, downloadPhotos, stripUnknownImages } = require('./post-media');

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
  const photos = collectPhotos([{ media: [{ type: 'photo', url: 'https://pbs.twimg.com/media/abc' }] }]);
  assert.equal(photos[0].filename, 'image-1.jpg');
});

test('downloadPhotos writes each image and reports what landed', async () => {
  const destDir = tmpDir();
  const fakeFetch = async () => ({ ok: true, arrayBuffer: async () => new TextEncoder().encode('png-bytes').buffer });
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

const { collectVideos, bestMp4, stripUnusableVideos } = require('./post-media');

const VARIANTS = [
  { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/x.m3u8' },
  { content_type: 'video/mp4', bit_rate: 632000, url: 'https://video.twimg.com/low.mp4' },
  { content_type: 'video/mp4', bit_rate: 2176000, url: 'https://video.twimg.com/high.mp4' },
];

test('bestMp4 picks the highest-bitrate mp4 and ignores streaming variants', () => {
  assert.equal(bestMp4(VARIANTS).url, 'https://video.twimg.com/high.mp4');
  assert.equal(bestMp4([]), undefined);
});

test('collectVideos builds a poster filename and hotlinked src', () => {
  const videos = collectVideos([
    {
      media: [
        { type: 'video', url: 'https://pbs.twimg.com/poster.jpg', variants: VARIANTS, width: 1920, height: 1080 },
      ],
    },
  ]);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].posterFilename, 'video-cover-1.jpg');
  assert.equal(videos[0].src, 'https://video.twimg.com/high.mp4');
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
    collectVideos([{ media: [{ type: 'video', url: 'https://pbs.twimg.com/p.jpg', variants: [] }] }]),
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
