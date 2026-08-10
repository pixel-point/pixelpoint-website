---
title: 'A web-native grass simulation for $15 and a few million AI tokens'
summary: 'I built a grass simulation that runs in the browser using Quixel Megascans assets and Three.js. Here''s what it cost, why photoscanned assets change the economics of 3D on the web, and where this kind of thing actually belongs on a site.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

It cost me $15 on the Epic Games Store and a few million AI tokens to build this web-native grass simulation. No 3D artist, no custom asset pipeline, no render farm. Just a paid asset pack, Three.js, and a lot of iteration.

<Video src="https://video.twimg.com/amplify_video/2080310614300164096/vid/avc1/3840x2160/tOnsdTZwG9Z3UB3j.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## Why grass is a genuinely hard thing to render

If you've never built anything in 3D, grass sounds like the most boring possible subject. It's the opposite. A convincing patch of grass is tens or hundreds of thousands of individual objects, each one thin, semi-transparent at the edges, catching light differently depending on which way it leans, and all of them moving slightly out of sync when wind passes through.

Games solve this with years of engine work and a hardware budget you control. The browser is a much less forgiving place. You're sharing a GPU with the rest of the user's tabs, you have no idea whether you're on an M-series laptop or a three-year-old Android phone, and every megabyte you ship is a megabyte someone waits for before they see anything at all.

So "web-native" here means something specific: this isn't a pre-rendered video of grass, and it isn't a Unreal Engine build wrapped in a page. It's real geometry, drawn live in WebGL, reacting to the camera and to simulated wind in real time. That distinction matters because a real simulation can respond to a user — scroll, cursor, click — in a way a video file never will.

## What the $15 actually bought

Epic Games owns Quixel, the company behind Megascans: a library of photoscanned real-world assets. Instead of an artist modelling a blade of grass from imagination, someone went outside, scanned actual plants with photogrammetry, and cleaned up the result into textures and meshes with real-world proportions and real-world colour data.

That's the part you can't fake cheaply. The reason most hobby 3D scenes look like hobby 3D scenes is not the shader work — it's that the source material is invented rather than measured. Photoscanned assets skip that entire problem.

The important detail for anyone reading this as a practical matter: those assets aren't locked to Unreal Engine. You can use them in Three.js, which is exactly what we did in this demo. The blade textures and geometry come straight out of the pack; everything around them — instancing so the GPU draws thousands of blades in one pass, a wind function in the vertex shader, thinning density out at distance so you're not paying for detail nobody can see — is ordinary web graphics work.

The "few million AI tokens" is the other half of the cost. Shader work is a tight feedback loop of tiny numerical changes: adjust a noise frequency, look, adjust again. Having a model to draft and revise those passes is what let a project like this happen in evenings rather than over a quarter.

## Where something like this belongs

The fair question is whether any of this is more than a nice toy. It is, but only when the subject and the surface match.

Concretely: imagine a landing page for an outdoor apparel brand, or a sustainability report for an agriculture company. Today that hero section is a stock photo of a field, or at best a looping video that starts playing after a two-second buffer and stops the moment the user scrolls. A live scene does things a video can't. The wind can respond to the cursor. The camera can travel as the user scrolls through the story. The time of day can shift to match a dark-mode toggle. Nothing has to be re-rendered and re-uploaded when marketing wants a different angle — you change a parameter.

The same logic applies to product demos, game studio sites, and anything where the thing you're selling is a physical environment. The reason it hasn't been common is that it used to require a 3D pipeline and the people to run it. Photoscanned asset libraries plus AI-assisted shader iteration collapses that cost by an order of magnitude, and this demo is the cheapest possible proof of it.

None of which means every site needs grass. Most don't. But the ceiling on what a browser can show has moved, and the price of finding out where that ceiling is now sits at roughly the cost of lunch.

