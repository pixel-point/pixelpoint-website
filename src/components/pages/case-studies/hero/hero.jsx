import React from 'react';

import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-center text-white">
    <div className="container">
      <h1 className="text-6xl font-normal leading-snug">Case studies</h1>
      <p className="mt-2.5 text-2xl">See how we have helped our customers achieve their goals</p>
      <img className="mt-14" src={illustration} alt="" loading="eager" aria-hidden />
    </div>
  </section>
);

export default Hero;
