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
        { type: 'video', url: 'https://pbs.twimg.com/poster.jpg', variants: VARIANTS, width: 1920, height: 1080 },
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

const { proxiedVideoSrc } = require('./post-media');

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

const { imageTarget } = require('./post-media');

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

const { dedupeVideosByPoster, extensionFor } = require('./post-media');

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
    fetchImpl: fetchReturning({ 'https://p/a.jpg': 'X', 'https://p/b.jpg': 'X', 'https://p/c.jpg': 'Y' }),
  });
  assert.deepEqual(kept.map((v) => v.posterFilename), ['video-cover-1.jpg', 'video-cover-2.jpg']);
});

test('an unreachable poster keeps the video rather than dropping it', async () => {
  // A transient network error must not silently cost a clip.
  const kept = await dedupeVideosByPoster({
    videos: [vid(1, 'https://p/a.jpg'), vid(2, 'https://p/b.jpg')],
    fetchImpl: async () => { throw new Error('ECONNRESET'); },
  });
  assert.equal(kept.length, 2);
});

test('extensionFor survives a malformed url instead of throwing', () => {
  // It runs inside the dedup renumbering; throwing there would kill the run.
  assert.equal(extensionFor('not-a-url'), '.jpg');
});
