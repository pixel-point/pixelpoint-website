/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const CaseStudyTemplate = ({
  data: {
    mdx: { body, slug, frontmatter },
  },
}) => {
  const content = {
    logo: frontmatter.logo.publicURL,
    title: frontmatter.title,
    description: frontmatter.description,
    websiteUrl: frontmatter.websiteUrl,
    githubUrl: frontmatter.githubUrl,
    githubStars: frontmatter.githubStars,
    quote: frontmatter.quote,
    text: body,
    services: frontmatter.services,
    stack: frontmatter.stack,
  };

  return (
    <Layout headerTheme="white">
      <Content {...content} />
      <Keynotes items={frontmatter.keynotes} iconsName={slug.slice(0, -1)} />
      <CaseStudies />
      <CTA withTopMargin />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      slug
      frontmatter {
        logo {
          publicURL
        }
        title
        description
        websiteUrl
        githubUrl
        githubStars
        quote {
          text
          authorName
          authorPosition
          authorPhoto {
            childImageSharp {
              gatsbyImageData(layout: FIXED, width: 48)
            }
          }
        }
        services
        stack
        keynotes
      }
    }
  }
`;

export default CaseStudyTemplate;
