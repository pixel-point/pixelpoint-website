import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

import authorPhotoDrone from './images/author-photo-drone.jpg';
import BlogPlatformIcon from './images/blog-platform.inline.svg';
import BrandAwarenessIcon from './images/brand-awareness.inline.svg';
import BrandIdentityIcon from './images/brand-identity.inline.svg';
import ConstructorIcon from './images/constructor.inline.svg';
import GithubStarsIcon from './images/github-stars.inline.svg';
import logoDrone from './images/logo-drone.svg';
import RevenueGrowthIcon from './images/revenue-growth.inline.svg';

const content = {
  logo: logoDrone,
  title: 'Drone',
  description: 'Self-service Continuous Integration Platform',
  url: 'https://drone.io/',
  githubUrl: 'https://github.com/harness/drone',
  githubStars: '24,549',
  quote: {
    text: `You guys revived my faith in open source! Drone has finally obtained a proper brand image and I have dozens of positive feedback from our users about new look and feel of the product itself. Bravo!`,
    authorPhoto: authorPhotoDrone,
    authorName: 'Brad Rydzewski',
    authorPosition: 'CEO of Drone',
  },
  text: (
    <>
      <p>
        We discovered Drone CI back in 2018, during experiments with CI/CD pipelines for our
        projects. It was a highly customizable and perfectly scalable solution, way ahead of the
        competition, but as it often happens with great tools created by seasoned devs, its
        interface wasn&apos;t particularly user-friendly. We reached out to its author, Brad
        Rydzewski, and were given carte blanche to act straight away.
      </p>
      <p>
        We went through the product back and forth, wrapping functionalities into thoughtful UI and
        robust UX patterns, solving problems its sole maintainer had been finding himself
        short-handed to work on, and soon enough Drone v1.0 was available to the community. As a
        cherry on top, we supplied Drone with a beautiful landing page, which, paired with refined
        product, immediately brought a mature look to the company. Eventually, all this led to Drone
        acquisition by Harness Inc.
      </p>
      <p>
        We continued working together later on: first, we took part in developing Harness CI/CD
        proprietary solutions, then got back working on Drone v2.0 redesign once more, introducing
        long-awaited features to the community. This version is available to the public now.
      </p>
    </>
  ),
  services: [
    'Brand Identity',
    'Motion Design',
    'Illustrations',
    'Web Design',
    'Web Development',
    'Product Design',
    'Product Front-End Development',
  ],
  stack: ['React', 'TypeScript', 'SCSS', 'SWR', 'Netlify'],
};

const keynotes = {
  items: [
    {
      icon: BlogPlatformIcon,
      description: 'Designed & built a modern landing page',
    },
    {
      icon: BrandIdentityIcon,
      description: 'Performed a full-fledged product redesign',
    },
    {
      icon: RevenueGrowthIcon,
      description: 'Developed front-end of the product',
    },
    {
      icon: ConstructorIcon,
      description: 'Bouncing rate dropped down to 29%',
    },
    {
      icon: GithubStarsIcon,
      description: 'Github Stars increase from 8k to 24.5k',
    },
    {
      icon: BrandAwarenessIcon,
      description: 'Drone got acquired by Harness Inc',
    },
  ],
};

const CaseStudiesDronePage = () => (
  <Layout>
    <Content {...content} />
    <Keynotes {...keynotes} />
    <CaseStudies />
    <CTA withTopMargin />
  </Layout>
);

export default CaseStudiesDronePage;
