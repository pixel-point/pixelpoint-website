import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ items }) => (
  <section className="safe-paddings mt-20 lg:mt-16 md:mt-12 sm:mt-8">
    <div className="container-sm">
      <div className="space-y-7 md:space-y-5 sm:space-y-4">
        {items.map(({ slug, frontmatter: { title, description } }, index) => (
          <article className="border-b border-b-gray-4 pb-7 md:pb-5 sm:pb-4" key={index}>
            <h1 className="text-2xl font-normal leading-snug lg:text-xl sm:text-lg">
              <Link
                className="transition-colors duration-200 hover:text-red"
                to={getBlogPostPath(slug)}
              >
                {title}
              </Link>
            </h1>
            <p className="mt-2.5 text-base">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

PostsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default PostsList;
