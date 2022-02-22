import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

import authorPhotoFlagsmith from './images/author-photo-flagsmith.jpg';
import BlogPlatformIcon from './images/blog-platform.inline.svg';
import BrandAwarenessIcon from './images/brand-awareness.inline.svg';
import BrandIdentityIcon from './images/brand-identity.inline.svg';
import ConstructorIcon from './images/constructor.inline.svg';
import GithubStarsIcon from './images/github-stars.inline.svg';
import logoFlagsmith from './images/logo-flagsmith.svg';
import RevenueGrowthIcon from './images/revenue-growth.inline.svg';

const content = {
  logo: logoFlagsmith,
  title: 'Flagsmith',
  description: 'Feature Flag & Remote Config Service',
  url: 'https://flagsmith.com/',
  githubUrl: 'https://github.com/Flagsmith/flagsmith',
  githubStars: '1,449',
  quote: {
    text: `It's been an absolute pleasure working with Alex and the team at PixelPoint on both our website and our GitHub presence. We constantly receive complements on the quality of the design and illustration, and it has made a significant impact on our business as a whole. 10/10 would install Figma again`,
    authorPhoto: authorPhotoFlagsmith,
    authorName: 'Ben Rometsch',
    authorPosition: 'CEO of Flagsmith',
  },
  text: (
    <>
      <p>
        Freshly acquired by Polychrome Capitals, guys were in the process of a major company
        transformation requiring full rebranding - and we were eager to help.
      </p>
      <p>
        We began with picking a distinctive color palette and a font that played nicely around the
        company message, then restructured content representation in a visually pleasing way. Devs
        chose a time-tested pair of GatsbyJS + Headless WP, which made it possible to create custom
        marketing pages on a whim with the library of reusable components. It took us just under 2
        months to complete the whole platform!
      </p>
      <p>
        We believe it had played a role in the events that took place shortly after: Flagsmith made
        it to Product Hunt top 5 and received 2 acquisitions offers.
      </p>
    </>
  ),
  services: [
    'Brand Identity',
    'Motion Design',
    'Marketing',
    'Web Design',
    'Illustrations',
    'Web Development',
  ],
  stack: [
    'React',
    'GatsbyJS',
    'SCSS',
    'Headless WordPress',
    'Gravity Forms',
    'Heap Analytics',
    'Netlify',
  ],
};

const keynotes = {
  items: [
    {
      icon: BlogPlatformIcon,
      description: 'Introduced feature-rich custom blog platform',
    },
    {
      icon: BrandIdentityIcon,
      description: 'Established a strong brand identity',
    },
    {
      icon: RevenueGrowthIcon,
      description: 'Built a flexible landing page constructor',
    },
    {
      icon: ConstructorIcon,
      description: 'Two-fold increase in revenue',
    },
    {
      icon: GithubStarsIcon,
      description: 'Github Stars increase from 200 to 1.4k',
    },
    {
      icon: BrandAwarenessIcon,
      description: 'Flagsmith made it to Product Hunt top #5',
    },
  ],
};

const CaseStudiesFlagsmithPage = () => (
  <Layout>
    <Content {...content} />
    <Keynotes {...keynotes} />
    <CaseStudies />
    <CTA withTopMargin />
  </Layout>
);

export default CaseStudiesFlagsmithPage;
