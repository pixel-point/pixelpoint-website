---
title: 'Introducing Aval: An Open Source Format for Interactive Video on the Web'
summary: 'I built Aval, a new open source format for interactive video in the browser — with a built-in state machine, frame-accurate transitions, and packed alpha transparency. Here''s the problem it solves, how it works, and what has landed since launch.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

I've been dreaming about this technology for years, and last week I finally shipped a first version of it. It's called **Aval**: a new open source format for interactive video on the web, with a built-in state machine, frame-accurate transitions, and packed alpha transparency.

Here's what it looks like in practice.

<Video src="https://video.twimg.com/amplify_video/2077405925183279104/vid/avc1/3840x2160/cPmxGScXFcFhivSb.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## The problem: video on the web is a rectangle that plays start to finish

At Pixel Point we build a lot of marketing sites for developer tools, and we keep hitting the same wall. A designer hands over a beautiful 3D render — a device that opens, a product that assembles itself, a mechanism that reacts when you click a control. Then we have to figure out how to put it on a page.

The options are all bad in a specific way:

- **A GIF.** Huge file, terrible color, no interactivity, and it just loops forever.
- **An MP4.** Great compression, but it's an opaque rectangle. You can't put it over a gradient background or let the page show through the shape of the object. Transparent video is technically possible in some browsers, but support is a maze: HEVC with alpha in Safari, VP9 with alpha in Chrome, and nothing that works everywhere from a single file.
- **Lottie or SVG animation.** Fully interactive and tiny, but you can't render photoreal 3D through it. Your designer's beautiful render doesn't survive the trip.
- **A pile of separate video files plus JavaScript.** This is what people actually do. One clip for "idle," one for "opening," one for "open," one for "closing." Then you write glue code to swap `<video>` elements at the right moment, and users see a flash, a stutter, or a frame of the wrong state every single time. Anyone who has tried this knows the feeling: it looks perfect in the demo and falls apart on a real device.

What we actually wanted was a video that behaves like a UI component: it has states, it knows how to get from one state to another, and it can be shaped like the object it shows rather than the box it lives in.

## What Aval does

Aval is a container format (`.avl`), a compiler that produces it, and a runtime that plays it in the browser. Three ideas do the heavy lifting.

**A built-in state machine.** Instead of shipping loose clips and writing playback logic by hand, you declare states and the transitions between them inside the file itself. "Idle" loops. Clicking moves it to "opening," which plays once and lands in "open." The states and transitions travel with the asset, so the video knows its own behavior and your application just says which state it wants. If you've used a state machine in animation tooling before, the mental model is the same — this is that idea, applied to real video frames.

**Frame-accurate transitions.** This is the part that makes it feel like software instead of media. When Aval switches from one state to another, it switches on the exact frame, with no gap, no flash of the previous state, and no reload. That's only possible because playback isn't handed off to a `<video>` element and hoped for the best — the runtime decodes and composites frames itself, so it knows precisely which frame is on screen and what comes next.

**Packed alpha transparency.** Rather than depending on the patchy browser support for transparent video codecs, Aval stores the transparency mask packed alongside the color data in the same frame, and the runtime recombines them at draw time. The practical result: one file, real transparency, working across browsers, without asking your users to be on the right one. Your 3D render can sit directly on top of the page background, with soft edges and shadows intact.

The layer underneath all of this is **WebCodecs**, a relatively new browser API that gives you low-level access to the same hardware video decoders the browser uses internally. It's what makes it possible to build a custom playback and compositing engine on the web at all — you get frames, and you decide what to do with them.

## The bet I made to build it

This started as a weekend project. I had two things I wanted to try with the 5.6 Sol Ultra model: an agentic-first remote FFmpeg service for optimizing videos, comparing quality quickly, and pulling stills out of clips — genuinely useful, unglamorous plumbing — and a WebCodecs playback and compositing engine, which was the interesting one.

At one point Codex had been working for 20 hours straight on that engine. I said publicly at the time that we'd either get something really dope out of it for the whole community, or it would be a complete waste of tokens. I honestly didn't know which. What I did believe is that models have reached the level where a single person can credibly attempt work that used to require a small specialist team and a quarter of runway — codec-level, format-design work that I would never have started solo two years ago.

It turned out to be the former. This is probably the craziest thing I've ever built with Codex.

## What's landed since launch

Thank you to everyone who tried it, filed issues, and shared it. Several updates are already in the repository:

- Fixes for multiple Safari compatibility issues.
- Support for **H.265, AV1, and VP9** codecs across the `.avl` container, the runtime, and the compiler.

That codec work matters more than it sounds. H.264 is the safe default everywhere, but AV1 and VP9 give you dramatically better quality per byte, and H.265 is the efficient path on Apple hardware. Being able to choose per project means you're not paying a 12 MB hero animation tax for a nice interaction.

## A caveat, stated plainly

This is still very early. It's an experiment that got promoted to a project, not a polished product with a support contract behind it. Expect rough edges, expect the format to move, and don't put it on a checkout page next week. If you work with video on the web, though, I'd love for you to poke at it — the parts that break next are the parts that tell me what to build.

Aval is open source. If you've ever fought with three MP4s and a `setTimeout` to fake an interactive animation, I think you'll immediately understand why I wanted this to exist.
