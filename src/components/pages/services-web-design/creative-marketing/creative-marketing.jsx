import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Logo1 from './images/logo-1.inline.svg';
import Logo2 from './images/logo-2.inline.svg';
import Logo3 from './images/logo-3.inline.svg';
import Logo4 from './images/logo-4.inline.svg';

const CreativeMarketing = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug">
        Bring your company credibility up a level with{' '}
        <span className="text-red">Creative marketing</span> & business assets
      </h2>
      <div className="mt-20 flex space-x-8">
        <div className="flex flex-1 flex-col space-y-8">
          <div className="rounded-2xl border-2 border-gray-3 px-9 pb-6 pt-10">
            <div className="flex flex-wrap space-x-8">
              <Logo1 className="h-28" />
              <Logo2 className="mt-8 h-28" />
            </div>
            <div className="flex flex-wrap space-x-8">
              <Logo3 className="h-28" />
              <Logo4 className="mt-8 h-28" />
            </div>
            <h3 className="mt-7 text-center text-2xl">Social media assets</h3>
          </div>
          <div className="flex flex-grow items-center justify-center rounded-2xl bg-gray-2">
            <h3 className="text-center text-4xl">Presentations</h3>
          </div>
        </div>
        <div className="flex shrink-0 basis-[488px] flex-col items-center rounded-2xl bg-gray-9 px-8 pt-16 pb-6">
          <StaticImage src="./images/swag.png" alt="" loading="lazy" aria-hidden />
          <h3 className="mt-10 text-2xl uppercase text-white">Swag</h3>
        </div>
        <div className="flex flex-1 flex-col space-y-8">
          <div className="flex flex-grow items-center justify-center rounded-2xl bg-gray-2">
            <h3 className="max-w-[150px] text-center text-4xl">Business Cards</h3>
          </div>
          <div className="rounded-2xl border-2 border-gray-3 p-5 pb-6">
            <StaticImage src="./images/technical-diagram.jpg" alt="" loading="lazy" aria-hidden />
            <h3 className="mt-4 text-center text-2xl">Technical Diagrams</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CreativeMarketing;
