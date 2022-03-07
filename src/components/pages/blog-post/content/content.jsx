// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React from 'react';

const Content = ({ className, content }) => (
  <article className="safe-paddings">
    <div className="container-xs">
      <div className={clsx('prose prose-lg md:prose-base', className)}>
        <MDXProvider>
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
