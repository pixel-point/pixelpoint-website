---
title: 'A framework-agnostic text animation skill for AI agents'
summary: 'AI agents can write animation code, but they can''t make it feel good — they default to linear fades and round-number durations. So we packaged our designers'' motion specifications into a skill that works with Remotion, GSAP, Motion, or native mobile, and hands your agent the timing, curves, and stagger values instead of leaving it to guess.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

Ask an AI coding agent to animate a headline and you'll get something that technically works. The text will appear. It will probably fade in over one second, linearly, all at once. It will look like a slide transition from 2007.

This isn't a model problem. It's a knowledge problem. Nothing in a typical prompt tells the agent that a 1000ms fade reads as sluggish, that words revealing on a 40ms stagger feel alive while a 200ms stagger feels broken, or that `ease-out` and a hand-tuned cubic-bezier are not interchangeable. Motion design is a body of craft knowledge, and agents have very little of it. So they guess, and their guesses average out to "fine."

We've been building marketing sites, product videos, and interface motion for long enough that our designers have opinions about all of this — opinions with numbers attached. So we wrote those numbers down in a form an agent can actually use.

## What we shipped

A text animation skill for AI agents. It's framework and language agnostic: whether you're working in Remotion, GSAP, Motion, or building a native mobile app, it helps your agent produce polished text animations instead of default ones.

Every animation in it comes with timing, curves, and specifications crafted by designers — not inferred by a model from whatever animation code happened to be in its training data.

<Video src="https://video.twimg.com/amplify_video/2081762526258176000/vid/avc1/3840x2160/Jnc5QPvPHeAxhGO1.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## What a "skill" is, if you haven't run into the term

Agent skills are a fairly new idea and the naming doesn't help. Think of one as a reference manual you hand your agent before it starts working — a folder of structured instructions the agent loads into context when the task calls for it. Not a library you install, not an API you call. Knowledge.

That distinction is what makes this approach portable. If we'd shipped an animation library, it would work in exactly one ecosystem, and you'd be stuck with our component API. Instead the skill describes animations the way a motion designer would spec them for a developer: this element, this property, over this duration, on this easing curve, offset by this much from the one before it. Your agent reads the spec and writes the implementation in whatever stack you're already in.

Same spec, different output. In Remotion it becomes frame-based interpolation. In GSAP it becomes a timeline with a stagger config. In SwiftUI it becomes a sequence of animations with custom timing curves. The motion is identical because the numbers are identical.

## A concrete example

Say you're building a product launch video in Remotion and you want the headline "Ship faster" to land with some weight.

Without any guidance, an agent typically gives you both words fading from opacity 0 to 1 over 30 frames, linear. It's not wrong. It's just inert.

With the skill loaded, the agent has an actual specification to follow: each word animates independently, entering from 20px below with a slight blur, over 500ms, on a curve that starts fast and settles gently rather than moving at a constant speed. The second word starts 60ms after the first — enough to read as deliberate sequencing, not enough to feel like you're waiting. The blur clears slightly before the movement finishes, so the text feels like it's coming into focus rather than sliding into place.

Those numbers are the entire difference between "an animation happened" and "this looks like someone made it." And they're precisely the kind of thing nobody types into a prompt, because if you knew them off the top of your head you probably wouldn't be asking an agent in the first place.

## Why this matters beyond text

We think this is the more interesting pattern in agent tooling right now: encoding craft, not just capability.

Agents are already competent at the mechanical parts of frontend work. Where they fall down is taste — the accumulated set of small decisions that separates a competent implementation from a good one. Those decisions are learnable and, crucially, writable. A designer who knows why 40ms feels right can put that in a document, and from then on every agent run inherits it.

That's a meaningful shift for teams without a dedicated motion designer. You don't need someone on staff who has spent years developing an instinct for easing curves. You need that instinct captured once, in a format your tools can read.

Text animation is where we started because it's the highest-frequency need — hero headlines, video titles, onboarding copy, feature callouts. It's also where bad defaults are most visible. But the approach generalises to anything with an established craft behind it.

Give it a try in whatever you're building, and tell us what breaks. We'd rather hear about the gaps than guess at them.

