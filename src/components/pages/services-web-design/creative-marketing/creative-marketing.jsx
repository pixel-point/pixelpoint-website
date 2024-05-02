import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Logo1 from './images/logo-1.svg';
import Logo2 from './images/logo-2.svg';
import Logo3 from './images/logo-3.svg';
import Logo4 from './images/logo-4.svg';
import Diagram from './images/technical-diagram.svg';

const CreativeMarketing = () => (
  <section className="safe-paddings mt-[200px] lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container">
      <h2 className="with-text-highlight-red mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug lg:max-w-[900px] lg:text-[42px] md:max-w-[650px] md:text-4xl sm:text-2xl">
        Bring your company <span>credibility up</span> a level with creative marketing & business
        assets
      </h2>
      <div className="grid gap-5 grid-cols-[338px_1fr_338px] grid-rows-[212px_1fr_212px] min-h-[644px] mt-20 lg:mt-16 md:mt-11 md:grid-cols-2 md:grid-rows-[max-content_repeat(2,1fr)_200px] sm:grid-cols-1 sm:grid-rows-[max-content_200px_1fr_200px_1fr]">
        <div className="col-start-1 col-end-2 row-start-1 row-end-3 relative overflow-hidden rounded-2xl py-6 text-center bg-gray-9 lg:rounded-xl md:col-span-2 md:row-span-1 sm:col-span-1">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/social-bg.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <div className="relative flex justify-around items-center mx-5 pt-1.5 px-3 border border-dashed border-gray-8 rounded-[10px]">
            <img className="max-w-[25%]" src={Logo1} alt="" loading="lazy" aria-hidden />
            <img className="max-w-[25%]" src={Logo2} alt="" loading="lazy" aria-hidden />
            <img className="max-w-[25%]" src={Logo3} alt="" loading="lazy" aria-hidden />
            <img className="max-w-[25%]" src={Logo4} alt="" loading="lazy" aria-hidden />
          </div>
          <StaticImage
            className="w-[338px] -mt-10 sm:relative sm:left-1/2 sm:-translate-x-1/2"
            src="./images/social-media.png"
            width="338"
            height="274"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3 className="relative mt-4 font-light text-center text-2xl leading-normal text-white lg:mt-5 lg:text-xl md:mt-7 md:text-2xl sm:mt-5 sm:text-xl">
            Social media assets
          </h3>
        </div>
        <div className="col-start-1 col-end-2 row-start-3 row-end-4 relative overflow-hidden flex flex-grow items-center justify-center bg-gray-9 rounded-2xl lg:rounded-xl md:row-start-4 md:row-end-5 sm:row-start-2 sm:row-end-3">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/small-bg.png"
            width="338"
            height="212"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3
            className="relative text-center text-4xl text-transparent bg-clip-text lg:text-[32px] sm:text-[32px]"
            style={{
              backgroundImage:
                'linear-gradient(86deg, #899bf5 19.47%, #f589ad 53.53%, #f5c489 84.93%)',
            }}
            title="Presentations"
          >
            <span
              className="absolute inset-0 text-transparent bg-clip-text blur-lg mix-blend-plus-lighter opacity-60"
              style={{ backgroundImage: 'linear-gradient(99deg, #FFC682 27.43%, #FF82E0 89.47%)' }}
              aria-hidden
            >
              Presentations
            </span>
            Presentations
          </h3>
        </div>
        <div className="col-start-2 col-end-3 row-start-1 row-end-4 relative overflow-hidden flex justify-center items-center bg-gray-9 rounded-2xl lg:rounded-xl md:col-span-2 md:row-span-1 sm:col-span-1">
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
            className="relative"
            src="./images/swag.png"
            width="500"
            height="644"
            alt="Swag"
            loading="lazy"
            aria-hidden
          />
        </div>
        <div className="col-start-3 col-end-4 row-start-1 row-end-2 relative overflow-hidden flex flex-grow items-center justify-center bg-gray-9 rounded-2xl lg:rounded-xl md:col-start-2 md:col-end-3 md:row-start-4 md:row-end-5 sm:col-span-1">
          <StaticImage
            className="!absolute -inset-1.5 w-[102%] h-[102%]"
            src="./images/small-bg.png"
            width="338"
            height="212"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <h3
            className="relative max-w-[200px] text-center text-4xl text-transparent bg-clip-text lg:text-[32px] sm:text-[32px]"
            style={{
              backgroundImage:
                'linear-gradient(86deg, #F59F89 10.44%, #F589AD 51.76%, #9B89F5 92.94%)',
            }}
            title="Presentations"
          >
            <span
              className="absolute inset-0 text-transparent bg-clip-text blur-xl mix-blend-plus-lighter opacity-60"
              style={{ backgroundImage: 'linear-gradient(99deg, #FFC682 27.43%, #FF82E0 89.47%)' }}
              aria-hidden
            >
              Business Cards
            </span>
            Business Cards
          </h3>
        </div>
        <div className="col-start-3 col-end-4 row-start-2 row-end-4 relative overflow-hidden flex flex-col justify-end bg-gray-9 rounded-2xl lg:rounded-xl md:col-span-2 md:row-span-1 sm:col-span-1">
          <span
            className="absolute top-1/2 left-1/2 -translate-x-64 -translate-y-64 w-[350px] h-[350px] rounded-full opacity-10 blur"
            style={{ background: 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 75%);' }}
          />
          <img
            className="absolute inset-0 md:static md:w-full"
            src={Diagram}
            width="338"
            height="412"
            alt="Technical diagrams"
            loading="lazy"
            aria-hidden
          />
          <h3 className="mb-6 text-center text-2xl text-white lg:text-xl md:text-2xl sm:text-xl">
            Technical Diagrams
          </h3>
        </div>
      </div>
    </div>
  </section>
);

export default CreativeMarketing;
