---
title: 'A $15 asset pack, a few million AI tokens, and a field of grass that runs in your browser'
summary: 'I built a web-native grass simulation using Quixel Megascans and Three.js — the whole asset cost $15 on the Epic Games Store. Here''s why cinematic-quality 3D on the web is now a budget question, not a technical one.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

It cost me $15 on the Epic Games Store and a few million AI tokens to build a web-native grass simulation. That's the whole budget. No render farm, no game engine license, no studio contract.

<Video src="/x-video/amplify_video/2080310614300164096/vid/avc1/1920x1080/grOQe8Ny3gnLUT24.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## What "web-native" actually means here

Most of the beautiful 3D you see on marketing sites isn't really 3D. It's a video file — someone rendered it in Blender or Cinema 4D over a few hours, exported an MP4, and dropped it on the page. It looks great, it weighs 40MB, and it does exactly one thing forever. Move your mouse, resize the window, change the time of day in your product's UI — nothing responds, because there's nothing there to respond. It's a painting of a scene, not a scene.

Web-native means the grass is being computed in the browser, frame by frame, on your GPU. The wind is a real simulation. The camera can go anywhere. If you wanted to add a character walking through it and have the blades bend away from their feet, that's a feature you write, not a re-render you wait for. That's the difference between decoration and an interface.

Until recently, that kind of scene was a specialist project: weeks of work, a technical artist, and a budget that only game studios and car manufacturers could justify. That math has changed, and it changed for two separate reasons that happened to land at the same time.

## Reason one: Epic owns Quixel, and Quixel is absurdly cheap

Quixel makes Megascans — a library of assets built by photoscanning real objects in the real world. Someone flew to a field, photographed actual grass from every angle, and turned it into geometry and textures accurate enough for film work. Megascans show up in Hollywood VFX and AAA games.

Epic Games owns Quixel, and Megascans are sold through the Epic Games Store. The grass in this demo cost me $15.

The part people miss is that these assets aren't locked to Unreal Engine. They're standard meshes and standard texture maps, which means they drop straight into Three.js — the open-source library that renders 3D in a browser — which is exactly what we did in this demo. You are not paying for a lesser version of film-quality assets because you're building for the web. You're paying $15 for the same thing.

## Reason two: the shader work is no longer the hard part

The other half of the cost was "a few million AI tokens," which is a slightly glib way of saying I spent a lot of it prompting my way through the parts of this that used to require a specialist.

Here's the actual problem. A convincing field is hundreds of thousands of grass blades. If you ask the browser to draw each one as its own object, you get a slideshow. So you use techniques with unfriendly names — instancing, so the GPU draws one blade shape many thousands of times in a single pass; vertex shaders, so the bending motion is calculated on the graphics card rather than in JavaScript; level-of-detail, so distant grass quietly gets simpler. This is the layer where web 3D projects historically died. It's math-heavy, it's poorly documented, and debugging it means staring at a black screen wondering which of forty things is wrong.

AI is genuinely good at this layer now. Not at art direction, and not at deciding whether the scene feels right — that judgement is still entirely yours. But at "write me an instanced mesh setup with wind displacement driven by a noise function," it gets you a working first draft in minutes. The interesting shift isn't that AI writes the code. It's that the cost of *trying* something dropped to near zero, so you iterate on the look instead of rationing your experiments.

## Why this matters if you never need grass

Swap the grass for whatever your product actually is.

Say you sell agricultural sensors. Today your homepage probably has a hero photo of a field and a diagram explaining coverage. With a scene like this, the field *is* the hero — and you can drop your sensors into it, let a visitor drag a slider to see coverage change, or show wind data affecting the crop in real time. Same page, same load, but the product demo and the marketing visual are now the same object.

Or take a game studio launch site. Instead of a trailer that plays once, the environment from the game runs live in the header, and the visitor moves through it before they've downloaded anything.

The practical takeaway is that the constraint on this work is no longer technical access. Film-grade assets cost fifteen dollars. The rendering library is free. The gnarly GPU code has a competent assistant. What's left is knowing what's worth building and having the taste to make it look intentional rather than like a tech demo — which, conveniently, is the part we enjoy most.

If you've been assuming a scene like this was out of budget, it's worth re-checking that assumption. It was out of budget. It isn't anymore.
