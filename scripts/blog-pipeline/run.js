#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const Anthropic = require('@anthropic-ai/sdk');
const { getUserId, fetchRecentPosts } = require('./lib/fetch-posts');
const { filterCandidates } = require('./lib/filter-posts');
const { classifyAndGroupPosts } = require('./lib/classify-posts');
const { draftPost } = require('./lib/draft-post');
const { readExistingPosts } = require('./lib/read-existing-posts');
const { readPendingPosts } = require('./lib/read-pending-posts');
const { readAuthorHandle } = require('./lib/read-author-handle');
const { publishPost } = require('./lib/publish-post');
const { collectPhotos, collectVideos, dedupeVideosByPoster } = require('./lib/post-media');
const { openDraftPr } = require('./lib/git-pr');
const { buildPrBody } = require('./lib/pr-body');
const { notifySlack, buildDraftsMessage } = require('./lib/notify-slack');
const { usageSummary } = require('./lib/anthropic-json');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
// Every run saves what it drafted so a later one can be replayed for free.
// Iterating on publishing or rendering should not cost an API call, and it
// should certainly not open a pull request.
const DRAFT_CACHE_PATH = path.join(REPO_ROOT, '.blog-pipeline-drafts.json');
const COVER_IMAGE_PATH = path.join(REPO_ROOT, 'static', 'blog-updates-cover.png');
const AUTHOR_NAME = 'Alex Barashkov';
const LOOKBACK_DAYS = 35;

function assertRequiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

// Collaborators are injected so the wiring itself can be tested. This file is
// where a missing `await` on openDraftPr shipped — the Slack message read
// "ready for review: undefined" — which is exactly the class of defect an
// orchestration test catches and a unit test on any single module cannot.
const defaultDeps = {
  getUserId,
  fetchRecentPosts,
  filterCandidates,
  readExistingPosts,
  readPendingPosts,
  readAuthorHandle,
  classifyAndGroupPosts,
  draftPost,
  publishPost,
  openDraftPr,
  notifySlack,
  collectPhotos,
  collectVideos,
  dedupeVideosByPoster,
  // Overridable so tests never write into the real repo.
  draftCachePath: DRAFT_CACHE_PATH,
};

async function main(overrides = {}) {
  const {
    getUserId,
    fetchRecentPosts,
    filterCandidates,
    readExistingPosts,
    readPendingPosts,
    readAuthorHandle,
    classifyAndGroupPosts,
    draftPost,
    publishPost,
    openDraftPr,
    notifySlack,
    collectPhotos,
    collectVideos,
    dedupeVideosByPoster,
    draftCachePath,
  } = { ...defaultDeps, ...overrides };

  const dryRun = process.argv.includes('--dry-run');
  // Writes the post folders but stops there — no branch, no commit, no PR, no
  // Slack. This is the mode for previewing real output with `gatsby develop`.
  const localOnly = process.argv.includes('--local');
  // Reuses the last run's drafts instead of calling the X and Anthropic APIs.
  const replay = process.argv.includes('--replay');
  // Drafts awaiting review legitimately suppress a re-run of the same month,
  // which is the point — but it also means you cannot test while a draft PR is
  // open. This opts out for local iteration only.
  const ignorePending = process.argv.includes('--ignore-pending');
  const writesNothing = dryRun;
  const opensPr = !dryRun && !localOnly;

  // A dry run stops after drafting — it never opens a PR or posts to Slack —
  // so requiring a webhook it will not use just blocks local testing.
  assertRequiredEnv(
    // A replay talks to neither API, so it needs no credentials at all.
    replay
      ? []
      : !opensPr
      ? ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY']
      // GH_TOKEN is what `gh pr create` authenticates with. Without it the run
      // fails only after posts are written, committed and a branch is pushed,
      // leaving an orphan branch and no PR.
      : ['X_API_BEARER_TOKEN', 'ANTHROPIC_API_KEY', 'SLACK_WEBHOOK_URL', 'GH_TOKEN']
  );

  const { X_API_BEARER_TOKEN, ANTHROPIC_API_KEY, SLACK_WEBHOOK_URL } = process.env;

  if (replay) {
    if (!fs.existsSync(draftCachePath)) {
      throw new Error(`No cached drafts at ${draftCachePath} — run once without --replay first.`);
    }
    const cached = JSON.parse(fs.readFileSync(draftCachePath, 'utf8'));
    console.log(`Replaying ${cached.drafted.length} cached draft(s) from ${cached.generatedAt}.`);
    return publishAndMaybeOpenPr({
      drafted: cached.drafted,
      skipped: cached.skipped,
      opensPr,
      deps: { publishPost, openDraftPr, notifySlack },
      webhookUrl: SLACK_WEBHOOK_URL,
    });
  }

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const username = readAuthorHandle(REPO_ROOT, AUTHOR_NAME);
  const userId = await getUserId({ username, bearerToken: X_API_BEARER_TOKEN });

  const sinceISODate = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const posts = await fetchRecentPosts({
    userId,
    // Lets the fetch use full-archive search to find self-replies, which is
    // ~7 reads instead of ~300 paging the timeline.
    username,
    bearerToken: X_API_BEARER_TOKEN,
    sinceISODate,
  });

  const candidates = filterCandidates(posts);
  // Posts awaiting review count as covered: without them a run whose previous
  // PR is still open re-drafts the same topics against an empty comparison.
  const pendingPosts = ignorePending ? [] : readPendingPosts({ repoRoot: REPO_ROOT });
  const existingPosts = [...readExistingPosts(REPO_ROOT), ...pendingPosts];
  if (pendingPosts.length > 0) {
    console.log(`Including ${pendingPosts.length} post(s) from open draft PRs in the dedup check.`);
  }
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
    if (opensPr) {
      await notifySlack({ webhookUrl: SLACK_WEBHOOK_URL, text: 'No qualifying posts this month — skipping.' });
    }
    return;
  }

  // Filenames are assigned before drafting so the model can be given the exact
  // names to reference, rather than inventing them and needing reconciliation.
  const drafted = [];
  for (const { posts: group, relatedExistingPosts } of groups) {
    const photos = collectPhotos(group);
    const videos = await dedupeVideosByPoster({ videos: collectVideos(group) });
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

  if (writesNothing) {
    console.log(`--- DRY RUN: ${drafts.length} drafted post(s) (nothing written or published) ---`);
    console.log(JSON.stringify(drafts, null, 2));
    return;
  }

  // Cached before publishing so a --replay can redo everything downstream —
  // publishing, media, frontmatter, the PR body — without paying for drafting
  // again or opening a pull request to look at the result.
  fs.writeFileSync(
    draftCachePath,
    JSON.stringify({ generatedAt: new Date().toISOString(), drafted, skipped }, null, 2)
  );

  return publishAndMaybeOpenPr({
    drafted,
    skipped,
    opensPr,
    deps: { publishPost, openDraftPr, notifySlack },
    webhookUrl: SLACK_WEBHOOK_URL,
  });
}

// Shared by a normal run and a --replay: everything after drafting.
async function publishAndMaybeOpenPr({ drafted, skipped, opensPr, deps, webhookUrl }) {
  const { publishPost, openDraftPr, notifySlack } = deps;
  const drafts = drafted.map((item) => item.draft);
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

  if (!opensPr) {
    console.log('');
    console.log(`${postDirs.length} post(s) written locally. No branch, PR, or Slack message.`);
    console.log('Preview with:  npx gatsby develop');
    console.log('Discard with:  git clean -fd content/posts');
    return;
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

  await notifySlack({ webhookUrl, text: buildDraftsMessage({ drafts, prUrl, skipped }) });
}

async function reportFailure(err) {
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
}

if (require.main === module) {
  main().catch(reportFailure);
}

module.exports = { main };
