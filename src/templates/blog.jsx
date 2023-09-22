/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import CTA from 'components/shared/cta';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo/seo';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({
  data: {
    allMdx: { nodes: items },
  },
  pageContext: { currentPageIndex, pageCount, category },
}) => (
  <Layout headerTheme="black" headerShowThemeButton>
    <PostsList activeCategory={category} items={items} />
    {pageCount > 1 && (
      <Pagination
        activeCategory={category}
        currentPageIndex={currentPageIndex}
        pageCount={pageCount}
      />
    )}
    {/* <GatsbyAwards theme="black" withTopMargin /> */}
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($category: String, $draftFilter: [Boolean]!, $limit: Int!, $skip: Int!) {
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/content/posts/((?!post-authors).)*$/" } }
        fields: { isDraft: { in: $draftFilter } }
        frontmatter: { category: { eq: $category } }
      }
      sort: { internal: { contentFilePath: DESC } }
      limit: $limit
      skip: $skip
    ) {
      nodes {
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
        fields {
          slug
        }
      }
    }
  }
`;

export default BlogTemplate;

export const Head = () => <SEO {...SEO_DATA.blog} />;
