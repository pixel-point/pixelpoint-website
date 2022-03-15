import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';

export const OPACITY_DURATION = 0.05;
export const COLOR_DURATION = 0.2;
export const COLOR_DELAY = 0.3;

const firstAnimationVariants = {
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

const secondAnimationVariants = {
  initial: () => ({
    opacity: 0,
    color: '#ffffff',
  }),
  animate: ({ color, delay }) => ({
    opacity: 1,
    ...(color && { color }),
    transition: {
      opacity: { duration: OPACITY_DURATION, delay: delay.opacity },
      color: { duration: COLOR_DURATION, delay: delay.color },
    },
  }),
};

const animations = {
  first: firstAnimationVariants,
  second: secondAnimationVariants,
};

const TitleAnimation = ({ className, tag: Tag, items, animationName, controls }) => {
  const itemsWithAnimationData = useMemo(() => {
    let previousDelay = 0;

    return items.map((item, index) => {
      if (index !== 0) previousDelay += OPACITY_DURATION;

      const newItem = {
        ...item,
        delay: {
          opacity: previousDelay,
        },
      };

      if (animationName === 'first') {
        if (item.color) {
          newItem.delay.color = previousDelay + COLOR_DELAY;
          previousDelay += COLOR_DELAY + COLOR_DURATION;
        }
      }

      if (animationName === 'second') {
        if (item.color) {
          newItem.delay.color = OPACITY_DURATION * items.length;
        }
      }

      return newItem;
    });
  }, [items, animationName]);

  return (
    <>
      <Tag className={clsx(animationName === 'first' && 'md:hidden', className)}>
        {itemsWithAnimationData.map(({ value, color, delay }, index) => (
          <motion.span
            initial="initial"
            animate={controls}
            variants={animations[animationName]}
            custom={{ color, delay }}
            key={index}
          >
            {value}{' '}
          </motion.span>
        ))}
      </Tag>
      {animationName === 'first' && (
        <Tag className={clsx('hidden md:block', className)}>
          {items.map(({ value }, index) => (
            <Fragment key={index}>{value} </Fragment>
          ))}
        </Tag>
      )}
    </>
  );
};

TitleAnimation.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  animationName: PropTypes.oneOf(Object.keys(animations)).isRequired,
  controls: PropTypes.object.isRequired,
};

TitleAnimation.defaultProps = {
  className: null,
};

export default TitleAnimation;
