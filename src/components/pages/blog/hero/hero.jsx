import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import QuoteIcon from 'images/quote.inline.svg';

import illustration from './images/illustration.svg';
import TwitterIcon from './images/twitter.inline.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 pb-32 text-white">
    <div className="container grid-gap-x grid grid-cols-12">
      <div className="col-span-6">
        <h1 className="text-6xl font-normal leading-snug">
          Sharing Pixel Point <span className="text-red">Collective experience:</span> OS, tools &
          processes
        </h1>
        <figure className="mt-8 border-t border-t-gray-9 pt-8">
          <QuoteIcon className="h-7" aria-hidden />
          <blockquote className="mt-4 text-2xl">
            <p>
              There is a key for sustainable growth and successful future for the humanity, and it
              is <span className="text-red">Open source</span> world with its community shared
              knowlege
            </p>
          </blockquote>
          <figcaption className="mt-5 flex items-center space-x-4">
            <StaticImage
              className="rounded-full"
              imgClassName="rounded-full"
              src="./images/photo.jpg"
              layout="fixed"
              height={48}
              width={48}
              alt="Alex Barashkov's photo"
            />
            <span className="text-base font-normal">Alex Barashkov — CEO at Pixel Point</span>
            <Link
              className="flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold"
              to="https://twitter.com/alex_barashkov"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="h-5" /> <span>Follow</span>
            </Link>
          </figcaption>
        </figure>
      </div>
      <div className="relative col-start-8 col-end-13 flex items-center justify-center">
        <img
          className="absolute left-1/2 -top-16 min-w-[640px] -translate-x-1/2"
          src={illustration}
          alt=""
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Hero;
