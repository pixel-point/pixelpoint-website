import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
// import getBlogPostPath from 'utils/get-blog-post-path';

const itemsLinks = {
  '2022-02-22-comparing-gatsby-and-nextjs-for-website-development/':
    'https://dev.to/alex_barashkov/comparing-gatsby-and-nextjs-for-website-development-13b7',
  '2022-02-01-measuring-gatsby-projects-build-time-using-paid-plans-of-popular-static-website-hosting-platforms/':
    'https://dev.to/alex_barashkov/measuring-gatsby-projects-build-time-using-paid-plans-of-popular-static-website-hosting-platforms-47pp',
};

const Blog = () => {
  const {
    allMdx: { nodes: items },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: {
          slug: {
            in: [
              "2022-02-22-comparing-gatsby-and-nextjs-for-website-development/"
              "2022-02-01-measuring-gatsby-projects-build-time-using-paid-plans-of-popular-static-website-hosting-platforms/"
            ]
          }
        }
      ) {
        nodes {
          slug
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
    }
  `);

  return (
    <section className="safe-paddings mt-52 lg:mt-36 md:mt-28 sm:mt-20">
      <div className="container">
        <h2 className="text-center text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          Blog. {/* <Link size="6xl" theme="arrow-red" to="/blog"> */}
          <Link size="6xl" theme="arrow-red" to="https://dev.to/alex_barashkov">
            Explore team experience
          </Link>
        </h2>
        <ul className="grid-gap-x mt-16 grid grid-cols-2 lg:mt-12 md:mt-10 sm:mt-8 sm:block sm:space-y-8">
          {items.map(({ slug, frontmatter: { title, cover } }, index) => (
            <li key={index}>
              {/* <Link
                className="with-nested-link-red-hover flex h-full flex-col"
                to={getBlogPostPath(slug)}
              > */}
              <Link
                className="with-nested-link-red-hover flex h-full flex-col"
                to={itemsLinks[slug]}
              >
                <GatsbyImage
                  className="w-full rounded-2xl"
                  imgClassName="rounded-2xl"
                  image={getImage(cover)}
                  alt={title}
                />
                <h3 className="mt-5 text-2xl font-normal leading-snug lg:mt-4 md:text-lg sm:text-base">
                  {title}
                </h3>
                <Link className="nested-link-red mt-3 lg:mt-2" size="base" theme="arrow-red">
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
