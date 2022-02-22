import React from 'react';

import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white">
    <div className="container">
      <h1 className="mx-auto max-w-[700px] text-center text-6xl font-normal leading-snug">
        Get your idea shaped into <span className="text-red">Astonishing</span> website
      </h1>
    </div>

    <img className="mx-auto mt-10" src={illustration} alt="" aria-hidden />
  </section>
);

export default Hero;
