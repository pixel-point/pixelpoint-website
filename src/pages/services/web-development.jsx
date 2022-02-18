import React from 'react';

import Hero from 'components/pages/services-web-development/hero';
import Blog from 'components/shared/blog';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const ServicesWebDevelopmentPage = () => (
  <Layout>
    <Hero />
    <Blog />
    <CTA />
  </Layout>
);

export default ServicesWebDevelopmentPage;
