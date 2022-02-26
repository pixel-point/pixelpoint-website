import React from 'react';

import Link from 'components/shared/link';
import Arrow from 'images/arrow.inline.svg';

import gettingStartedWithOpenSourceDroneCi from './images/getting-started-with-open-source-drone-ci-cover.svg';
import measuringGatsbyProjectsBuildTime from './images/measuring-gatsby-projects-build-time-cover.svg';

const items = [
  {
    cover: measuringGatsbyProjectsBuildTime,
    title: 'Measuring Gatsby projects build time',
    description:
      'Two years ago, we began the process of building an open-source MacOS app, but this turned out to be a much more challenging journey.',
    to: '/',
  },
  {
    cover: gettingStartedWithOpenSourceDroneCi,
    title: 'Getting started with open-source Drone CI',
    description:
      'If you want to avoid spending too much money on popular commercial solutions like Travic CI, you can use your own self-hosted Drone CI.',
    to: '/',
  },
];

const Blog = () => (
  <section className="safe-paddings mt-52 lg:mt-44 md:mt-36 sm:mt-20">
    <div className="container">
      <h2 className="text-center text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
        Blog.{' '}
        <Link className="text-red" to="/blog">
          Explore team experience
          <Arrow
            className="ml-4 inline-block h-7 lg:ml-3 lg:h-6 md:ml-2 md:h-5 sm:ml-1.5 sm:h-4 xs:ml-1 xs:h-3"
            aria-hidden
          />
        </Link>
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-2 lg:mt-12 md:mt-10 sm:mt-8 sm:block sm:space-y-8">
        {items.map(({ cover, title, description, to }, index) => (
          <li key={index}>
            <Link to={to}>
              <img className="w-full rounded-2xl" src={cover} alt={title} />
            </Link>
            <h3 className="mt-5 text-2xl font-normal leading-snug md:mt-4 md:text-xl sm:mt-3 sm:text-lg">
              {title}
            </h3>
            <p className="mt-2.5 text-base md:mt-2 md:text-sm sm:mt-1.5">{description}</p>
            <Link className="mt-4 md:mt-3 md:text-sm sm:mt-2" to="/" size="sm" theme="arrow-red">
              Read article
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Blog;
