---
title: 'Toolcraft update: a leaner AI harness and a built-in API on the way'
summary: 'A new version of Toolcraft is out, with a major overhaul of the AI harness so it burns fewer tokens and spends far less time re-running performance checks, plus component fixes throughout. Next up: a built-in API the CLI can talk to, so an agent can reproduce your presets with different assets.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

A new version of Toolcraft is out. The headline change is a major overhaul of the AI harness, plus a batch of smaller component improvements and bug fixes. If you've been generating tools with it, the difference you'll notice first is cost and speed: it should consume fewer tokens and spend a lot less time testing performance on subsequent runs.

If you're coming to this cold, the [introduction to Toolcraft](/blog/how-to-craft-personal-design-tools-with-toolcraft) covers what it is and how you'd use it. This post is about what changed under the hood and where it's going next.

<Video src="https://video.twimg.com/amplify_video/2083512258513027072/vid/avc1/1440x1080/QaAMFW64yTsayPOo.mp4" width="1440" height="1080" controls muted poster="./video-cover-1.jpg"></Video>

## What the harness actually does

"AI harness" sounds more mysterious than it is. It's the scaffolding around the model: the instructions, the context it gets, the order in which it builds things, and the checks it runs before it hands you a working tool. When you ask for a generative effect, the agent doesn't just write some code and stop. It has to understand the component it's assembling, wire up controls, then verify the result actually runs smoothly in a browser rather than dropping to a slideshow the moment you drag a slider.

That verification step is where the cost was piling up. Real-time canvas and WebGL work has to be measured, not assumed — a shader that looks fine in a screenshot can still tank the frame rate on a laptop. So the harness would run performance passes, and it would run them again on the next iteration, and again on the one after that, re-learning things it had already established. Every one of those passes is tokens and wall-clock time you're paying for while you sit and wait.

The overhaul reworks how that context and those results carry across runs. The first run still does the work of figuring out what performs well; the runs after it stop starting from zero. In practice that means iterating on a tool — nudging a parameter set, changing how a control behaves, adjusting the visual output — feels much closer to editing than to regenerating from scratch.

<Video src="https://video.twimg.com/amplify_video/2083512352150802432/vid/avc1/1440x1080/7ZOuEl0AsF3vEj5m.mp4" width="1440" height="1080" controls muted poster="./video-cover-2.jpg"></Video>

## Components and fixes

Alongside the harness, several components got improvements and bug fixes. These are the unglamorous ones — controls behaving predictably, edge cases in how effects handle unusual inputs, output that matches what the preview promised. Individually they're small. Together they're the difference between a tool you trust enough to use on real work and a demo you show someone once.

<Video src="https://video.twimg.com/amplify_video/2083512425114972160/vid/avc1/1440x1080/elsXOt7myIXd1FrV.mp4" width="1440" height="1080" controls muted poster="./video-cover-3.jpg"></Video>

## Next: a built-in API the CLI can talk to

The update I'm planning next is a built-in API, with our CLI able to interact with it. The point of that is presets.

Right now, when you build a tool and dial it in until the output looks right, that configuration is yours — a specific combination of parameters that produces a specific look. Useful, but it lives inside the tool, and applying it to a new image means opening things up and doing it by hand.

With an API in front of it, a preset becomes something an agent can drive. Say you've built a tool that dissolves a product shot into particles and you've tuned it until it matches your brand's look: the right density, the right easing, the right palette. Save that as a preset, and instead of repeating the process for the next twelve product shots, you point an agent at the CLI and ask it to reproduce that preset with different assets. Same look, new inputs, no manual re-tuning. The same pattern covers social variants, a set of blog headers, or every card in a component library that needs a generated background.

That's the shape of it: the tool you crafted once becomes a repeatable operation rather than a one-off session in front of a canvas.

<Video src="https://video.twimg.com/amplify_video/2083512454131159040/vid/avc1/1440x1080/J_YeA5bxcTy_-OFK.mp4" width="1440" height="1080" controls muted poster="./video-cover-4.jpg"></Video>

## Try it

The new version is available now — pull the latest and your next run should be cheaper and quicker than the last one. If you hit something that behaves oddly, or you have a preset workflow you'd want the API to support, I'd genuinely like to hear about it before that part is finalised. Enjoy!

