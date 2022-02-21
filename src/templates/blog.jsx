/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog/hero';
import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const BlogTemplate = ({
  data: {
    allMdx: { nodes },
  },
  pageContext: { currentPageIndex, pageCount },
}) => (
  <Layout>
    <Hero />
    <PostsList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
    <CaseStudies />
    <CTA />
  </Layout>
);

export const query = graphql`
  query ($limit: Int!, $skip: Int!, $draftFilter: [Boolean]!) {
    allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" }, fields: { draft: { in: $draftFilter } } }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        slug
        frontmatter {
          title
          description
        }
      }
    }
  }
`;

export default BlogTemplate;
