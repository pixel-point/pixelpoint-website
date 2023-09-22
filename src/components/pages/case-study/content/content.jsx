// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';
import GithubLogo from 'images/github.inline.svg';
import QuoteIcon from 'images/quote.inline.svg';
import getGithubRepoLink from 'utils/get-github-repo-link';

const Content = ({
  logo,
  title,
  description,
  websiteUrl,
  githubUsername,
  githubRepoName,
  quote,
  text,
  services,
  stack,
  githubStars,
}) => (
  <article className="safe-paddings bg-black pt-40 text-white lg:pt-36 sm:pt-24">
    <div className="container grid-gap-x grid grid-cols-12 items-start md:block">
      <div className="col-span-8">
        <h1 className="text-6xl font-normal leading-snug lg:text-[42px] md:text-4xl sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2.5 text-lg font-normal leading-snug lg:text-base">{description}</p>
        <Link
          className="mt-7 rounded-full border border-red py-3 px-5 transition-colors duration-200 hover:border-blue lg:mt-6 md:mt-5"
          to={websiteUrl}
          size="base"
          theme="arrow-red"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {title}
        </Link>
        {quote && (
          <figure className="mt-12">
            <QuoteIcon className="w-10 lg:w-8 sm:h-5" aria-hidden />
            <blockquote className="mt-4 text-2xl lg:text-xl">
              <p>{quote.text}</p>
            </blockquote>
            <figcaption className="mt-5 flex items-center">
              <GatsbyImage
                className="w-12 shrink-0 rounded-full sm:!h-10 sm:!w-10"
                imgClassName="rounded-full"
                image={getImage(quote.authorPhoto)}
                alt={quote.authorName}
                loading="lazy"
              />
              <span className="ml-4 text-base font-normal sm:ml-3">
                {quote.authorName} — {quote.authorPosition}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="mt-12 hidden rounded-xl border border-gray-8 p-7 md:block sm:px-5 sm:pt-4 sm:pb-6">
          <div className="flex items-center justify-between">
            <img
              className="sm:translate-x-[-15%] sm:scale-[0.7]"
              src={logo.url.publicURL}
              width={logo.width}
              height={logo.height}
              alt={title}
              loading="eager"
            />
            {githubUsername && githubRepoName && githubStars && (
              <Link
                className="inline-flex items-center rounded-full border border-white p-2 pr-4 text-white transition-colors duration-200 hover:border-blue hover:text-blue sm:p-1.5 sm:pr-3.5"
                to={getGithubRepoLink(githubUsername, githubRepoName)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubLogo className="h-7 sm:h-6" aria-hidden />
                <span className="ml-2 text-xs font-semibold sm:ml-1.5">{githubStars}</span>
              </Link>
            )}
          </div>
          <div className="mt-6 flex md:mt-7 md:space-x-4 md:border-t md:border-t-gray-8 md:pt-7 sm:mt-4 sm:block sm:space-x-0 sm:space-y-6 sm:pt-6">
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
        <h2 className="mt-12 text-2xl font-normal leading-snug sm:text-xl">About the project</h2>
        <div className="with-link-red mt-2.5 space-y-5 text-lg md:space-y-4">
          <MDXProvider>{text}</MDXProvider>
        </div>
      </div>
      <div className="col-start-10 col-end-13 rounded-2xl border border-gray-8 p-7 lg:col-start-9 lg:rounded-xl md:hidden">
        <img
          src={logo.url.publicURL}
          width={logo.width}
          height={logo.height}
          alt={title}
          loading="eager"
        />
        {githubUsername && githubRepoName && githubStars && (
          <Link
            className="mt-7 inline-flex items-center rounded-full border border-white p-2 pr-4 text-white transition-colors duration-200 hover:border-blue hover:text-blue"
            to={getGithubRepoLink(githubUsername, githubRepoName)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogo className="h-7" aria-hidden />
            <span className="ml-2 text-xs font-semibold">{githubStars}</span>
          </Link>
        )}
        {[
          { title: 'Provided services', items: services },
          { title: 'Technology stack', items: stack },
        ].map(({ title, items }, index) => (
          <Fragment key={index}>
            <h4 className="mt-8 text-base font-semibold leading-snug text-red">{title}</h4>
            <ul className="mt-2.5 space-y-2.5 text-base font-normal leading-snug">
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
  logo: PropTypes.exact({
    url: PropTypes.exact({
      publicURL: PropTypes.string.isRequired,
    }),
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  websiteUrl: PropTypes.string.isRequired,
  githubUsername: PropTypes.string,
  githubRepoName: PropTypes.string,
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
  text: PropTypes.node.isRequired,
  services: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  stack: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  githubStars: PropTypes.string,
};

Content.defaultProps = {
  githubUsername: null,
  githubRepoName: null,
  quote: null,
  githubStars: null,
};

export default Content;
