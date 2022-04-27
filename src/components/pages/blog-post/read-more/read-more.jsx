import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import getBlogPostPath from 'utils/get-blog-post-path';

const ReadMore = ({ items }) => (
  <section className="safe-paddings mt-20 hidden md:block sm:mt-10">
    <div className="container">
      <h2 className="text-4xl font-bold leading-snug sm:text-xl">More from Pixel Point</h2>
      <div className="grid-gap-x mt-16 grid grid-cols-12 gap-y-16 lg:mt-12 lg:gap-y-12 md:mt-10 md:gap-y-10 sm:mt-8 sm:block sm:space-y-8">
        {items.map(({ slug, frontmatter: { title, mediumCover: cover } }, index) => (
          <article className="col-span-4 md:col-span-6" key={index}>
            <Link className="with-nested-link-red-hover block" to={getBlogPostPath(slug)}>
              <GatsbyImage
                className="w-full lg:rounded-xl"
                imgClassName="lg:rounded-xl"
                image={getImage(cover)}
                alt=""
              />
              <h1 className="my-2.5 text-lg font-normal leading-snug">{title}</h1>
              <Link className="nested-link-red" size="base" theme="arrow-red" withoutHover>
                Read article
              </Link>
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

ReadMore.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        mediumCover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
        smallCover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default ReadMore;
