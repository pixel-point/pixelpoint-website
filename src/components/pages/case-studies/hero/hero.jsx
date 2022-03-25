import React from 'react';

import ImagePlaceholder from 'components/shared/image-placeholder';

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
    </div>

    <div className="mt-14 flex justify-center lg:mt-11 md:mt-10 sm:hidden" aria-hidden>
      <ImagePlaceholder className="mx-2" width={1270} height={134}>
        <img src={illustration} alt="" loading="eager" />
      </ImagePlaceholder>
    </div>

    <div className="mt-4 hidden justify-center sm:flex" aria-hidden>
      <ImagePlaceholder className="mx-1 w-full max-w-[414px]" width={466} height={90}>
        <img src={illustrationSm} alt="" loading="eager" />
      </ImagePlaceholder>
    </div>
  </section>
);

export default Hero;
