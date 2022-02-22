import React from 'react';

import illustration from './images/illustration.svg';

const GuideAndEngage = () => (
  <section className="safe-paddings mt-52 bg-black py-52 text-white">
    <div className="container">
      <h2 className="mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug">
        <span className="text-red">Guide and engage</span> your customers with sleek, on-point
        animations
      </h2>
      <img className="mt-20 rounded-2xl" src={illustration} alt="" aria-hidden />
    </div>
  </section>
);

export default GuideAndEngage;
