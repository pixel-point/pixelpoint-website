import React from 'react';

import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-center text-white">
    <div className="container">
      <h1 className="text-6xl font-normal leading-snug">Case studies</h1>
      <p className="mt-2.5 font-normal leading-snug">
        A full-fledged marketing platform worthy of unmatched OS load testing tool
      </p>
      <img className="mt-16" src={illustration} alt="" loading="eager" aria-hidden />
    </div>
  </section>
);

export default Hero;
