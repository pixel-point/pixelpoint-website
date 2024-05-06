import React from 'react';

import Benefits from 'components/pages/services-web-design/benefits';
import Community from 'components/pages/services-web-design/community';
import CreativeMarketing from 'components/pages/services-web-design/creative-marketing';
import GuideAndEngage from 'components/pages/services-web-design/guide-and-engage';
import Hero from 'components/pages/services-web-design/hero';
import InHouseTeam from 'components/pages/services-web-design/in-house-team';
import WillTweet from 'components/pages/services-web-design/will-tweet';
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
  linkText: 'development services',
  linkUrl: LINKS.webDevelopment,
};

const ServicesWebDevelopmentPage = () => (
  <Layout headerTheme="white">
    <Hero />
    <InHouseTeam />
    <Benefits />
    <WillTweet />
    <Community />
    <GuideAndEngage />
    <CreativeMarketing />
    <CaseStudies title="There are plenty of companies we made design for." />
    <Blog />
    {/* <GatsbyAwards theme="black" withTopMargin /> */}
    <ServicesCTA {...servicesCTA} />
    <CTA />
  </Layout>
);

export default ServicesWebDevelopmentPage;

export const Head = () => <SEO {...SEO_DATA.servicesWebDesign} />;
