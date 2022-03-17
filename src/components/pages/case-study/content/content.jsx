// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';
import GithubLogo from 'images/github.inline.svg';
import QuoteIcon from 'images/quote.inline.svg';

const Content = ({
  logo,
  title,
  description,
  websiteUrl,
  githubUrl,
  githubStars,
  quote,
  text,
  services,
  stack,
}) => (
  <article className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20">
    <div className="container grid-gap-x grid grid-cols-12 items-start md:block">
      <div className="col-span-8">
        <h1 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          {title}
        </h1>
        <p className="mt-3 font-normal leading-snug md:mt-2.5">{description}</p>
        <Link
          className="mt-7 rounded-full border border-red py-3 px-5 transition-colors duration-200 hover:border-blue md:mt-5 sm:mt-4"
          to={websiteUrl}
          size="base"
          theme="arrow-red"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {title}
        </Link>
        <figure className="mt-12 lg:mt-10 sm:mt-8">
          <QuoteIcon className="h-7 lg:h-6 sm:h-5" aria-hidden />
          <blockquote className="mt-4 text-2xl lg:mt-3 lg:text-xl sm:mt-2.5 sm:text-lg">
            <p>{quote.text}</p>
          </blockquote>
          <figcaption className="mt-5 flex items-center lg:mt-4 md:mt-3.5">
            <GatsbyImage
              className="w-12 shrink-0 rounded-full"
              imgClassName="rounded-full"
              image={getImage(quote.authorPhoto)}
              alt={quote.authorName}
              loading="lazy"
            />
            <span className="ml-4 text-base font-normal lg:ml-3 md:ml-2.5">
              {quote.authorName} — {quote.authorPosition}
            </span>
          </figcaption>
        </figure>
        <div className="mt-10 hidden rounded-2xl border border-gray-8 p-5 md:block sm:mt-8 xs:p-4">
          <div className="flex items-center justify-between xs:block">
            <img src={logo} alt={title} loading="eager" />
            {githubUrl && githubStars && (
              <Link
                className="inline-flex items-center rounded-full border border-white p-2 pr-4 transition-colors duration-200 hover:border-red xs:mt-4"
                to={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubLogo className="h-7 text-white" aria-hidden />
                <span className="ml-2 text-xs font-semibold text-white">{githubStars}</span>
              </Link>
            )}
          </div>
          <div className="mt-6 flex md:mt-5 md:space-x-4 sm:mt-4 sm:block sm:space-x-0 sm:space-y-4">
            {[
              { title: 'Provided services', items: services },
              { title: 'Technology stack', items: stack },
            ].map(({ title, items }, index) => (
              <div className="flex-1" key={index}>
                <h4 className="text-base font-semibold leading-snug text-red">{title}</h4>
                <ul className="mt-2.5 space-y-2.5 text-base font-normal leading-snug">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <h2 className="mt-12 text-2xl font-normal leading-snug lg:mt-10 sm:mt-8 sm:text-xl">
          About the project
        </h2>
        <div className="with-link-red mt-2.5 space-y-5 md:space-y-4">
          <MDXProvider>
            <MDXRenderer>{text}</MDXRenderer>
          </MDXProvider>
        </div>
      </div>
      <div className="col-start-10 col-end-13 rounded-2xl border border-gray-8 p-7 lg:col-start-9 md:hidden">
        <img src={logo} alt={title} loading="eager" />
        {githubUrl && githubStars && (
          <Link
            className="mt-7 inline-flex items-center rounded-full border border-white p-2 pr-4 transition-colors duration-200 hover:border-red xs:mt-4"
            to={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogo className="h-7 text-white" aria-hidden />
            <span className="ml-2 text-xs font-semibold text-white">{githubStars}</span>
          </Link>
        )}
        {[
          { title: 'Provided services', items: services },
          { title: 'Technology stack', items: stack },
        ].map(({ title, items }, index) => (
          <Fragment key={index}>
            <h4 className="mt-7 text-base font-semibold leading-snug text-red">{title}</h4>
            <ul className="mt-3 space-y-3 text-base font-normal leading-snug">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </div>
  </article>
);

Content.propTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  websiteUrl: PropTypes.string.isRequired,
  githubUrl: PropTypes.string,
  githubStars: PropTypes.string,
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
  text: PropTypes.node.isRequired,
  services: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  stack: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

Content.defaultProps = {
  githubUrl: null,
  githubStars: null,
};

export default Content;
