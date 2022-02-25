import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

import IllustrationHeartIcon from './images/illustration-heart.inline.svg';

SyntaxHighlighter.registerLanguage('jsx', jsx);

// If you are replacing the code, don't forget to fix the code and remove cursor-pointer classes
const illustrationCode = `<article className="flex overflow-hidden rounded-2xl">
  <StaticImage className="h-56 w-52 shrink-0" imgClassName="rounded-l-2xl object-center" src="./illustration.jpg" loading="lazy" alt="" />
  <div className="bg-white px-7 py-5">
    <h1 className="max-w-[240px] text-xl font-semibold leading-snug">Welcome to Conference in London</h1>
    <p className="mt-2 text-sm font-normal text-gray-7">The home of global innovators, disruptors, and tech leaders. Registration is open!</p>
    <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5">
      <button className="flex h-11 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white">Join now</button>
      <HeartIcon className="h-11" />`;

const Tailwindcss = () => (
  <section className="safe-paddings bg-black pt-80 lg:pt-64 md:pt-52 sm:pt-24">
    <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl md:max-w-none md:text-4xl sm:text-3xl xs:text-2xl">
          Pixel-perfect interface styled with <span className="text-red">TailwindCSS</span>
        </h2>
        <p className="mt-5 max-w-[420px] md:mt-4 md:max-w-none sm:mt-3">
          Scalable, adaptive and highly customizable styling solution with a tiny CSS bundle size.
        </p>
      </div>
      <div className="col-span-6 md:mt-8 sm:mt-6" aria-hidden>
        <div className="flex overflow-hidden rounded-2xl sm:block">
          <StaticImage
            className="h-56 w-52 shrink-0 lg:h-48 lg:w-44 md:h-56 md:w-52 sm:w-full"
            imgClassName="rounded-l-2xl object-center sm:rounded-t-2xl sm:rounded-bl-none sm:object-[50%_40%]"
            src="./images/illustration-photo.jpg"
            loading="lazy"
            alt=""
          />
          <div className="bg-white px-7 py-5 lg:px-4 md:px-7 sm:p-4">
            <div className="max-w-[240px] text-xl font-semibold leading-snug lg:max-w-[210px] lg:text-lg md:max-w-[240px] md:text-xl">
              Welcome to Conference in London
            </div>
            <div className="mt-2 text-sm font-normal text-gray-7 lg:text-xs md:text-sm">
              The home of global innovators, disruptors, and tech leaders. Registration is open!
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5 lg:mt-3.5 lg:pt-4 md:mt-4 md:pt-5">
              <span className="flex h-11 cursor-pointer items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white lg:h-10 lg:px-5 lg:text-xs md:h-11 md:px-7 md:text-sm">
                Join now
              </span>
              <IllustrationHeartIcon className="h-11 cursor-pointer lg:h-10 md:h-11" />
            </div>
          </div>
        </div>
        <SyntaxHighlighter
          className="code-block mt-8 p-3 text-sm lg:p-2 lg:text-[13px] md:p-3 md:text-sm sm:hidden"
          language="jsx"
          useInlineStyles={false}
          showLineNumbers
        >
          {illustrationCode}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          className="code-block mt-6 hidden p-2 text-[13px] sm:block xs:text-xs"
          language="jsx"
          useInlineStyles={false}
        >
          {illustrationCode}
        </SyntaxHighlighter>
      </div>
    </div>
  </section>
);

export default Tailwindcss;
