import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import TwitterIcon from 'images/twitter.inline.svg';

const Author = () => (
  <section className="safe-paddings mt-20 text-white lg:mt-16 md:mt-12 sm:mt-8">
    <div className="container-xs">
      <div
        className="flex space-x-8 rounded-2xl p-8 sm:block sm:space-x-0 sm:space-y-3.5 sm:p-6"
        style={{ background: 'linear-gradient(254.82deg, #333333 0%, #000000 100%)' }}
      >
        <StaticImage
          className="w-20 shrink-0 rounded-full"
          imgClassName="rounded-full"
          src="../../../../images/alex-barashkov.jpg"
          layout="fixed"
          height={80}
          width={80}
          alt="Alex Barashkov"
          loading="lazy"
        />

        <div>
          <h2 className="text-2xl font-normal leading-snug lg:text-xl sm:text-lg">
            Written by <span className="text-red">Alex Barashkov</span>
          </h2>
          <p className="mt-3 md:mt-2.5">
            CEO at Pixel Point. Software engineer with 10+ years of web development experience.
            Currently focused on React, Next.js, Gatsby.
          </p>
          <Link
            className="mt-5 inline-flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold lg:mt-4 md:mt-3.5"
            to="https://twitter.com/alex_barashkov"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon className="h-5" /> <span>Follow on Twitter</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Author;
