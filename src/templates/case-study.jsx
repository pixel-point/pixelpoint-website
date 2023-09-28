/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/case-study/content';
import Keynotes from 'components/pages/case-study/keynotes';
import Blog from 'components/shared/blog';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo/seo';
import SEO_DATA from 'constants/seo-data';

const CaseStudyTemplate = ({
  data: {
    mdx: {
      fields: { slug },
      frontmatter,
      githubStars,
    },
  },
  children,
}) => {
  const content = {
    logo: frontmatter.logo,
    title: frontmatter.title,
    description: frontmatter.description,
    websiteUrl: frontmatter.websiteUrl,
    githubUsername: frontmatter.githubUsername,
    githubRepoName: frontmatter.githubRepoName,
    quote: frontmatter.quote,
    text: children,
    services: frontmatter.services,
    stack: frontmatter.stack,
    githubStars,
  };

  return (
    <Layout headerTheme="white">
      <Content {...content} />
      <Keynotes items={frontmatter.keynotes} iconsName={slug} />
      <CaseStudies
        title="We provided design & development services for many more projects."
        activeItemSlug={slug}
      />
      <Blog />
      {/* <GatsbyAwards theme="black" withTopMargin /> */}
      <CTA withTopMargin />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      fields {
        slug
      }
      frontmatter {
        logo {
          url {
            publicURL
          }
          width
          height
        }
        title
        description
        websiteUrl
        githubUsername
        githubRepoName
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
      githubStars
    }
  }
`;

export default CaseStudyTemplate;

export const Head = ({
  data: {
    mdx: {
      frontmatter: { title, description },
    },
  },
}) => <SEO {...SEO_DATA.caseStudy({ title, description })} />;
