import React from 'react';

import Foundation from 'components/pages/about/foundation';
import Hero from 'components/pages/about/hero';
import Projects from 'components/pages/about/projects';
import Values from 'components/pages/about/values';
import Blog from 'components/shared/blog';
import CTA from 'components/shared/cta';
import GatsbyAwards from 'components/shared/gatsby-awards';
import ItemsList from 'components/shared/items-list';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo/seo';
import SEO_DATA from 'constants/seo-data';

const benefits = {
  title: 'Unlock design process with benefits you wouldn’t want to lose:',
  items: [
    {
      title: 'Professional in-house team',
      description:
        'Skillful web, graphic, and motion designers along with prominent software engineers who do care about their work.',
    },
    {
      title: 'Communication-oriented',
      description:
        'We answer in a matter of hours, eagerly joining requirements discussions and deliver constant updates, making our work as transparent as it possible.',
    },
    {
      title: 'Context-aware',
      description:
        'Strong technical background helps us naturally translate the technological complexity of your project to visually appealing and clear graphics.',
    },
  ],
};

const AboutUsPage = () => (
  <Layout headerTheme="white">
    <Hero />
    <GatsbyAwards className="bg-black pt-32 sm:pt-24" theme="white" />
    <Foundation />
    <ItemsList
      className="bg-black pt-52 text-white lg:pt-36 md:pt-32 sm:pt-20"
      {...benefits}
      title="Over the years we've gained the extensive expertise and tuned our work processes"
    />
    <Values />
    <Projects />
    <Blog />
    <CTA withTopMargin />
  </Layout>
);

export default AboutUsPage;

export const Head = () => <SEO {...SEO_DATA.about} />;
