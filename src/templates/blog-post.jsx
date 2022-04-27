/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Author from 'components/pages/blog-post/author';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import Sidebar from 'components/pages/blog-post/sidebar';
import SocialShare from 'components/pages/blog-post/social-share';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, excerpt, body, frontmatter },
  },
  location,
}) => (
  <Layout
    seo={SEO_DATA.blogPost({
      title: frontmatter.title,
      description: excerpt,
      ogImage: frontmatter.ogImage.childImageSharp.fixed.src,
    })}
    headerTheme="black"
  >
    <article className="safe-paddings mt-22 border-t border-t-gray-3 lg:mt-0 lg:border-t-0 lg:pt-32 sm:pt-24">
      <div className="container-xs relative pt-16 lg:pt-0">
        <Hero {...frontmatter} slug={slug} />
        <Content content={body} />
        <Sidebar />
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
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        cover {
          childImageSharp {
            gatsbyImageData(width: 696)
          }
        }
        ogImage: cover {
          childImageSharp {
            fixed(
              width: 1200
              height: 630
              toFormat: JPG
              cropFocus: CENTER
              fit: COVER
              quality: 90
            ) {
              src
            }
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
