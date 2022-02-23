import PropTypes from 'prop-types';
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
    title: 'Feature flag & remote config service',
    stars: '32,934',
    to: '/case-studies/flagsmith',
  },
  {
    logo: droneLogo,
    name: 'Drone',
    title: 'Self-service continuous integration platform',
    stars: '32,934',
    to: '/case-studies/drone',
  },
  {
    logo: k6Logo,
    name: 'k6',
    title: 'Load testing tool and cloud service',
    stars: '32,934',
    to: '/case-studies/k6',
  },
  {
    logo: flagsmithLogo,
    name: 'Flagsmith',
    title: 'Feature flag & remote config service',
    stars: '32,934',
    to: '/case-studies/flagsmith',
  },
  {
    logo: droneLogo,
    name: 'Drone',
    title: 'Self-service continuous integration platform',
    stars: '32,934',
    to: '/case-studies/drone',
  },
  {
    logo: k6Logo,
    name: 'k6',
    title: 'Load testing tool and cloud service',
    stars: '32,934',
    to: '/case-studies/k6',
  },
];

const CaseStudies = ({ title }) => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="max-w-[800px] text-4xl font-normal leading-snug">{title}</h2>
      <div className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map(({ logo, name, title, stars, to }, index) => (
          <article className="flex flex-col" key={index}>
            <h1 className="sr-only">{`${name} case study`}</h1>
            <Link
              className="relative flex aspect-[384/200] items-center justify-center rounded-2xl bg-black"
              to={to}
              aria-label={`${name} case study`}
            >
              <img src={logo} loading="lazy" alt={`${name} logo`} />
              <div className="absolute top-3 left-3 flex items-center">
                <GithubLogo className="h-7 text-white" />
                <p
                  className="ml-2 text-xs font-semibold text-white"
                  aria-label={`${stars} stars on Github`}
                >
                  {stars}
                </p>
              </div>
            </Link>
            <p className="my-4 font-normal leading-snug">{title}</p>
            <Link className="mt-auto self-start" to={to} size="sm" theme="arrow-red">
              {name} case study
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

CaseStudies.propTypes = {
  title: PropTypes.node,
};

CaseStudies.defaultProps = {
  title: (
    <>
      We provide design & development services for popular{' '}
      <span className="text-red">Open-Source</span> projects:
    </>
  ),
};

export default CaseStudies;
