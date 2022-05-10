import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { BLOG_CATEGORIES } from 'constants/blog';
import getBlogPath from 'utils/get-blog-path';

const Categories = ({ activeCategory }) => (
  <section className="safe-paddings mt-16 lg:mt-14 md:mt-12 sm:mt-11">
    <div className="container-md">
      <ul className="scrollbar-hidden relative flex space-x-6 overflow-auto pb-px after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-gray-4">
        {['All', ...BLOG_CATEGORIES].map((category, index) => (
          <li key={index}>
            <Link
              className={clsx(
                'relative mb-3 block text-sm font-normal transition-colors duration-200 hover:text-red',
                ((!activeCategory && category === 'All') || activeCategory === category) &&
                  '!font-semibold text-red after:absolute after:-bottom-[13px] after:left-0 after:z-10 after:h-0.5 after:w-full after:bg-red'
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
    </div>
  </section>
);

Categories.propTypes = {
  activeCategory: PropTypes.oneOf(BLOG_CATEGORIES),
};

Categories.defaultProps = {
  activeCategory: null,
};

export default Categories;
