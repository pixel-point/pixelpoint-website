import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import illustration from './images/illustration.svg';

const Foundation = () => (
  <section className="safe-paddings bg-black pt-32 text-white ">
    <div className="container grid grid-cols-12 items-center gap-x-8 md:gap-x-0">
      <div className="col-span-5">
        <h2 className="text-6xl font-normal leading-snug">Foundation</h2>
        <p className="mt-5 text-lg leading-normal">
          Creative web agency Pixel Point has been founded in 2017 and operating since at the
          headquarters based in France. However, we keep being a remote friendly company, as
          talented people can be found anywhere around the globe.
        </p>
      </div>
      <div className="col-start-7 col-end-13 grid grid-cols-2 gap-8">
        <StaticImage
          className="col-span-full rounded-[20px]"
          imgClassName="rounded-[20px]"
          src="./images/france.jpg"
          alt="View of the Hôtel Dieu and La Grave"
          width={592}
          height={224}
          loading="lazy"
        />
        <div className="flex flex-col items-center justify-center rounded-[20px] border-2 border-gray-9">
          <span className="text-lg">Founded in</span>
          <span
            className="mt-2  text-[80px] leading-none"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 100%)',
              '-webkit-background-clip': 'text',
              '-webkit-text-fill-color': 'transparent',
              'background-clip': 'text',
              'text-fill-color': 'transparent',
            }}
          >
            2017
          </span>
        </div>
        <img
          className="rounded-[20px]"
          src={illustration}
          alt=""
          width={280}
          height={224}
          loading="lazy"
          aria-hidden
        />
      </div>
    </div>
  </section>
);

export default Foundation;
