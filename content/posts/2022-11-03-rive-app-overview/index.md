---
title: 'Web animation experience with Rive'
summary: Discover Rive app - a modern tool for creating well-performing interactive animations that you can run anywhere. Find out what I've learned about its features and limitations during a year of using it.
author: Yaroslav Demidov
cover: cover.jpg
category: Design
---

Motion design industry has a lot of great tools, and it’s rather easy nowadays to create stunning visual effects and animations. Most of that technological progress was driven by the movie industry and the needs of video makers creating new blockbusters or TV shows.

I’ve been working in the design space for over 10 years and I have switched to motion design about five years ago. At Pixel Point, I help to bring creative motion design into the projects, and I must say that building animations for web was not as simple as doing it for video production.

When you think about motion design in web, there are several options you can go with:

- Use video
- Develop fully native, manually created animations (e.g. framer-motion, threejs)
- Use solutions like Lottie, [Rive](https://rive.app/), or Spline

In this article, we’re going to talk about [Rive](https://rive.app/): why it is revolutionising the way motion design is done in the web, when you should use it, and how it performs in comparison with Lottie.

I was using Lottie for many years, but one day, I got stuck with the performance issues of one specific animation. No matter how I tried to optimize it within Lottie framework, it simply did not work. That day, after some research, I discovered Rive. I reimplemented the animation in Rive, and I was shocked to see all the performance issues gone. No freezes or lags even on a low performing machine. This recent tweet from Rive’s founder is totally aligned with my experiments.

https://twitter.com/guidorosso/status/1580267624050532352?s=20&t=vOgDMFrOJ0AVVlSjVGeksg

## What is Rive?

Rive is a modern tool for creating well-performing interactive animations that you can run anywhere. It is simple to use, works great with vector graphics, has a nice developer toolkit and many powerful features like state machine and mesh deformation. It’s a pretty new tool (at the time of publication, November 2022), and the available version is 0.8.9. However, even in that state, Rive outperforms some of its competitors and has a potential to soon become the industry standard for 2D animations.

## What’s great in Rive?

Rive is great. My top features list is:

### Performance

The major advantage for me is performance (in the scope of web animations). It is achieved by better architecture and by Rive WASM runtime library that handles all the calculations.

### Size

Animation size is also significantly lower compared to Lottie files. Most of the time, if you use only 2D objects, it will be about a couple of KB.

### State machine

Rive makes animations interactive - you can control the state of animation from your code, loop it’s parts or define the transition from one state to another. This is not possible to do with Lottie. It allows the creation of complex animations that react to mouse hover, clicks, movement, or changing the state based on the input value.

<Video src="https://pixel-point-website.s3.amazonaws.com/posts/2022-11-03-rive-app-overview/state-machine.mp4" width="1280" height="720" autoPlay muted loop playsInline></Video>

### Runs anywhere

Rive animation is easily exported and can b run on any platform - iOS, macOS, Android, Windows, Web.

### Mesh deformations

It’s a way to apply natural deformations to an object by connecting multiple points together into a mesh for further chained manipulations.

It’s not everything that Rive can, you can find better visualisation of everything that works perfectly at the moment on their [website](https://rive.app/features).

## What’s my workflow in Rive?

Despite Rive advertising their Editor as a primary source for the creation of animations, I still find it less productive to use in comparison with Adobe After Effect. That’s why I prototype and design animations in AE at first, and in the late stages, when everything is approved, export it to Rive. The export process is quite simple, and you can use the bodymoving AE plugin to do it. It will require some additional bug fixes and tuning after the export, but it’s still worth it considering that I spend less time on the initial stage. However in case of some trivial animations I do it directly in Rive.

## What are the limitations?

Rive is rapidly growing, its team introduces new feature quickly, so everything below is valid to the date of publication.

### Blur, Glow, Shadows

If you prototyping some animation that has a lot of light effects, it can be hard to do it in Rive. There is no native support for effects like blur, glow, or shadows. If it’s used ocassionaly and in a certain condition, sometimes it’s possible to work it around by adding rasterised light or blue images to create a similar effect. But if it’s used quite a lot, you should better consider using Lottie or developing an animation natively with the help of frame-motion or threejs. As far as I know, Rive has some ideas on how to fix, and maybe soon we will see it.

### Dotted lines

Another feature that you can often meet in some application mockups or diagrams that for the time being is missing in Rive.

### Elements alignment

You can’t align elements center, left or right.

### Moving an object along a bézier curve

For example, if you need to have a vagon going over the curved road or a rollercoaster that also has to slow down and speed up according to the laws of physics, it might be hard to do in Rive. You will need to manually add a lot of keyframes replicating that road, as well as defining the transition functions between them. Fortunately, you can do it in AE, export it to Rive and tweak it to a perfect state. It’s a high demand feature that pops up quite often.

In After Effect we just have to points and a curve and can make object move between them.
<Video src="https://pixel-point-website.s3.amazonaws.com/posts/2022-11-03-rive-app-overview/bezier-after.mp4" width="1280" height="720" autoPlay muted loop playsInline></Video>

In Rive to achieve similar effect we need to create more points. The more keyframes we create, the smoother the movement will be.
<Video src="https://pixel-point-website.s3.amazonaws.com/posts/2022-11-03-rive-app-overview/bezier-rive.mp4" width="1280" height="720" autoPlay muted loop playsInline></Video>

### Mask on a stroke

Currently, you can use only a fill mask, but sometimes it’s useful to have the mask on a stroke. Since we talk about mask here, let’s also add that you can’t invert or subtract it.

### Disable files for exporting

I often use png layer export from some design tools to match an animation key frame made in Rive with the reference. But once you add it to the artboard, you need to make sure that before the export you will remove that layer from the board, otherwise it will drastically increase the `.riv` file size.

### Animation / Design tabs splitting

I often have cases when I need to change the object size without animating it, but the problem is that the object is only visible at a specific time of the animation. So you have to scroll the timeline to a specific point in time, then change sizes there, but in that case new keyframe will be created, so you have to remove the keyframe in Animation, then move to Design tab and insert the copied element size there. When you have to change those things on a curve with many points, it becomes quite annoying.

### Changes of canvas size

You can’t change the size of the canvas by just pulling the edge while keeping all the objects at the same place and you can't extend the canvas from a specific side.

<Video src="https://pixel-point-website.s3.amazonaws.com/posts/2022-11-03-rive-app-overview/canvas-resize.mp4" width="1280" height="720" autoPlay muted loop playsInline></Video>

### Native app

Having a web app in browser is good, but it would be great to have a native OS implementation.

### Slow zoom

Zoom in the editor feels very slow, so you have to really scroll the wheel a lot to zoom in.

## Summary

Rive is an amazing and promising tool that already can cover plenty of motion design tasks. However, it has certain limitations, and knowing them can help you decide whether you should go with Rive or try the alternatives.

- If you have extensive light effects, blur, shadow, and dotted lines effects in the animation, maybe you should consider using Lottie instead, or go with a native implementation.
- If you have a lot of moving objects on the page, be careful. Performance is great but it has some limits anyway.
- If you need elements that keep some physical properties, accelerating and slowing down correctly based on the weight of the object, AE will be a better choice for the development with a potential to be exported to Rive if necessary.

Rive works great for everything else and can be used to create interactive web components, animating 2d characters, or making some mockup animations.
