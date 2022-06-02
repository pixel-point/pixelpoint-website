/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({
  data: {
    allMdx: { nodes: items },
  },
  pageContext: { currentPageIndex, pageCount, category },
}) => (
  <Layout seo={SEO_DATA.blog} headerTheme="black">
    <PostsList activeCategory={category} items={items} />
    {pageCount > 1 && (
      <Pagination
        activeCategory={category}
        currentPageIndex={currentPageIndex}
        pageCount={pageCount}
      />
    )}
    <CaseStudies title="Our team loves Open Source. We designed and developed many projects in this space." />
    <GatsbyAwards theme="black" />
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($category: String, $draftFilter: [Boolean]!, $limit: Int!, $skip: Int!) {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { isDraft: { in: $draftFilter } }
        frontmatter: { category: { eq: $category } }
      }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        slug
        author {
          name
          photo {
            childImageSharp {
              gatsbyImageData(width: 36, layout: FIXED)
            }
          }
        }
        frontmatter {
          title
          summary
          category
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
