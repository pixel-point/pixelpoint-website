import React from 'react';

import Frameworks from 'components/pages/services-web-development/frameworks';
import Hero from 'components/pages/services-web-development/hero';
import Lighthouse from 'components/pages/services-web-development/lighthouse';
import ThirdPartiesAndIntegrations from 'components/pages/services-web-development/third-parties-and-integrations';
import Blog from 'components/shared/blog';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const ServicesWebDevelopmentPage = () => (
  <Layout>
    <Hero />
    <Frameworks />
    <ThirdPartiesAndIntegrations />
    <Lighthouse />
    <Blog />
    <CTA />
  </Layout>
);

export default ServicesWebDevelopmentPage;
