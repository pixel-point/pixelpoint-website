// scripts/blog-pipeline/lib/publish-post.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const matter = require('gray-matter');
const { publishPost } = require('./publish-post');

test('writes index.md with frontmatter and copies the cover image', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-publish-'));
  const coverImageSourcePath = path.join(repoRoot, 'source-cover.png');
  fs.writeFileSync(coverImageSourcePath, 'fake-png-bytes');

  const { postDir, folderName } = await publishPost({
    draft: { title: "Alex's Update", summary: 'Summary text', slug: 'alex-update', body: 'Body text' },
    publishDate: '2026-07-21',
    repoRoot,
    coverImageSourcePath,
  });

  assert.equal(folderName, '2026-07-21-alex-update');
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes("title: 'Alex''s Update'") || written.includes("title: 'Alex\\'s Update'"));
  assert.ok(written.includes("summary: 'Summary text'"));
  assert.ok(written.includes('author: Alex Barashkov'));
  assert.ok(written.includes('category: Updates'));
  assert.ok(written.includes('Body text'));
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

  assert.deepEqual(photos.map((p) => p.filename), ['image-1.jpg']);
  assert.ok(fs.existsSync(path.join(postDir, 'image-1.jpg')));
  const written = fs.readFileSync(path.join(postDir, 'index.md'), 'utf8');
  assert.ok(written.includes('![kept](image-1.jpg)'));
  assert.ok(!written.includes('image-2.jpg'));
  assert.ok(written.includes('End.'));
});

const { claimFolderName } = require('./publish-post');

test('two drafts with the same slug get separate folders instead of overwriting', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-collide-'));
  const cover = path.join(repoRoot, 'c.png');
  fs.writeFileSync(cover, 'x');
  const draft = { title: 'A', summary: 'S', slug: 'toolcraft-update', body: 'first' };

  const one = await publishPost({ draft, publishDate: '2026-08-11', repoRoot, coverImageSourcePath: cover });
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
  assert.equal(claimFolderName({ postsDir, publishDate: '2026-08-11', slug: '!!!' }), '2026-08-11-updates');
});
