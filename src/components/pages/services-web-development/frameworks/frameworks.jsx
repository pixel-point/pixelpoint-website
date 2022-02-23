import React from 'react';

import gatsbyBackground from './images/gatsby-background.svg';
import GatsbyLogo from './images/gatsby.inline.svg';
import NextjsLogo from './images/nextjs.inline.svg';
import RemixLogo from './images/remix.inline.svg';

const items = [
  {
    logo: RemixLogo,
    name: 'Remix',
    description: 'For full-stack dynamic applications',
  },
  {
    logo: NextjsLogo,
    name: 'Next.js',
    description: 'For enterprise-grade dynamic web applications',
  },
];

const Frameworks = () => (
  <section className="safe-paddings bg-black pt-80 text-white lg:pt-64 md:pt-52 sm:pt-32">
    <div className="container grid-gap-x grid grid-cols-2 items-center md:block">
      <div>
        <h2 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          We leverage the greatest <span className="text-red">React</span> frameworks
        </h2>
        <p className="mt-5 max-w-[410px] md:mt-4 md:max-w-none sm:mt-3">
          Always ready to jump on a project quickly with our custom inclusive GatsbyJS & NextJS
          starters.
        </p>
      </div>
      <div className="md:mt-8 md:flex md:space-x-4 sm:mt-6 sm:block sm:space-x-0 sm:space-y-4">
        <div
          className="relative flex aspect-[592/224] items-center justify-between overflow-hidden rounded-2xl pl-10 pr-6 lg:pl-6 md:aspect-auto md:min-h-[166px] md:basis-1/3 md:flex-col md:items-start md:px-4 md:pt-6 md:pb-5"
          style={{ background: 'linear-gradient(261.85deg, #773399 19.08%, #402060 81.57%)' }}
        >
          <GatsbyLogo className="relative z-10 h-14 lg:h-12 md:h-8" aria-hidden />
          <span className="sr-only">Gatsby</span>
          <p className="relative z-10 max-w-[256px] lg:max-w-[190px] lg:text-base md:max-w-none md:text-sm">
            Best for building SEO-friendly, high-performing marketing websites
          </p>
          <img
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
            src={gatsbyBackground}
            alt=""
            loading="lazy"
            aria-hidden
          />
        </div>
        <div className="mt-8 flex space-x-8 lg:mt-4 lg:space-x-4 md:mt-0 md:basis-2/3 sm:block sm:space-x-0 sm:space-y-4">
          {items.map(({ logo: Logo, name, description }, index) => (
            <div
              className="flex aspect-[280/224] w-1/2 flex-col items-start justify-between rounded-2xl bg-gray-9 px-6 pt-4 pb-5 md:aspect-auto md:min-h-[166px] md:px-4 sm:w-full"
              key={index}
            >
              <Logo className="h-14 lg:h-12" aria-hidden />
              <span className="sr-only">{name}</span>
              <p className="text-base lg:text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Frameworks;
