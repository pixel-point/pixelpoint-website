---
title: 'A leaner AI harness and a full workspace of components in the new Toolcraft release'
summary: 'The new version of Toolcraft ships a major overhaul of the AI harness — fewer tokens burned, less time re-testing performance on repeat runs — plus component fixes and a reminder of everything you get out of the box: sliders, curves, color pickers, timelines, layers, canvas, and more.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

A new version of [Toolcraft](/blog/how-to-craft-personal-design-tools-with-toolcraft) is out, and the headline change is under the hood: a major overhaul of the AI harness, plus a batch of smaller component improvements and bug fixes.

If "AI harness" doesn't mean much to you, here's the plain version. When you ask an agent to build you a tool, the model isn't working from a blank slate — it's working inside a set of instructions, conventions, examples, and checks that tell it what the project looks like, which components already exist, how to wire them up, and how to verify that what it produced actually runs. That scaffolding is the harness. It's the difference between an agent that guesses its way to something plausible and an agent that lands on working code on the first attempt.

The harness is also where your money and your patience go. Every instruction and every example the agent reads is tokens. Every verification pass it runs is time you spend watching a progress indicator instead of using your tool.

<Video src="/x-video/amplify_video/2083512258513027072/vid/avc1/1440x1080/QaAMFW64yTsayPOo.mp4" width="1440" height="1080" controls muted poster="./video-cover-1.jpg"></Video>

## What changed

Two practical outcomes from the rewrite:

**It consumes fewer tokens.** The context the agent needs is tighter and better organized, so it spends less budget reading about the project and more budget building the thing you asked for. Cheaper runs, and less risk of the agent losing the thread halfway through a long generation.

**It spends less time testing performance on subsequent runs.** Previously, performance checks were repeated more or less from scratch each time you iterated. That's wasteful — if you've already established that the canvas renders smoothly, re-proving it on every tweak to a slider label is pure overhead. Now repeat runs skip work that's already been settled, so the second, third, and tenth iteration feel noticeably quicker than the first.

Alongside that, a set of component improvements and bug fixes across the workspace.

<Video src="/x-video/amplify_video/2083512352150802432/vid/avc1/1440x1080/7ZOuEl0AsF3vEj5m.mp4" width="1440" height="1080" controls muted poster="./video-cover-2.jpg"></Video>

## Why the component library is the real time saver

The reason iteration speed matters so much here is that the interesting part of a personal tool is never the interface. It's the idea.

Say you want a small tool that generates layered noise textures for hero backgrounds: two or three noise layers, each with its own scale and opacity, an easing curve to control falloff, a color ramp, and a PNG export at whatever resolution you need. The actual logic there is maybe fifty lines. Everything else is workspace — a toolbar, a layers panel, sliders that feel right when you drag them, a curve editor that doesn't fight you, a color picker, a canvas that redraws without stuttering, a file upload for a base image.

That workspace is where most "I'll just vibe-code a quick tool" attempts die. You spend an hour on a color picker and lose interest before you get to the part you actually wanted.

So Toolcraft ships all of it out of the box: buttons, toggles, sliders, curves, color pickers, timeline, font picker, layers, uploads, canvas, toolbar, and many more. The agent assembles from parts that already look and behave correctly, which is also why the harness improvements compound — there's less for the model to invent, so there's less to describe, verify, and re-verify.

<Video src="/x-video/amplify_video/2082153948287262721/vid/avc1/1920x1080/DZoQid375pCn7hGh.mp4" width="3840" height="2160" controls muted poster="./video-cover-5.jpg"></Video>

If you ever need to build a tool for your creative process, you shouldn't be spending your time building the workspace around it.

## A few things built on it

A sample of what the current version produces — different tools, same underlying workspace:

<Video src="/x-video/amplify_video/2083512425114972160/vid/avc1/1440x1080/elsXOt7myIXd1FrV.mp4" width="1440" height="1080" controls muted poster="./video-cover-3.jpg"></Video>

<Video src="/x-video/amplify_video/2083512454131159040/vid/avc1/1440x1080/J_YeA5bxcTy_-OFK.mp4" width="1440" height="1080" controls muted poster="./video-cover-4.jpg"></Video>

None of these took an afternoon of interface work, because the interface was never the point.

Update, try it on your next idea, and enjoy.

