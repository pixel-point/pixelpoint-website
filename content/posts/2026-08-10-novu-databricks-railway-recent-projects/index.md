---
title: 'Novu, Databricks, and Railway: three recent projects and what they have in common'
summary: 'A look at three projects we shipped recently — a new homepage for Novu after four years of working together, a brand and design refresh for the Databricks Developer Portal, and a launch video for Railway delivered in under two weeks — and what each one says about how we work with developer-first companies.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

The last few weeks have been busy, and the work that shipped happens to be a decent cross-section of what we actually do at Pixel Point: a long-running product website partnership, a brand and design project for a developer portal, and a launch video produced against a hard deadline. Three different shapes of work, one audience — developers.

Here's each one, and why I think they're worth more than a screenshot.

## A new homepage for Novu, four years in

Novu just launched its new homepage, and I'm glad to say we've been part of that journey for four years already.

For anyone without context: Novu is notification infrastructure. If you're building a product that needs to send emails, in-app notifications, push, SMS, and Slack messages — and let users choose which of those they want — you either build and maintain that plumbing yourself or you use something like Novu. It's the kind of product where the value is obvious to an engineer in about ten seconds and almost invisible to everyone else, which makes the website a genuinely hard problem.

Four years is a long time in developer tools. In that window a company's positioning usually shifts more than once: the open-source project finds traction, the cloud offering arrives, the ideal customer moves from solo builders to platform teams, and the words that used to land stop landing. A one-off redesign captures a company at a single moment. What we've been doing with Novu is closer to maintaining a living thing — revisiting the story as the product changes, keeping the design system coherent while pages get added, and making sure the site stays fast as it grows.

That continuity is the part I value most. When you've been in the codebase and in the positioning conversations for years, a new homepage isn't a discovery project that starts from zero. You already know which claims the team can defend, which parts of the audience are skeptical, and which pages actually convert. The redesign becomes an editing job rather than an archaeology job.

## The Databricks Developer Portal, and using vibe coding the right way

We also recently wrapped a brand and design project for the Databricks Developer Portal — the place where developers building on the platform go to find SDKs, APIs, guides, and everything else they need to get something running.

<Video src="/x-video/amplify_video/2079181347784884224/vid/avc1/1920x1080/07-M4Z07_7uywyvD.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

One detail about this project is worth pulling out, because it touches a debate happening at basically every company right now.

A lot of teams are currently "vibe coding" their websites — describing what they want to an AI tool and shipping whatever working code comes back, with little review of the structure underneath. It's fast, and it's genuinely useful. It's also how you end up with a site that looks fine in a demo and then falls apart the moment it needs to scale to fifty pages, load on a slow connection, work with a keyboard, or match a brand that a much larger organization has spent years building.

Databricks used vibe coding the right way: mainly for quick prototyping and for communicating the overall page structure and intent.

That distinction matters more than it sounds. Imagine a stakeholder who wants a landing page for the portal organized around three entry points — one for people evaluating the platform, one for people mid-integration, and one for people looking up a specific API. Describing that in a document produces a conversation about wording. Waiting for polished mockups produces a conversation two weeks later. Generating a rough, clickable version in an afternoon produces something you can point at: "this, but the second section is doing too much work." The prototype isn't the deliverable — it's the fastest possible way to get everyone agreeing on the same shape before real design begins.

And then real design begins. Typography that survives long code samples and short marketing headlines. Navigation that still makes sense when the portal doubles in size. Motion that guides attention instead of decorating. Accessibility and performance that hold up under an enterprise review. Visual language consistent with a brand as recognizable as Databricks'. None of that comes out of a prompt, and none of it is optional for a portal that developers will use as a daily reference.

Used as a communication tool, AI removed weeks of ambiguity from the front of this project. Used as a shipping tool, it would have quietly created months of cleanup at the back.

## A launch video for Railway in under two weeks

The third project is a launch video for Railway, and here's the behind-the-scenes look at how it came together — from the initial request to final release in less than two weeks.

<Video src="/x-video/amplify_video/2074843533224103936/vid/avc1/1920x1080/MGgp326un9ZLrYBP.mp4" width="3840" height="2160" controls muted poster="./video-cover-2.jpg"></Video>

Two weeks sounds like a flex, but it's mostly a description of the constraint. Developer platforms don't ship on a media schedule — they ship when the feature is ready, and the announcement goes out that day. A launch video that arrives a month later is no longer a launch video; it's an archive clip. So the real requirement isn't "make something beautiful," it's "make something beautiful that exists on the day the thing goes live."

Meeting that means collapsing the usual sequence. Concept, script, and visual direction get decided nearly together instead of one after another. Feedback happens in a handful of high-signal rounds with people who can actually make decisions, not in an approval chain. And crucially, the team producing the video already understands the product and the audience, so nobody spends the first three days explaining what a deployment is.

That's the same advantage as the Novu partnership, just compressed into fourteen days. Context is the thing that makes speed possible.

## The thread

A long-term website partnership, a brand and design project for a developer portal, and a two-week video production don't look much alike on paper. What they share is an audience that notices details, distrusts marketing language, and forms an opinion about your product based on how carefully your website loads.

We build for that audience on purpose. If you're working on something in this space and want the same kind of attention paid to it, [get in touch](/contact-us) — we'd be glad to talk.

