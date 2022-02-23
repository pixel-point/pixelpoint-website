import React from 'react';

import Hero from 'components/pages/case-studies/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const CaseStudiesPage = () => (
  <Layout>
    <Hero />
    <CTA withTopMargin />
  </Layout>
);

export default CaseStudiesPage;
