---
title: 'Introducing Aval: an open source format for interactive video on the web'
summary: 'Aval is a new open source format for interactive video on the web, with a built-in state machine, frame-accurate transitions, and packed alpha transparency. Here''s the problem it solves, how the pieces fit together, and what has already landed since launch.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

I've been dreaming about this technology for years, and it finally exists: **Aval**, a new open source format for interactive video on the web. It ships with a built-in state machine, frame-accurate transitions, and packed alpha transparency — and it is probably the craziest thing I've ever built with Codex.

<Video src="/x-video/amplify_video/2077405925183279104/vid/avc1/1920x1080/LgkPBuNiGJ8AMVsn.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## The problem: video on the web is a black box

If you want beautiful motion on a website, you generally pick one of two bad options.

Option one is a video file. You get everything a renderer can give you — real lighting, depth of field, motion blur, materials that would take a month to fake in CSS — but the result is inert. A `<video>` element plays forward. You can pause it, mute it, maybe scrub it. It cannot respond to a user. And it comes in a rectangle with an opaque background, so it never truly sits inside a layout.

Option two is a vector or code-driven animation: Lottie, CSS, WebGL, a canvas loop. Now it's interactive and transparent, but you've traded away the visual ceiling. Anything cinematic — a rendered product, a character, a material that reflects its surroundings — is either impossible or turns into a rendering project with its own performance budget.

So teams compromise. The hero animation becomes a looping MP4 that ignores the cursor. The "interactive" 3D scene becomes a sequence of PNG frames, dragging megabytes of images along with it. Or the designer's storyboard gets cut down until it fits what the platform can actually do.

Aval exists to remove that compromise: keep the fidelity of pre-rendered video, and make it behave like an interactive component.

## A concrete example

Imagine a landing page hero: a device rendered in Blender, slowly rotating in an idle loop. A visitor hovers over it and the camera pushes in. They click, the device opens and reveals its interface, then settles into a second idle loop. They move away and it eases back to where it started.

Today, building that means either an interminable WebGL scene or a folder of clips, a pile of `timeupdate` listeners, some `currentTime` math, and visible seams every time you jump from one clip to another. Seeking a video is not frame-precise — browsers snap to keyframes — so transitions land a few frames off and the picture visibly hitches.

With Aval, the same hero is one file. The idle loop, the push-in, the open, the reveal, and the return are clips in a state machine. Hover and click are events that trigger transitions between states. The runtime handles the switch on the exact frame it was authored on, so it looks like one continuous render. And because the alpha channel travels with the video, the device sits on your gradient, your dark mode background, your section divider — no matte box, no baked-in backdrop.

## How it works

Three pieces make up the format:

**The state machine.** Instead of a single timeline, an Aval file describes states (a clip, looping or not) and transitions between them, driven by events. This is the same mental model animators know from game engines and tools like Rive, applied to pre-rendered footage. Interaction logic lives in the file rather than in bespoke JavaScript scattered around your component.

**Frame-accurate transitions.** The runtime doesn't ask the browser to "seek to roughly here." Transitions are resolved at the frame level, which is the difference between a cut you don't notice and one you can't stop noticing.

**Packed alpha transparency.** Most hardware-accelerated video codecs have no usable alpha channel, which is why transparent video on the web has always been painful. Aval works around it the way visual effects pipelines do: the transparency mask is packed into the video alongside the color image, then recombined at playback so you get a genuinely transparent element. You keep hardware decoding, and you keep the shape.

Around those concepts sit the practical parts: an `.avl` container that bundles the media and the state machine definition, a compiler that turns your clips and configuration into that container, and a runtime that plays it in the browser.

## What's already landed

Thank you to everyone who has poked at the project since launch — a lot of it turned into commits straight away. Two things worth calling out:

- **Safari compatibility fixes.** Several issues are resolved. Safari has its own opinions about video decoding, and interactive playback finds all of them.
- **Codec support for H.265, AV1, and VP9**, across the `.avl` container, the runtime, and the compiler. Instead of one hardcoded encoding path, you can pick the codec that matches your audience and your file size targets. If you want the background on how those codecs behave in practice and how to encode for the web without wrecking quality, we [wrote about that separately](/blog/web-optimized-video-ffmpeg).

Keep in mind that this is still early. The format is young, the API surface will move, and there are rough edges I already know about and probably a few I don't. If you break it, that's genuinely useful information.

## Why I built it this way

A format like this used to be a quarter of work: a container spec, a compiler, a browser runtime, and enough demos to prove the idea holds. Building it with Codex compressed that into something I could actually finish while running a company — not because the AI knew what interactive video should be, but because once the design was clear it could carry an enormous amount of the mechanical work: container plumbing, codec paths, edge cases across browsers.

That's the part I keep thinking about. The bottleneck on ambitious infrastructure has quietly moved from "can I implement this" to "do I know what I want."

If interactive video is something you've wanted for your own product pages, docs, or marketing sites, the repository is open. Try compiling something, tell me where it falls over, and open an issue.

