import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const ImagePlaceholder = ({ className, width, height, children, wrapperRef, ...otherProps }) => (
  <div className={clsx('relative', className)} {...otherProps} ref={wrapperRef}>
    <img
      className="w-full"
      src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
      alt=""
      aria-hidden
    />
    <div className="absolute top-0 left-0 h-full w-full">{children}</div>
  </div>
);

ImagePlaceholder.propTypes = {
  wrapperRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

ImagePlaceholder.defaultProps = {
  className: null,
  wrapperRef: null,
};

export default ImagePlaceholder;
