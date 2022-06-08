import clsx from 'clsx';
import { useAnimation, motion, animate } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const items = [
  {
    name: 'Performance',
    value: '93',
    circleValue: 93,
  },
  {
    name: 'Accessibility',
    value: '100',
    circleValue: 100,
  },
  {
    name: 'Best practices',
    value: '92',
    circleValue: 92,
  },
  {
    name: 'SEO',
    value: '99',
    circleValue: 100,
  },
];

const itemCircleVariants = {
  initial: { pathLength: 0 },
  animate: ({ value }) => ({
    pathLength: value / 100,
    transition: { duration: 2 },
  }),
};

const Value = ({ className, value }) => {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(0, Number(value), {
      duration: 2,
      onUpdate(value) {
        node.textContent = value.toFixed();
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span className={className} ref={nodeRef} />;
};

Value.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const Lighthouse = () => {
  const [itemsWrapperRef, isItemsWrapperInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const itemsWrapperControls = useAnimation();

  useEffect(() => {
    if (isItemsWrapperInView) itemsWrapperControls.start('animate');
  }, [isItemsWrapperInView, itemsWrapperControls]);

  return (
    <section className="safe-paddings mt-52 lg:mt-36 sm:mt-20">
      <div className="container">
        <h2 className="with-text-highlight-red mx-auto max-w-[1008px] text-center text-6xl font-normal leading-snug lg:max-w-[782px] lg:text-[42px] md:text-4xl sm:text-2xl">
          Always in the upper <span>Lighthouse</span> threshold to outperform competitors
        </h2>
        <motion.ul
          className="mt-16 flex justify-center space-x-44 lg:mt-14 lg:space-x-32 md:mt-12 md:justify-between md:space-x-0 sm:mt-11 sm:flex-wrap"
          initial="initial"
          animate={itemsWrapperControls}
          ref={itemsWrapperRef}
        >
          {items.map(({ name, value, circleValue }, index) => (
            <li
              className={clsx('sm:basis-1/2', (index === 2 || index === 3) && 'sm:mt-11')}
              key={index}
            >
              <div className="relative mx-auto h-36 w-36 lg:h-28 lg:w-28 md:h-24 md:w-24">
                <div
                  className="h-full w-full rounded-full border-[6px] border-green border-opacity-20 lg:border-[5px]"
                  aria-hidden
                />
                <svg
                  className="absolute top-1/2 left-1/2 h-full w-full"
                  width="144"
                  height="144"
                  viewBox="0 0 144 144"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                  aria-hidden
                >
                  <motion.path
                    className="stroke-green"
                    d="M3.49609 72.0001C3.49609 109.834 34.1664 140.504 72.0001 140.504C109.834 140.504 140.504 109.834 140.504 72.0001C140.504 34.1664 109.834 3.49609 72.0001 3.49609C34.1664 3.49609 3.49609 34.1664 3.49609 72.0001Z"
                    strokeWidth="6"
                    strokeLinecap="round"
                    custom={{ value: circleValue }}
                    variants={itemCircleVariants}
                  />
                </svg>
                {isItemsWrapperInView && (
                  <Value
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-5xl font-normal lg:text-4xl md:text-3xl"
                    value={value}
                  />
                )}
              </div>
              <div className="mt-4 text-center text-lg font-normal">{name}</div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default Lighthouse;
