/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import Sidebar from 'components/pages/blog-post/sidebar';
import CTA from 'components/shared/cta';
import HighlightedTweets from 'components/shared/highlighted-tweets';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, author, frontmatter },
    allMdx: { nodes: readMorePosts },
  },
  location,
}) => (
  <Layout
    seo={SEO_DATA.blogPost({
      title: frontmatter.title,
      description: frontmatter.summary,
      ogImage: frontmatter.ogImage.childImageSharp.gatsbyImageData.images.fallback.src,
    })}
    headerTheme="black"
    headerShowThemeButton
  >
    <article className="safe-paddings pt-32 sm:pt-24">
      <div className="container">
        <div className="relative mx-auto max-w-[696px] xl:mx-0 xl:flex xl:max-w-none xl:justify-center xl:space-x-20 lg:space-x-8 md:block md:space-x-0">
          <div className="xl:max-w-[696px] lg:max-w-[626px] md:max-w-none">
            <Hero {...frontmatter} slug={slug} />
            <Content content={body} />
          </div>
          <Sidebar author={author} readMorePosts={readMorePosts} socialShareUrl={location.href} />
        </div>
      </div>
    </article>
    <HighlightedTweets className="mt-52 lg:mt-36 md:mt-28 sm:mt-20" />
    <CTA />
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      slug
      body
      author {
        name
        photo {
          childImageSharp {
            gatsbyImageData(width: 64, layout: FIXED)
          }
        }
        description
        twitterUrl
      }
      frontmatter {
        title
        summary
        category
        cover {
          childImageSharp {
            gatsbyImageData(width: 696)
          }
        }
        ogImage: cover {
          childImageSharp {
            gatsbyImageData(layout: FIXED, quality: 90, width: 1200, height: 630, formats: JPG)
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
