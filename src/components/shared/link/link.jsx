import clsx from 'clsx';
import { Link as GatsbyLink } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import ArrowBase from './images/arrow-base.inline.svg';
import ArrowLarge from './images/arrow-large.inline.svg';

const styles = {
  base: 'inline-flex leading-none transition-colors duration-200',
  size: {
    '6xl': {
      wrapper:
        '!inline-block text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl',
      icon: 'ml-4 h-7 lg:ml-3 !inline-block align-baseline lg:h-6 md:ml-2 md:h-5 sm:ml-1.5 sm:h-4 xs:ml-1 xs:h-3',
    },
    '2xl': {
      wrapper: '!inline-block text-2xl font-semibold leading-snug lg:text-xl sm:text-lg',
      icon: 'ml-3 h-4 lg:ml-3 align-baseline !inline-block lg:h-3.5 md:ml-2.5 sm:ml-2 sm:h-3',
    },
    base: {
      wrapper: 'text-base sm:text-sm',
      icon: 'ml-1.5 h-2.5 sm:ml-1 sm:h-2',
    },
  },
  theme: {
    white: {
      wrapper: 'text-white font-normal hover:text-red',
    },
    black: {
      wrapper: 'text-black font-normal hover:text-red',
    },
    'underline-red': {
      wrapper:
        'relative font-normal text-red after:absolute after:-bottom-1 after:translate-y-full after:left-0 after:w-full after:h-0.5 after:bg-red after:bg-opacity-40 after:transition-colors after:duration-200 hover:after:bg-opacity-100',
    },
    'arrow-red': {
      wrapper: 'items-center font-semibold text-red hover:text-blue',
    },
  },
};

const Link = ({ className: additionalClassName, size, theme, to, children, ...props }) => {
  const className = clsx(
    (size || theme) && styles.base,
    styles.size[size]?.wrapper,
    styles.theme[theme]?.wrapper,
    additionalClassName
  );

  const content =
    theme === 'arrow-red' ? (
      <>
        <span>{children}</span>
        {size === 'base' && (
          <ArrowBase className={clsx(styles.size[size]?.icon, styles.theme[theme]?.icon)} />
        )}
        {(size === '2xl' || size === '6xl') && (
          <ArrowLarge className={clsx(styles.size[size]?.icon, styles.theme[theme]?.icon)} />
        )}
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
