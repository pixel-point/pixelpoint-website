import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import getBlogPostPath from 'utils/get-blog-post-path';

const Blog = () => {
  const {
    allMdx: { nodes: items },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: {
          fields: {
            slug: {
              in: ["2022-11-28-advanced-web-font-optimization-techniques", "2023-06-22-next-image"]
            }
          }
        }
      ) {
        nodes {
          frontmatter {
            title
            cover {
              childImageSharp {
                gatsbyImageData(width: 592)
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  return (
    <section className="safe-paddings mt-52 lg:mt-36 md:mt-28 sm:mt-20">
      <div className="container">
        <h2 className="text-center text-6xl font-normal leading-snug lg:text-[42px] md:text-[32px] sm:text-2xl">
          Blog.{' '}
          <Link size="6xl" theme="arrow-red" to={LINKS.blog}>
            Explore team experience
          </Link>
        </h2>
        <ul className="grid-gap-x mt-16 grid grid-cols-2 lg:mt-14 md:mt-11 sm:mt-10 sm:block sm:space-y-10">
          {items.map(({ fields: { slug }, frontmatter: { title, cover } }, index) => (
            <li key={index}>
              <Link
                className="with-nested-link-red-hover flex h-full flex-col"
                to={getBlogPostPath(slug)}
              >
                <GatsbyImage
                  className="w-full rounded-2xl lg:rounded-xl"
                  imgClassName="rounded-2xl lg:rounded-xl"
                  image={getImage(cover)}
                  alt={title}
                />
                <h3 className="mt-4 text-2xl font-normal leading-snug lg:mt-3 lg:text-xl md:mt-2.5 md:text-lg">
                  {title}
                </h3>
                <Link
                  className="nested-link-red mt-4 lg:mt-3 md:mt-2.5"
                  size="base"
                  theme="arrow-red"
                >
                  Read article
                </Link>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Blog;
