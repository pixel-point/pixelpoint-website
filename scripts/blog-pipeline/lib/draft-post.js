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

function buildVideoInstructions(videos) {
  if (videos.length === 0) return [];
  return [
    '',
    'These videos come from the source posts. Place each one at the point it illustrates using exactly the markup listed below, copied verbatim on its own line — it is a component, not markdown, and altering the attributes will break the page. Leave a video out if it does not earn its place.',
    '',
    'Videos available (use these lines exactly):',
    ...videos.map(
      (video) =>
        `<Video src="${video.src}" width="${video.width}" height="${video.height}"${
          video.isGif ? ' autoPlay muted loop playsInline' : ' controls muted'
        } poster="./${video.posterFilename}"></Video>`
    ),
  ];
}

function buildImageInstructions(photos) {
  if (photos.length === 0) return [];
  return [
    '',
    'These images come from the source posts and are saved alongside the article. Place each one in the body at the point it illustrates, not collected at the end, using exactly this markdown: ![alt text](filename). Use the filenames exactly as listed — a filename you invent renders as a broken image. Leave an image out entirely if it does not earn its place.',
    'Write the alt text yourself. The site renders it as the visible caption under the image, so describe what the image actually shows instead of restating the sentence next to it.',
    '',
    'Images available (JSON):',
    JSON.stringify(photos.map((photo) => ({ filename: photo.filename }))),
  ];
}

function buildDraftPrompt(posts, photos = [], videos = []) {
  return [
    'Write a company blog post for Pixel Point\'s "Updates" category, based on the following X posts from Alex Barashkov (CEO). This group of posts is one article topic — if there is more than one post, weave them into one cohesive piece rather than listing them separately.',
    'The article is published under Alex\'s own byline, so he is the narrator. Write as him, not about him: never refer to "Alex", "Alex Barashkov", or "our CEO" in the third person, and never introduce a quote as something he said elsewhere — his posts are your own material, so state it directly.',
    'Preserve his framing: if a post says "I built X," keep it first-person; if it credits the team ("our design process"), keep that framing. Do not force everything into "we."',
    "Don't just reformat the source posts into blog-post shape — write editorially: explain the problem being solved, translate any jargon into plain language, and add a concrete example if it helps a reader with zero context on these posts understand why this matters. The goal is a piece that reads as genuinely worth someone's time, not a tidied-up repost.",
    '',
    'Source posts (JSON):',
    JSON.stringify(posts.map((p) => ({ text: p.text, url: p.url }))),
    ...buildImageInstructions(photos),
    ...buildVideoInstructions(videos),
    '',
    'Respond with JSON: { "title": "...", "summary": "...", "slug": "kebab-case-slug", "body": "markdown body" }',
  ].join('\n');
}

async function draftPost({ qualifyingPosts, photos = [], videos = [], anthropicClient }) {
  const draft = await requestJson({
    anthropicClient,
    prompt: buildDraftPrompt(qualifyingPosts, photos, videos),
    schema: DRAFT_SCHEMA,
  });

  return { title: draft.title, summary: draft.summary, slug: draft.slug, body: draft.body };
}

module.exports = { draftPost, buildDraftPrompt, DRAFT_SCHEMA };
