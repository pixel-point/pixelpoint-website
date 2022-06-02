import React from 'react';

import Advantages from 'components/pages/home/advantages';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import Services from 'components/pages/home/services';
import Workflow from 'components/pages/home/workflow';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout headerTheme="white">
    <Hero />
    <Advantages />
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
