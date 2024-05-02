import clsx from 'clsx';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import AnalyticsLogo from './images/analytics.svg';
import AwsLogo from './images/aws.svg';
import CloudflareLogo from './images/cloudflare.svg';
import HotjarLogo from './images/hotjar.svg';
import HubspotLogo from './images/hubspot.svg';
import IubendaLogo from './images/iubenda.svg';
import NetlifyLogo from './images/netlify.svg';
import OnetrustLogo from './images/onetrust.svg';
import TagManagerLogo from './images/tagmanager.svg';
import TwilioLogo from './images/twilio.svg';
import VercelLogo from './images/vercel.svg';
import ZapierLogo from './images/zapier.svg';

const headlessCmsItems = [
  {
    logo: AwsLogo,
    width: 80,
    height: 48,
    name: 'AWS',
    description: 'For enterprises seeking extensive scalability',
    color: 'text-white',
    background: 'bg-[#252c37]',
  },
  {
    logo: CloudflareLogo,
    width: 134,
    height: 48,
    name: 'Cloudflare',
    description: 'For businesses focusing on enhanced security',
    color: 'text-black',
    background: 'bg-[#f7c797]',
  },
  {
    logo: NetlifyLogo,
    width: 138,
    height: 56,
    name: 'Netlify',
    description: 'For developers prioritizing streamlined deployment',
    color: 'text-black',
    background: 'bg-[#42d7d7]',
  },
];

const hostingPlatformsItems = [
  {
    logo: TagManagerLogo,
    width: 76,
    height: 76,
    name: 'Google Tag Manager',
  },
  {
    logo: HubspotLogo,
    width: 122,
    height: 34,
    name: 'Hubspot',
  },
  {
    logo: TwilioLogo,
    width: 148,
    height: 40,
    name: 'Twilio Segment',
  },
  {
    logo: OnetrustLogo,
    width: 136,
    height: 24,
    name: 'Onetrust',
  },
  {
    logo: ZapierLogo,
    width: 132,
    height: 36,
    name: 'Zapier',
  },
  {
    logo: AnalyticsLogo,
    width: 68,
    height: 68,
    name: 'Google Analytics',
  },
  {
    logo: HotjarLogo,
    width: 142,
    height: 36,
    name: 'Hotjar',
  },
  {
    logo: IubendaLogo,
    width: 130,
    height: 48,
    name: 'Iubenda',
  },
];

const ThirdPartiesAndIntegrations = () => (
  <section className="safe-paddings mt-52 lg:mt-36 sm:mt-20">
    <div className="container">
      <h2 className="with-text-highlight-red mx-auto max-w-[800px] text-center text-6xl font-normal leading-snug tracking-[-1.12px] lg:max-w-[568px] lg:text-[42px] md:max-w-[458px] md:text-4xl sm:max-w-none sm:text-2xl">
        Powered by <span>the best hosting</span> and third-party integrations
      </h2>
      <h3 className="mt-20 text-4xl leading-snug lg:mt-14 lg:text-3xl md:mt-10 md:text-xl sm:mt-6 sm:text-lg">
        The fastest and most reliable hosting platforms
      </h3>
      <div className="grid-gap-x mt-10 grid grid-cols-2 lg:mt-8 md:mt-5 md:block md:space-y-5 sm:mt-4 sm:space-y-4">
        <div className="rounded-2xl bg-gray-9 p-8 px-4 pb-6 lg:rounded-xl lg:p-6 md:flex md:items-center md:space-x-6 sm:block sm:space-x-0 sm:p-5 sm:pb-4">
          <div className="px-4 lg:px-0">
            <img src={VercelLogo} width="162" height="36" alt="Vercel" loading="lazy" />
            <p className="mt-5 hidden text-xl text-white md:block sm:hidden">
              Default option providing best flexibility for a reasonable price
            </p>
          </div>
          <span className="sr-only">Vercel</span>
          <StaticImage
            className="mt-8 lg:mt-5 md:mt-4"
            src="./images/vercel-illustration.png"
            alt=""
            loading="lazy"
            aria-hidden
          />
          <p className="mt-6 px-4 text-2xl text-white lg:mt-7 lg:px-0 lg:text-xl md:hidden sm:mt-4 sm:block sm:text-base">
            Default option providing best flexibility for a reasonable price
          </p>
        </div>
        <div className="grid-gap grid grid-cols-2 sm:block sm:space-y-4">
          {headlessCmsItems.map(
            ({ logo, width, height, name, description, color, background }, index) => (
              <div
                className={clsx(
                  'flex flex-col items-start justify-between rounded-2xl px-6 pb-5 pt-7 lg:min-h-[176px] lg:rounded-xl lg:py-4 lg:px-5 md:min-h-[144px]',
                  background
                )}
                key={index}
              >
                <img src={logo} width={width} height={height} alt={name} loading="lazy" />
                <p className={clsx('text-base', color)}>{description}</p>
              </div>
            )
          )}
          <p
            className="flex flex-col items-center justify-center rounded-2xl text-center lg:min-h-[176px] lg:rounded-xl md:min-h-[144px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
          >
            <span className="text-2xl font-semibold leading-snug lg:text-xl">OR</span>
            <span className="mt-2.5 max-w-[160px] text-lg font-normal leading-snug lg:mt-2 lg:text-base">
              any other platform of your choice
            </span>
          </p>
        </div>
      </div>
      <h3 className="mt-20 text-4xl leading-snug lg:mt-14 lg:text-3xl md:mt-10 md:text-xl sm:mt-10 sm:text-lg">
        Most popular third-party services and integrations
      </h3>
      <ul className="grid-gap mt-10 grid grid-cols-4 lg:mt-8 md:mt-5 sm:mt-4 sm:block sm:space-y-4">
        {hostingPlatformsItems.map(({ logo, width, height, name }, index) => (
          <li
            className="flex min-h-[160px] items-center justify-center rounded-2xl lg:min-h-[120px] lg:rounded-xl md:min-h-[100px] sm:min-h-[120px]"
            style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
            key={index}
          >
            <img src={logo} width={width} height={height} alt={name} loading="lazy" />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ThirdPartiesAndIntegrations;
