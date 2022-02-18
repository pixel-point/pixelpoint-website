import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

import authorPhotoK6 from './images/author-photo-k6.jpg';
import BlogPlatformIcon from './images/blog-platform.inline.svg';
import BrandAwarenessIcon from './images/brand-awareness.inline.svg';
import BrandIdentityIcon from './images/brand-identity.inline.svg';
import ConstructorIcon from './images/constructor.inline.svg';
import GithubStarsIcon from './images/github-stars.inline.svg';
import logoK6 from './images/logo-k6.svg';
import RevenueGrowthIcon from './images/revenue-growth.inline.svg';

const content = {
  logo: logoK6,
  title: 'k6',
  description: 'Open-source Load Testing Tool and Cloud Service',
  url: 'https://k6.io/',
  githubUrl: 'https://github.com/grafana/k6',
  githubStars: '24,549',
  quote: {
    text: `My special thanks to the Pixel Point team! The crocodile animation, fantastic design and attention to detail definitely helped to make this acquisition happen. It was one of the first things pointed out [by Grafana] in our initial acquisition discussions. Our website and look-and-feel was miles ahead of competition.`,
    authorPhoto: authorPhotoK6,
    authorName: 'Pavel Suwala',
    authorPosition: 'CTO of k6',
  },
  text: (
    <>
      <p>
        We met with the guys during their rebranding from Loadimpact to k6, and they clearly showed
        they were ready to hit it big on the competitive market.
      </p>
      <p>
        We took off with a visual direction that resembled a combination between an ambitious
        startup and a solid enterprise - a bright, violet-accented color palette around well-known
        content organisational patterns and marketing pages sprinkled with mascot-based entertaining
        animations and illustrations. We developed all necessary marketing page along with
        feature-rich blog and documentation portals using MDX, as guys wanted to be in full control
        and felt completely comfortable in the absence of CMS GUI. We have also been making sure
        they possess every marketing asset they need, be it for post covers, swag design or an
        internet ad.
      </p>
      <p>
        We have kept helping them to run the platform and marketing campaigns to this day,
        successfully carrying out our partnership through years.
      </p>
    </>
  ),
  services: ['Brand Identity', 'Motion Design', 'Illustrations', 'Web Design', 'Web Development'],
  stack: [
    'React',
    'GatsbyJS',
    'SCSS',
    'MDX',
    'Algolia',
    'Hubspot Forms',
    'Meetup Events',
    'SendGrid',
    'Hotjar Analytics',
    'AWS',
  ],
};

const keynotes = {
  items: [
    {
      icon: BlogPlatformIcon,
      description: 'Reimagined brand identity',
    },
    {
      icon: BrandIdentityIcon,
      description: 'Built powerful custom mdx-based blog & docs platforms',
    },
    {
      icon: RevenueGrowthIcon,
      description: 'Provided long-term design & development support',
    },
    {
      icon: ConstructorIcon,
      description: 'Median user visit time increased tenfold',
    },
    {
      icon: GithubStarsIcon,
      description: 'Github Stars increase from 4k to 15.5k',
    },
    {
      icon: BrandAwarenessIcon,
      description: 'k6 got acquired by Grafana Labs',
    },
  ],
};

const CaseStudiesK6Page = () => (
  <Layout>
    <Content {...content} />
    <Keynotes {...keynotes} />
    <CaseStudies />
    <CTA />
  </Layout>
);

export default CaseStudiesK6Page;
