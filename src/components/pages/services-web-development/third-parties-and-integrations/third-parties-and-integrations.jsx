import clsx from 'clsx';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import CloudflareLogo from './images/cloudflare.inline.svg';
import ContentfulLogo from './images/contentful.inline.svg';
import GatsbyCloudLogo from './images/gatsby-cloud.inline.svg';
import MdxLogo from './images/mdx.inline.svg';
import NetlifyLogo from './images/netlify.inline.svg';
import StrapiLogo from './images/strapi.inline.svg';
import VercelLogo from './images/vercel.inline.svg';
import WordPressLogo from './images/wordpress.inline.svg';

const headlessCmsItems = [
  {
    logo: StrapiLogo,
    name: 'Strapi',
    description: 'For Node.js and Open Source lovers',
    background: 'bg-[#1f1f7a]',
  },
  {
    logo: MdxLogo,
    name: 'MDX',
    description: 'For tech-savvy teams who don’t particularly favour GUI',
    background: 'bg-[#0959aa]',
  },
  {
    logo: ContentfulLogo,
    name: 'Contentful',
    description: 'For enterprise grade security and scalability',
    background: 'bg-[#13406c]',
  },
];

const hostingPlatformsItems = [
  {
    logo: NetlifyLogo,
    name: 'Netlify',
  },
  {
    logo: VercelLogo,
    name: 'Vercel',
  },
  {
    logo: GatsbyCloudLogo,
    name: 'Gatsby Cloud',
  },
  {
    logo: CloudflareLogo,
    name: 'Cloudflare',
  },
];

const ThirdPartiesAndIntegrations = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-28 sm:mt-20">
    <div className="container">
      <h2 className="mx-auto max-w-[800px] text-center text-6xl font-normal leading-snug lg:max-w-[700px] lg:text-5xl md:max-w-[600px] md:text-4xl sm:max-w-none sm:text-3xl xs:text-2xl">
        Choosing <span className="text-red">best-in-class</span> third-party integrations
      </h2>

      <h3 className="mt-20 text-4xl leading-snug lg:mt-16 lg:text-3xl md:mt-12 sm:text-xl">
        Flexible content management solutions
      </h3>
      <div className="grid-gap-x mt-10 grid grid-cols-2 lg:mt-8 md:mt-6 md:block md:space-y-4 sm:mt-4">
        <div className="rounded-2xl bg-gray-9 p-8 pb-6 lg:p-6 lg:pb-5 sm:p-4 sm:pt-5">
          <WordPressLogo className="h-14 lg:h-12 sm:h-8" aria-hidden />
          <span className="sr-only">WordPress</span>
          <StaticImage
            className="mt-8 lg:mt-6 sm:mt-4"
            src="./images/wordpress-illustration.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <p className="mt-8 text-2xl text-white lg:mt-6 lg:text-xl sm:mt-4 sm:text-base">
            Default option providing best flexibility for a reasonable price
          </p>
        </div>
        <div className="grid-gap grid grid-cols-2 sm:block sm:space-y-4">
          {headlessCmsItems.map(({ logo: Logo, name, description, background }, index) => (
            <div
              className={clsx(
                'flex flex-col items-start justify-between rounded-2xl px-6 pb-5 pt-4 lg:p-4 lg:pt-3 md:min-h-[166px]',
                background
              )}
              key={index}
            >
              <Logo className="h-14 lg:h-12" aria-hidden />
              <span className="sr-only">{name}</span>
              <p className="text-base text-white lg:text-sm sm:text-base">{description}</p>
            </div>
          ))}
          <p
            className="flex flex-col items-center justify-center rounded-2xl text-center md:min-h-[166px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <span className="text-2xl font-semibold leading-snug lg:text-xl">OR</span>
            <span className="mt-2.5 max-w-[130px] text-lg font-normal leading-snug lg:mt-2 lg:text-base">
              any other CMS of your choice
            </span>
          </p>
        </div>
      </div>

      <h3 className="mt-20 text-4xl leading-snug lg:mt-16 lg:text-3xl md:mt-12 sm:text-xl">
        The fastest and most reliable hosting platforms
      </h3>
      <ul className="grid-gap-x mt-10 grid grid-cols-4 lg:mt-8 md:mt-6 sm:mt-4 sm:block sm:space-y-4">
        {hostingPlatformsItems.map(({ logo: Logo, name }, index) => (
          <li
            className="flex min-h-[180px] items-center justify-center rounded-2xl lg:min-h-[140px] md:min-h-[106px] sm:min-h-[144px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
            key={index}
          >
            <Logo className="h-20 lg:h-16 md:h-12 sm:h-18" aria-hidden />
            <span className="sr-only">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ThirdPartiesAndIntegrations;
