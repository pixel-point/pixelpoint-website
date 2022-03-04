import React from 'react';

import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-center text-white lg:pt-32 md:pt-28 sm:pt-20">
    <div className="container">
      <h1 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
        Case studies
      </h1>
      <p className="mt-2.5 text-2xl lg:text-xl sm:text-lg">
        See how we have helped our customers achieve their goals
      </p>
      <img
        className="mt-16 lg:mt-12 md:mt-10 sm:mt-8"
        src={illustration}
        alt=""
        loading="eager"
        aria-hidden
      />
    </div>
  </section>
);

export default Hero;
