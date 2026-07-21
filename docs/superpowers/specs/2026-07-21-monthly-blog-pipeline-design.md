# Monthly blog pipeline: X posts → "Updates" category

## Problem

Alex (CEO) regularly posts design-process notes, product announcements, and
release videos on X (`@alex_barashkov`). None of that reaches
pixelpoint.io/blog unless someone manually turns it into a post, so the blog
has gone stale even though there's a steady stream of real content already
being written — just on the wrong platform.

## Goal

Once a month, automatically turn his qualifying X posts into a single blog
post in a new **Updates** category — preserving whether he framed it as his
own work or the team's — and get it in front of him as a reviewable draft,
without ever publishing anything without his sign-off.

## Non-goals

- Real-time posting (this is a monthly batch, not a live feed)
- Auto-classifying/filtering by scraping (we use the official X API)
- Generating a custom cover image per post (out of scope for v1 — see Cover
  image below)
- Touching his personal posting habits or requiring him to change how he
  posts on X

## One-time setup (before the pipeline goes live, not part of the recurring job)

1. Add `'Updates'` to `BLOG_CATEGORIES` in
   [`src/constants/blog.js`](../../../src/constants/blog.js) (currently
   `['Development', 'Design', 'Misc']`).
2. Add one fixed cover image asset for all auto-generated posts (see Cover
   image below).
3. Provision secrets in the repo's GitHub Actions settings: X API
   credentials, an LLM API key (for filtering/drafting), and a Slack webhook
   URL.

## Architecture

A single GitHub Actions workflow in this repo, triggered monthly by cron
(plus a manual `workflow_dispatch` trigger for on-demand testing). One job
runs the whole pipeline start to finish and exits — no separate service, no
long-running infra.

```
cron (monthly) ─▶ GitHub Action job
                     ├─ 1. Fetch @alex_barashkov's recent posts (X API)
                     ├─ 2. Filter to real candidates (heuristics + LLM)
                     ├─ 3. Check against existing blog posts (dedup)
                     ├─ 4. If nothing qualifies → Slack "nothing found" → stop
                     ├─ 5. Draft the post in company voice (LLM)
                     ├─ 6. Commit to a new branch, open a PR
                     └─ 7. Slack message with the PR link
                            (Vercel's GitHub bot auto-comments the preview
                             link on that PR — no separate Vercel API call
                             needed)
```

## Components

- **Fetcher** — calls the X API for posts from the last ~35 days (small
  overlap buffer over the prior run), excluding replies/retweets at the
  query level. Reads the handle from the `twitterUrl` field already present
  for Alex's entry in
  [`content/posts/post-authors.json`](../../../content/posts/post-authors.json)
  rather than hardcoding it elsewhere.
- **Filter** — drops posts too short/thin to be real content, then sends
  survivors to an LLM to keep only genuine design-process/announcement/
  release posts (catches quote-tweets or borderline cases the query-level
  exclude might miss).
- **Dedup check** — in the same LLM call, passes the list of existing post
  titles/summaries (read from `content/posts/*/index.md` frontmatter) so it
  skips anything already covered. This is a confirmed real case: the June
  2026 Toolcraft launch already has its own post at
  `content/posts/2026-06-30-how-to-craft-personal-design-tools-with-toolcraft/`,
  so a naive pipeline would have re-announced it.
- **Drafter** — generates the MDX body plus frontmatter (`title`, `summary`,
  `author: Alex Barashkov`, `cover`, `category: Updates`), preserving the
  ownership framing from the source posts rather than forcing a blanket
  rewrite: if he says "I built X," the draft stays first-person (the post is
  already bylined to him, so this reads naturally); if he says "our design
  process" or credits the team, the draft keeps that team framing. The LLM
  prompt carries this rule explicitly rather than defaulting to one voice.
- **Publisher** — creates `content/posts/<YYYY-MM-DD>-<slug>/index.md`
  (matching the existing folder-per-post convention, date-prefixed slug so
  `getBlogPostDateFromSlug` keeps working), copies in the fixed default
  cover image, commits to branch `blog-draft/<YYYY-MM>`, pushes, opens a PR
  against `main`.
- **Notifier** — posts one Slack message: either the PR link, or "No
  qualifying posts this month — skipping."

## Cover image

Every post requires a `cover` image (used for `gatsbyImageData` on the blog
listing) — this is the one piece an LLM can't produce well. For v1, every
auto-generated post reuses one fixed "Updates" branded cover image, copied
into the new post's folder as `cover.png`. If a given month's release
deserves a custom cover, that can be swapped in manually during PR review
before merge — the pipeline itself never tries to generate one.

## Data flow (monthly run, step by step)

1. Cron fires (e.g. 1st of each month), or triggered manually via
   `workflow_dispatch`.
2. Fetch posts from the last ~35 days via the X API, excluding
   replies/retweets at the query level.
3. Run heuristic filter (drop anything too short/thin).
4. Send survivors + existing post titles/summaries to the LLM in one call —
   it returns which posts qualify *and* aren't already covered.
5. If nothing qualifies → Slack: "No qualifying posts this month —
   skipping." → job ends here.
6. Otherwise, LLM drafts the post body + frontmatter in company voice.
7. Create branch `blog-draft/<YYYY-MM>`, write the post folder (`index.md` +
   fixed cover image), commit, push.
8. Open a PR against `main`.
9. Slack message with the PR link.
10. Alex reviews the Vercel preview (auto-linked inside the PR by Vercel's
    bot), gives an informal thumbs-up outside GitHub; the developer merges.

## Error handling

- X API call fails (auth/rate-limit/network) → job fails loudly with a Slack
  message like "Monthly blog draft failed at the fetch step — check the
  Action logs," rather than failing silently. Same pattern for the LLM call
  and the git/PR step.
- "No qualifying posts" is *not* an error — it's the expected quiet-month
  outcome (step 5 above).
- No dedup needed against the job's own prior runs: each run creates a
  uniquely-named branch (`blog-draft/<YYYY-MM>`), so even if last month's PR
  is still unreviewed, this month's run just opens another one — no
  collision, just a visible backlog if approvals lag.

## Testing / validation

- The script is broken into isolated functions (fetch / filter+dedup /
  draft / publish), so each can be unit-tested with canned input (e.g., feed
  a fixed list of fake posts into the filter step and assert what survives)
  without hitting real APIs.
- A `--dry-run` flag runs the whole thing locally against the real X API and
  prints the filtered posts + drafted post to the terminal, without
  creating a branch, PR, or Slack message — for sanity-checking a month's
  output before the schedule is ever turned on.
- The `workflow_dispatch` trigger also allows running the *real* end-to-end
  flow (including opening a real PR) on demand, instead of waiting a month
  between test cycles.

## Open items deferred past v1

- Per-post custom cover images (manual swap-in during review is the
  workaround for now)
- Automating the X API cost/volume monitoring (expected cost is well under
  $1/month at this volume, so not worth building alerting for yet)
