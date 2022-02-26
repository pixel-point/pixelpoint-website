import clsx from 'clsx';
import { Link as GatsbyLink } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import Arrow from 'images/arrow.inline.svg';

const styles = {
  base: 'inline-flex leading-none transition-colors duration-200',
  size: {
    sm: 'text-base sm:text-sm',
  },
  theme: {
    white: 'text-white font-normal hover:text-red',
    'underline-red':
      'relative font-normal text-red after:absolute after:-bottom-1 after:translate-y-full after:left-0 after:w-full after:h-0.5 after:bg-red after:bg-opacity-40 after:transition-colors after:duration-200 hover:after:bg-opacity-100',
    'arrow-red': 'items-center font-semibold text-red',
  },
};

const Link = ({ className: additionalClassName, size, theme, to, children, ...props }) => {
  const className = clsx(
    (size || theme) && styles.base,
    styles.size[size],
    styles.theme[theme],
    additionalClassName
  );

  const content =
    theme === 'arrow-red' ? (
      <>
        <span>{children}</span>
        <Arrow className="ml-1.5 h-2.5" />
      </>
    ) : (
      children
    );

  if (!to) {
    return (
      <span className={className} {...props}>
        {content}
      </span>
    );
  }

  if (to.startsWith('/')) {
    return (
      <GatsbyLink className={className} to={to} {...props}>
        {content}
      </GatsbyLink>
    );
  }

  return (
    <a className={className} href={to} {...props}>
      {content}
    </a>
  );
};

Link.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)),
  theme: PropTypes.oneOf(Object.keys(styles.theme)),
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  className: null,
  to: null,
  size: null,
  theme: null,
};

export default Link;
