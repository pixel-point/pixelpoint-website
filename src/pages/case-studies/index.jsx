import React from 'react';

import Hero from 'components/pages/case-studies/hero';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const CaseStudiesPage = () => (
  <Layout>
    <Hero />
    <CaseStudies title="All case studies" />
    <CTA withTopMargin />
  </Layout>
);

export default CaseStudiesPage;
