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
  <section className="safe-paddings mt-52 lg:mt-44">
    <div className="container">
      <h2 className="text-center text-6xl font-normal leading-snug lg:text-5xl">
        Blog.{' '}
        <Link className="text-red" to="/">
          Explore team experience
          <Arrow className="ml-4 inline-block h-7" aria-hidden />
        </Link>
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-2 lg:mt-12">
        {items.map(({ cover, title, description, to }, index) => (
          <li key={index}>
            <Link to={to}>
              <img className="rounded-2xl" src={cover} alt={title} />
            </Link>
            <h3 className="mt-5 text-2xl font-normal leading-snug">{title}</h3>
            <p className="mt-2.5 text-base">{description}</p>
            <Link className="mt-4" to="/" size="sm" theme="arrow-red">
              Read article
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Blog;
