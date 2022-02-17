import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import GithubLogo from 'images/github.inline.svg';

import companyLogo from './images/company-logo.svg';
import QuoteIcon from './images/quote.inline.svg';

const services = [
  'Brand Identity',
  'Motion Design',
  'Marketing',
  'Design',
  'Illustrations',
  'Website Front-End',
];

const stack = [
  'React',
  'TypeScript',
  'Headless CMS',
  'NextJS',
  'GatsbyJS',
  'TailwindCSS',
  '3rd party integrations',
];

const Content = () => (
  <article className="safe-paddings bg-black pt-44 text-white">
    <div className="container grid-gap-x grid grid-cols-12 items-start">
      <div className="col-span-8">
        <h1 className="text-6xl font-normal leading-snug">Flagsmith</h1>
        <p className="mt-2.5 font-normal leading-snug">
          A full-fledged marketing platform worthy of unmatched OS load testing tool
        </p>
        <Link
          className="mt-7 rounded-full border border-red py-3 px-5"
          to="/"
          size="sm"
          theme="arrow-red"
        >
          Visit Flagsmith
        </Link>
        <figure className="mt-12">
          <QuoteIcon className="h-7" aria-hidden />
          <blockquote className="mt-4 text-2xl">
            <p>
              It's been an absolute pleasure working with Alex and the team at PixelPoint on both
              our website and our GitHub presence. We constantly receive complements on the quality
              of the design and illustration, and it has made a significant impact on our business
              as a whole. 10/10 would install Figma again
            </p>
          </blockquote>
          <figcaption className="mt-5 flex items-center">
            <StaticImage
              className="w-12 rounded-full"
              imgClassName="rounded-full"
              src="./images/author-photo.jpg"
              alt="Ben Rometsch — CEO of Flagsmith"
            />
            <span className="ml-4 text-base font-normal">Ben Rometsch — CEO of Flagsmith</span>
          </figcaption>
        </figure>
        <h2 className="mt-12 text-2xl font-normal leading-snug">About Flagsmith</h2>
        <p className="mt-2.5">
          Flagsmith is a company providing all-in-one platform for developing, implementing and
          managing feature flags across web, mobile, and server-side applications. Segregation can
          be done by environment, individual users or segments of users which allows quickly
          implementing practices like canary deployments; and multivariate flags allow you to use a
          percentage split for precise A/B testing and experimentation.
        </p>
      </div>
      <div className="col-start-10 col-end-13 rounded-2xl border border-gray-8 p-7">
        <img src={companyLogo} alt="Flagsmith" loading="eager" />
        <div className="mt-7 inline-flex items-center rounded-full border border-white p-2 pr-4">
          <GithubLogo className="h-7 text-white" aria-hidden />
          <span className="ml-2 text-xs font-semibold text-white">32,934</span>
        </div>
        <h4 className="mt-7 text-base font-semibold leading-snug text-red">Provided service</h4>
        <ul className="mt-3 space-y-3 text-base font-normal leading-snug">
          {services.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h4 className="mt-7 text-base font-semibold leading-snug text-red">Technology stack</h4>
        <ul className="mt-3 space-y-3 text-base font-normal leading-snug">
          {stack.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </article>
);

export default Content;
