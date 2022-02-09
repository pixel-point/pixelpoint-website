import React from 'react';

import contentSvg from 'images/home/features/content.svg';
import illustrationsSvg from 'images/home/features/illustrations.svg';
import integrationsSvg from 'images/home/features/integrations.svg';
import pixelPerfectSvg from 'images/home/features/pixel-perfect.svg';
import releaseSvg from 'images/home/features/release.svg';
import seoSvg from 'images/home/features/seo.svg';

const data = [
  {
    title: 'Astonishingly looking pixel-perfect UI',
    icon: pixelPerfectSvg,
  },
  {
    title: 'Dazzling illustrations and animations',
    icon: illustrationsSvg,
  },
  {
    title: 'Obvious and clear way to operate on your content',
    icon: contentSvg,
  },
  {
    title: 'Robust release management flow',
    icon: releaseSvg,
  },
  {
    title: 'Integrations, 3rd parties and analytics set up',
    icon: integrationsSvg,
  },
  {
    title: 'High-performing, SEO & a11y friendly',
    icon: seoSvg,
  },
];
const Features = () => (
  <section className="features default">
    <div className="container">
      <h3>
        Here is what we have to offer for the next
        <br />
        ideal marketing website of yours
      </h3>
      <ul className="grid grid-cols-3 gap-8">
        {data.map(({ title, icon }, index) => (
          <li key={index}>
            <img className="mb-3" src={icon} alt={title} loading="lazy" width="80" height="62" />
            <p className="max-w-[200px] font-light">{title}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
