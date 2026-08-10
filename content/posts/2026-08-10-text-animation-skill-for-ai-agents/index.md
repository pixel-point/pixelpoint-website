---
title: 'A framework-agnostic text animation skill for AI agents'
summary: 'Our new agent skill teaches AI coding agents how designers actually build text animations — timing, easing curves, and staggering specified up front — so the output looks intentional in Remotion, GSAP, Motion, CSS, or a mobile app.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

We've just published something small that has quietly changed how quickly we can ship motion work: a text animation skill for AI agents that doesn't care which framework or language you're working in.

If you've followed our [work with animation tooling like Rive](/blog/rive-app-overview), you know we care about the craft side of motion — the part that decides whether a headline feels expensive or feels like a slide transition from 2009. This is that same concern, packaged for the way a lot of us now write code: by asking an agent.

## The problem: agents can write animation code, but they can't feel it

Ask Claude Code or Cursor to "animate this headline word by word" and you'll get working code on the first try. That's not the issue. The issue is what the code contains.

Left to its own judgment, an agent reaches for the defaults it has seen most often in training data: `ease-in-out`, a round 1000ms duration, every word starting at the same moment or staggered by an arbitrary tenth of a second, movement of 50 pixels because 50 is a nice number. The result animates. It just doesn't look designed. It's slightly too slow, it decelerates in a way that reads as sluggish, and the stagger has no rhythm to it.

Those are exactly the decisions a motion designer spends their time on, and they're the decisions that never make it into a prompt — because most people don't know what to ask for. "Make it feel snappier" is not a spec.

## What an agent skill actually is

If the term is new to you: a skill is a folder of instructions and reference material that you drop into your agent's project, and the agent loads it when the task is relevant. Think of it as onboarding documentation written for a machine — the institutional knowledge that a senior teammate would otherwise have to repeat in every code review.

Our skill is that documentation for text animation. Instead of the agent guessing at values, it reads a set of animation recipes our designers authored: what the animation is called, what it's for, the exact durations, the easing curves as cubic-bezier values, the offsets, the per-character or per-word stagger, and the order in which things enter and leave. Every animation in it includes timing, curves, and specifications crafted by our designers — not invented on the spot by a model doing its best.

A concrete example. "Fade up a hero headline" is not one instruction, it's about six: split the line into words, start each word 24 pixels below its final position at zero opacity, move it over 480ms on `cubic-bezier(0.16, 1, 0.3, 1)`, offset each successive word by 40ms, and don't animate opacity and position on different curves. Get those numbers right and the headline feels like it settles into place. Get them wrong and it feels like it's loading. The skill hands the agent the right numbers, so you can go back to writing "animate this headline" and still get the good version.

<Video src="/x-video/amplify_video/2081762526258176000/vid/avc1/1920x1080/EFUk-QV7iVH_WnCV.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## Why framework-agnostic matters here

The insight that made this worth building is that a motion spec isn't code. A duration, an easing curve, and a stagger interval are just numbers. They translate cleanly into whatever you happen to be using.

So the same skill works whether you're rendering video with Remotion, animating a marketing page with GSAP or Motion, writing plain CSS keyframes, or building a mobile screen. The agent's job becomes translation — take the specified curve and duration, express it in the idioms of your stack — rather than invention. That's a task language models are genuinely good at, and it's why the output holds up across targets instead of only working in the one library the example code happened to use.

It also means the skill survives your stack changing. When we moved a set of animations from a web page into a Remotion video, the motion stayed identical, because the source of truth was the spec, not a particular implementation of it.

## What this changes day to day

For us, the practical effect is that the boring 70% of motion work — the standard entrances, reveals, counters, and text transitions that every landing page and product video needs — now comes out right on the first pass. Our designers spend their attention on the animations that are actually specific to a project, and nobody burns an afternoon nudging easing values in a browser to figure out why a subtitle feels off.

For anyone using an agent to build interfaces, the takeaway is broader than text animation: the reason AI output often looks generic isn't a model limitation, it's missing context. Give an agent the same specifications you'd give a developer and the ceiling moves considerably.

The skill is free to use — drop it into your agent's skills directory and ask for an animation. If you try it on something we didn't anticipate, or you want a recipe added, tell us. We'd like to see where it breaks.

