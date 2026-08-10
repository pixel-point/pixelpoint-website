---
title: 'Four creative tools we built with Toolcraft, and why none of them are toys'
summary: 'While building Toolcraft''s own site, we ended up shipping four small creative tools: a math-driven three.js scene, a sticker-and-shader mockup app, a web UI that renders in real Blender, and a bespoke editor for animating one website section. Here''s what each one solves and why bespoke tools beat generic ones.'
author: Alex Barashkov
cover: cover.png
category: Updates
---

Most AI-built demos you scroll past are variations on the same thing: a flat pattern generator, a gradient mesh, maybe a spinning cube. They look fine in a video and then you close the tab. That's the reputation problem — the assumption that anything assembled this quickly is a toy.

While working on the site for Toolcraft, the approach to building personal design tools [we introduced earlier](/blog/how-to-craft-personal-design-tools-with-toolcraft), we kept building small apps to fill it with real demos. Four of them turned out to be genuinely useful, and each one does something the generic demos can't. Here they are, and more importantly, what problem each one actually solves.

## Math, not vibes

The first one looks like a Blender render. It isn't — it's a three.js app, meaning it runs live in the browser, and the geometry you see is generated from equations rather than modelled by hand.

<Video src="/x-video/amplify_video/2078123186240053601/vid/avc1/1920x1080/imQSuWnHjRkQxJZ1.mp4" width="3840" height="2160" controls muted poster="./video-cover-1.jpg"></Video>

That distinction matters more than it sounds. When a shape comes out of a formula, every part of it is a number you can turn: how many segments, how tightly it twists, how the surface falls away from the light. Change the number, get a new shape — and get it consistently, over and over, instead of nudging bezier handles until something looks right.

![The generated three.js scene running in the browser, with parameter sliders controlling the geometry and lighting](image-1.jpg)

This is the case where AI-assisted building is disproportionately powerful. Writing parametric geometry by hand means remembering the trigonometry and debugging it in your head. Describing the shape you want and then tuning the exposed parameters gets you to the same place without the detour. If you've ever wanted a hero visual that's yours rather than a stock 3D asset everyone else also bought, this is the shortest route to one.

The demo is live on the Toolcraft site, so you can drag the controls yourself.

## Stickers, shaders, and product shots

The second app started as an experiment inspired by a post from [@FonsMans](https://x.com/FonsMans), mixed with [Paper](https://paper.design/) shaders. You upload a 3D model, drop stickers onto its surface, tweak the shader settings, and pull out a good-looking shot.

<Video src="/x-video/amplify_video/2077098248326582534/vid/avc1/1920x1080/GXBKPpX8oKt0Kdfk.mp4" width="3840" height="2160" controls muted poster="./video-cover-2.jpg"></Video>

"Shader" is one of those words that scares people off, so: a shader is a small program that decides what a surface looks like when light hits it — how glossy, how translucent, how the colour shifts across a curve. Paper's shaders are the nice, art-directed kind rather than the physically accurate kind, which is exactly what you want for marketing visuals.

The practical version of this: say you're launching a small hardware product, or you just want a branded object for a landing page. Normally that's a designer, a 3D app, and a half-day round trip for every variant. Here it's upload, place your logo where you want it, change the material until it reads well, export. Ten variants in the time the old loop takes to produce one.

![The sticker tool interface, with a 3D model in the viewport and controls for placing decals and adjusting the shader](image-2.jpg)

## Customise on the web, render in Blender

The third one is the one I'm most attached to, because it steps outside the browser entirely.

Everything three.js does in a browser is an approximation. Depth of field — the way a real camera keeps one plane sharp and blurs the rest — is faked. Focal length is emulated. It's close enough for interaction, and it's obvious the moment you put it next to a real render.

So we didn't fake it. The app gives you a web interface to set up the scene — camera, lens, materials, arrangement — and then hands the job to Blender, a full production renderer, to produce the final image.

<Video src="/x-video/amplify_video/2074492797260870072/vid/avc1/1920x1080/e2Ibg8OGpPy_KL_e.mp4" width="3840" height="2160" controls muted poster="./video-cover-3.jpg"></Video>

What you get is the combination that usually doesn't exist: the accessibility of a web UI with the output quality of the tool professionals actually ship with. No installing Blender, no learning its interface, no hunting for the node that controls the thing you want. Someone on the marketing side can produce a genuinely photographic asset without ever opening a 3D application.

![A web control panel for scene setup next to the resulting Blender-rendered image with real depth of field](image-3.jpg)

While most of the AI-app conversation is still about flat pattern generators, this is where it gets interesting: using the browser as a control surface for real production software.

## A tool built for one website section

I don't usually share work in progress, but this last one makes the argument better than the finished ones do.

We needed a specific animated section for a website. Rather than fight a general-purpose animation tool into shape, we built a small editor whose only job is designing and animating that one section.

<Video src="/x-video/amplify_video/2079936269962850344/vid/avc1/1440x1080/BfwJMdiEu_Y5pdo8.mp4" width="3840" height="2880" controls muted poster="./video-cover-4.jpg"></Video>

Everything is exposed and adjustable, and when something is missing, we add it — because the tool is ours. That's the part that's hard to appreciate until you've experienced it. In a commercial design tool, a missing control is a permanent limitation you design around. In a tool you built, it's a fifteen-minute addition. The result is a level of control over a single piece of a page that would be impractical to reach any other way.

## The pattern underneath all four

None of these are products. They're bespoke instruments, each built for one job, and that's precisely why they hold up: a tool that only has to handle one situation can handle it far better than a tool that has to handle every situation.

The reason to pay attention isn't the demos themselves. It's that the cost of building a tool has dropped far enough that "I'll make something for this" is now a reasonable answer to a one-off design problem. The generic AI demo era isn't the ceiling — it's the floor.

All of these are on the Toolcraft site if you want to try them rather than watch them.

