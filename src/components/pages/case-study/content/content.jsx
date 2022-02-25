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
  <article className="safe-paddings bg-black pt-44 text-white">
    <div className="container grid-gap-x grid grid-cols-12 items-start">
      <div className="col-span-8">
        <h1 className="text-6xl font-normal leading-snug">{title}</h1>
        <p className="mt-2.5 font-normal leading-snug">{description}</p>
        <Link
          className="mt-7 rounded-full border border-red py-3 px-5"
          to={websiteUrl}
          size="sm"
          theme="arrow-red"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {title}
        </Link>
        <figure className="mt-12">
          <QuoteIcon className="h-7" aria-hidden />
          <blockquote className="mt-4 text-2xl">
            <p>{quote.text}</p>
          </blockquote>
          <figcaption className="mt-5 flex items-center">
            <GatsbyImage
              className="w-12 shrink-0 rounded-full"
              image={getImage(quote.authorPhoto)}
              alt={quote.authorName}
            />
            <span className="ml-4 text-base font-normal">
              {quote.authorName} — {quote.authorPosition}
            </span>
          </figcaption>
        </figure>
        <h2 className="mt-12 text-2xl font-normal leading-snug">About the project</h2>
        <div className="with-link-red mt-2.5 space-y-5">
          <MDXProvider>
            <MDXRenderer>{text}</MDXRenderer>
          </MDXProvider>
        </div>
      </div>
      <div className="col-start-10 col-end-13 rounded-2xl border border-gray-8 p-7">
        <img src={logo} alt={title} loading="eager" />
        {githubUrl && githubStars && (
          <Link
            className="mt-7 inline-flex items-center rounded-full border border-white p-2 pr-4"
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
