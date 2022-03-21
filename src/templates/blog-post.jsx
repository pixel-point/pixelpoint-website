/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Author from 'components/pages/blog-post/author';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import SocialShare from 'components/pages/blog-post/social-share';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
  location,
}) => (
  <Layout
    seo={SEO_DATA.blogPost({
      title: frontmatter.title,
      description: frontmatter.description,
      ogImage: frontmatter.ogImage?.publicURL,
    })}
    headerTheme="black"
  >
    <article className="safe-paddings pt-40 lg:pt-32 md:pt-28 sm:pt-20">
      <div className="container-xs relative">
        <Hero {...frontmatter} slug={slug} />
        <Content content={body} />
        <SocialShare url={location.href} />
      </div>
    </article>
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
