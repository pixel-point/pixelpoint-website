/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog-post/hero';
import Content from 'components/shared/content';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
}) => (
  <Layout>
    <article>
      <Hero {...frontmatter} slug={slug} />
      <Content className="mt-20" content={body} />
    </article>
    <CTA />
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      slug
      body
      frontmatter {
        title
        description
      }
    }
  }
`;

export default BlogPostTemplate;
