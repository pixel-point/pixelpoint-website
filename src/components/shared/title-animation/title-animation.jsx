import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

export const OPACITY_DURATION = 0.05;
export const COLOR_DURATION = 0.2;
export const COLOR_DELAY = 0.3;

const variants = {
  initial: ({ color }) => ({
    opacity: 0,
    ...(color && { color }),
  }),
  animate: ({ delay }) => ({
    opacity: 1,
    color: '#ffffff',
    transition: {
      opacity: { duration: OPACITY_DURATION, delay: delay.opacity },
      color: { duration: COLOR_DURATION, delay: delay.color },
    },
  }),
};

const TitleAnimation = ({ className, tag: Tag, items, controls }) => (
  <>
    <Tag className={clsx('md:hidden', className)}>
      {items.map(({ value, color, delay }, index) => (
        <motion.span
          initial="initial"
          animate={controls}
          variants={variants}
          custom={{ color, delay }}
          key={index}
        >
          {value}{' '}
        </motion.span>
      ))}
    </Tag>
    <Tag className={clsx('hidden md:block', className)}>
      {items.map(({ value }, index) => (
        <Fragment key={index}>{value} </Fragment>
      ))}
    </Tag>
  </>
);

TitleAnimation.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
      delay: PropTypes.exact({
        opacity: PropTypes.number.isRequired,
        color: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,
  controls: PropTypes.object.isRequired,
};

TitleAnimation.defaultProps = {
  className: null,
};

export default TitleAnimation;
