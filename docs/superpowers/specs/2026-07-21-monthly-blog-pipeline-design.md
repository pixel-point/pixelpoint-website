# Monthly blog pipeline: X posts → "Updates" category

## Problem

Alex (CEO) regularly posts design-process notes, product announcements, and
release videos on X (`@alex_barashkov`). None of that reaches
pixelpoint.io/blog unless someone manually turns it into a post, so the blog
has gone stale even though there's a steady stream of real content already
being written — just on the wrong platform.

## Goal

Once a month, automatically turn his qualifying X posts into one or more blog
posts in a new **Updates** category — preserving whether he framed it as his
own work or the team's — and get it in front of him as a reviewable draft,
without ever publishing anything without his sign-off. A month with one big
story (e.g. a major project) and several small updates should produce a
standalone post for the big story and one bundled post for the rest, not one
post trying to cover everything.

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
                     ├─ 2. Drop near-empty one-liners (cheap length check)
                     ├─ 3. LLM: classify, dedup against existing posts, and
                     │      group survivors into one or more article topics
                     ├─ 4. If nothing qualifies → Slack "nothing found" → stop
                     ├─ 5. Draft one post per group, editorial style (LLM)
                     ├─ 6. Commit all new post folders to one branch, open one PR
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
- **Filter** — drops only near-empty one-liners (a cheap length check, just
  enough to skip obvious noise like "People are having fun with Toolcraft"
  before spending an LLM call on it). Substance is *not* judged here — a
  short-but-real post (e.g. a two-sentence client-project note) must survive
  this step and reach the classify step below, which is the actual quality
  gate.
- **Classify + dedup + group** — one LLM call that: (1) keeps only posts
  that would stand alone as something worth reading for someone with zero
  context on Alex's X feed — not just "on topic," but genuinely informative
  without the original thread; (2) includes his personal side projects
  (e.g. an open-source tool he built solo) since those still reflect the
  team's work and expertise, but excludes opinion/thought-leadership essays
  not tied to a specific project, at least for v1; (3) checks survivors
  against existing post titles/summaries (read from `content/posts/*/index.md`
  frontmatter) and drops anything already covered — confirmed real case: the
  June 2026 Toolcraft launch already has its own post at
  `content/posts/2026-06-30-how-to-craft-personal-design-tools-with-toolcraft/`,
  so a naive pipeline would have re-announced it; (4) groups whatever
  survives into one or more article topics — a single substantial story
  (e.g. a major open-source release) becomes its own group, several smaller
  updates get grouped into one bundle.
- **Drafter** — runs once per group from the step above, generating the MDX
  body plus frontmatter (`title`, `summary`, `author: Alex Barashkov`,
  `cover`, `category: Updates`) for that group. Two rules carried explicitly
  in the prompt: (1) preserve the source's ownership framing rather than
  forcing a blanket rewrite — "I built X" stays first-person (the post is
  already bylined to him, so this reads naturally), "our design process"
  keeps that team framing; (2) write editorially, not as a transcription —
  add the context a reader unfamiliar with the original posts would need
  (what problem this solves, plain-language explanation of any jargon, a
  concrete example if useful), rather than reformatting the source text in
  its original order. See "Content quality bar" below for why this rule
  exists.
- **Publisher** — for each drafted group, creates
  `content/posts/<YYYY-MM-DD>-<slug>/index.md` (matching the existing
  folder-per-post convention, date-prefixed slug so `getBlogPostDateFromSlug`
  keeps working) and copies in the fixed default cover image. All of a run's
  post folders are committed together to one branch (`blog-draft/<YYYY-MM>`),
  which is pushed as a single PR against `main` — even in a multi-post month,
  Alex reviews one PR, not several.
- **Notifier** — posts one Slack message: either the PR link (mentioning how
  many posts it contains), or "No qualifying posts this month — skipping."

## Content quality bar

Alex's main concern reviewing this idea: some source posts are thin enough
that turning them into a blog post would read as filler — nothing worth a
reader's time. A manual dry run against real June 2026 posts confirmed this
is real (several one-liners like "People are having fun with Toolcraft" or
"Testing design capabilities of GPT 5.6 Sol" carry no standalone content),
and also surfaced a second-order version of the same problem: even a
qualifying post, drafted as a close paraphrase of the source tweet, doesn't
add anything a reader couldn't get from the tweet itself.

Two design decisions address this directly:

- The classify step's bar is "would this stand alone as worth reading for
  someone with no X context," not just "is this on-topic." This is a higher
  bar than length or topic-matching alone, and is why the length-based
  filter step was scaled back to just catching near-empty one-liners rather
  than trying to judge substance.
- The draft step is explicitly instructed to write editorially — explaining
  the problem being solved, translating jargon, adding a concrete example
  where useful — rather than reorganizing the source posts' own sentences.
  This is a real trade-off worth remembering: an editorial rewrite reads
  better for an outside audience but sounds less like Alex's own voice than
  a close paraphrase would. If the blog's appeal partly rests on posts
  sounding authentically like him, this is worth revisiting after a few
  real posts go out.

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
3. Drop near-empty one-liners (cheap length check only, not a substance
   judgment).
4. Send survivors + existing post titles/summaries to the LLM in one call —
   it returns which posts qualify (stand-alone-for-an-outsider bar, dedup'd
   against existing posts) *and* how they group into one or more article
   topics.
5. If nothing qualifies → Slack: "No qualifying posts this month —
   skipping." → job ends here.
6. Otherwise, for each group: LLM drafts the post body + frontmatter,
   editorially (not a reformatted transcription), preserving I/we framing
   from the source.
7. Create branch `blog-draft/<YYYY-MM>`, write every group's post folder
   (`index.md` + fixed cover image), commit, push.
8. Open one PR against `main` containing all of the run's post folders.
9. Slack message with the PR link.
10. Alex reviews the Vercel preview(s) (auto-linked inside the PR by
    Vercel's bot), gives an informal thumbs-up outside GitHub; the developer
    merges.

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

- The script is broken into isolated functions (fetch / length-filter /
  classify+dedup+group / draft / publish), so each can be unit-tested with
  canned input (e.g., feed a fixed list of fake posts into the length filter
  and assert what survives) without hitting real APIs.
- A `--dry-run` flag runs the whole thing locally against the real X API and
  prints the qualifying groups + drafted posts to the terminal, without
  creating a branch, PR, or Slack message — for sanity-checking a month's
  output before the schedule is ever turned on. This is also how the
  classify/draft prompts were validated against real June 2026 posts before
  any code was written (see "Content quality bar" above).
- The `workflow_dispatch` trigger also allows running the *real* end-to-end
  flow (including opening a real PR) on demand, instead of waiting a month
  between test cycles.

## Open items deferred past v1

- Per-post custom cover images (manual swap-in during review is the
  workaround for now)
- Automating the X API cost/volume monitoring (expected cost is well under
  $1/month at this volume, so not worth building alerting for yet)
- **Rehosting video off `video.twimg.com`.** Media from the source posts now
  reaches the article: photos are downloaded into the post folder and
  referenced as `![alt](file)`, and video renders through the site's `<Video>`
  component. A survey of 35 days of posts found no author-supplied alt text on
  any of 42 media items, so the model writes all of it.

  Video is **proxied** rather than rehosted: the pipeline has no write access
  to the `pixel-point-website` S3 bucket that existing posts use. It cannot be
  linked directly either — X returns **403 for any request carrying a Referer
  from another domain**, browsers always send one, and `referrerPolicy` is not
  honoured on `<video>`. So `src` points at `/x-video/...`, a rewrite in
  `vercel.json` that fetches server-side and therefore without the browser's
  Referer, alongside the `/aval` and `/api` proxies already there. The upstream
  URLs are still not contractually stable, so a published post's video can stop
  playing later with no warning and no build failure. The poster frame is downloaded locally, so a dead link
  degrades to a still image rather than an empty box, and the PR checklist asks
  the reviewer to play each video before merging.

  Fixing this properly means S3 (or equivalent) write credentials for the
  pipeline, at which point only `collectVideos` changes — it would upload the
  chosen mp4 and emit the hosted URL instead of the twimg one. Everything
  downstream already works.
