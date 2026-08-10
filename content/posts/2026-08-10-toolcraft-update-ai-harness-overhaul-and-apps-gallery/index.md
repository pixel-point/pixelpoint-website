---
title: 'Toolcraft update: a rebuilt AI harness and an apps gallery for community tools'
summary: 'The new version of Toolcraft ships a major overhaul of the AI harness — fewer tokens burned and less time re-testing performance on repeat runs — plus a batch of component fixes. And if you''ve built something with it, you can now submit it: an apps gallery with a community section goes live next week.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

A new version of Toolcraft is out, and the headline change is under the hood: I rewrote most of the AI harness. There are also a handful of smaller component improvements and bug fixes, but the harness is where you'll feel the difference — it should consume fewer tokens and spend noticeably less time re-testing performance on subsequent runs.

If you're arriving cold, Toolcraft is the starter kit [I introduced earlier](/blog/how-to-craft-personal-design-tools-with-toolcraft) for building small, personal design tools with AI — the kind of single-purpose generator you'd otherwise never get around to making because it isn't worth a week of work.

## What the "harness" actually is

When you ask a coding agent to build something, the model isn't the whole system. Around it sits a layer of scaffolding: the instructions it starts from, the project conventions it's told to respect, the checks it runs to confirm the thing it just wrote actually works, and the loop it goes through when a check fails. That layer is the harness. It's the difference between an agent that produces plausible-looking code and one that produces a tool you can open and use.

Toolcraft's harness has a particular job. These tools are generative and visual — they render to canvas, animate, and often push a lot of pixels per frame — so it isn't enough to check that the code compiles. The harness also verifies the output renders and that it renders fast enough to be usable.

The original version did that honestly but expensively. It re-derived a lot of context on every run and re-ran the full performance pass each time, even when nothing about the rendering path had changed. That's fine once. It's tedious on the fifth iteration of "make the grid tighter, and can the noise be softer."

<Video src="/x-video/amplify_video/2083512258513027072/vid/avc1/1440x1080/QaAMFW64yTsayPOo.mp4" width="1440" height="1080" controls muted poster="./video-cover-1.jpg"></Video>

## Fewer tokens, shorter loops

Two practical consequences of the overhaul.

**Lower token usage.** Tokens are the units models are billed and rate-limited by — roughly, chunks of text going in and coming out. A harness that re-explains the whole project on every turn burns them fast. The new one is leaner about what it puts in front of the model and when, so a session of small tweaks costs less than it used to.

**Faster follow-up runs.** Say you've asked for a tool that tiles an SVG shape into a repeating pattern with adjustable spacing and rotation. First run: the harness builds it, renders it, checks the frame timing, fixes what's slow. Then you ask for a colour control. Previously that second request dragged the entire performance pass along with it. Now the harness is smarter about what genuinely needs re-testing, so the iteration you actually care about arrives sooner.

The net effect is that Toolcraft feels more like a design conversation and less like waiting on a build server.

<Video src="/x-video/amplify_video/2083512352150802432/vid/avc1/1440x1080/7ZOuEl0AsF3vEj5m.mp4" width="1440" height="1080" controls muted poster="./video-cover-2.jpg"></Video>

## Component improvements and fixes

Alongside the harness work, this release includes several smaller improvements to the bundled components and a round of bug fixes. Nothing dramatic on its own — the sort of sanding that removes the small frictions you stop noticing only once they're gone.

<Video src="/x-video/amplify_video/2083512425114972160/vid/avc1/1440x1080/elsXOt7myIXd1FrV.mp4" width="1440" height="1080" controls muted poster="./video-cover-3.jpg"></Video>

## An apps gallery, with room for yours

The other piece of news: we're launching an apps gallery on the website next week, and I want a community section in it.

If you've built a tool with Toolcraft — a pattern generator, a gradient mesh explorer, a type-on-a-path playground, whatever odd single-purpose thing you needed — you can submit it for inclusion. There's no bar around polish or ambition. Personal tools are interesting precisely because they're specific, and the fastest way for someone to understand what Toolcraft is for is to see twenty things other people made with it.

<Video src="/x-video/amplify_video/2083512454131159040/vid/avc1/1440x1080/J_YeA5bxcTy_-OFK.mp4" width="1440" height="1080" controls muted poster="./video-cover-4.jpg"></Video>

So: update to the new version, spend a cheaper afternoon building something, and send it over. I'd like the gallery to open with company.

