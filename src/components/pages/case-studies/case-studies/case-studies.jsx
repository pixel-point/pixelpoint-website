import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { CASE_STUDIES_BASE_PATH } from 'constants/case-studies';

const CaseStudies = ({ items }) => (
  <section className="safe-paddings pt-32 sm:pt-24">
    <div className="container">
      <h1 className="mx-auto max-w-[800px] text-center text-4xl font-semibold leading-snug lg:text-[32px] sm:text-2xl">
        <span className="text-red">Case studies.</span> See how we have helped our customers achieve
        their goals
      </h1>
      <div className="mt-28 space-y-40 lg:mt-24 lg:space-y-36 md:mt-20 md:space-y-24 sm:mt-16 sm:space-y-16">
        {items.map(
          (
            { fields: { slug }, frontmatter: { logo, title, description, overview, quote, cover } },
            index
          ) => (
            <article
              className="grid-gap-x grid grid-cols-2 md:flex md:flex-col md:items-stretch"
              key={index}
            >
              <h1 className="sr-only">{`${title} case study`}</h1>
              <div className="lg:max-w-[436px] md:mt-11 md:max-w-none sm:mt-8">
                <Link className="inline-block" to={`${CASE_STUDIES_BASE_PATH}${slug}`}>
                  <img
                    className="invert lg:translate-x-[-10%] lg:scale-[0.8]"
                    src={logo.url.publicURL}
                    alt={`${title} logo`}
                    loading="lazy"
                    width={logo.width}
                    height={logo.height}
                  />
                </Link>
                <p className="mt-4 text-lg font-normal leading-snug lg:mt-3 lg:text-base sm:mt-2">
                  {description}
                </p>
                {quote ? (
                  <figure className="mt-5 border-t border-t-gray-4 pt-5 lg:mt-4 lg:pt-4">
                    <blockquote>
                      <p className="text-lg lg:text-base">{quote.text}</p>
                    </blockquote>
                    <figcaption className="mt-3 flex items-center">
                      <GatsbyImage
                        className="w-10 shrink-0 rounded-full"
                        imgClassName="rounded-full"
                        image={getImage(quote.authorPhoto)}
                        alt={quote.authorName}
                        loading="lazy"
                      />
                      <span className="ml-3.5 text-base font-normal">
                        {quote.authorName} — {quote.authorPosition}
                      </span>
                    </figcaption>
                  </figure>
                ) : (
                  <p className="mt-5 border-t border-t-gray-4 pt-5 text-lg lg:mt-4 lg:pt-4 lg:text-base">
                    {overview}
                  </p>
                )}
                <Link
                  className="mt-8 lg:mt-5 md:mt-4"
                  to={`${CASE_STUDIES_BASE_PATH}${slug}`}
                  size="base"
                  theme="arrow-red"
                >
                  {title} case study
                </Link>
              </div>
              <Link
                className="md:order-first"
                to={`${CASE_STUDIES_BASE_PATH}${slug}`}
                aria-label={`${title} case study`}
              >
                <GatsbyImage
                  className="w-full rounded-md"
                  imgClassName="rounded-md"
                  image={getImage(cover)}
                  alt={`${title} website`}
                  loading="lazy"
                  style={{ filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))' }}
                />
              </Link>
            </article>
          )
        )}
      </div>
    </div>
  </section>
);

CaseStudies.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      fields: PropTypes.exact({
        slug: PropTypes.string.isRequired,
      }).isRequired,
      frontmatter: PropTypes.exact({
        logo: PropTypes.exact({
          url: PropTypes.exact({
            publicURL: PropTypes.string.isRequired,
          }),
          width: PropTypes.number,
          height: PropTypes.number,
        }).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        overview: PropTypes.string,
        quote: PropTypes.exact({
          text: PropTypes.string.isRequired,
          authorName: PropTypes.string.isRequired,
          authorPosition: PropTypes.string.isRequired,
          authorPhoto: PropTypes.exact({
            childImageSharp: PropTypes.exact({
              gatsbyImageData: PropTypes.object.isRequired,
            }).isRequired,
          }).isRequired,
        }),
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
