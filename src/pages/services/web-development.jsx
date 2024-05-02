import React from 'react';

import CodeQuality from 'components/pages/services-web-development/code-quality';
import Hero from 'components/pages/services-web-development/hero';
import Lighthouse from 'components/pages/services-web-development/lighthouse';
import Stack from 'components/pages/services-web-development/stack';
import Tailwindcss from 'components/pages/services-web-development/tailwindcss';
import ThirdPartiesAndIntegrations from 'components/pages/services-web-development/third-parties-and-integrations';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo/seo';
import ServicesCTA from 'components/shared/services-cta';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';

const servicesCTA = {
  title: 'Still in doubts? Check out what we have to offer on',
  linkText: 'design services',
  linkUrl: LINKS.webDesign,
};

const ServicesWebDevelopmentPage = () => (
  <Layout headerTheme="white">
    <Hero />
    <Stack />
    <Tailwindcss />
    <CodeQuality />
    <ThirdPartiesAndIntegrations />
    <Lighthouse />
    <CaseStudies
      title="There are numerous living proofs of our work out there."
      itemsType="open-source"
    />
    <Blog />
    {/* <GatsbyAwards theme="black" withTopMargin /> */}
    <ServicesCTA {...servicesCTA} />
    <CTA />
  </Layout>
);

export default ServicesWebDevelopmentPage;

export const Head = () => <SEO {...SEO_DATA.servicesWebDevelopment} />;
