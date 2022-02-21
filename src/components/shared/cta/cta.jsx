import React from 'react';

import Link from 'components/shared/link';
import Arrow from 'images/arrow.inline.svg';

import illustration from './images/illustration.svg';

const CTA = () => (
  <section className="safe-paddings mt-52 bg-black py-32 lg:mt-44 lg:py-28 md:mt-36 md:py-24">
    <div className="container grid-gap-x grid grid-cols-2 items-center">
      <div className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl">
        <h2 className="text-white">Let's have a chat</h2>
        <Link className="text-red" to="mailto:info@pixelpoint.io">
          Schedule a call
          <Arrow className="ml-4 inline-block h-7 lg:ml-3 lg:h-6 md:ml-2 md:h-5" aria-hidden />
        </Link>
      </div>
      <img src={illustration} alt="" loading="lazy" aria-hidden />
    </div>
  </section>
);

export default CTA;
