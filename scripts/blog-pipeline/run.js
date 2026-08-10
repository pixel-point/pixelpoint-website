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
const { openDraftPr } = require('./lib/git-pr');
const { notifySlack } = require('./lib/notify-slack');

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
  assertRequiredEnv(['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY', 'SLACK_WEBHOOK_URL']);

  const dryRun = process.argv.includes('--dry-run');
  const { X_API_BEARER_TOKEN, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({ userId, bearerToken: X_API_BEARER_TOKEN, sinceISODate });

  const candidates = filterCandidates(posts);
  const existingPosts = readExistingPosts(REPO_ROOT);
  const rawGroups = await classifyAndGroupPosts({ candidates, existingPosts, anthropicClient });
  // classifyAndGroupPosts can return a group that ends up empty (e.g. the model
  // returns a hallucinated/unknown post id that the id-to-post mapping filters
  // out), so drop any empty group before it reaches drafting.
  const groups = rawGroups.filter((group) => group.length > 0);

  if (groups.length === 0) {
    console.log('No qualifying posts this month — skipping.');
    if (!dryRun) {
      await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: 'No qualifying posts this month — skipping.' });
    }
    return;
  }

  const drafts = [];
  for (const group of groups) {
    drafts.push(await draftPost({ qualifyingPosts: group, anthropicClient }));
  }

  if (dryRun) {
    console.log(`--- DRY RUN: ${drafts.length} drafted post(s) (nothing written or published) ---`);
    console.log(JSON.stringify(drafts, null, 2));
    return;
  }

  const publishDate = new Date().toISOString().slice(0, 10);
  const postDirs = drafts.map(
    (draft) =>
      publishPost({
        draft,
        publishDate,
        repoRoot: REPO_ROOT,
        coverImageSourcePath: COVER_IMAGE_PATH,
      }).postDir
  );

  const runId = process.env.GITHUB_RUN_ID || Date.now().toString();
  const branchName = `blog-draft/${publishDate.slice(0, 7)}-${runId}`;
  const prTitle =
    drafts.length === 1
      ? `Updates: ${drafts[0].title}`
      : `Updates: ${drafts.length} new posts for ${publishDate.slice(0, 7)}`;
  const { prUrl } = openDraftPr({
    repoRoot: REPO_ROOT,
    branchName,
    postDirs,
    prTitle,
    prBody: [
      'Auto-generated monthly Updates draft(s). Review the Vercel preview(s) before merging.',
      '',
      ...drafts.map((draft) => `- ${draft.title}`),
    ].join('\n'),
  });

  const summary =
    drafts.length === 1
      ? `New monthly blog draft ready for review: ${prUrl}`
      : `${drafts.length} new monthly blog drafts ready for review: ${prUrl}`;
  await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: summary });
}

main().catch(async (err) => {
  console.error(err);
  try {
    await notifySlack({
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      text: `Monthly blog draft pipeline failed: ${err.message}`,
    });
  } catch (notifyErr) {
    console.error('Also failed to notify Slack:', notifyErr);
  }
  process.exitCode = 1;
});
