import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import illustration from './images/illustration.svg';

const Foundation = () => (
  <section className="safe-paddings bg-black pt-52 text-white lg:pt-36 md:pt-32 sm:pt-20">
    <div className="container grid grid-cols-12 items-center gap-x-8 md:grid-cols-1 md:gap-y-11 md:gap-x-0 sm:gap-y-8">
      <div className="col-span-5 md:col-span-full">
        <h2 className="max-w-[488px] text-6xl font-normal leading-snug lg:text-[42px] md:text-4xl sm:text-2xl">
          Foundation
        </h2>
        <p className="mt-5 max-w-[488px] text-lg leading-normal md:mt-3 sm:mt-2.5 sm:text-base">
          Creative web agency Pixel Point has been founded in 2017 and operating since at the
          headquarters based in France. However, we keep being a remote friendly company, as
          talented people can be found anywhere around the globe.
        </p>
      </div>
      <div className="col-start-7 col-end-13 grid max-w-[592px] grid-cols-2 gap-8 md:col-span-full md:gap-6 md:justify-self-center sm:gap-4">
        <StaticImage
          className="col-span-full rounded-[20px] lg:rounded-xl sm:rounded-lg"
          imgClassName="rounded-[20px] lg:rounded-xl sm:rounded-lg"
          src="./images/france.jpg"
          alt="Albi, France"
          width={592}
          height={224}
          loading="lazy"
        />
        <div className="flex flex-col items-center justify-center rounded-[20px] border-2 border-gray-9 lg:rounded-xl sm:rounded-lg">
          <span className="-mt-2 text-lg">Founded in</span>
          <span
            className="mt-2 text-[80px] leading-none lg:text-6xl md:text-5xl xs:text-4xl"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}
          >
            2017
          </span>
        </div>
        <img
          className="rounded-[20px] lg:rounded-xl sm:rounded-lg"
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
