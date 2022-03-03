import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const WellThought = () => (
  <section className="safe-paddings mt-52 lg:mt-44 md:mt-36 sm:mt-20">
    <div className="container">
      <h2 className="mx-auto max-w-[800px] text-center text-6xl font-normal leading-snug lg:max-w-[700px] lg:text-5xl md:max-w-[550px] md:text-4xl sm:text-3xl xs:text-2xl">
        Ensure user comfort with a <span className="text-red">Well-thought</span> product design
      </h2>
      <StaticImage
        className="mt-20 lg:mt-16 md:mt-12 sm:mt-8"
        src="../well-thought/images/illustration.jpg"
        alt=""
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default WellThought;
