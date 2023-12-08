/* eslint-disable import/no-extraneous-dependencies */
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';

import QuoteIcon from 'images/quote.inline.svg';

import '@code-hike/mdx/dist/index.css';

import Video from './video';

const Heading =
  (Tag) =>
  // eslint-disable-next-line react/prop-types
  ({ children }) => {
    const id =
      typeof children === 'string'
        ? slugify(children, { strict: true }).toLocaleLowerCase()
        : undefined;

    return <Tag id={id}>{children}</Tag>;
  };

const Paragraph = ({ children }) => {
  // We have this check in order NOT to wrap specified elements into <p> tag
  if (
    children?.props?.mdxType === 'undefined' ||
    children?.props?.mdxType === 'img' ||
    children?.props?.mdxType === 'figure' ||
    children?.props?.className === 'gatsby-resp-image-wrapper' ||
    children?.props?.className === 'embedVideo-container'
  ) {
    return children;
  }

  return <p>{children}</p>;
};

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
};

const Quote = ({ authorName, children }) => (
  <figure
    className="rounded-2xl p-7 dark:!bg-gray-9 dark:!bg-none lg:rounded-xl not-prose"
    style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
  >
    <QuoteIcon className="w-10 sm:w-8" aria-hidden />
    <blockquote className="mt-4 text-2xl sm:text-xl [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
      {children}
    </blockquote>
    {authorName && (
      <figcaption className="mt-5 flex items-center">
        <span className="text-base font-normal">{authorName}</span>
      </figcaption>
    )}
  </figure>
);

Quote.propTypes = {
  authorName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Quote.defaultProps = {
  authorName: null,
};

const getComponents = (videoCovers) => ({
  h2: Heading('h2'),
  h3: Heading('h3'),
  p: Paragraph,
  Quote,
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  Video: (props) => <Video {...props} videoCovers={videoCovers} />,
  // this code prevents the creation of an additional video iframe wrapper in mdx
  undefined: (obj) =>
    obj?.children.filter((child) => typeof child === 'object') || obj?.props?.children,
});

const Content = ({ className, content, videoCovers }) => (
  <div className="mt-10 md:mt-8">
    <div className={clsx('content', className)}>
      <MDXProvider components={getComponents(videoCovers)}>{content}</MDXProvider>
    </div>
  </div>
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  videoCovers: PropTypes.shape({}),
};

Content.defaultProps = {
  className: null,
  videoCovers: null,
};

export default Content;
