// eslint-disable-next-line import/no-extraneous-dependencies
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PropTypes from 'prop-types';
// TODO: Delete if still not needed after moving all posts
// import React, { Fragment } from 'react';
import React from 'react';

// TODO: Delete if still not needed after moving all posts
// const components = {
//   table: (props) => (
//     <div className="table-wrapper">
//       <table {...props} />
//     </div>
//   ),
//   // eslint-disable-next-line react/jsx-no-useless-fragment
//   undefined: (props) => <Fragment {...props} />,
// };

const Content = ({ className, content }) => (
  <div className="safe-paddings">
    <div className="container-sm">
      <div className={clsx('prose prose-lg sm:prose-base', className)}>
        {/* TODO: Delete if still not needed after moving all posts */}
        {/* <MDXProvider components={components}> */}
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
