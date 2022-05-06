/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import Sidebar from 'components/pages/blog-post/sidebar';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, excerpt, body, frontmatter },
    allMdx: { nodes: readMorePosts },
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
    <article className="safe-paddings pt-32 sm:pt-24">
      <div className="container">
        <div className="relative mx-auto max-w-[696px] xl:mx-0 lg:max-w-[626px] md:max-w-none">
          <Hero {...frontmatter} slug={slug} />
          <Content content={body} />
          <Sidebar readMorePosts={readMorePosts} socialShareUrl={location.href} />
        </div>
      </div>
    </article>
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
        author
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
    allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" }, id: { ne: $id } }
      limit: 4
      sort: { order: DESC, fields: slug }
    ) {
      nodes {
        slug
        frontmatter {
          title
          mediumCover: cover {
            childImageSharp {
              gatsbyImageData(width: 384)
            }
          }
          smallCover: cover {
            childImageSharp {
              gatsbyImageData(width: 80, layout: FIXED)
            }
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
