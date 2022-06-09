import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { BLOG_CATEGORIES } from 'constants/blog';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ items }) => (
  <section className="safe-paddings mt-20 lg:mt-16 md:mt-14">
    <div className="container-md">
      <div className="grid-gap-x space-y-20 lg:space-y-16 md:space-y-14">
        {items.map(({ slug, author, frontmatter: { title, summary, category, cover } }, index) => (
          <article key={index}>
            <Link className="with-nested-link-red-hover block" to={getBlogPostPath(slug)}>
              <div className="flex items-center">
                <span className="text-sm font-normal text-red">{category}</span>
                <span className="relative ml-3 pl-3 text-sm font-normal text-gray-7 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-4 dark:before:bg-gray-8">
                  {getBlogPostDateFromSlug(slug)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between md:block md:space-y-4">
                <h1 className="max-w-[696px] text-2xl font-normal leading-snug lg:max-w-[600px] md:max-w-none sm:text-xl">
                  {title}
                </h1>
                <div className="flex items-center space-x-2.5 md:space-x-0">
                  <span className="text-sm font-normal md:ml-2.5">{author.name}</span>
                  <GatsbyImage
                    className="w-9 rounded-full md:order-first"
                    imgClassName="rounded-full"
                    image={getImage(author.photo)}
                    alt={author.name}
                  />
                </div>
              </div>
              <div className="mt-5 flex space-x-8 lg:space-x-7 md:mt-4 md:space-x-5 sm:flex-col sm:space-x-0">
                <div className="flex-1 sm:mt-4">
                  <p className="text-lg sm:text-base">{summary}</p>
                  <Link
                    className="nested-link-red mt-5 md:mt-4"
                    size="base"
                    theme="arrow-red"
                    withoutHover
                  >
                    Read article
                  </Link>
                </div>
                <GatsbyImage
                  className="flex-1 rounded-xl sm:order-first"
                  imgClassName="rounded-xl"
                  image={getImage(cover)}
                  alt=""
                  aria-hidden
                />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

PostsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      slug: PropTypes.string.isRequired,
      author: PropTypes.exact({
        name: PropTypes.string.isRequired,
        photo: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
      frontmatter: PropTypes.exact({
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        category: PropTypes.oneOf(BLOG_CATEGORIES).isRequired,
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
