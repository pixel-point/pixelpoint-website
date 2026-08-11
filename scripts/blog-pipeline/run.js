#!/usr/bin/env node
const path = require('node:path');
const Anthropic = require('@anthropic-ai/sdk');
const { getUserId, fetchRecentPosts } = require('./lib/fetch-posts');
const { filterCandidates } = require('./lib/filter-posts');
const { classifyAndGroupPosts } = require('./lib/classify-posts');
const { draftPost } = require('./lib/draft-post');
const { readExistingPosts } = require('./lib/read-existing-posts');
const { readAuthorHandle } = require('./lib/read-author-handle');
const { publishPost } = require('./lib/publish-post');
const { collectPhotos, collectVideos } = require('./lib/post-media');
const { openDraftPr } = require('./lib/git-pr');
const { buildPrBody } = require('./lib/pr-body');
const { notifySlack, buildDraftsMessage } = require('./lib/notify-slack');
const { usageSummary } = require('./lib/anthropic-json');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const COVER_IMAGE_PATH = path.join(REPO_ROOT, 'static', 'blog-updates-cover.png');
const AUTHOR_NAME = 'Alex Barashkov';
const LOOKBACK_DAYS = 35;

function assertRequiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  // A dry run stops after drafting — it never opens a PR or posts to Slack —
  // so requiring a webhook it will not use just blocks local testing.
  assertRequiredEnv(
    dryRun
      ? ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY']
      // GH_TOKEN is what `gh pr create` authenticates with. Without it the run
      // fails only after posts are written, committed and a branch is pushed,
      // leaving an orphan branch and no PR.
      : ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY', 'SLACK_WEBHOOK_URL', 'GH_TOKEN']
  );

  const { X_API_BEARER_TOKEN, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({ userId, bearerToken: X_API_BEARER_TOKEN, sinceISODate });

  const candidates = filterCandidates(posts);
  const existingPosts = readExistingPosts(REPO_ROOT);
  const { groups, skipped } = await classifyAndGroupPosts({
    candidates,
    existingPosts,
    anthropicClient,
  });

  for (const { posts, existingPostTitle } of skipped) {
    console.log(
      `Skipped ${posts.length} post(s) as already covered by "${existingPostTitle || 'an existing post'}".`
    );
  }

  if (groups.length === 0) {
    console.log('No qualifying posts this month — skipping.');
    if (!dryRun) {
      await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: 'No qualifying posts this month — skipping.' });
    }
    return;
  }

  // Filenames are assigned before drafting so the model can be given the exact
  // names to reference, rather than inventing them and needing reconciliation.
  const drafted = [];
  for (const { posts: group, relatedExistingPosts } of groups) {
    const photos = collectPhotos(group);
    const videos = collectVideos(group);
    drafted.push({
      draft: await draftPost({
        qualifyingPosts: group,
        photos,
        videos,
        relatedExistingPosts,
        anthropicClient,
      }),
      photos,
      videos,
    });
  }
  const drafts = drafted.map((item) => item.draft);

  console.log(`Model usage: ${usageSummary()}`);

  if (dryRun) {
    console.log(`--- DRY RUN: ${drafts.length} drafted post(s) (nothing written or published) ---`);
    console.log(JSON.stringify(drafts, null, 2));
    return;
  }

  const publishDate = new Date().toISOString().slice(0, 10);
  const postDirs = [];
  for (const { draft, photos, videos } of drafted) {
    const published = await publishPost({
      draft,
      publishDate,
      repoRoot: REPO_ROOT,
      coverImageSourcePath: COVER_IMAGE_PATH,
      photos,
      videos,
    });
    console.log(
      `Wrote ${published.folderName} with ${published.photos.length} image(s) and ${published.videos.length} video(s).`
    );
    postDirs.push(published.postDir);
  }

  const runId = process.env.GITHUB_RUN_ID || Date.now().toString();
  const branchName = `blog-draft/${publishDate.slice(0, 7)}-${runId}`;
  const prTitle =
    drafts.length === 1
      ? `Updates: ${drafts[0].title}`
      : `Updates: ${drafts.length} new posts for ${publishDate.slice(0, 7)}`;
  const { prUrl } = await openDraftPr({
    repoRoot: REPO_ROOT,
    branchName,
    postDirs,
    prTitle,
    prBody: buildPrBody({ drafts, skipped }),
  });

  await notifySlack({
    webhookUrl: SLACK_WEBHOOK_URL,
    text: buildDraftsMessage({ drafts, prUrl, skipped }),
  });
}

main().catch(async (err) => {
  console.error(err);
  // No webhook configured (a dry run, typically) — the console error above is
  // the whole report, so don't bury it under a second failure from posting to
  // an undefined URL.
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await notifySlack({
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        text: `Monthly blog draft pipeline failed: ${err.message}`,
      });
    } catch (notifyErr) {
      console.error('Also failed to notify Slack:', notifyErr);
    }
  }
  process.exitCode = 1;
});
