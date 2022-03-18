// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React from 'react';

import QuoteIcon from 'images/quote.inline.svg';

const Quote = ({ authorName, children }) => (
  <figure
    className="rounded-2xl p-7 text-2xl"
    style={{ background: 'linear-gradient(247.55deg, #fcfcfc 0%, #f7f7f7 100%)' }}
  >
    <QuoteIcon className="h-7 lg:h-6 sm:h-5" aria-hidden />
    <blockquote className="mt-4 text-2xl lg:mt-3 lg:text-xl sm:mt-2.5 sm:text-lg">
      <p className="my-0 before:hidden after:hidden">{children}</p>
    </blockquote>
    <figcaption className="mt-5 flex items-center lg:mt-4 md:mt-3.5">
      <span className="text-base font-normal">{authorName}</span>
    </figcaption>
  </figure>
);

Quote.propTypes = {
  authorName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const components = {
  Quote,
};

const Content = ({ className, content }) => (
  <article className="safe-paddings mt-10">
    <div className="container-xs">
      <div className={clsx('content', className)}>
        <MDXProvider components={components}>
          <MDXRenderer>{content}</MDXRenderer>
        </MDXProvider>
      </div>
    </div>
  </article>
);

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

Content.defaultProps = {
  className: null,
};

export default Content;
