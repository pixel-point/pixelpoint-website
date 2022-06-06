import React from 'react';

import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import Services from 'components/pages/home/services';
import Workflow from 'components/pages/home/workflow';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import ItemsList from 'components/shared/items-list';
import Layout from 'components/shared/layout';

const advantages = {
  title: 'It doesn’t have to be like that. Work&nbsp;with&nbsp;Pixel Point to see the difference:',
  items: [
    {
      title: 'Professional team',
      description:
        'The team power-packed with talented web, graphic and motion designers and software engineers led by skilled project managers whose synergy and sum of experience bring stunning marketing websites to life on a regular basis.',
    },
    {
      title: 'Communication-oriented',
      description:
        'Communication is the key to any successful relationship. At Pixel Point we answer in a matter of hours, eagerly joining requirements discussions and deliver constant updates, making our work as transparent as it possible.',
    },
    {
      title: 'On the same page with you',
      description:
        'Our team gained a strong technical background working in Open Source, DevOps, and SaaS fields. It helps us naturally translate the technological complexity of your project to visually appealing and clear graphics.',
    },
  ],
};

const HomePage = () => (
  <Layout headerTheme="white">
    <Hero />
    <ItemsList className="mt-40 lg:mt-32 sm:mt-20" {...advantages} />
    <Features />
    <Workflow />
    <Services />
    <CaseStudies title=" Our team loves Open Source. We designed and developed many projects in this space." />
    <Blog />
    {/* <GatsbyAwards theme="black" withTopMargin /> */}
    <CTA withTopMargin />
  </Layout>
);

export default HomePage;
