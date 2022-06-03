import React from 'react';

import Foundation from 'components/pages/about/foundation';
import Hero from 'components/pages/about/hero';
import Projects from 'components/pages/about/projects';
import Values from 'components/pages/about/values';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import GatsbyAwards from 'components/shared/gatsby-awards';
import ItemsList from 'components/shared/items-list';
import Layout from 'components/shared/layout';

const benefits = {
  title: 'Unlock design process with benefits you wouldn’t want to lose:',
  items: [
    {
      title: 'Professional team',
      description:
        'Strong technical background that helps us naturally translate the technological complexity of your project to visually appealing and clear graphics.',
    },
    {
      title: 'Communication-oriented',
      description:
        'Communication is the key to any successful relationship. At Pixel Point we answer in a matter of hours, eagerly joining requirements discussions and deliver constant updates, making our work as transparent as it possible.',
    },
    {
      title: 'Lorem auctor imperdiet.',
      description:
        'Talented web, graphic and motion designers and software engineers who are passionate about their work',
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
      isTitleFullWidth
    />
    <Values />
    <Projects />
    <CaseStudies
      title="We provide design & development services for popular <span>Open Source</span> projects:"
      withoutTitleLink
    />
    <Blog />
    <CTA withTopMargin />
  </Layout>
);

export default AboutUsPage;
