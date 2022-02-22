import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const Hero = () => (
  <section className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:overflow-hidden sm:pt-20">
    <div className="container">
      <h1 className="mx-auto max-w-[700px] text-center text-6xl font-normal leading-snug lg:max-w-[600px] lg:text-5xl md:max-w-[450px] md:text-4xl sm:text-3xl xs:text-2xl">
        Bring the power of <span className="text-red">JAMStack</span> to your project
      </h1>
      <div className="mt-16 lg:mt-12 md:mt-10 sm:mt-8 sm:flex sm:justify-center sm:text-center">
        <StaticImage
          className="sm:min-w-[450px] sm:max-w-[450px] xs:min-w-[400px] xs:max-w-[400px]"
          src="./images/illustration.jpg"
          alt=""
          loading="eager"
          formats={['jpg']}
          quality={100}
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Hero;
