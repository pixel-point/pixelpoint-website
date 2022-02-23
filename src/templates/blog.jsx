/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog/hero';
import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const BlogTemplate = ({
  data: {
    allMdx: { nodes },
  },
}) => (
  <Layout>
    <Hero />
    <PostsList items={nodes} />
    <CaseStudies />
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($draftFilter: [Boolean]!) {
    allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" }, fields: { draft: { in: $draftFilter } } }
      sort: { order: DESC, fields: slug }
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
