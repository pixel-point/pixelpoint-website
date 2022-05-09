import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { BLOG_CATEGORIES } from 'constants/blog';
import POST_AUTHORS from 'constants/post-authors';
import getBlogPath from 'utils/get-blog-path';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ activeCategory, items }) => (
  <section className="safe-paddings pt-32 sm:pt-24">
    <div className="container-md">
      <h1 className="text-4xl font-semibold leading-snug lg:text-[32px] sm:text-2xl">
        Sharing Pixel Point <span className="text-red">Collective experience:</span>
      </h1>
      <ul className="scrollbar-hidden mt-16 flex space-x-6 overflow-auto border-b border-b-gray-4 lg:mt-14 md:mt-12 sm:mt-11">
        {['All', ...BLOG_CATEGORIES].map((category, index) => (
          <li key={index}>
            <Link
              className={clsx(
                'relative mb-3 block text-sm font-normal transition-colors duration-200 hover:text-red',
                ((!activeCategory && category === 'All') || activeCategory === category) &&
                  '!font-semibold text-red after:absolute after:-bottom-[13px] after:left-0 after:h-0.5 after:w-full after:bg-red'
              )}
              to={getBlogPath({ category: category === 'All' ? undefined : category })}
            >
              <span className="invisible font-semibold opacity-0">{category}</span>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid-gap-x mt-20 space-y-20 lg:mt-16 lg:space-y-16 md:mt-14 md:space-y-14">
        {items.map(({ slug, frontmatter: { title, summary, category, author, cover } }, index) => (
          <article key={index}>
            <Link className="with-nested-link-red-hover block" to={getBlogPostPath(slug)}>
              <div className="flex items-center">
                <span className="text-sm font-normal text-red">{category}</span>
                <span className="relative ml-3 pl-3 text-sm font-normal text-gray-7 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-4">
                  {getBlogPostDateFromSlug(slug)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between md:block md:space-y-4">
                <h1 className="max-w-[696px] text-2xl font-normal leading-snug lg:max-w-[600px] md:max-w-none sm:text-xl">
                  {title}
                </h1>
                <div className="flex items-center space-x-2.5 md:space-x-0">
                  <span className="text-sm font-normal md:ml-2.5">{POST_AUTHORS[author].name}</span>
                  <img
                    className="h-auto w-9 rounded-full md:order-first"
                    src={POST_AUTHORS[author].photo}
                    height={36}
                    width={36}
                    alt={POST_AUTHORS[author].name}
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
  activeCategory: PropTypes.oneOf(BLOG_CATEGORIES),
  items: PropTypes.arrayOf(
    PropTypes.exact({
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.exact({
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        category: PropTypes.oneOf(BLOG_CATEGORIES).isRequired,
        author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
        cover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

PostsList.defaultProps = {
  activeCategory: null,
};

export default PostsList;
