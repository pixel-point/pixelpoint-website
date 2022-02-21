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
    description: 'For Node.js and Open source lovers',
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
  <section className="safe-paddings mt-52 lg:mt-44 md:mt-36">
    <div className="container">
      <h2 className="mx-auto max-w-[800px] text-center text-6xl font-normal leading-snug lg:max-w-[700px] lg:text-5xl md:max-w-[600px] md:text-4xl">
        Choosing <span className="text-red">best-in-class</span> third parties integrations
      </h2>

      <h3 className="mt-20 text-4xl leading-snug lg:mt-16 lg:text-3xl md:mt-12 md:text-2xl">
        Flexible content management solutions
      </h3>
      <div className="grid-gap-x mt-10 grid grid-cols-2 lg:mt-8 md:mt-6 md:block md:space-y-4">
        <div className="rounded-2xl bg-gray-9 p-8 pb-6 lg:p-6 lg:pb-5">
          <WordPressLogo className="h-14 lg:h-12" aria-hidden />
          <span className="sr-only">WordPress</span>
          <StaticImage
            className="mt-8 lg:mt-6"
            src="./images/wordpress-illustration.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <p className="mt-8 text-2xl text-white lg:mt-6 lg:text-xl">
            Default option providing best flexibility for a reasonable price
          </p>
        </div>
        <div className="grid-gap grid grid-cols-2">
          {headlessCmsItems.map(({ logo: Logo, name, description, background }, index) => (
            <div
              className={clsx(
                'flex min-h-[166px] flex-col items-start justify-between rounded-2xl px-6 pb-5 pt-4 lg:p-4 lg:pt-3',
                background
              )}
              key={index}
            >
              <Logo className="h-14 lg:h-12" aria-hidden />
              <span className="sr-only">{name}</span>
              <p className="text-base text-white lg:text-sm">{description}</p>
            </div>
          ))}
          <p className="flex flex-col items-center justify-center rounded-2xl bg-gray-2 text-center">
            <span className="text-2xl font-semibold leading-snug lg:text-xl">OR</span>
            <span className="mt-2.5 max-w-[130px] font-normal leading-snug lg:mt-2 lg:text-base">
              any other CMS of your choice
            </span>
          </p>
        </div>
      </div>

      <h3 className="mt-20 text-4xl leading-snug lg:mt-16 lg:text-3xl md:mt-12 md:text-2xl">
        The fastest and most reliable hosting platforms
      </h3>
      <ul className="grid-gap-x mt-10 grid grid-cols-4 lg:mt-8 md:mt-6">
        {hostingPlatformsItems.map(({ logo: Logo, name }, index) => (
          <li
            className="flex aspect-[280/180] items-center justify-center rounded-2xl bg-gray-2"
            key={index}
          >
            <Logo className="h-20 lg:h-16 md:h-12" aria-hidden />
            <span className="sr-only">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ThirdPartiesAndIntegrations;
