---
title: 'Inside our brand and design work for the Databricks Developer Portal'
summary: 'We recently wrapped up a brand and design project for developers.databricks.com. Here''s a look at the work — and why the way Databricks used AI prototyping on this project is a model more teams should copy.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

We recently released our brand and design project for the [Databricks Developer Portal](https://developers.databricks.com), and I've been looking forward to sharing it.

<Video src="/x-video/amplify_video/2079181347784884224/vid/avc1/1920x1080/07-M4Z07_7uywyvD.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

## Why a developer portal is its own design problem

A developer portal isn't a marketing site with code samples bolted on. It's the place where an engineer decides, usually in under a minute, whether your platform is something they can build on. That means it has to do several jobs at once: explain what the platform does, point to the right SDK or API, surface documentation, and carry the parent brand without feeling like a brochure.

Those jobs pull in different directions. Marketing pages want atmosphere and narrative. Developer entry points want density, scannability, and zero ambiguity about where to click next. Get the balance wrong and you either end up with something visually flat and forgettable, or something beautiful that makes a developer hunt for the one link they actually came for.

So the work here was as much about structure and hierarchy as it was about visual identity — building a brand expression for the portal that stays unmistakably Databricks, while designing pages where the path from "I'm curious" to "I'm reading the API reference" is short and obvious.

## The part I want to highlight: vibe coding used the right way

Here's the thing about this project I keep coming back to.

If you haven't run into the term, "vibe coding" is what people call describing what you want to an AI tool and letting it generate the code. You type a paragraph, you get a working page. It's genuinely useful, and it's also become a trap: plenty of companies now vibe-code an entire production website, ship it, and then spend the next six months discovering what an unmaintainable codebase with no design system feels like.

Databricks used it differently — mainly for quick prototyping and for communicating overall page structure and intent. And that's exactly where the technique shines.

Here's why that matters in practice. The hardest part of the early phase of any web project isn't design or engineering. It's alignment. A stakeholder has a picture in their head of how a page should be organized, and the traditional ways of getting that picture out are all lossy: a bulleted list in a doc, a hand-drawn wireframe, a long Slack thread with three people describing the same thing differently.

A rough vibe-coded prototype collapses that. Instead of "we want a hero, then a section with the SDKs, then something for the docs," you get a clickable page you can scroll through and react to. Everyone is looking at the same artifact. Disagreements surface in minutes instead of after the first design round. And critically, nobody is precious about it, because everyone knows it's scaffolding — it exists to communicate a shape, not to be shipped.

From there, our job is the part the prototype can't do: the brand system, the typography and layout decisions, the motion, the responsive behavior, the accessibility, the actual production build that a team can maintain and extend for years. The prototype gets us to a shared understanding faster. It doesn't replace the craft that comes after.

<Video src="/x-video/amplify_video/2084312850378391552/vid/avc1/1920x1080/r3fEj08LbABeTAkQ.mp4" width="3840" height="2160" controls muted poster="./video-cover-2.jpg"></Video>

## The takeaway for anyone starting a site project

If you're kicking off a website or portal redesign right now, AI tools give you a genuinely new option in the discovery phase, and I'd encourage you to use it. Prototype the structure. Throw three versions at the wall. Bring the rough thing to the kickoff call instead of a document nobody read.

Just be honest with yourself about the boundary. A generated prototype is a communication tool. It has no design system underneath it, no considered brand, no performance budget, no plan for the tenth page you'll need to add next quarter. Treating it as a finished product is how you end up rebuilding in a year.

Used as scaffolding, though, it makes the whole project faster and the final result better, because more of the design and engineering time goes into decisions that actually compound. That's what happened here, and it's a pattern I'd like to see more teams adopt.

Go take a look at [developers.databricks.com](https://developers.databricks.com) — and thanks to the Databricks team for a great collaboration.
