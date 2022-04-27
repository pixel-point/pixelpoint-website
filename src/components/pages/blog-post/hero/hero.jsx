import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, cover, slug }) => (
  <>
    <span className="text-sm font-normal text-gray-7">{getBlogPostDateFromSlug(slug)}</span>
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
  cover: PropTypes.exact({
    childImageSharp: PropTypes.exact({
      gatsbyImageData: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Hero;
