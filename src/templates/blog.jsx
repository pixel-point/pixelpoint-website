/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({
  data: {
    allMdx: { nodes: items },
  },
}) => (
  <Layout seo={SEO_DATA.blog} headerTheme="black">
    <PostsList items={items} />
    <CaseStudies title="Our team loves Open Source. We designed and developed many projects in this space." />
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($category: String, $draftFilter: [Boolean]!) {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { isDraft: { in: $draftFilter } }
        frontmatter: { category: { eq: $category } }
      }
      sort: { order: DESC, fields: slug }
    ) {
      nodes {
        slug
        frontmatter {
          title
          shortDescription
          category
          author
          cover {
            childImageSharp {
              gatsbyImageData(width: 488)
            }
          }
        }
      }
    }
  }
`;

export default BlogTemplate;
