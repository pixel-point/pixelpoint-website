import React from 'react';

import ContentIcon from './images/content.inline.svg';
import IllustrationsIcon from './images/illustrations.inline.svg';
import IntegrationsIcon from './images/integrations.inline.svg';
import PixelPerfectIcon from './images/pixel-perfect.inline.svg';
import ReleaseIcon from './images/release.inline.svg';
import SeoIcon from './images/seo.inline.svg';

const items = [
  {
    icon: PixelPerfectIcon,
    description: 'Astonishingly looking</br> pixel-perfect UI',
  },
  {
    icon: IllustrationsIcon,
    description: 'Dazzling illustrations</br> and animations',
  },
  {
    icon: ContentIcon,
    description: 'Obvious and clear way to</br> operate on your content',
  },
  {
    icon: ReleaseIcon,
    description: 'Robust release</br> management flow',
  },
  {
    icon: IntegrationsIcon,
    description: 'Integrations, 3rd parties</br> and analytics set up',
  },
  {
    icon: SeoIcon,
    description: 'High-performing,</br> SEO & a11y friendly',
  },
];
const Features = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="max-w-[700px] text-4xl font-normal leading-snug">
        Here is what we have to offer for the next ideal&nbsp;marketing website of yours
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map(({ icon: Icon, description }, index) => (
          <li key={index}>
            <Icon className="w-20" aria-hidden />
            <p
              className="mt-3 font-normal leading-snug"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
