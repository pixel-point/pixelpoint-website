// scripts/blog-pipeline/lib/publish-post.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const matter = require('gray-matter');

const { publishPost, claimFolderName } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = await publishPost({
    draft: {
      title: "Alex's Update",
      summary: 'Summary text',
      slug: 'alex-update',
      body: 'Body text',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  // Round-tripped rather than string-matched: asserting on a particular
  // escaping style cannot fail when the escaping itself is wrong.
  const { data, content } = matter(written);
  assert.equal(data.title, "Alex's Update");
  assert.equal(data.summary, 'Summary text');
  assert.equal(data.author, 'Alex Barashkov');
  assert.equal(data.category, 'Updates');
  assert.equal(data.cover, 'cover.png');
  assert.ok(content.includes('Body text'));
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
});

test('produces valid YAML frontmatter when the summary contains a colon', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-colon-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir } = await publishPost({
    draft: {
      title: 'New Tool',
      summary: 'New AI tool: what it means for designers',
      slug: 'new-tool',
      body: 'Body text',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  const { data } = matter(written);
  assert.equal(data.summary, 'New AI tool: what it means for designers');
});

test('downloads photos into the post folder and drops references that failed', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-media-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const fakeFetch = async (url) =>
    url.includes('good')
      ? { ok: true, arrayBuffer: async () => new TextEncoder().encode('img').buffer }
      : { ok: false, status: 404 };

  const { postDir, photos } = await publishPost({
    draft: {
      title: 'With images',
      summary: 'Summary',
      slug: 'with-images',
      body: 'Intro.\n\n![kept](image-1.jpg)\n\n![lost](image-2.jpg)\n\nEnd.',
    },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
    photos: [
      { filename: 'image-1.jpg', url: 'https://pbs.twimg.com/good.jpg' },
      { filename: 'image-2.jpg', url: 'https://pbs.twimg.com/gone.jpg' },
    ],
    fetchImpl: fakeFetch,
  });

  assert.deepEqual(
    photos.map((p) => p.filename),
    ['image-1.jpg']
  );
  assert.ok(fs.existsSync(path.join(postDir, 'image-1.jpg')));
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes('![kept](image-1.jpg)'));
  assert.ok(!written.includes('image-2.jpg'));
  assert.ok(written.includes('End.'));
});

test('two drafts with the same slug get separate folders instead of overwriting', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-collide-'));
  const cover = path.join(repoRoot, 'c.png');
  fs.writeFileSync(cover, 'x');
  const draft = { title: 'A', summary: 'S', slug: 'toolcraft-update', body: 'first' };

  const one = await publishPost({
    draft,
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });
  const two = await publishPost({
    draft: { ...draft, body: 'second' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });

  assert.notEqual(one.folderName, two.folderName);
  assert.equal(two.folderName, '2026-08-11-toolcraft-update-2');
  // The first post must survive: losing it silently while the PR still lists
  // its title is the failure this guards against.
  assert.ok(fs.readFileSync(path.join(one.postDir, 'index.md'), 'utf8').includes('first'));
  assert.ok(fs.readFileSync(path.join(two.postDir, 'index.md'), 'utf8').includes('second'));
});

test('a slug with no usable characters still produces a valid folder', () => {
  const postsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-slug-'));
  // Would otherwise yield a folder named "2026-08-11-", which breaks the
  // site's date-prefix slug parsing.
  assert.equal(
    claimFolderName({ postsDir, publishDate: '2026-08-11', slug: '!!!' }),
    '2026-08-11-updates'
  );
});

test('a title containing a newline or a colon still parses', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-yaml-'));
  const cover = path.join(repoRoot, 'c.png');
  fs.writeFileSync(cover, 'x');
  // Hand-built frontmatter produced an unparseable file for these, which
  // fails the Gatsby build rather than one post.
  const { postDir } = await publishPost({
    draft: {
      title: 'Toolcraft: an update\nwith a newline',
      summary: 'He said "it works" — 100% of the time',
      slug: 'edge',
      body: 'Body',
    },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: cover,
  });
  const { data } = matter(fs.readFileSync(path.join(postDir, 'index.md'), 'utf8'));
  assert.equal(data.title, 'Toolcraft: an update\nwith a newline');
  assert.equal(data.summary, 'He said "it works" — 100% of the time');
});

test('a video poster becomes the cover, without duplicating the bytes', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { postDir, cover } = await publishPost({
    draft: {
      title: 'T',
      summary: 'S',
      slug: 'with-video',
      body: '<Video poster="./video-cover-1.jpg"></Video>',
    },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/a.jpg' }],
    fetchImpl: async () => ({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('FRAME').buffer,
    }),
  });

  assert.equal(cover, 'video-cover-1.jpg');
  assert.equal(
    matter(fs.readFileSync(path.join(postDir, 'index.md'), 'utf8')).data.cover,
    'video-cover-1.jpg'
  );
  // Referenced in place rather than copied to cover.png.
  assert.equal(fs.existsSync(path.join(postDir, 'cover.png')), false);
});

test('the placeholder is used when the post has no video', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-none-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { postDir, cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'no-video', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
  });

  assert.equal(cover, 'cover.png');
  assert.equal(fs.readFileSync(path.join(postDir, 'cover.png'), 'utf8'), 'PLACEHOLDER');
});

test('a poster that failed to download does not become a missing cover', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-404-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  // A cover pointing at a file that isn't there fails the whole Gatsby build.
  const { postDir, cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'lost-poster', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/gone.jpg' }],
    fetchImpl: async () => ({ ok: false, status: 404 }),
  });

  assert.equal(cover, 'cover.png');
  assert.ok(fs.existsSync(path.join(postDir, 'cover.png')));
});

test('a photo is preferred over a video poster for the cover', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-pref-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  // The author chose to post the photo; the poster is whatever frame X pulled.
  const { cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'both', body: '![a](image-1.jpg)' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    photos: [{ filename: 'image-1.jpg', url: 'https://p/photo.jpg' }],
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/poster.jpg' }],
    fetchImpl: async () => ({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('X').buffer,
    }),
  });
  assert.equal(cover, 'image-1.jpg');
});

test('a failed photo download falls through to the video poster', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cover-fall-'));
  const placeholder = path.join(repoRoot, 'placeholder.png');
  fs.writeFileSync(placeholder, 'PLACEHOLDER');

  const { cover } = await publishPost({
    draft: { title: 'T', summary: 'S', slug: 'fallthrough', body: 'Body' },
    publishDate: '2026-08-11',
    repoRoot,
    coverImageSourcePath: placeholder,
    photos: [{ filename: 'image-1.jpg', url: 'https://p/gone.jpg' }],
    videos: [{ posterFilename: 'video-cover-1.jpg', posterUrl: 'https://p/poster.jpg' }],
    fetchImpl: async (url) =>
      url.includes('gone')
        ? { ok: false, status: 404 }
        : { ok: true, arrayBuffer: async () => new TextEncoder().encode('X').buffer },
  });
  assert.equal(cover, 'video-cover-1.jpg');
});
