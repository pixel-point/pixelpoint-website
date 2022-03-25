import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, description, cover, slug }) => (
  <>
    <h1 className="text-4xl font-bold leading-snug sm:text-xl">{title}</h1>
    <p className="mt-5 text-xl font-normal sm:mt-3 sm:text-base">{description}</p>
    <div className="mt-5 flex items-center justify-between font-normal sm:mt-3 sm:flex-col sm:items-start">
      <div className="flex items-center">
        <StaticImage
          className="w-12 shrink-0 rounded-full sm:!h-10 sm:!w-10"
          imgClassName="rounded-full"
          src="../../../../images/alex-barashkov.jpg"
          layout="fixed"
          height={48}
          width={48}
          alt="Alex Barashkov"
          loading="eager"
        />
        <span className="ml-4 text-base font-normal sm:space-x-3">
          Alex Barashkov — CEO at Pixel Point
        </span>
      </div>
      <span className="text-sm text-gray-7 sm:order-first sm:hidden">
        {getBlogPostDateFromSlug(slug)}
      </span>
    </div>
    <GatsbyImage
      className="mt-10 rounded-2xl lg:rounded-xl sm:mt-8"
      imgClassName="rounded-2xl lg:rounded-xl"
      image={getImage(cover)}
      alt=""
      loading="eager"
    />
  </>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cover: PropTypes.exact({
    childImageSharp: PropTypes.exact({
      gatsbyImageData: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Hero;
