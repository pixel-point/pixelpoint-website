---
title: 'A $15 asset pack and a few million AI tokens: building a web-native grass simulation'
summary: 'I built a real-time grass field that runs in the browser using Quixel Megascans and Three.js — a $15 purchase on the Epic Games Store plus a lot of AI-assisted shader iteration. Here''s how it works and why game-engine-grade vegetation on the web matters more than it sounds.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

It cost me $15 on the Epic Games Store and a few million AI tokens to build a web-native grass simulation. Here it is:

<Video src="/x-video/amplify_video/2080310614300164096/vid/avc1/1920x1080/grOQe8Ny3gnLUT24.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

That's running in a browser tab, not in Unreal Engine and not pre-rendered as a video. You can [see the original demo thread here](https://x.com/alex_barashkov/status/2080311292036890971).

## Why grass is a genuinely hard problem

If you've never had to build 3D vegetation, it sounds like a trivial thing to obsess over. It isn't. Grass is one of the classic stress tests in real-time graphics, because a convincing field is made of hundreds of thousands of individual blades, each catching light differently, each bending on its own schedule when wind moves across the field. Get any part of that wrong and the eye immediately reads it as fake — either a flat green carpet with a texture painted on it, or a spiky mess that shimmers when the camera moves.

Game engines solve this with brute force and decades of tooling. The web doesn't get that luxury. A marketing site has a load budget measured in megabytes, has to survive a three-year-old Android phone, and has to hit a stable frame rate inside a browser tab that's already running other things. So most web 3D quietly avoids nature: hard-surface products, abstract shapes, geometric landscapes. Anything organic gets replaced with a video loop.

That's the gap I wanted to test. Not "can this look nice in a screenshot" but "can we get game-engine-grade vegetation running live on the web without a studio-sized asset budget."

## The $15 part: Megascans outside of Unreal

Epic Games owns Quixel, which produces Megascans — a library of assets built from photogrammetry, meaning real plants, rocks, and surfaces scanned in the real world and turned into meshes and texture maps. It's the same source material used in film and AAA games. Because Epic owns it, most people assume it's Unreal-only content, locked behind a specific engine.

It isn't. Underneath the tooling, a Megascan is just geometry plus a set of image maps: colour, normals (the fine surface detail that makes light behave correctly), roughness, translucency. Those are portable. So I bought a grass collection for $15 and pulled it straight into [Three.js](https://threejs.org/), the standard library for 3D in the browser.

That's the practical takeaway I'd want a reader to leave with: photoreal source assets are no longer the expensive part of a web 3D project. A scanned grass clump that would once have meant commissioning a 3D artist now costs less than lunch, and nothing stops it from rendering in WebGL.

## The "few million AI tokens" part

The expensive part is the rendering strategy, and that's where the tokens went.

Drawing 200,000 blades of grass as 200,000 separate objects would kill any browser. Instead you draw one blade thousands of times in a single instruction to the GPU, and then use a small program called a shader to move each copy — position it, rotate it, vary its height and colour, and bend it in the vertex stage so wind ripples across the field as a wave rather than as random jitter. Density has to fall off with distance, distant grass has to collapse into cheaper flat cards, and the whole thing has to be tuned so the transition is invisible.

Writing and debugging that math by hand is slow, unglamorous work. Working with AI on the shader code turned days of trial and error into an afternoon of iteration: describe the behaviour I wanted, get a version, look at it, say what was wrong, go again. The AI didn't design the scene — it removed the friction between an idea about how wind should look and seeing it on screen. That loop is the actual unlock here, more than any single line of generated code.

## Why this matters if you don't build graphics demos

Because it changes what a website can be for entire categories of brand.

Concretely: imagine a running shoe brand's product page where the hero isn't a video of someone on a trail, but an actual field you can drag through, with the shoe pressing the grass down as it moves. Or a lawn equipment company where the difference between two mower settings is something you scrub through rather than read about. Or a golf brand, an outdoor apparel brand, a sustainability report, a game studio's landing page. Each of those is currently served a video loop because live vegetation was assumed to be out of reach.

It isn't out of reach any more. The cost of the assets has collapsed, the cost of the shader work has collapsed, and the browser is fast enough. What's left is craft — knowing what to cut, where the performance budget goes, how to build a mobile fallback that still feels intentional, and how to compress textures so the page loads before someone leaves.

That's the part we're most interested in at Pixel Point, and it's why we keep building demos like this one instead of only reading about them. The ceiling on what a marketing site can do visually moved this year. Most sites haven't noticed yet.

