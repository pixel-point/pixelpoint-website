---
title: 'Speed up your development with this new VS Code extension'
author: Alex Barashkov
summary: My friend and I recently have developed a VS Code extension called Snipsnap. We see it as a solution to the existing problem with code snippets collections.
cover: cover.jpg
category: Development
---

My friend and I recently developed VS Code extension – [Snipsnap](https://github.com/snipsnapdev/snipsnap) - that aims to solve the existing problem with code snippets collections.

[Snipsnap](https://github.com/snipsnapdev/snipsnap) is the ultimate snippets collection and VS Code extension that automatically exposes all available snippets for every library you are using in your project.

![Snipsnap](snipsnap.gif)

We already have snippets for React, Redux, Gatsby, Next.js, Vue. The full list of snippets you can find [there](https://github.com/snipsnapdev/snipsnap/tree/master/snippets/javascript).

## 🔥 What problem Snipsnap is trying to solve?

**Problem #1**
Almost every popular language has a lot of different libraries that people used to use. Some of them big, some are small. For each library, you should keep in mind a lot of different syntax constructions in order to use them. Code snippets help to fix it, but you don't want to create and you will not install extensions for each small library. Instead of it we want to have a single Snipsnap extension that will fetch relevant code snippets based on languages, packages you use in your current project.

**Problem #2**
Different snippets extensions follow different rules and use unpredictable shortcuts such as "rccp", "ecrp", 'impp' etc. Having those unreadable shortcuts don't allow you to actually search across all snippets you have for a specific case. We want to change it by standardizing snippets format and providing clean, predictable search syntax such as library-name keyword, so you can always type the name of your library and get a full list of snippets available for it.

**Problem #3**
Each IDE has individual snippets format that does not compatible with other IDEs. So having independent snippets format could allow us to create Snipsnap extensions for each popular IDEs and using converters transform snippets from one format to another.

## 🛠️ How it works

Snipsnap VS Code extension scans your package.json(or yarn.lock) and searches on the server available snippets for packages you have in the project. It means that you don't need anymore install different extensions with snippets for frameworks, libraries you use.

Snipsnap extension creates snipsnap.code-snippets inside .vscode folder with all snippets, so snippets will be available even for other developers who did not install extension.

Snipsnap scans for newly available snippets:

- on folder opening
- on pressing command "Snipsnap: Fetch the snippets" via the command palette All snippets currently present in this repository and follow the guidelines described below.

## 🗓️ Our plans and vision

The current version could be called MVP and it's there just for the one purpose – test the idea and get first feedbacks. If you like extension - star the repository, tell us about your experience or help us to improve the project.

We don't want to stop just on having snippets for Javascript. We want to make it standard for all popular languages and their package managers. So cover Ruby, Go, Python, PHP libraries also in our plans.

We believe that snippets could become a perfect solution for providing simple documentation and examples. Code snippets should become the part of packages repositories like README files. You build your library, you put snippets together with it in .snipsnap.json file and then we fetch it.

Having standardized collection could allow us to write extensions and converters for all popular IDE's, that will finally make code snippets independent from IDE. Let's say in a couple of years the new awesome IDE will be released, instead of writing a whole batch of snippets for new IDE you will be able to just continue using Snipsnap and the collection you already created.

## 💡 Your feedback matters

We are very curious to know what do you think about Snipsnap. Let us know by leaving a comment or submitting an issue on [Github](https://github.com/snipsnapdev/snipsnap).
