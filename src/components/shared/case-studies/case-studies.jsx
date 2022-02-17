import React from 'react';

import Link from 'components/shared/link';
import GithubLogo from 'images/github.inline.svg';

import droneLogo from './images/drone.svg';
import flagsmithLogo from './images/flagsmith.svg';
import k6Logo from './images/k6.svg';

const items = [
  {
    logo: flagsmithLogo,
    title: 'Flagsmith — Open source feature flag & remote config service',
    stars: '32,934',
  },
  {
    logo: droneLogo,
    title: 'Drone — Automate software testing and delivery',
    stars: '32,934',
  },
  {
    logo: k6Logo,
    title: 'k6 — Load testing for engineering teams',
    stars: '32,934',
  },
];

const CaseStudies = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="max-w-[800px] text-4xl font-normal leading-snug">
        We provide design & development services for popular{' '}
        <span className="text-red">Open Source</span> projects:
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3">
        {items.map(({ logo, title, stars }, index) => (
          <li key={index}>
            <Link className="group" to="/">
              <div className="relative flex aspect-[384/200] items-center justify-center rounded-2xl bg-black">
                <div className="absolute top-3 left-3 flex items-center">
                  <GithubLogo className="h-7 text-white" />
                  <span className="ml-2 text-xs font-semibold text-white">{stars}</span>
                </div>
                <img src={logo} loading="lazy" alt={title} />
              </div>
              <h3 className="mt-4 font-normal leading-snug transition-colors duration-200 group-hover:text-red">
                {title}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CaseStudies;
