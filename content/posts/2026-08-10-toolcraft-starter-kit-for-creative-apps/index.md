---
title: 'Toolcraft: One Command Away From Your Own Creative Tools'
summary: 'Toolcraft is our free, MIT-licensed starter kit and UI library for building personal creative apps — shaders, utilities, brand asset tools. It now has a home at toolcraft.sh, a big AI harness overhaul, and an apps gallery on the way.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

Every designer and developer I know has a mental list of small tools they wish existed. A shader playground where you can actually tweak the curve instead of guessing numbers. A tiny utility that takes a client's logo and spits out every size and format their team keeps asking for. A canvas where you can drag layers around and export a poster in one click.

Almost none of those tools get built. Not because the idea is hard, but because the boring part is enormous. Before you write a single line of the thing you actually care about, you need a workspace: a toolbar, panels, sliders that feel right, a color picker that isn't awful, file uploads, a canvas that handles zoom and pan, a timeline if there's animation involved. That's days of work — and it's the same days, over and over, for every new idea.

That's the problem Toolcraft solves. It's a free, open-source starter kit and UI library for building personal creative apps, and it now has a proper home at [toolcraft.sh](https://toolcraft.sh).

<Video src="https://video.twimg.com/amplify_video/2077041819334963200/vid/avc1/3840x2160/i7EbGbdUsVgrf9Uc.mp4" width="3840" height="2160" controls muted poster="./video-cover-5.jpg"></Video>

## One command, then you're building

You're one npx command away from your own design app:

```bash
npx @pixel-point/toolcraft create
```

That's it. Bring your coding agent, bring an idea, and start being creative. There's no license to buy, no account to create, no hosted service in the middle.

## The workspace comes out of the box

Buttons, toggles, sliders, curves, color pickers, a timeline, a font picker, layers, uploads, canvas, toolbar — and plenty more — ship with Toolcraft. These aren't generic form widgets; they're the controls creative tools actually need, built to sit together in a single coherent workspace.

<Video src="https://video.twimg.com/amplify_video/2082153948287262721/vid/avc1/3840x2160/E5nX-xZB8mb7Y1hz.mp4" width="3840" height="2160" controls muted poster="./video-cover-6.jpg"></Video>

Here's what that changes in practice. Say you want a tool that renders a shader — a small program that draws pixels on the GPU, the thing behind most animated gradients and noise textures you see on modern websites. The interesting work is the shader itself: playing with the math until it looks good. Without a starter kit, you spend the first two days building the surrounding app so you can play at all. With Toolcraft, you drop in a canvas, wire a few sliders and a curve editor to your uniforms, add a timeline to scrub the animation, and you're tweaking the visuals within the hour.

Same story for client work. A brand asset tool — upload a logo, pick colors from the brand palette, choose a layout, export — is mostly panels, pickers, and uploads. All of that is already there. You build the part that's specific to your client.

## New release: a major AI harness overhaul

A new version of Toolcraft is out, and the headline change is a major overhaul of the AI harness.

If that term means nothing to you: the harness is everything in the project that a coding agent reads and runs when it works on your app. The instructions about how the library is structured, which components exist and how they're meant to be wired together, and the checks the agent runs to confirm it hasn't broken anything or tanked performance. It's the difference between an agent that guesses at your codebase and one that already knows the rules.

The rebuilt harness is leaner. It consumes fewer tokens, which means cheaper and faster runs, and it spends far less time re-testing performance on subsequent runs instead of repeating the same expensive checks every time you ask for a change. Alongside that, this release includes several smaller component improvements and bug fixes.

<Video src="https://video.twimg.com/amplify_video/2083512258513027072/vid/avc1/1440x1080/QaAMFW64yTsayPOo.mp4" width="1440" height="1080" controls muted poster="./video-cover-1.jpg"></Video>

<Video src="https://video.twimg.com/amplify_video/2083512352150802432/vid/avc1/1440x1080/7ZOuEl0AsF3vEj5m.mp4" width="1440" height="1080" controls muted poster="./video-cover-2.jpg"></Video>

<Video src="https://video.twimg.com/amplify_video/2083512425114972160/vid/avc1/1440x1080/elsXOt7myIXd1FrV.mp4" width="1440" height="1080" controls muted poster="./video-cover-3.jpg"></Video>

<Video src="https://video.twimg.com/amplify_video/2083512454131159040/vid/avc1/1440x1080/J_YeA5bxcTy_-OFK.mp4" width="1440" height="1080" controls muted poster="./video-cover-4.jpg"></Video>

## 100% free, MIT-licensed, and yours

Toolcraft is MIT-licensed. Build with it for yourself or for a client, ship it commercially, do whatever you want. You own the code and can change anything in it — swap the theme, change component behavior, add new controls or entire panels. We give you the foundation so you can focus on the creative part instead of re-inventing a workspace.

## What's next: a built-in API

One of the updates I'm planning is a built-in API, with our CLI able to talk to it. The point is repeatability. Once you've dialed in your own presets in a tool — a particular gradient treatment, a specific poster layout, an export configuration — you'll be able to ask an agent to reproduce those presets against different assets.

Concretely: you design one social card you love inside your Toolcraft app, save it as a preset, then hand the agent a folder of forty product photos and let it generate forty on-brand cards without you touching a slider again. The tool stops being something you sit in and becomes something you can drive programmatically.

## Show us what you build

We're launching an apps gallery on the site next week, and I'd really like a community section in it. If you build something with Toolcraft — a shader experiment, a utility that quietly saves you twenty minutes a day, a brand asset manager you handed to a client — submit it on our website and we'll feature it.

Start here: [toolcraft.sh](https://toolcraft.sh).
