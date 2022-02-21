import React from 'react';

import CheckIcon from './images/check.inline.svg';
import illustrationBackground from './images/illustration-background.svg';

const illustrationItems = [
  ['Prettier', 'ESLint', 'Lighthouse CI'],
  ['Webpack bundle with pre/post processing'],
  ['MarkdownLint', 'Conventional commits'],
];

const CodeQuality = () => (
  <section className="safe-paddings bg-black py-80 lg:py-64">
    <div className="container grid-gap-x grid grid-cols-12 items-center">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl">
          Developed with industry best practices
        </h2>
        <p className="mt-5 max-w-[520px]">
          A lean and maintainable code base as a guaranteed part of Pixel Point front-end
          development services.
        </p>
      </div>
      <div className="relative col-span-6 flex items-center justify-center">
        <ul className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8 lg:space-y-6">
          {illustrationItems.map((items, index) => (
            <li className="flex justify-center space-x-8 lg:space-x-6" key={index}>
              {items.map((item, index) => (
                <span
                  className="flex items-center rounded-full bg-white p-6 pr-8 lg:p-5"
                  key={index}
                >
                  <CheckIcon className="h-8" />
                  <span className="ml-4 whitespace-nowrap text-base font-semibold lg:ml-3">
                    {item}
                  </span>
                </span>
              ))}
            </li>
          ))}
        </ul>
        <img className="lg:max-w-[440px]" src={illustrationBackground} alt="" aria-hidden />
      </div>
    </div>
  </section>
);

export default CodeQuality;
