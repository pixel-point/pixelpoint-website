---
title: 'Four creative tools we built with Toolcraft, and why they aren''t toys'
summary: 'Since publishing our Toolcraft starter kit, we''ve used it to build four real creative tools: a math-driven three.js scene, a sticker-and-shader mockup app, a web UI that renders in Blender, and a purpose-built animator for a single website section. Here''s what each one does and why it matters.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

When we published the [Toolcraft starter kit](/blog/how-to-craft-personal-design-tools-with-toolcraft), the idea was simple: instead of waiting for a SaaS product to support the exact thing you need, build the small tool yourself and throw it away when you're done. Since then we've been eating our own dog food while building Toolcraft's own website, and four tools came out of it.

I'm sharing them because the most common reaction to anything made this way is "cute demo." A gradient generator. A pattern maker. Something you screenshot once and never open again. Fair enough — a lot of AI-built demos are exactly that. These four aren't, and the reasons why are worth unpacking.

## The one that's actually about math

If you look at the first demo and assume it's a render from Blender, look closer. It's not — and honestly, it's not that good. It's a [three.js](https://threejs.org/) app, which means everything you see is drawn live in the browser by your GPU.

<Video src="https://video.twimg.com/amplify_video/2078121239156064256/vid/avc1/3840x2160/hKysjY-IaYAeGe10.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

The interesting part isn't the rendering, it's where the shapes come from. Nobody modelled them. There's no mesh someone sculpted by hand in a 3D program. Every surface is the output of a formula — feed in a few numbers and you get a curve, twist it around an axis, repeat it, offset each copy by a fraction of a rotation, and you have a form that looks designed but is entirely computed.

That's what makes it a tool rather than a picture. Because the geometry is math, every input is a parameter you can expose as a slider: number of segments, amplitude, rotation offset, thickness, easing. Move one and the whole thing re-forms instantly. You're not editing a shape, you're exploring a space of shapes, and you can drop the result into a hero section, an explainer animation, or a background loop.

![A three.js scene of computed, repeating geometry rendered live in the browser, with parameter controls for the underlying formula](image-1.jpg)

This is the sort of thing designers historically outsource: describe what you want, wait for a motion designer, get one variation back, ask for the same thing but slower. When the math is in front of you, that loop collapses to seconds.

## Stickers, shaders, and product shots

The second one started as a detour while working on Toolcraft's site. It was inspired by a post from [Fons Mans](https://x.com/FonsMans), mixed with [Paper shaders](https://github.com/paper-design/shaders).

You upload a 3D model, drop your stickers onto it, tweak the shader settings, and shoot. "Shader" is the piece of jargon worth translating: it's a tiny program that runs on the GPU and decides the colour of every pixel. In practice it's what gives you the animated gradient behind the object, the grain, the iridescence, the way the light rolls across a surface. Paper shaders is a library of those effects with controls attached, so instead of writing GPU code you're moving sliders.

<Video src="https://video.twimg.com/amplify_video/2077096663953408000/vid/avc1/3840x2160/DQGFY-Ji6WButLah.mp4" width="3840" height="2160" controls muted poster="./video-cover-2.jpg"></Video>

Here's the concrete reason this earns its place. Say you're launching a feature and you want eight variations of the same 3D object for social, docs, and the changelog — same model, different sticker placement, different background treatment, consistent lighting. In a normal design workflow that's eight rounds of manual file wrangling. Here it's one upload and eight exports, and because the tool is yours, you can add whatever control you find yourself missing on the third export.

![A 3D model in a web app with stickers applied to its surface and an animated shader background behind it](image-2.jpg)

## Customise in the web, render in Blender

The third tool is the one I'm most pleased with, because it steps outside the browser entirely.

While everyone is vibe-coding flat pattern generators, or at best a three.js scene, we went one further: no three.js, no fake web-based depth of field, no emulated focal length. You customise in the web, and the actual frame is rendered by [Blender](https://www.blender.org/).

<Video src="https://video.twimg.com/amplify_video/2074492797260870072/vid/avc1/3840x2160/jAsgCrGo2tZ4Dv29.mp4" width="3840" height="2160" controls muted poster="./video-cover-3.jpg"></Video>

Why that distinction matters: browsers cheat at photography. Depth of field — the soft, out-of-focus falloff behind a subject — is usually faked in the browser with a blur applied after the fact. Focal length, the thing that makes a 35mm shot feel wide and a 105mm shot feel compressed and flattering, is often approximated too. It looks fine until you put it next to a real render, and then it looks like a website effect.

Blender doesn't approximate. It simulates a camera with a real lens, so a wide aperture gives you genuine bokeh, and changing focal length changes perspective the way it would on a physical set. The tool's job is to hide all of that: the web UI is where you position the object, pick the lens, set the focus distance and the materials, and the render happens on the Blender side with the settings you chose.

![A web interface with camera and material controls next to a Blender-rendered frame with real depth-of-field falloff](image-3.jpg)

So instead of "here's my 3D scene, now let me learn Blender's UI," a marketer or designer gets three sliders and a render button, and the output is production quality rather than good-enough-for-a-tweet.

## A tool built for exactly one website section

I don't usually share work in progress, but this last one is the clearest example of the whole idea. It's a creative tool we built specifically to design and animate a single section of a website. Not a general-purpose animation editor. One section.

<Video src="https://video.twimg.com/amplify_video/2079925057673994240/vid/avc1/2880x2160/oaOPNgsyXH_ubvxl.mp4" width="3840" height="2880" controls muted poster="./video-cover-4.jpg"></Video>

Everything in it is under your control, and if a control is missing, you add it. That's the part that no off-the-shelf product can offer. When you're tuning a motion sequence, the thing you need on the fifth iteration is almost never in the menu — the stagger delay between items, the exact curve of the easing, the pause before the loop restarts. In Figma or a video editor you work around it. In a tool you own, you spend two minutes adding the slider and then spend your remaining attention on the design instead of the workaround.

The result is a section that's tuned rather than approximated, and a build process where the designer, not a handoff document, decides how it moves.

## What this set is meant to prove

Taken together, these four cover a decent spread: computed geometry, GPU shader effects, a real offline render pipeline, and a single-purpose animation editor. None of them is a product. All of them solved a specific problem on a specific project faster than the alternative, and each took hours rather than sprints.

That's the argument. The interesting question about AI-built software isn't whether it can produce another gradient generator — it's whether it lowers the cost of a bespoke tool far enough that building one becomes the obvious move. Once it does, the ceiling on what a small team can make stops being "what features does our design tool support" and starts being "what do we actually want."

You can try the live demos for the first three on the Toolcraft site, and if you want to start building your own, the starter kit post has everything you need to get going.

