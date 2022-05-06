import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import POST_AUTHORS from 'constants/post-authors';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, author, cover, slug }) => (
  <>
    <h1 className="text-4xl font-bold leading-snug sm:text-xl">{title}</h1>
    <div className="mt-5 flex items-center justify-between font-normal sm:mt-3 sm:flex-col sm:items-start">
      <div className="flex items-center">
        <img
          className="w-12 shrink-0 rounded-full sm:!h-10 sm:!w-10"
          src={POST_AUTHORS[author].photo}
          alt={POST_AUTHORS[author].name}
          loading="eager"
        />
        <span className="ml-4 text-base font-normal sm:ml-3">{POST_AUTHORS[author].name}</span>
      </div>
      <span className="text-sm text-gray-7 sm:order-first sm:hidden">
        {getBlogPostDateFromSlug(slug)}
      </span>
    </div>
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
  author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
  cover: PropTypes.exact({
    childImageSharp: PropTypes.exact({
      gatsbyImageData: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Hero;
