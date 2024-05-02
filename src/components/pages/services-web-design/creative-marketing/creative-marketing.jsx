import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Logo1 from './images/logo-1.inline.svg';
import Logo2 from './images/logo-2.inline.svg';
import Logo3 from './images/logo-3.inline.svg';
import Logo4 from './images/logo-4.inline.svg';

const CreativeMarketing = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container">
      <h2 className="with-text-highlight-red mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug lg:max-w-[900px] lg:text-[42px] md:max-w-[650px] md:text-4xl sm:text-2xl">
        Bring your company <span>credibility up</span> a level with creative marketing & business
        assets
      </h2>
      <div className="mt-20 flex space-x-8 lg:mt-16 lg:space-x-6 md:mt-11 md:block md:space-x-0 md:space-y-5 sm:mt-8 sm:space-y-4">
        <div className="flex flex-1 flex-col space-y-8 lg:space-y-6 md:block sm:space-y-4">
          <div className="rounded-2xl border-2 border-gray-3 px-9 pb-6 pt-10 lg:rounded-xl lg:px-7 lg:pt-8 lg:pb-5 md:p-8 sm:px-6 sm:pb-5 sm:pt-7 sm:pt-8">
            <div className="md:flex md:justify-center md:space-x-6 sm:flex-col sm:items-center">
              <div className="flex flex-wrap space-x-8 lg:space-x-6 md:space-x-8 sm:space-x-6">
                <Logo1 className="h-28 lg:h-20 md:h-28 sm:h-20" />
                <Logo2 className="mt-8 h-28 lg:mt-6 lg:h-20 md:mt-0 md:h-28 sm:mt-6 sm:h-20" />
              </div>
              <div className="flex flex-wrap space-x-8 lg:space-x-6 md:space-x-8 sm:space-x-6">
                <Logo3 className="h-28 lg:h-20 md:h-28 sm:h-20" />
                <Logo4 className="mt-8 h-28 lg:mt-6 lg:h-20 md:mt-0 md:h-28 sm:mt-6 sm:h-20" />
              </div>
            </div>
            <h3 className="mt-7 text-center text-2xl lg:mt-5 lg:text-xl md:mt-7 md:text-2xl sm:mt-5 sm:text-xl">
              Social media assets
            </h3>
          </div>
          <div
            className="flex flex-grow items-center justify-center rounded-2xl lg:rounded-xl md:hidden sm:flex sm:min-h-[156px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <h3 className="text-center text-4xl lg:text-[32px] sm:text-[32px]">Presentations</h3>
          </div>
        </div>
        <div className="flex shrink-0 basis-[488px] flex-col items-center rounded-2xl bg-gray-9 px-8 pt-16 pb-6 lg:basis-[388px] lg:rounded-xl lg:px-6 lg:pt-14 md:pt-12 md:pb-8 sm:px-6 sm:pb-5 sm:pt-12">
          <StaticImage
            className="md:max-w-[468px]"
            src="./images/swag.png"
            alt="Upscope Swag"
            loading="lazy"
            aria-hidden
          />
          <h3 className="mt-10 text-2xl uppercase text-white lg:mt-8 lg:text-xl md:mt-12 md:text-2xl sm:mt-8 sm:text-xl">
            Swag
          </h3>
        </div>
        <div className="flex flex-1 flex-col space-y-8 lg:space-y-6 md:block sm:space-y-4">
          <div
            className="flex flex-grow items-center justify-center rounded-2xl lg:rounded-xl md:hidden sm:flex sm:min-h-[156px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <h3 className="max-w-[150px] text-center text-4xl lg:text-[32px] sm:text-[32px]">
              Business Cards
            </h3>
          </div>
          <div className="rounded-2xl border-2 border-gray-3 p-5 pb-6 lg:rounded-xl lg:px-7 lg:pt-8 md:pb-8 md:pt-12 sm:px-6 sm:pt-8 sm:pb-5">
            <StaticImage
              className="md:mx-auto md:!block md:max-w-[468px]"
              src="./images/technical-diagram.jpg"
              alt="Browserless diagrams"
              loading="lazy"
              aria-hidden
            />
            <h3 className="mt-4 text-center text-2xl lg:mt-3 lg:text-xl md:mt-12 md:text-2xl sm:mt-5 sm:text-xl">
              Technical Diagrams
            </h3>
          </div>
        </div>
        <div className="hidden min-h-[200px] space-x-5 md:flex sm:hidden">
          <div
            className="flex flex-1 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <h3 className="text-center text-4xl">Presentations</h3>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <h3 className="max-w-[150px] text-center text-4xl">Business Cards</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CreativeMarketing;
