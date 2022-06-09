/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Categories from 'components/pages/blog/categories';
import Hero from 'components/pages/blog/hero';
import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import CaseStudies from 'components/shared/case-studies';
import CTA from 'components/shared/cta';
import HighlightedTweets from 'components/shared/highlighted-tweets';
// import GatsbyAwards from 'components/shared/gatsby-awards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({
  data: {
    allMdx: { nodes: items },
  },
  pageContext: { currentPageIndex, pageCount, category },
}) => {
  const itemsPart1 = items.slice(0, Math.ceil(items.length / 2));
  const itemsPart2 = items.slice(Math.ceil(items.length / 2));

  return (
    <Layout seo={SEO_DATA.blog} headerTheme="black" headerShowThemeButton>
      <Hero />
      <Categories activeCategory={category} />
      <PostsList items={itemsPart1} />
      <HighlightedTweets className="my-28 lg:my-24 md:my-20 sm:my-16" />
      <PostsList items={itemsPart2} />
      {pageCount > 1 && (
        <Pagination
          activeCategory={category}
          currentPageIndex={currentPageIndex}
          pageCount={pageCount}
        />
      )}
      <CaseStudies title="Our team loves Open Source. We designed and developed many projects in this space." />
      {/* <GatsbyAwards theme="black" withTopMargin /> */}
      <CTA withTopMargin />
    </Layout>
  );
};

export const query = graphql`
  query ($category: String, $draftFilter: [Boolean]!, $limit: Int!, $skip: Int!) {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { isDraft: { in: $draftFilter } }
        frontmatter: { category: { eq: $category } }
      }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        slug
        author {
          name
          photo {
            childImageSharp {
              gatsbyImageData(width: 36, layout: FIXED)
            }
          }
        }
        frontmatter {
          title
          summary
          category
          cover {
            childImageSharp {
              gatsbyImageData(width: 488)
            }
          }
        }
      }
    }
  }
`;

export default BlogTemplate;
