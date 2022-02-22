import React from 'react';

import CheckIcon from './images/check.inline.svg';
import illustrationBackground from './images/illustration-background.svg';

const illustrationItems = [
  ['Prettier', 'ESLint', 'Lighthouse CI'],
  ['Webpack bundle with pre/post processing'],
  ['MarkdownLint', 'Conventional commits'],
];

const CodeQuality = () => (
  <section className="safe-paddings bg-black py-80 lg:py-64 md:pt-52 sm:py-32">
    <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl md:max-w-none md:text-4xl sm:text-3xl xs:text-2xl">
          Developed with industry best practices
        </h2>
        <p className="mt-5 max-w-[520px] md:mt-4 md:max-w-none sm:mt-3">
          A lean and maintainable code base as a guaranteed part of Pixel Point front-end
          development services.
        </p>
      </div>
      <div className="relative col-span-6 flex items-center justify-center md:mt-8 sm:mt-6">
        <ul className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8 lg:space-y-6 sm:space-y-6">
          {illustrationItems.map((items, index) => (
            <li className="flex justify-center space-x-8 lg:space-x-6 sm:space-x-3.5" key={index}>
              {items.map((item, index) => (
                <span
                  className="flex items-center rounded-full bg-white p-6 pr-8 lg:p-5 sm:p-3.5 xs:p-3"
                  key={index}
                >
                  <CheckIcon className="h-8 sm:h-5 xs:h-4" />
                  <span className="ml-4 whitespace-nowrap text-base font-semibold lg:ml-3 sm:ml-1.5 sm:text-xs xs:ml-1 xs:text-[11px]">
                    {item}
                  </span>
                </span>
              ))}
            </li>
          ))}
        </ul>
        <img
          className="lg:max-w-[440px] sm:max-w-[328px] xs:max-w-[288px]"
          src={illustrationBackground}
          alt=""
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default CodeQuality;
