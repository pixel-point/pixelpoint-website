import clsx from 'clsx';
import { Link as GatsbyLink } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import ArrowLarge from './images/arrow-large.inline.svg';
import Arrow from './images/arrow.inline.svg';

const styles = {
  base: 'inline-flex leading-none transition-colors duration-200',
  size: {
    '6xl': {
      wrapper: 'text-6xl font-normal !leading-snug lg:text-[42px] md:text-[32px] sm:text-2xl',
      icon: 'mt-2.5 ml-4 h-7 lg:mt-2 lg:ml-3 lg:h-6 md:mt-1.5 md:ml-2 md:h-5 sm:ml-1 sm:h-3',
    },
    '4xl': {
      wrapper: 'text-4xl font-normal !leading-snug lg:text-[32px] sm:text-2xl',
      icon: 'mt-1.5 ml-2 h-5 lg:h-4 sm:h-3.5 sm:mt-1.5',
    },
    'lg-only': {
      wrapper: 'text-lg font-semibold',
      icon: 'ml-2 h-2.5 mt-0.5',
    },
    base: {
      wrapper: 'text-base',
      icon: 'mt-[3px] ml-1.5 h-2.5',
    },
  },
  theme: {
    white: {
      wrapper: {
        base: 'text-white font-normal',
        hover: 'hover:text-red',
      },
    },
    black: {
      wrapper: {
        base: 'text-black font-normal dark:text-white',
        hover: 'hover:text-red dark:hover:text-red',
      },
    },
    'underline-red': {
      wrapper: {
        base: 'relative font-normal text-red after:absolute after:-bottom-1 after:translate-y-full after:left-0 after:w-full after:h-0.5 after:bg-red after:bg-opacity-40 after:transition-colors after:duration-200',
        hover: 'hover:after:bg-opacity-100',
      },
    },
    'arrow-red': {
      wrapper: {
        base: 'items-center font-semibold text-red whitespace-nowrap',
        hover: 'hover:text-blue',
      },
    },
  },
};

const Link = ({
  className: additionalClassName,
  size,
  theme,
  to,
  withoutHover,
  children,
  ...props
}) => {
  const className = clsx(
    (size || theme) && styles.base,
    styles.size[size]?.wrapper,
    styles.theme[theme]?.wrapper?.base,
    !withoutHover && styles.theme[theme]?.wrapper?.hover,
    additionalClassName
  );

  const content =
    theme === 'arrow-red' ? (
      <>
        <span>{children}</span>
        {(size === 'base' || size === 'lg-only') && (
          <Arrow className={clsx(styles.size[size]?.icon, styles.theme[theme]?.icon)} />
        )}
        {(size === '4xl' || size === '6xl') && (
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
  withoutHover: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  className: null,
  to: null,
  size: null,
  theme: null,
  withoutHover: false,
};

export default Link;
