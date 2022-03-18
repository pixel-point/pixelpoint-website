import React from 'react';

import illustration from './images/illustration.svg';

const GuideAndEngage = () => (
  <section className="safe-paddings mt-52 bg-black py-52 text-white lg:mt-36 lg:py-36 md:mt-28 md:py-28 sm:mt-20 sm:py-20">
    <div className="container">
      <h2 className="mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug lg:max-w-[800px] lg:text-5xl md:max-w-[650px] md:text-4xl sm:text-3xl xs:text-2xl">
        <span className="text-red">Guide and engage</span> your customers with sleek, on-point
        animations
      </h2>
      <img
        className="mt-20 lg:mt-16 md:mt-12 sm:mt-8"
        src={illustration}
        alt=""
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default GuideAndEngage;
