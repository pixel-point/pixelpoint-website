/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Author from 'components/pages/blog-post/author';
import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import ReadMore from 'components/pages/blog-post/read-more';
import Sidebar from 'components/pages/blog-post/sidebar';
import SocialShare from 'components/pages/blog-post/social-share';
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
    <article className="safe-paddings mt-22 border-t border-t-gray-3 md:mt-0 md:border-t-0 md:pt-32 sm:pt-24">
      <div className="container">
        <div className="relative max-w-[696px] pt-16 pb-52 lg:max-w-[626px] lg:pb-36 md:mx-auto md:max-w-none md:pb-0 md:pt-0">
          <Hero {...frontmatter} slug={slug} />
          <Content content={body} />
          <Sidebar readMorePosts={readMorePosts} />
          <SocialShare url={location.href} />
        </div>
      </div>
    </article>
    <Author />
    <ReadMore items={readMorePosts} />
    <CTA className="md:mt-28 sm:mt-20" />
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
