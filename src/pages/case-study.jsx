import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const CaseStudyPage = () => (
  <Layout>
    <Content />
    <Keynotes />
    <CaseStudies />
    <CTA />
  </Layout>
);

export default CaseStudyPage;
