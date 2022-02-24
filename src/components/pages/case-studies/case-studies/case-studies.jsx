import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { CASE_STUDIES_BASE_PATH } from 'constants/case-studies';

const CaseStudies = ({ items }) => (
  <section className="safe-paddings mt-32">
    <div className="container space-y-40">
      {items.map(({ slug, frontmatter: { logo, title, description, quote, cover } }, index) => (
        <article className="grid-gap-x grid grid-cols-2" key={index}>
          <div>
            <h1 className="sr-only">{`${title} case study`}</h1>
            <img className="invert" src={logo.publicURL} alt={`${title} logo`} loading="lazy" />
            <p className="mt-4 font-normal leading-snug">{description}</p>
            <figure className="mt-5 border-t border-t-gray-4 pt-5">
              <blockquote>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className="mt-3 flex items-center">
                <GatsbyImage
                  className="w-10 shrink-0 rounded-full"
                  image={getImage(quote.authorPhoto)}
                  alt={quote.authorName}
                  loading="lazy"
                />
                <span className="ml-3.5 text-base font-normal">
                  {quote.authorName} — {quote.authorPosition}
                </span>
              </figcaption>
            </figure>
            <Link
              className="mt-8"
              to={`${CASE_STUDIES_BASE_PATH}/${slug}`}
              size="sm"
              theme="arrow-red"
            >
              {title} case study
            </Link>
          </div>
          <Link to={`${CASE_STUDIES_BASE_PATH}/${slug}`} aria-label={`${title} case study`}>
            <GatsbyImage
              className="rounded-2xl"
              imgClassName="rounded-2xl"
              image={getImage(cover)}
              alt={`${title} website`}
              loading="lazy"
            />
          </Link>
        </article>
      ))}
    </div>
  </section>
);

CaseStudies.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.exact({
        logo: PropTypes.exact({
          publicURL: PropTypes.string.isRequired,
        }).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quote: PropTypes.exact({
          text: PropTypes.string.isRequired,
          authorName: PropTypes.string.isRequired,
          authorPosition: PropTypes.string.isRequired,
          authorPhoto: PropTypes.exact({
            childImageSharp: PropTypes.exact({
              gatsbyImageData: PropTypes.object.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired,
        cover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default CaseStudies;
