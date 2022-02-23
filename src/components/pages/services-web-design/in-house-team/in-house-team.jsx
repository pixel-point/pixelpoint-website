import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const InHouseTeam = () => (
  <section className="safe-paddings bg-black pt-80">
    <div className="container grid-gap-x grid grid-cols-12 items-center">
      <div className="col-span-6 text-white">
        <h2 className="max-w-[520px] text-6xl font-normal leading-snug">
          <span className="text-red">In-house team</span> of motion, graphic, and web designers
        </h2>
        <p className="mt-5 max-w-[520px]">
          With years of experience supplying visuals for tech companies' marketing platforms.
        </p>
      </div>
      <div className="relative col-span-6 flex items-center justify-center">
        <StaticImage src="./images/illustration.png" alt="" loading="lazy" aria-hidden />
      </div>
    </div>
  </section>
);

export default InHouseTeam;
