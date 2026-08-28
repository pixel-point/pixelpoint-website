---
title: 'Our text animation skill for AI agents works with any framework or language'
summary: 'AI agents can write animation code, but they guess at the details that make motion feel good. We packaged designer-crafted timing, easing curves, and specs into a skill that works whether you''re using Remotion, GSAP, Motion, or building a mobile app.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

Ask an AI agent to animate a headline and it will happily write the code. It will also, almost every time, give you the same thing: every word fading in together, over half a second, on a linear curve. Technically an animation. Visually, a placeholder.

That gap is the reason we built a text animation skill for AI agents — and made it deliberately framework and language agnostic.

<Video src="/x-video/amplify_video/2081762526258176000/vid/avc1/1920x1080/EFUk-QV7iVH_WnCV.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## The problem isn't the code, it's the numbers

Modern agents are genuinely good at animation APIs. They know the syntax for GSAP timelines, they know how `motion.div` works, they know how to structure a Remotion composition. What they don't know is what makes motion feel intentional.

Good text animation lives in details that are almost never written down anywhere an agent can read them:

- **Duration.** 300ms reads as snappy, 700ms reads as cinematic, 1.2s reads as broken.
- **Easing.** A linear fade looks cheap. A curve that decelerates hard at the end looks designed.
- **Stagger.** Words or characters entering 40–80ms apart create rhythm. All at once creates a blink.
- **Direction and distance.** A 12px rise feels grounded. A 60px rise feels like the text fell off a shelf.
- **What else moves.** Blur, mask reveals, clip paths, per-line offsets — the parts that separate "it appeared" from "it arrived."

Without that information, an agent interpolates from averages. You get the median animation of the entire internet, which is exactly as exciting as it sounds.

## What the skill actually contains

Every animation in the skill ships with its full specification: timing, curves, stagger values, offsets, and the sequencing between elements. Those numbers were crafted by designers, not inferred by a model from training data.

Think of it as a design system, but for motion instead of components. When our agent reaches for "a word-by-word headline reveal," it doesn't invent one. It pulls a defined recipe: 700ms per word, 60ms stagger, a cubic-bezier that eases out sharply, a small upward offset paired with a blur that resolves in the last third of the movement. The agent's job becomes translation, not taste.

Here's the difference in practice. Prompt an agent cold with "animate this hero headline word by word" and you'll typically get opacity going 0 to 1 across all words simultaneously, half a second, default easing. Prompt the same agent with the skill loaded and you get a staggered reveal where each word settles individually, the motion decelerates instead of stopping dead, and the whole sequence lands in under a second. Same model, same prompt, same amount of your time — the output just stops looking like a first draft.

## Why framework agnostic matters

This was the design decision we cared about most. The skill describes animations, not API calls.

A fade-and-rise with a 60ms per-word stagger and an ease-out curve is the same animation whether it's expressed as a GSAP timeline, a Motion variant, a Remotion sequence with frame-based interpolation, a SwiftUI transition, or Reanimated on React Native. The intent is portable. Only the syntax changes, and syntax is the part agents are already excellent at.

So the skill doesn't lock you into a stack. If you're building a marketing site in Motion this week and a product video in Remotion next week, you're not maintaining two separate sets of animation knowledge — and you're not getting two different-looking results from the same brand. The spec is the source of truth; the implementation is a rendering of it.

That also means the skill survives your next migration. Animation libraries come and go faster than design decisions do.

## Where this fits

We build a lot of animated interfaces and a lot of programmatic video, and both workflows now run through agents more than they used to. The bottleneck stopped being "can the agent write this" a while ago. It became "can the agent write this well enough that I don't rewrite the timing by hand afterward."

Encoding designer judgment as a skill is how we closed that loop. The agent gets the numbers it was previously guessing at, and we get output that's usable on the first pass instead of the third.

You can see it running in [the announcement thread](https://x.com/i/web/status/2081763849712099532) — polished text animations, same skill, across different frameworks. If you're building anything with motion and letting an agent hold the keyboard, this is the layer that's probably missing.

