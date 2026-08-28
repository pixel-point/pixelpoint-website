---
title: 'Introducing Aval: an open source format for interactive video on the web'
summary: 'Aval is a new open source video format with a built-in state machine, frame-accurate transitions, and packed alpha transparency — plus the first round of updates: Safari fixes and H.265, AV1, and VP9 support across the container, runtime, and compiler.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

I've just [released Aval](https://x.com/i/web/status/2077406669647073370), a new open source format for interactive video on the web. It ships with a built-in state machine, frame-accurate transitions, and packed alpha transparency. This is probably the craziest thing I've ever built with Codex.

<Video src="/x-video/amplify_video/2077405925183279104/vid/avc1/1920x1080/LgkPBuNiGJ8AMVsn.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## The problem I kept running into

On marketing sites and product pages, we often want video that behaves less like a movie and more like an interface element. A 3D device that sits idle, tilts when you hover it, and snaps to a second state when you click a tab. A character that reacts to scroll position. A hero animation rendered in Blender because no amount of CSS or SVG will get you that lighting.

The honest answer today is that you fake it. You export a handful of clips, stack several `<video>` elements on top of each other, and write JavaScript that listens for `timeupdate` to decide when to swap or seek. That approach breaks in specific and annoying ways:

- **Transitions land in the wrong place.** `timeupdate` fires a few times per second, not once per frame, so "jump to the next state when the loop ends" ends up a handful of frames late. On a 24-frame transition, that reads as a stutter.
- **Transparency doubles your work.** If you need video with a transparent background so it can sit over real page content, you're maintaining HEVC with an alpha channel for Safari and VP9 with alpha in WebM for everyone else — two pipelines, two sets of bugs, and browser-specific fallbacks in your player code.
- **The state logic lives nowhere.** The knowledge of which clip follows which, and which transition connects them, is scattered across your React components instead of living with the asset.

We've written before about [getting video down to a reasonable size with VP9 and H.265](/blog/web-optimized-video-ffmpeg/), and that part of the problem is well understood. The interactivity part isn't.

## What Aval does

Aval is a container format (`.avl`), a compiler that produces it, and a runtime that plays it in the browser.

**A built-in state machine.** Instead of describing a linear timeline, you describe states and the transitions between them — the same mental model you'd use in Rive or a game engine's animation graph. "Idle loops. On `hover`, play the `idle → tilted` transition, then loop `tilted`." That graph is compiled into the file itself, so the asset carries its own behaviour. Your application code stops managing playheads and just sends events: `aval.trigger('hover')`.

**Frame-accurate transitions.** The runtime knows exactly which frame each state and transition starts and ends on, so a transition begins on the frame it's supposed to. No `timeupdate` polling, no visible seam where one clip is swapped for another.

**Packed alpha transparency.** Rather than relying on codec-level alpha channels — which is where the Safari-versus-Chrome split comes from — Aval packs the alpha mask into the video frame alongside the colour data and recombines it at playback. One encode, one file, transparency everywhere, and you can use whichever codec compresses your footage best.

The practical difference: a hero animation that used to be four video files, two encoding pipelines, and 200 lines of playback glue becomes one `.avl` file and a few event calls.

## What's landed since launch

Thank you to everyone who's tried it and filed issues — the response was much bigger than I expected, and several updates have already landed in the repository:

- **Multiple Safari compatibility fixes.** Safari is always the interesting one when you're doing anything unusual with video decoding, and a batch of those issues is now resolved.
- **Support for H.265, AV1, and VP9** across the `.avl` container, the runtime, and the compiler. You're no longer limited to a single codec, so you can pick based on the quality-per-byte you need and the browsers you care about — AV1 where you can afford the encode time, H.265 or VP9 as the pragmatic default.

## A fair warning

This is still early and experimental. The format, the compiler flags, and the runtime API can all change, and I'd treat it as something to prototype with rather than something to drop into a production release this week. If you do try it, the most useful thing you can send back is a real asset that doesn't work — browser, codec, and file, so I can reproduce it.

I'd been dreaming about this technology for a long time and never had a realistic path to building it alone. That it exists now, with a working compiler and runtime, is the clearest example I have of what agentic coding tools change about the scope of a side project.

