import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const ImagePlaceholder = React.forwardRef(
  ({ className, width, height, children, ...otherProps }, ref) => (
    <div className={clsx('relative', className)} ref={ref} {...otherProps}>
      <img
        className="w-full"
        src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
        alt=""
        aria-hidden
      />
      <div className="absolute top-0 left-0 h-full w-full">{children}</div>
    </div>
  )
);

ImagePlaceholder.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

ImagePlaceholder.defaultProps = {
  className: null,
};

export default ImagePlaceholder;
