// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
import React from 'react';

const Content = ({ className, content }) => (
  <div className="safe-paddings">
    <div className="container-sm">
      <div className={clsx('prose prose-lg sm:prose-base', className)}>
        <MDXProvider>
          <MDXRenderer>{content}</MDXRenderer>
        </MDXProvider>
      </div>
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
