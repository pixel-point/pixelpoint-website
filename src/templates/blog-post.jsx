/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Author from 'components/pages/blog-post/author';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
}) => (
  <Layout headerTheme="black">
    <Hero {...frontmatter} slug={slug} />
    <Content content={body} />
    <Author />
    <CTA withTopMargin />
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
        cover {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
