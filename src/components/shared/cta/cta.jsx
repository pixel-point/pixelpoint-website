import React from 'react';

import Link from 'components/shared/link';
import Arrow from 'images/arrow.inline.svg';

import illustration from './images/illustration.svg';

const CTA = () => (
  <section className="safe-paddings mt-52 bg-black py-32">
    <div className="container flex items-center justify-between">
      <div className="text-6xl font-normal leading-snug">
        <h2 className="text-white">Let's have a chat</h2>
        <Link className="text-red" to="mailto:info@pixelpoint.io">
          Schedule a call
          <Arrow className="ml-4 inline-block h-7" aria-hidden />
        </Link>
      </div>
      <img src={illustration} alt="" loading="lazy" aria-hidden />
    </div>
  </section>
);

export default CTA;
