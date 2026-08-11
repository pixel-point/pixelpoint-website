// scripts/blog-pipeline/lib/draft-post.js
const { requestJson } = require('./anthropic-json');

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    slug: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['title', 'summary', 'slug', 'body'],
  additionalProperties: false,
};

// Candidates, not conclusions: the model decides whether any of these is
// genuinely the install command for what the article is about. A README's
// shell blocks routinely include demo invocations and contributing steps.
function buildRepoUsageInstructions(repoUsage) {
  if (repoUsage.length === 0) return [];
  return [
    '',
    'The source posts link the repositories below, and these are shell commands taken from their READMEs. If one of them is genuinely how a reader installs or runs the thing this article is about, include it verbatim in a fenced code block where it helps. If none of them is — they may be demo invocations, build steps, or contributing instructions — leave them all out and just link the repository. Do not adapt or guess at a command.',
    '',
    'Commands found in linked repositories (JSON):',
    JSON.stringify(repoUsage),
  ];
}

function buildRelatedPostsInstructions(relatedExistingPosts) {
  if (relatedExistingPosts.length === 0) return [];
  return [
    '',
    'The blog has already published the posts below on this same subject. Assume the reader can be sent there: do not reintroduce or re-explain what these posts already cover, and do not restate their framing in new words. Open with what is actually new here, and link to the relevant post inline in markdown the first time you refer to the background — for example, "the starter kit [we introduced earlier](/blog/some-post/)".',
    '',
    'Already published on this subject (JSON):',
    JSON.stringify(relatedExistingPosts.map((post) => ({ title: post.title, path: post.path }))),
  ];
}

function videoTag(video) {
  return `<Video src="${video.src}" width="${video.width}" height="${video.height}"${
    video.isGif ? ' autoPlay muted loop playsInline' : ' controls muted'
  } poster="./${video.posterFilename}"></Video>`;
}

// Grouped by the post that published them. Flattening the list lost the fact
// that four clips attached to a single post are one set the author posted at
// once — the article then scattered them across four sections with headings in
// between, which reads as four unrelated demos rather than one release.
function groupBySource(items) {
  const groups = new Map();
  for (const item of items) {
    const key = item.sourceUrl || '';
    groups.set(key, [...(groups.get(key) || []), item]);
  }
  return [...groups.values()];
}

function buildVideoInstructions(videos) {
  if (videos.length === 0) return [];
  const sets = groupBySource(videos);
  const multiple = sets.some((set) => set.length > 1);

  return [
    '',
    'These videos come from the source posts. Place each one at the point it illustrates using exactly the markup listed below, copied verbatim on its own line — it is a component, not markdown, and altering the attributes will break the page. Leave a video out if it does not earn its place.',
    ...(multiple
      ? [
          'Videos listed under one heading below were published together in a single post, with no caption of their own. Keep such a set together in the article and in the order given — they are one exhibit, not separate illustrations to spread across sections.',
        ]
      : []),
    '',
    'Videos available (use these lines exactly):',
    ...sets
      .flatMap((set, index) => [
        sets.length > 1 || set.length > 1
          ? `Set ${index + 1} — ${set.length} video(s) published together:`
          : '',
        ...set.map(videoTag),
      ])
      .filter(Boolean),
  ];
}

function buildImageInstructions(photos) {
  if (photos.length === 0) return [];
  return [
    '',
    'These images come from the source posts and are saved alongside the article. Place each one in the body at the point it illustrates, not collected at the end, using exactly this markdown: ![alt text](filename). Use the filenames exactly as listed — a filename you invent renders as a broken image. Leave an image out entirely if it does not earn its place.',
    'Write the alt text yourself. The site renders it as the visible caption under the image, so describe what the image actually shows instead of restating the sentence next to it.',
    '',
    'Images available (JSON) — images sharing a sourcePost were published together and belong together in the article:',
    JSON.stringify(
      photos.map((photo) => ({ filename: photo.filename, sourcePost: photo.sourceUrl }))
    ),
  ];
}

function buildDraftPrompt(
  posts,
  photos = [],
  videos = [],
  relatedExistingPosts = [],
  repoUsage = []
) {
  return [
    'Write a company blog post for Pixel Point\'s "Updates" category, based on the following X posts from Alex Barashkov (CEO). This group of posts is one article topic — if there is more than one post, weave them into one cohesive piece rather than listing them separately.',
    'The article is published under Alex\'s own byline, so he is the narrator. Write as him, not about him: never refer to "Alex", "Alex Barashkov", or "our CEO" in the third person, and never introduce a quote as something he said elsewhere — his posts are your own material, so state it directly.',
    'Preserve his framing: if a post says "I built X," keep it first-person; if it credits the team ("our design process"), keep that framing. Do not force everything into "we."',
    "Don't just reformat the source posts into blog-post shape — write editorially: explain the problem being solved, translate any jargon into plain language, and add a concrete example if it helps a reader with zero context on these posts understand why this matters. The goal is a piece that reads as genuinely worth someone's time, not a tidied-up repost.",
    // The rest of the blog is sentence case ("Taking automated web page
    // screenshots with Puppeteer and Sharp"), but drafts drifted into title
    // case on roughly a third of titles.
    'Write the title and every heading in sentence case, like the rest of this blog: capitalise the first word, and after that only proper nouns, product names, and acronyms. Write "Toolcraft: five creative tools we built to prove AI demos can be more than toys", not "Toolcraft: Five Creative Tools We Built to Prove AI Demos Can Be More Than Toys". Note that AI, Blender, and Novu stay capitalised because of what they are, not because of where they sit in the sentence.',
    '',
    'When the article announces something we built, keep its exact command or package name verbatim in ' +
      'a fenced code block — an install line a reader can copy is the most useful thing an announcement ' +
      'can carry, and paraphrasing it makes it wrong. A code block is for something executable: never ' +
      "put a sentence in one. Commands for someone else's product are not ours to promote, so leave " +
      'those out however prominent they were in the source.',
    'A post\'s "followUps" are the author\'s own replies to it, and are usually where the landing page or repository link was posted. Treat them as part of the same announcement and use those links in the article.',
    'When a source post links to something — a launched page, a repo, a demo — link to it from the article at the point you mention it, using the real URL from the post. Do not describe a thing as launched or shipped without linking it if the link is available.',
    'Where a source post quotes another post, that quoted text is background so you know what was ' +
      "announced — nothing more. It is someone else's launch copy: do not quote it, and do not carry " +
      'over its calls to action, setup instructions, or commands. The article is about our part in the ' +
      'work, so a reader should finish it understanding what we did, not how to sign up for their product.',
    '',
    'Source posts (JSON):',
    JSON.stringify(
      posts.map((p) => ({
        text: p.text,
        url: p.url,
        ...(p.quoted ? { quotedForContext: p.quoted.text } : {}),
        // Follow-up replies by the same author, which is usually where the
        // landing page and repo links live.
        ...(p.thread && p.thread.length ? { followUps: p.thread.map((r) => r.text) } : {}),
      }))
    ),
    ...buildRelatedPostsInstructions(relatedExistingPosts),
    ...buildRepoUsageInstructions(repoUsage),
    ...buildImageInstructions(photos),
    ...buildVideoInstructions(videos),
    '',
    'Respond with JSON: { "title": "...", "summary": "...", "slug": "kebab-case-slug", "body": "markdown body" }',
  ].join('\n');
}

// A drafted body can come back cut off mid-sentence or mid-tag. Stripping the
// broken tag keeps the site building, but publishes an article that stops
// dead — one ended at "It cost me $15 on the Epic Games Store and a few
// million AI tokens to build a web-native grass simulation." with nothing
// after it. A missing post is recoverable; a published half-written one is
// not, so the caller drops it instead.
function looksTruncated(body) {
  const trimmed = body.trimEnd();
  const lastLine = trimmed.split('\n').filter(Boolean).pop() || '';

  // An opening <Video that never closed is the unambiguous case.
  if (/<Video\b/.test(lastLine) && !/<\/Video>$/.test(lastLine)) return true;

  // Otherwise: prose should end on terminal punctuation, a closing tag, a
  // code fence, or a link/emphasis marker. Ending on a bare word or a comma
  // means the model stopped mid-thought.
  return !/([.!?:;"'`)\]]|<\/Video>|```)$/.test(trimmed);
}

async function draftPost({
  qualifyingPosts,
  photos = [],
  videos = [],
  relatedExistingPosts = [],
  repoUsage = [],
  anthropicClient,
}) {
  const draft = await requestJson({
    anthropicClient,
    prompt: buildDraftPrompt(qualifyingPosts, photos, videos, relatedExistingPosts, repoUsage),
    schema: DRAFT_SCHEMA,
  });

  if (looksTruncated(draft.body)) {
    const error = new Error(
      `Draft "${draft.title}" came back truncated — it ends "${draft.body.trimEnd().slice(-60)}". Not publishing a half-written post.`
    );
    // Distinct from a refusal or a credit failure, which must stop the run.
    error.truncated = true;
    throw error;
  }

  return { title: draft.title, summary: draft.summary, slug: draft.slug, body: draft.body };
}

module.exports = { draftPost, buildDraftPrompt, looksTruncated, DRAFT_SCHEMA };
