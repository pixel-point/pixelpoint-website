<h1 align="left">
  Pixel Point — Web Design and Development
</h1>

<p align="left">
<a href="https://twitter.com/intent/follow?screen_name=alex_barashkov">
  <img alt="Follow on Twitter" src="https://img.shields.io/twitter/follow/alex_barashkov?color=%23ee2b6c&label=Follow%20Pixel%20Point%20on%20Twitter&labelColor=black&logoColor=%23ee2b6c&style=for-the-badge" />
</a>
<a href="https://app.netlify.com/sites/pixelpoint-website/deploys" alt="Netlify Status">
  <img src="https://img.shields.io/netlify/d25e0926-7706-4f32-b200-3231fdff5e79?label=Netlify%20build&labelColor=black&style=for-the-badge" />
</a>
</p>

<p align="center">
  <a href="https://www.pixelpoint.io">
    <img alt="Gatsby" src="https://pixelpoint.io/images/social-preview.jpg" />
  </a>
</p>

## Table of Contents

- [Welcome](#welcome)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Run the website](#run-the-website)
  - [Build the website](#build-the-website)
  - [Run the built website](#run-the-built-website)
  - [Clean Gatsby cache](#clean-gatsby-cache)
- [Project Structure](#project-structure)
- [Component Folder Structure](#component-folder-structure)
  - [Each component includes](#each-component-includes)
  - [Each component optionally may include](#each-component-optionally-may-include)
  - [Example structure](#example-structure)
- [Code Style](#code-style)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [VS Code](#vs-code)
- [Contribution](#contribution)

## Welcome

Hello there! This repo is a home to Pixel Point, a web agency that designs and develops world-class marketing websites. We made this codebase available to open source community so everyone can get something useful out of our expertise, be it for project structure, code patterns or plugins.

Below you will find some basic information about how to work with this project. If you've spotted a bug, a copywriting mistake or just want to suggest some better solution, please, refer to the [contribution](#contribution) section.

## Getting Started

1. Clone repository

```bash
git clone git@github.com:pixel-point/pixelpoint-website.git
```

2. Install dependencies

```bash
npm install
```

3. Add `.env` file

```bash
cp .env.example .env
```

## Usage

### Run the website

```bash
npm run start
```

### Build the website

```bash
npm run build
```

### Run the built website

```bash
npm run serve
```

### Clean Gatsby cache

```bash
npm run clean
```

## Project Structure

```text
├── content
│   ├── case-studies
│   └── posts
├── src
│   ├── components
│   │   ├── pages — React components that are being used specifically on a certain page
│   │   └── shared — React components that are being used across the whole website
│   ├── constants
│   ├── hooks
│   ├── images
│   ├── pages
│   ├── styles
│   ├── templates
│   ├── utils
│   └── html.jsx
├── static
│   ├── animations
│   │   ├── pages — Rive animation files that are being used specifically on a certain page
│   │   └── shared — Rive animation files that are being used across the whole website
│   ├── fonts
│   └── images
├── gatsby-browser.js
├── gatsby-config.js
├── gatsby-node.js
├── gatsby-ssr.js
└── tailwind.config.js
```

## Component Folder Structure

### Each component includes

1. Main JavaScript File
2. Index File

### Each component optionally may include

1. Folder with images and icons
2. Folder with data

Also, each component may include another component that follows all above listed rules.

### Example structure

```bash
component
├── nested-component
│  ├── data
│  │  └── nested-component-lottie-data.json
│  ├── images
│  │  ├── nested-component-image.jpg
│  │  ├── nested-component-inline-svg.inline.svg
│  │  └── nested-component-url-svg.svg
│  ├── nested-component.js
│  └── index.js
├── data
│  └── component-lottie-data.json
├── images
│  ├── component-image.jpg
│  ├── component-inline-svg.inline.svg
│  └── component-url-svg.svg
├── component.js
└── index.js
```

## Code Style

### ESLint

[ESLint](https://eslint.org/) helps find and fix code style issues and force developers to follow same rules. Current configuration is based on [Airbnb style guide](https://github.com/airbnb/javascript).

Additional commands:

```bash
npm run lint
```

Run it to check the current status of eslint issues across project.

```bash
npm run lint:fix
```

Run it to fix all possible issues.

### Prettier

[Prettier](https://prettier.io/) helps to format code based on defined rules. [Difference between Prettier and ESLint](https://prettier.io/docs/en/comparison.html).

Additional commands:

```bash
npm run format
```

Run it to format all files across the project.

### VS Code

Following extensions required to simplify the process of keeping the same code style across the project:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

After installation enable "ESLint on save" by adding to your VS Code settings.json the following line:

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

You can navigate to settings.json by using Command Pallete (CMD+Shift+P) and then type "Open settings.json".

To enable Prettier go to Preferences -> Settings -> type "Format". Then check that you have esbenp.prettier-vscode as default formatter, and also enable "Format On Save".

Reload VS Code and auto-format will work for you.

## Contribution

Contribution is highly welcomed!

If there is a bug you've encountered, an occasional typo or just want to ask something, don't hesitate to raise and issue or even make a PR.

There are no special contribution guidelines, just use your common sense, keep your changes cohesive with the overall code style and leverage the project info above.

When raising an issue or making a pull request, please do use appropriate labels.

Thank you!

## License

All assets and code are under the [MIT LICENSE](/LICENSE) and in the public domain unless specified otherwise.

The client logos are trademarks of their respective companies and are under their terms and license.
