/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Author from 'components/pages/blog-post/author';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
}) => (
  <Layout
    seo={SEO_DATA.blogPost({
      title: frontmatter.title,
      description: frontmatter.description,
      ogImage: frontmatter.ogImage.publicURL,
    })}
    headerTheme="black"
  >
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
        ogImage: cover {
          publicURL
        }
      }
    }
  }
`;

export default BlogPostTemplate;
