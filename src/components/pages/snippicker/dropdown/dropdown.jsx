import clsx from 'clsx';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import BucketIcon from '../images/bucket-icon.inline.svg';
import DownArrowIcon from '../images/down-arrow-icon.inline.svg';
import WorldIcon from '../images/world-icon.inline.svg';

const DEFAULT_EASE = [0.5, 0.5, 0.5, 1];

const tabsWrapperVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const tabVariants = {
  initial: {
    translateY: '100%',
  },
  animate: {
    translateY: 0,
    transition: {
      duration: 1,
      ease: DEFAULT_EASE,
    },
  },
};

const icons = {
  Theme: BucketIcon,
  Language: WorldIcon,
};

const Dropdown = ({ title, items, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const Icon = icons[title];

  return (
    <LazyMotion features={domAnimation}>
      <h3 className="mb-3 mt-4 border-t border-[#E6E6E6] pt-4 font-sans text-sm font-semibold">
        {title}
      </h3>
      <div className="group flex items-center rounded border border-transparent transition-colors duration-200 hover:border hover:border-gray-6">
        {Icon && <Icon className="my-auto ml-1 mr-2.5 h-3.5 w-3.5 justify-self-start" />}
        <m.div className="relative w-28 min-w-fit rounded-lg" aria-hidden>
          <div className="relative flex">
            <button
              className="w-full text-left align-middle font-sans text-sm font-normal leading-denser text-black"
              type="button"
              onClick={handleClick}
            >
              {items[activeIndex].name}
            </button>
          </div>
          {isOpen && (
            <m.ul
              className="scrollbar-hidden absolute -left-7 top-6 z-10 flex w-[200px] min-w-full flex-col overflow-x-auto overflow-y-hidden rounded bg-black"
              variants={tabsWrapperVariants}
            >
              {items.map(({ name }, index) => (
                <m.li key={index} variants={tabVariants}>
                  <button
                    className={clsx(
                      'w-full cursor-pointer whitespace-nowrap py-2.5 px-10 text-left text-sm font-normal leading-denser text-white transition-colors duration-200 hover:bg-[#008CF0] xl:px-6'
                    )}
                    type="button"
                    onClick={() => {
                      onClick(index);
                      setActiveIndex(index);
                      handleClick();
                    }}
                  >
                    {name}
                  </button>
                </m.li>
              ))}
            </m.ul>
          )}
        </m.div>
        <span className="ml-auto flex h-7 w-7 items-center rounded border border-transparent group-hover:bg-gray-2">
          <DownArrowIcon className="m-auto h-2 w-2" />
        </span>
      </div>
    </LazyMotion>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Dropdown;
