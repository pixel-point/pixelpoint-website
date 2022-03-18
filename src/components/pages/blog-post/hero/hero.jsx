import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, description, cover, slug }) => (
  <section className="safe-paddings pt-40 lg:pt-32 md:pt-28 sm:pt-20">
    <div className="container-xs">
      <h1 className="text-4xl font-bold leading-snug md:text-3xl">{title}</h1>
      <p className="mt-5 text-xl font-normal lg:mt-4 md:mt-3.5">{description}</p>
      <div className="mt-5 flex items-center justify-between font-normal lg:mt-4 md:mt-3.5 sm:flex-col sm:items-start">
        <div className="flex items-center sm:mt-3.5">
          <StaticImage
            className="w-12 shrink-0 rounded-full"
            imgClassName="rounded-full"
            src="../../../../images/alex-barashkov.jpg"
            layout="fixed"
            height={48}
            width={48}
            alt="Alex Barashkov"
            loading="eager"
          />
          <span className="ml-4 text-base lg:ml-3 md:ml-2.5">
            Alex Barashkov — CEO at Pixel Point
          </span>
        </div>
        <span className="text-sm text-gray-7 sm:order-first">{getBlogPostDateFromSlug(slug)}</span>
      </div>
      <GatsbyImage
        className="mt-10 rounded-2xl"
        imgClassName="rounded-2xl"
        image={getImage(cover)}
        alt=""
        loading="eager"
      />
    </div>
  </section>
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
