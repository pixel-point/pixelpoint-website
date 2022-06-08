import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { BLOG_CATEGORIES } from 'constants/blog';
import getBlogPath from 'utils/get-blog-path';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, category, cover, slug }) => (
  <>
    <div className="flex items-center">
      <Link
        className="text-sm font-normal text-red transition-colors duration-200 hover:text-blue"
        to={getBlogPath({ category })}
      >
        {category}
      </Link>
      <span className="relative ml-3 pl-3 text-sm font-normal text-gray-7 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-4 dark:before:bg-gray-8">
        {getBlogPostDateFromSlug(slug)}
      </span>
    </div>
    <h1 className="mt-5 text-4xl font-bold leading-snug sm:mt-3 sm:text-xl">{title}</h1>
    <GatsbyImage
      className="mt-5 rounded-2xl lg:rounded-xl sm:mt-3"
      imgClassName="rounded-2xl lg:rounded-xl"
      image={getImage(cover)}
      alt=""
      loading="eager"
    />
  </>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.oneOf(BLOG_CATEGORIES).isRequired,
  cover: PropTypes.exact({
    childImageSharp: PropTypes.exact({
      gatsbyImageData: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Hero;
