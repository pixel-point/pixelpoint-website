import React from 'react';

import CaseStudies from 'components/pages/case-studies/case-studies';
import Hero from 'components/pages/case-studies/hero';
import SharedCaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const CaseStudiesPage = () => (
  <Layout>
    <Hero />
    <CaseStudies />
    <SharedCaseStudies title="All case studies" />
    <CTA withTopMargin />
  </Layout>
);

export default CaseStudiesPage;
