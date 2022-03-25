import React from 'react';

import illustrationSm from './images/illustration-sm.svg';
import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings overflow-hidden bg-black pt-32 text-center text-white sm:pt-24">
    <div className="container">
      <h1 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
        Case studies
      </h1>
      <p className="mt-2.5 text-2xl lg:text-xl md:text-lg sm:text-base">
        See how we have helped our customers achieve their goals
      </p>
      <div className="mt-14 flex justify-center lg:mt-11 md:mt-10 sm:mt-4" aria-hidden>
        <img className="sm:hidden" src={illustration} alt="" loading="eager" />
        <img className="hidden sm:block" src={illustrationSm} alt="" loading="eager" />
      </div>
    </div>
  </section>
);

export default Hero;
