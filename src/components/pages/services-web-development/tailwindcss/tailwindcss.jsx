import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

import IllustrationHeartIcon from './images/illustration-heart.inline.svg';

SyntaxHighlighter.registerLanguage('jsx', jsx);

// If you are replacing the code, don't forget to fix the code and remove cursor-pointer classes
const illustrationCode = `<article className="flex overflow-hidden rounded-2xl">
  <StaticImage className="w-52 shrink-0" src="./photo.jpg" loading="lazy" alt="" />
  <div className="bg-white px-7 py-5">
    <h1 className="max-w-[240px] text-xl font-semibold leading-snug">Welcome to Conference in London</h1>
    <p className="mt-2 text-sm font-normal text-gray-7">Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.</p>
    <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5">
      <button className="flex h-11 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white">Read more</button>
      <HeartIcon className="h-11" />
    </div>
  </div>
</article>`;

const Tailwindcss = () => (
  <section className="safe-paddings bg-black pt-80 lg:pt-64">
    <div className="container grid-gap-x grid grid-cols-12 items-center">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl">
          Pixel-perfect interface styled with <span className="text-red">TailwindCSS</span>
        </h2>
        <p className="mt-5 max-w-[420px]">
          Scalable, adaptive and highly customizable styling solution with a tiny CSS bundle size.
        </p>
      </div>
      <div className="col-span-6" aria-hidden>
        <div className="flex overflow-hidden rounded-2xl">
          <StaticImage
            className="w-52 shrink-0 lg:w-44"
            src="./images/illustration-photo.jpg"
            loading="lazy"
            alt=""
          />
          <div className="bg-white px-7 py-5 lg:px-4">
            <div className="max-w-[240px] text-xl font-semibold leading-snug lg:max-w-[210px] lg:text-lg">
              Welcome to Conference in London
            </div>
            <div className="mt-2 text-sm font-normal text-gray-7 lg:text-xs">
              Kube Forwarder app as an alternative for native built-in Kubernetes port forwarding.
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5 lg:mt-3.5 lg:pt-4">
              <span className="flex h-11 cursor-pointer items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white lg:h-10 lg:px-5 lg:text-xs">
                Read more
              </span>
              <IllustrationHeartIcon className="h-11 cursor-pointer lg:h-10" />
            </div>
          </div>
        </div>
        <SyntaxHighlighter
          className="code-highlight scrollbar-hidden mt-8 overflow-scroll rounded-2xl bg-gray-9 p-3 text-sm lg:p-2 lg:text-xs"
          language="jsx"
          useInlineStyles={false}
          showLineNumbers
        >
          {illustrationCode}
        </SyntaxHighlighter>
      </div>
    </div>
  </section>
);

export default Tailwindcss;
