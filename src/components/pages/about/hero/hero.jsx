import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const Hero = () => (
  <section className="safe-paddings overflow-hidden bg-black pt-36 text-center text-white md:pt-32 sm:pt-24">
    <div className="container">
      <h1 className="with-text-highlight-red relative z-10 mx-auto max-w-[660px] text-center text-6xl font-normal leading-snug lg:max-w-[570px] lg:text-[42px] md:max-w-[440px] md:text-4xl sm:max-w-[290px] sm:text-2xl">
        Meet the <span>Pixel Point</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[864px] text-2xl leading-snug sm:text-xl">
        Half a decade we’ve been on a mission to help our clients’ companies reveal their full
        potential by designing and building outstanding world-class marketing websites.
      </p>
      <div className="flex flex-col items-center">
        <StaticImage
          className="mt-32 text-center md:mt-24 sm:mt-20 sm:w-[125%] xs:mt-16 xs:w-[150%]"
          src="./images/team-members.png"
          alt="Pixel Point team members"
          width={1216}
          height={800}
          loading="eager"
        />
      </div>
    </div>
  </section>
);

export default Hero;
