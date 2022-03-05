import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import QuoteIcon from 'images/quote.inline.svg';

import illustration from './images/illustration.svg';
import TwitterIcon from './images/twitter.inline.svg';

const Hero = () => (
  <section className="safe-paddings overflow-hidden bg-black pt-40 pb-32 text-white lg:pt-32 lg:pb-28 md:pt-28 md:pb-24 sm:pt-20 sm:pb-16">
    <div className="container grid-gap-x grid grid-cols-12 md:block">
      <div className="col-span-6 lg:col-span-7">
        <h1 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          Sharing Pixel Point <span className="text-red">Collective experience:</span> OS, tools &
          processes
        </h1>
        <figure className="mt-8 border-t border-t-gray-9 pt-8 lg:mt-6 lg:pt-6 sm:mt-4 sm:pt-4">
          <QuoteIcon className="h-7 lg:h-6 sm:h-5" aria-hidden />
          <blockquote className="mt-4 text-2xl lg:mt-3 lg:text-xl sm:mt-2.5 sm:text-lg">
            <p>
              There is a key for sustainable growth and successful future for the humanity, and it
              is <span className="text-red">Open source</span> world with its community shared
              knowlege
            </p>
          </blockquote>
          <figcaption className="mt-5 flex items-center space-x-4 lg:mt-4 lg:space-x-3 md:mt-3.5 md:space-x-2.5 sm:block sm:space-x-0">
            <div className="flex items-center space-x-4 lg:space-x-3 md:space-x-2.5">
              <StaticImage
                className="w-12 shrink-0 rounded-full"
                imgClassName="rounded-full"
                src="./images/photo.jpg"
                layout="fixed"
                height={48}
                width={48}
                alt="Alex Barashkov's photo"
              />
              <span className="text-base font-normal">Alex Barashkov — CEO at Pixel Point</span>
            </div>
            <Link
              className="flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold sm:mt-2.5 sm:inline-flex"
              to="https://twitter.com/alex_barashkov"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="h-5" /> <span>Follow</span>
            </Link>
          </figcaption>
        </figure>
      </div>
      <div className="relative col-start-8 col-end-13 flex items-center justify-center lg:col-start-9 md:mt-12 sm:mt-8">
        <img
          className="absolute left-1/2 -top-16 min-w-[640px] -translate-x-1/2 lg:-top-4 lg:min-w-[480px] md:relative md:left-0 md:top-0 md:mx-auto md:min-w-0 md:max-w-[440px] md:translate-x-0"
          src={illustration}
          alt=""
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Hero;
