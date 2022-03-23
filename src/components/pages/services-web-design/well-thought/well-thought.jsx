import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const WellThought = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container">
      <h2 className="mx-auto max-w-[800px] text-center text-6xl font-normal leading-snug lg:max-w-[580px] lg:text-[42px] md:max-w-[550px] md:text-4xl sm:text-2xl">
        Ensure user comfort with a <span className="text-red">Well-thought</span> product design
      </h2>
      <StaticImage
        className="mt-20 rounded-2xl lg:mt-14 lg:rounded-xl md:mt-11 sm:mt-6"
        imgclassName="rounded-2xl lg:rounded-xl"
        src="../well-thought/images/illustration.jpg"
        alt=""
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default WellThought;
