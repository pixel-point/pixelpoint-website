import clsx from 'clsx';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const DEFAULT_LANGUAGE = 'bash';
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

const CodeBlock = ({
  className,
  children,
  showLineNumbers,
  theme,
  items,
  bgColor,
  ...otherProps
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;

  const wrapperRef = useRef(null);

  useEffect(() =>
    Object.entries(theme).forEach(
      ([key, value]) => {
        wrapperRef.current.style.setProperty(key, value);
      },
      [wrapperRef, theme]
    )
  );

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <LazyMotion features={domAnimation}>
      <div className="sticky top-14 left-0 z-10 p-4" style={{ backgroundColor: bgColor }}>
        <m.div className="overflow-hidden rounded-lg bg-black" aria-hidden>
          <m.ul
            className="scrollbar-hidden flex space-x-0.5 overflow-x-auto overflow-y-hidden"
            variants={tabsWrapperVariants}
          >
            {items.map(({ name }, index) => (
              <m.li className="grow" key={index} variants={tabVariants}>
                <button
                  className={clsx(
                    'block w-full cursor-pointer whitespace-nowrap bg-gray-10 py-2.5 px-4 text-xs font-medium leading-none text-gray-6 transition-colors duration-200 hover:bg-gray-9 hover:text-black xl:px-2.5',
                    activeIndex === index && '!bg-black !text-white',
                    items.length === 1 && '!bg-gray-9 !text-white'
                  )}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                >
                  {name}
                </button>
              </m.li>
            ))}
          </m.ul>
        </m.div>
      </div>
      <div
        className={clsx(
          'highlighted-code group relative mt-4 min-w-[900px] max-w-[900px]',
          className
        )}
        ref={wrapperRef}
        {...otherProps}
      >
        <SyntaxHighlighter
          language={language}
          useInlineStyles={false}
          showLineNumbers={showLineNumbers}
          className="no-scrollbars text-sm"
        >
          {items[activeIndex].code.trim()}
        </SyntaxHighlighter>
      </div>
    </LazyMotion>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  showLineNumbers: PropTypes.bool,
  theme: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  bgColor: PropTypes.string.isRequired,
};

CodeBlock.defaultProps = {
  className: null,
  showLineNumbers: false,
};

export default CodeBlock;
