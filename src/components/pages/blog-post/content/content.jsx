// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';

import QuoteIcon from 'images/quote.inline.svg';

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
    children?.props?.mdxType === 'img' ||
    children?.props?.mdxType === 'figure' ||
    children?.props?.className === 'gatsby-resp-image-wrapper'
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
    className="rounded-2xl p-7 lg:rounded-xl"
    style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
  >
    <QuoteIcon className="w-10 sm:w-8" aria-hidden />
    <blockquote className="mt-4 text-2xl sm:text-xl">
      <p className="my-0 before:hidden after:hidden">{children}</p>
    </blockquote>
    {authorName && (
      <figcaption className="mt-5 flex items-center">
        <span className="text-base font-normal">{authorName}</span>
      </figcaption>
    )}
  </figure>
);

Quote.propTypes = {
  authorName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const components = {
  h2: Heading('h2'),
  h3: Heading('h3'),
  p: Paragraph,
  Quote,
};

const Content = ({ className, content }) => (
  <div className="mt-10 md:mt-8">
    <div className={clsx('content', className)}>
      <MDXProvider components={components}>
        <MDXRenderer>{content}</MDXRenderer>
      </MDXProvider>
    </div>
  </div>
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

Content.defaultProps = {
  className: null,
};

export default Content;
