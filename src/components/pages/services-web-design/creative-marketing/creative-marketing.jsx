import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import logo1 from './images/logo-1.svg';
import logo2 from './images/logo-2.svg';
import logo3 from './images/logo-3.svg';
import logo4 from './images/logo-4.svg';
import diagram from './images/technical-diagram.svg';

const CreativeMarketing = () => (
  <section className="safe-paddings mt-[200px] lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container">
      <h2 className="with-text-highlight-red mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug lg:max-w-[900px] lg:text-[42px] md:max-w-[650px] md:text-4xl sm:text-2xl">
        Bring your company <span>credibility up</span> a level with creative marketing & business
        assets
      </h2>
      <div className="grid gap-5 grid-cols-[338px_1fr_338px] grid-rows-[212px_1fr_212px] h-[644px] mt-20 lg:grid-cols-[260px_1fr_260px] lg:grid-rows-[164px_1fr_164px] lg:gap-[18px] lg:h-[500px] lg:mt-16 md:grid-cols-2 md:grid-rows-[422px_644px_200px] md:gap-5 md:max-w-[712px] md:h-auto md:mx-auto sm:grid-cols-1 sm:grid-rows-[398px_156px_398px_156px_398px] sm:gap-2.5 sm:max-w-[328px]">
        <div className="row-span-2 flex flex-col py-6 bg-gray-9 rounded-2xl lg:py-4 lg:rounded-xl md:row-span-1 md:py-6 md:rounded-2xl">
          <div className="relative flex justify-evenly items-center h-[78px] mx-5 border border-dashed border-gray-8 rounded-[10px] lg:mx-4 md:mx-5">
            <img
              className="max-w-[20%] shadow-[0_4px_7px_0_rgba(0,0,0,0.25)]"
              src={logo1}
              width="52"
              height="52"
              alt=""
              loading="lazy"
              aria-hidden
            />
            <img
              className="max-w-[20%] shadow-[0_4px_7px_0_rgba(0,0,0,0.25)]"
              src={logo2}
              width="52"
              height="52"
              alt=""
              loading="lazy"
              aria-hidden
            />
            <img
              className="max-w-[20%] shadow-[0_4px_7px_0_rgba(0,0,0,0.25)]"
              src={logo3}
              width="52"
              height="52"
              alt=""
              loading="lazy"
              aria-hidden
            />
            <img
              className="max-w-[20%] shadow-[0_4px_7px_0_rgba(0,0,0,0.25)]"
              src={logo4}
              width="52"
              height="52"
              alt=""
              loading="lazy"
              aria-hidden
            />
          </div>
          <StaticImage
            className="max-w-full -mt-10 mb-auto mx-auto lg:-mt-8 md:-mt-9 sm:max-w-[330px] sm:-mt-10"
            src="./images/social-media.png"
            width="338"
            height="274"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3 className="relative font-light text-center text-2xl leading-normal text-white lg:text-xl md:text-2xl sm:text-xl">
            Social media assets
          </h3>
        </div>
        <div className="relative overflow-hidden row-start-3 flex flex-grow items-center justify-center bg-gray-9 rounded-2xl lg:rounded-xl md:rounded-2xl sm:row-start-2">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/small-bg.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3 className="relative text-center text-4xl text-transparent bg-[linear-gradient(86deg,#899bf5_19.47%,#f589ad_53.53%,#f5c489_84.93%)] bg-clip-text lg:text-[28px] md:text-4xl sm:text-[32px]">
            <span
              className="absolute inset-0 text-transparent bg-[linear-gradient(99deg,#ffc682_27.43%,#ff82e0_89.47%)] bg-clip-text blur-lg mix-blend-plus-lighter opacity-60"
              aria-hidden
            >
              Presentations
            </span>
            Presentations
          </h3>
        </div>
        <div className="relative overflow-hidden row-span-3 flex justify-center items-center bg-gray-9 rounded-2xl lg:rounded-xl md:row-span-1 md:col-span-2 md:rounded-2xl sm:col-span-1">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/swag-bg.png"
            width="500"
            height="644"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <StaticImage
            className="relative h-full aspect-[500/650] md:h-[108%]"
            src="./images/swag.png"
            width="500"
            height="644"
            alt="Swag"
            loading="lazy"
            aria-hidden
          />
        </div>
        <div className="relative overflow-hidden flex flex-grow items-center justify-center bg-gray-9 rounded-2xl lg:rounded-xl md:rounded-2xl">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/small-bg.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3 className="relative max-w-[200px] text-center text-4xl text-transparent bg-[linear-gradient(86deg,#f59f89_10.44%,#f589ad_51.76%,#9b89f5_92.94%)] bg-clip-text lg:text-[28px] md:text-4xl sm:max-w-none sm:text-[32px]">
            <span
              className="absolute inset-0 text-transparent bg-[linear-gradient(99deg,#ffc682_27.43%,#ff82e0_89.47%)] bg-clip-text blur-xl mix-blend-plus-lighter opacity-60"
              aria-hidden
            >
              Business Cards
            </span>
            Business Cards
          </h3>
        </div>
        <div className="relative overflow-hidden row-span-2 flex flex-col justify-end bg-gray-9 rounded-2xl lg:rounded-xl md:row-span-1 md:row-start-1 md:col-start-2 md:rounded-2xl sm:row-start-auto sm:col-start-1">
          <span className="absolute top-1/2 left-1/2 -translate-x-64 -translate-y-64 w-[350px] h-[350px] rounded-full opacity-10 blur bg-[radial-gradient(circle,#ffffff_0%,rgba(255,255,255,0)_75%)]" />
          <img
            className="absolute top-0 left-1/2 -translate-x-1/2 min-w-[103%]"
            src={diagram}
            width="338"
            height="412"
            alt="Technical diagrams"
            loading="lazy"
            aria-hidden
          />
          <h3 className="mb-6 text-center text-2xl text-white lg:mb-[18px] lg:text-xl md:mb-6 md:text-2xl sm:text-xl">
            Technical Diagrams
          </h3>
        </div>
      </div>
    </div>
  </section>
);

export default CreativeMarketing;
