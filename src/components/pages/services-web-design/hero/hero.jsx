import React from 'react';

import illustration from './images/illustration.svg';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20">
    <div className="container">
      <h1 className="mx-auto max-w-[660px] text-center text-6xl font-normal leading-snug lg:max-w-[570px] lg:text-5xl md:max-w-[440px] md:text-4xl sm:max-w-[360px] sm:text-3xl xs:max-w-[290px] xs:text-2xl">
        Get your idea shaped into <span className="text-red">Astonishing</span> website
      </h1>
      <div className="mt-10 flex justify-center 2xl:block lg:mt-8 md:mt-8 sm:mt-6">
        <img
          className="min-w-[1544px] 2xl:mx-auto 2xl:min-w-0"
          src={illustration}
          alt=""
          loading="eager"
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Hero;
