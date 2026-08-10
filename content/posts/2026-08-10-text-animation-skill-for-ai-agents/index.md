---
title: 'A Designer-Made Text Animation Skill for Your AI Agent'
summary: 'AI agents can write animation code, but they don''t know what good motion feels like. Our new text animation skill is framework and language agnostic: it gives your agent the timing, easing curves, and specs our designers actually use, so the output looks intentional instead of generic.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

Ask an AI agent to animate a headline and you'll almost always get the same thing back: opacity from 0 to 1, half a second, `ease-in-out`, every word arriving at once. It works. It's also the motion equivalent of Times New Roman — technically correct, completely forgettable, and instantly recognizable as something nobody made a decision about.

That gap is the reason we built a text animation skill for AI agents, and it's framework and language agnostic on purpose.

<Video src="https://video.twimg.com/amplify_video/2081762526258176000/vid/avc1/3840x2160/Jnc5QPvPHeAxhGO1.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## The problem isn't code, it's taste

Modern coding agents are genuinely good at animation syntax. They know the GSAP API. They can wire up Motion variants. They'll scaffold a Remotion composition without breaking a sweat. What they don't have is a point of view about *how motion should feel* — and that's the part that separates polished work from a page that looks like it's twitching.

Good text animation is a pile of small, specific choices. How long does a single word take to arrive? How much delay sits between one word and the next? Does the text rise into place or scale into it, and by how many pixels? Which easing curve — the mathematical description of how something speeds up and slows down — makes it feel confident rather than sluggish or snappy to the point of feeling nervous? Change a stagger from 80ms to 30ms and the same animation goes from "reading along with you" to "one clean gesture."

Agents guess at those numbers. Designers don't. So we wrote the numbers down.

## What the skill actually is

If you haven't used agent skills yet, the plain-language version: a skill is a bundle of instructions and reference material that an agent loads when it becomes relevant to the task at hand. It's not a library you install or an API you call. It's closer to handing your agent the internal documentation it was missing — the agent reads it, then writes code the way someone who'd read that doc would.

Ours contains a catalog of text animations, and every entry ships with full specifications: durations, delays, stagger values, easing curves, the transforms involved, and notes on when a given effect is appropriate. Those specs come out of our design process — the same motion work we do on production marketing sites — not from an agent's statistical guess about what animation code usually looks like.

Because the source of truth is a specification rather than a snippet, it doesn't care what you're building in. Remotion, GSAP, Motion, CSS keyframes, SwiftUI, React Native Reanimated — the agent translates the same spec into whatever your codebase uses. That's the "framework and language agnostic" part, and it's the whole design goal, not a bonus feature.

## A concrete example

Say you're building a landing page and you want the hero headline to animate in.

Without the skill, you write "animate the headline" and get a fade. Maybe a fade with a 20px upward slide if the agent is feeling ambitious. You look at it, know something's off, and start the slow loop of "make it a bit faster," "less bouncy," "try staggering the words" — nudging numbers you can't quite name until it stops bothering you. That loop can eat an hour, and the result is usually a local optimum you settled for.

With the skill in place, the agent picks an animation that suits a hero headline and implements it to spec: words revealed in sequence with a deliberate stagger, a blur-to-focus pass, a custom cubic-bezier curve that decelerates the way a designer intended, and sensible handling of details that get forgotten — like respecting `prefers-reduced-motion` for people who've asked their system to tone motion down, or making sure text doesn't reflow mid-animation.

You go from prompt to something you'd actually ship, and the review conversation changes from "this feels wrong somehow" to "use the other variant here."

## Why we care about this

We build marketing sites for developer-facing companies, and motion is a big part of how those sites feel expensive or cheap. It's also the part that's hardest to hand off — you can document a color palette in five minutes, but "how our animations feel" has always lived in the heads of the people doing the work.

Encoding that into a skill is the first time it's felt genuinely transferable. Our designers' judgment becomes something an agent can apply consistently, on any project, in any stack, without a designer in the loop for every headline. That's useful for us internally, and it's the reason we made it available rather than keeping it in-house.

If you're building anything with animated text right now — a product page, a video render, an onboarding screen — try adding it to your agent's setup and compare the first output to what you were getting before. The difference shows up immediately, and it shows up in the numbers you never had to argue about.

