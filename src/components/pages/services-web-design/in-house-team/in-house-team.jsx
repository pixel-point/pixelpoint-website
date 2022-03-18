import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const InHouseTeam = () => (
  <section className="safe-paddings bg-black pt-80 lg:pt-64 md:pt-52 sm:pt-32">
    <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl md:max-w-none md:text-4xl sm:text-3xl xs:text-2xl">
          <span className="text-red">In-house team</span> of motion, graphic, and web designers
        </h2>
        <p className="mt-5 max-w-[520px] md:mt-4 md:max-w-none sm:mt-3">
          With years of experience supplying visuals for tech companies' marketing platforms.
        </p>
      </div>
      <div className="relative col-span-6 flex items-center justify-center md:mx-auto md:mt-8 md:max-w-[440px] sm:mt-6">
        <StaticImage src="./images/illustration.png" alt="" loading="lazy" aria-hidden />
      </div>
    </div>
  </section>
);

export default InHouseTeam;
