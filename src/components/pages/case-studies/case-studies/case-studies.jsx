import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';

import authorPhoto from './images/author-photo.jpg';
import logoBrowserless from './images/logo-browserless.svg';
import logoRevenuecat from './images/logo-revenuecat.svg';
import logoZenith from './images/logo-zenith.svg';

const items = [
  {
    logo: logoBrowserless,
    name: 'Browserless',
    description: 'A full-fledged marketing platform worthy of unmatched OS load testing tool',
    to: '/case-studies/browserless',
    quote: {
      text: `It's been an absolute pleasure working with Alex and the team at PixelPoint on both our website and our GitHub presence. We constantly receive complements on the quality of the design and illustration, and it has made a significant impact on our business as a whole. 10/10 would install Figma again`,
      authorPhoto,
      authorName: 'Ben Rometsch',
      authorPosition: 'CEO of Flagsmith',
    },
    cover: (
      <StaticImage
        className="rounded-2xl"
        imgClassName="rounded-2xl"
        src="./images/cover-browserless.jpg"
        alt="Browserless website"
        loading="lazy"
      />
    ),
  },
  {
    logo: logoRevenuecat,
    name: 'RevenueCat',
    description: 'A full-fledged marketing platform worthy of unmatched OS load testing tool',
    to: '/case-studies/revenuecat',
    quote: {
      text: `It's been an absolute pleasure working with Alex and the team at PixelPoint on both our website and our GitHub presence. We constantly receive complements on the quality`,
      authorPhoto,
      authorName: 'Ben Rometsch',
      authorPosition: 'CEO of Flagsmith',
    },
    cover: (
      <StaticImage
        className="rounded-2xl"
        imgClassName="rounded-2xl"
        src="./images/cover-revenuecat.jpg"
        alt="RevenueCat website"
        loading="lazy"
      />
    ),
  },
  {
    logo: logoZenith,
    name: 'Zenith',
    description: 'A full-fledged marketing platform worthy of unmatched OS load testing tool',
    to: '/case-studies/zenith',
    quote: {
      text: `It's been an absolute pleasure working with Alex and the team at PixelPoint on both our website and our GitHub presence. We constantly receive complements on the quality of the design and illustration, and it has made a significant impact on our business as a whole. 10/10 would install Figma again`,
      authorPhoto,
      authorName: 'Ben Rometsch',
      authorPosition: 'CEO of Flagsmith',
    },
    cover: (
      <StaticImage
        className="rounded-2xl"
        imgClassName="rounded-2xl"
        src="./images/cover-zenith.jpg"
        alt="Zenith website"
        loading="lazy"
      />
    ),
  },
];

const CaseStudies = () => (
  <section className="safe-paddings mt-32">
    <div className="container space-y-40">
      {items.map(({ logo, name, description, to, quote, cover }, index) => (
        <article className="grid-gap-x grid grid-cols-2" key={index}>
          <div>
            <h1 className="sr-only">{`${name} case study`}</h1>
            <img src={logo} alt={`${name} logo`} loading="lazy" />
            <p className="mt-4 font-normal leading-snug">{description}</p>
            <figure className="mt-5 border-t border-t-gray-4 pt-5">
              <blockquote>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className="mt-3 flex items-center">
                <img
                  className="w-10 shrink-0 rounded-full"
                  src={quote.authorPhoto}
                  alt={quote.authorName}
                  loading="lazy"
                />
                <span className="ml-3.5 text-base font-normal">
                  {quote.authorName} — {quote.authorPosition}
                </span>
              </figcaption>
            </figure>
            <Link className="mt-8" to={to} size="sm" theme="arrow-red">
              {name} case study
            </Link>
          </div>
          <Link to={to} aria-label={`${name} case study`}>
            {cover}
          </Link>
        </article>
      ))}
    </div>
  </section>
);

export default CaseStudies;
