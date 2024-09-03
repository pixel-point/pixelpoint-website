/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import CaseStudies from 'components/pages/case-studies/case-studies';
import Blog from 'components/shared/blog';
import SharedCaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo/seo';
import SEO_DATA from 'constants/seo-data';

const CaseStudiesPage = ({
  data: {
    allMdx: { nodes },
  },
}) => (
  <Layout headerTheme="black">
    <CaseStudies items={nodes} />
    <SharedCaseStudies
      title="Some more of our recent projects to read about:"
      itemsType="not-featured"
      withoutTitleLink
    />
    <Blog />
    {/* <GatsbyAwards theme="black" withTopMargin /> */}
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($draftFilter: [Boolean]!) {
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/content/case-studies/" } }
        fields: { isDraft: { in: $draftFilter }, isFeatured: { eq: true }, isHidden: { eq: false } }
      }
      sort: { frontmatter: { position: ASC } }
    ) {
      nodes {
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
          overview
          quote {
            text
            authorName
            authorPosition
            authorPhoto {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 40)
              }
            }
          }
          cover {
            childImageSharp {
              gatsbyImageData(width: 712)
            }
          }
        }
      }
    }
  }
`;

export default CaseStudiesPage;

export const Head = () => <SEO {...SEO_DATA.caseStudies} />;
