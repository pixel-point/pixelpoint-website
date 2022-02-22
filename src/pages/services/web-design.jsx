import React from 'react';

import Benefits from 'components/pages/services-web-design/benefits';
import Hero from 'components/pages/services-web-design/hero';
import InHouseTeam from 'components/pages/services-web-design/in-house-team';
import WellThought from 'components/pages/services-web-design/well-thought';
import WillTweet from 'components/pages/services-web-design/will-tweet';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import ServicesCTA from 'components/shared/services-cta';

const servicesCTA = {
  title: 'Still in doubts? Check out what we have to offer on',
  linkText: 'Development services',
  linkUrl: '/services/web-development',
};

const ServicesWebDevelopmentPage = () => (
  <Layout>
    <Hero />
    <InHouseTeam />
    <Benefits />
    <WillTweet />
    <WellThought />
    <CaseStudies />
    <Blog />
    <ServicesCTA {...servicesCTA} />
    <CTA />
  </Layout>
);

export default ServicesWebDevelopmentPage;
