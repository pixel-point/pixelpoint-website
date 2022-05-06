/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import CaseStudies from 'components/pages/case-studies/case-studies';
import Hero from 'components/pages/case-studies/hero';
import SharedCaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const CaseStudiesPage = ({
  data: {
    allMdx: { nodes },
  },
}) => (
  <Layout seo={SEO_DATA.caseStudies} headerTheme="white">
    <Hero />
    <CaseStudies items={nodes} />
    <SharedCaseStudies
      title="Some more of our recent projects to read about:"
      itemsType="not-featured"
      withoutTitleLink
    />
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($draftFilter: [Boolean]!) {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/case-studies/" }
        fields: { isDraft: { in: $draftFilter }, isFeatured: { eq: true } }
      }
      sort: { fields: frontmatter___position, order: ASC }
    ) {
      nodes {
        slug
        frontmatter {
          logo {
            publicURL
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
