import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ items }) => (
  <section className="safe-paddings mt-32 lg:mt-28 md:mt-24 sm:mt-16">
    <div className="container">
      <div className="grid-gap-x grid grid-cols-12 gap-y-16 lg:gap-y-12 md:gap-y-10 sm:block sm:space-y-8">
        {items.map(({ slug, frontmatter: { title, cover } }, index) => {
          const isFeatured = index === 0 || index === 1;
          return (
            <article
              className={clsx(isFeatured ? 'col-span-6' : 'col-span-4 lg:col-span-6')}
              key={index}
            >
              <Link className="with-nested-link-red-hover" to={getBlogPostPath(slug)}>
                <GatsbyImage
                  className={clsx(
                    'w-full lg:rounded-2xl',
                    isFeatured ? 'rounded-2xl' : 'rounded-lg'
                  )}
                  imgClassName={clsx('lg:rounded-2xl', isFeatured ? 'rounded-2xl' : 'rounded-lg')}
                  image={getImage(cover)}
                  alt=""
                />
                <h1
                  className={clsx(
                    'font-normal leading-snug md:text-lg sm:text-base',
                    isFeatured ? 'mt-5 text-2xl lg:mt-4' : 'mt-4 text-xl lg:mt-3'
                  )}
                >
                  {title}
                </h1>
                <Link
                  className="nested-link-red mt-3 lg:mt-2"
                  size="base"
                  theme="arrow-red"
                  withoutHover
                >
                  Read article
                </Link>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

PostsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      slug: PropTypes.string.isRequired,
      fields: PropTypes.exact({
        isFeatured: PropTypes.bool.isRequired,
      }).isRequired,
      frontmatter: PropTypes.exact({
        title: PropTypes.string.isRequired,
        cover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default PostsList;
