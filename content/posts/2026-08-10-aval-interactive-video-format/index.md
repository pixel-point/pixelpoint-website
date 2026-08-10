---
title: 'Aval: an open source format for interactive video on the web'
summary: 'I built Aval, an open source container and runtime for interactive video on the web: a built-in state machine, frame-accurate transitions, and packed alpha transparency, decoded through WebCodecs. Here''s what it does, why the web needed it, and what has landed since launch.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

I've just open sourced **Aval**, a new format for interactive video on the web. It ships with a built-in state machine, frame-accurate transitions, and packed alpha transparency, and it's probably the craziest thing I've ever built with Codex.

I'd been dreaming about this technology for years, mostly because every time we wanted a piece of video on a landing page to *react* to something — a hover, a scroll position, a click, a state change in the UI — we ended up building a pile of workarounds instead of shipping the idea.

## The problem: video on the web is a black box

A `<video>` tag is great at one job: play this file from start to finish. The moment you want something more interactive, the cracks show up fast.

Say you have a product hero: a 3D render of a device that sits idle, then smoothly opens when the user hovers a button, then loops in an "open" state until they move away, then closes. That's four pieces of motion — idle loop, open transition, active loop, close transition — and a set of rules about which one plays when.

With plain HTML video, you have a few bad options:

- **Multiple video files and swap the source.** Every swap means a new load, a new decode, and a visible flicker at the seam.
- **One long video and seek to timecodes.** Browsers don't seek to exact frames reliably. You ask for 2.400s and land somewhere near it, and "near it" reads as a jump.
- **Image sequences or sprite sheets.** Frame-accurate, but the file sizes are brutal — you're throwing away video compression entirely.
- **Lottie or a vector animation.** Wonderful for illustration and UI motion, but it can't represent a rendered 3D scene or real footage.

And then there's transparency. If you want video composited over a page background — a floating object with no rectangular box around it — your options in browsers have historically been narrow, inconsistent, and expensive.

## What Aval is

Aval is a container format (`.avl`), a compiler that produces it, and a runtime that plays it in the browser. Three ideas hold it together.

**A built-in state machine.** Instead of a single timeline, an Aval file describes states and the transitions between them. Idle, opening, active, closing — declared inside the asset, not stitched together in your application code. The runtime exposes those states, so your app just says "go to active" and the format handles what has to play to get there. If you've used Rive for vector animation, the mental model is similar, except the source material can be any video the compiler can eat: a Blender render, screen capture, real footage.

**Frame-accurate transitions.** The runtime doesn't ask the browser to seek. It decodes frames itself through WebCodecs — the low-level browser API that gives you direct access to the decoder instead of the opaque `<video>` element — and composites them on the GPU. That means a transition starts on the exact frame it's supposed to start on, and states join without a flash or a stall.

**Packed alpha transparency.** Alpha channel support in web video codecs is patchy at best, so Aval sidesteps the problem: the compiler packs the alpha channel into the video frame alongside the color data, and the runtime recombines them at draw time. You get transparent video that survives normal video compression, in codecs browsers already decode in hardware.

<Video src="https://video.twimg.com/amplify_video/2077405925183279104/vid/avc1/3840x2160/cPmxGScXFcFhivSb.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## How it got built

This started as a weekend project with the 5.6 Sol Ultra model. Two things went into the queue: an agentic-first remote FFmpeg service, and a WebCodecs playback and compositing engine. The second one was the gamble.

Codex worked for about 20 hours straight on it. I was honest about the odds at the time: either we get something really dope out of it for the whole community, or it's a complete waste of tokens. What convinced me to let it run is that the models have approached a level where a project like this is worth attempting solo — a custom container format, a compiler, and a GPU compositing runtime is not a weekend's worth of work by any historical measure, and it's the kind of thing that would previously have needed a small team and a quarter.

The first project turned out to be genuinely useful on its own: a remote FFmpeg service designed to be driven by an agent rather than by a human typing flags. It optimizes videos, runs quick quality comparisons between encodes, and extracts stills from footage. If you've read our notes on [creating web-optimized video with FFmpeg using VP9 and H.265](/blog/web-optimized-video-ffmpeg), you know how much of that work is iterative guess-and-check — encode, look, adjust, encode again. Handing that loop to an agent with a service that can actually run the encodes and diff the results removes most of the tedium, and it fed directly into getting Aval's compiler output right.

## What has landed since launch

Thank you to everyone who's tried it and filed issues. Several updates are already in the repository:

- **Safari compatibility fixes.** Multiple issues resolved. Safari's WebCodecs behavior differs from Chromium's in ways you only discover by running into them.
- **H.265, AV1, and VP9 support** across the `.avl` container, the runtime, and the compiler. Aval no longer assumes one codec: you can pick based on the tradeoff you care about — hardware decode coverage, file size, or browser support — and the format carries that choice through the whole pipeline.

## A word of caution

This is still an early project. It's open source because I think the web needs a shared answer to interactive video, not because it's finished, hardened, and ready to carry your production traffic tomorrow. Expect rough edges, expect the format to change, and please open issues when you hit something.

If you work with motion on the web — product heroes, in-page 3D, transparent overlays, anything that has to respond rather than just play — I'd love for you to try it and tell me where it breaks.

