import React from 'react';

import BlogPlatform from './images/blog-platform.inline.svg';
import BrandAwareness from './images/brand-awareness.inline.svg';
import BrandIdentity from './images/brand-identity.inline.svg';
import Constructor from './images/constructor.inline.svg';
import GithubStars from './images/github-stars.inline.svg';
import illustration from './images/illustration.svg';
import RevenueGrowth from './images/revenue-growth.inline.svg';

const items = [
  {
    icon: BlogPlatform,
    description: 'Introduced feature-rich blog platform',
  },
  {
    icon: BrandIdentity,
    description: 'Reimagined brand identity',
  },
  {
    icon: RevenueGrowth,
    description: 'Witnessed revenue growth 10x',
  },
  {
    icon: Constructor,
    description: 'Built landing page constructor',
  },
  {
    icon: GithubStars,
    description: 'Github Stars from 200 to 1.2k',
  },
  {
    icon: BrandAwareness,
    description: 'Increased brand awareness',
  },
];

const Keynotes = () => (
  <section className="safe-paddings bg-black pt-32 text-white">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug">Design and Development Keynotes</h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map(({ icon: Icon, description }, index) => (
          <li key={index}>
            <Icon className="h-16" aria-hidden />
            <p className="mt-2.5 font-normal leading-snug">{description}</p>
          </li>
        ))}
      </ul>
    </div>
    <img className="mx-auto mt-32" src={illustration} loading="lazy" alt="" aria-hidden />
  </section>
);

export default Keynotes;
