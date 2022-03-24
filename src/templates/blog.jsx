/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog/hero';
import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({ data: { featuredPosts, notFeaturedPosts } }) => (
  <Layout seo={SEO_DATA.blog} headerTheme="white">
    <Hero />
    <PostsList items={[...featuredPosts.nodes, ...notFeaturedPosts.nodes]} />
    <CaseStudies
      title={
        <>
          Our team loves <span className="text-red">Open Source</span>. We designed and developed
          many projects in this space:
        </>
      }
    />
    <CTA withTopMargin />
  </Layout>
);

export const query = graphql`
  query ($draftFilter: [Boolean]!) {
    featuredPosts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { isDraft: { in: $draftFilter }, isFeatured: { eq: true } }
      }
      sort: { order: DESC, fields: slug }
    ) {
      nodes {
        slug
        fields {
          isFeatured
        }
        frontmatter {
          title
          cover {
            childImageSharp {
              gatsbyImageData(width: 592)
            }
          }
        }
      }
    }

    notFeaturedPosts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { isDraft: { in: $draftFilter }, isFeatured: { eq: false } }
      }
      sort: { order: DESC, fields: slug }
    ) {
      nodes {
        slug
        fields {
          isFeatured
        }
        frontmatter {
          title
          cover {
            childImageSharp {
              gatsbyImageData(width: 456)
            }
          }
        }
      }
    }
  }
`;

export default BlogTemplate;
