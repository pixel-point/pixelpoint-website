import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20">
    <div className="container">
      <h1 className="mx-auto max-w-[700px] text-center text-6xl font-normal leading-snug lg:max-w-[600px] lg:text-5xl md:max-w-[450px] md:text-4xl sm:max-w-[400px] sm:text-3xl xs:max-w-[300px] xs:text-2xl">
        Bring the power of <span className="text-red">JAMStack</span> to your project
      </h1>
      <StaticImage
        className="mt-16 lg:mt-12 md:mt-10 sm:mt-8"
        src="./images/illustration.jpg"
        alt=""
        loading="eager"
        formats={['jpg']}
        quality={100}
        aria-hidden
      />
    </div>
  </section>
);

export default Hero;
