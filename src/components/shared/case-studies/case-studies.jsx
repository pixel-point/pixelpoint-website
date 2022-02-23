import React from 'react';

import Link from 'components/shared/link';
import GithubLogo from 'images/github.inline.svg';

import droneLogo from './images/drone.svg';
import flagsmithLogo from './images/flagsmith.svg';
import k6Logo from './images/k6.svg';

const items = [
  {
    logo: flagsmithLogo,
    name: 'Flagsmith',
    title: 'Open source feature flag & remote config service',
    stars: '32,934',
    to: '/case-studies/flagsmith',
  },
  {
    logo: droneLogo,
    name: 'Drone',
    title: 'Automate software testing and delivery',
    stars: '32,934',
    to: '/case-studies/drone',
  },
  {
    logo: k6Logo,
    name: 'k6',
    title: 'Load testing for engineering teams',
    stars: '32,934',
    to: '/case-studies/k6',
  },
  {
    logo: flagsmithLogo,
    name: 'Flagsmith',
    title: 'Open source feature flag & remote config service',
    stars: '32,934',
    to: '/case-studies/flagsmith',
  },
  {
    logo: droneLogo,
    name: 'Drone',
    title: 'Automate software testing and delivery',
    stars: '32,934',
    to: '/case-studies/drone',
  },
  {
    logo: k6Logo,
    name: 'k6',
    title: 'Load testing for engineering teams',
    stars: '32,934',
    to: '/case-studies/k6',
  },
];

const CaseStudies = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="max-w-[800px] text-4xl font-normal leading-snug">
        We provide design & development services for popular{' '}
        <span className="text-red">Open-Source</span> projects:
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map(({ logo, name, title, stars, to }, index) => (
          <li className="flex flex-col" key={index}>
            <Link
              className="relative flex aspect-[384/200] items-center justify-center rounded-2xl bg-black"
              to={to}
            >
              <img src={logo} loading="lazy" alt={`${name}'s logo`} />
              <div className="absolute top-3 left-3 flex items-center">
                <GithubLogo className="h-7 text-white" />
                <span className="ml-2 text-xs font-semibold text-white">
                  {stars} <span className="sr-only">stars on Github</span>
                </span>
              </div>
            </Link>
            <h3 className="my-4 font-normal leading-snug">{title}</h3>
            <Link className="mt-auto self-start" to={to} size="sm" theme="arrow-red">
              {name} case study
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CaseStudies;
