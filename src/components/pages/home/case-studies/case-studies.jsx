import { Link } from 'gatsby';
import React from 'react';

import DroneSvg from 'images/drone-logo.svg';
import FlagsmithSvg from 'images/flagsmith-logo.svg';
import K6Svg from 'images/k6-logo.svg';

const data = [
  {
    title: 'Flagsmith — Open source feature flag & remote config service',
    logo: FlagsmithSvg,
  },
  {
    title: 'Drone — Automate software testing and delivery',
    logo: DroneSvg,
  },
  {
    title: 'k6 — Load testing for engineering teams',
    logo: K6Svg,
  },
];
const CaseStudies = () => (
  <section className="case-studies default">
    <div className="container">
      <h3>
        We provide design & development services
        <br /> for popular <strong>Open Source</strong> projects:
      </h3>
      <ul className="grid grid-cols-3 gap-8">
        {data.map(({ title, logo }, index) => (
          <li key={index}>
            <Link to="/" className="group">
              <div className="mb-4 flex aspect-[384/200] items-center justify-center rounded-2xl bg-black">
                <img src={logo} alt={title} loading="lazy" />
              </div>
              <p className="mb-4 text-xl">{title}</p>
              <div href="#" className="link link-secondary link-group">
                Read case study
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CaseStudies;
