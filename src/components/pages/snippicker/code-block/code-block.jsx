import clsx from 'clsx';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const DEFAULT_LANGUAGE = 'bash';
const DEFAULT_EASE = [0.5, 0.5, 0.5, 1];

// const wrapperVariants = {
//   initial: {
//     opacity: 0,
//   },
//   animate: {
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//       staggerChildren: 0.05,
//     },
//   },
// };

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

const CodeBlock = ({ className, children, showLineNumbers, theme, items, ...otherProps }) => {
  // const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;
  // const code = children?.trim();
  // {items[activeIndex].code}

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
      <div className="sticky top-0 left-0 z-10 flex w-full gap-[8px] pb-3 pt-5">
        <span className="h-5 w-5 rounded-full bg-[#FE5F56]" />
        <span className="h-5 w-5 rounded-full bg-[#FFBD2D]" />
        <span className="h-5 w-5 rounded-full bg-[#26C940]" />
      </div>

      <m.div
        className="sticky top-14 left-0 z-10 overflow-hidden rounded-lg bg-black"
        // variants={wrapperVariants}
        aria-hidden
      >
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
                  items.length === 1 && '!bg-[#FAFAFA] !text-white'
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
        {/* <button
        className="invisible absolute top-2 right-2 rounded border border-gray-6 bg-white p-1.5 text-gray-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-gray-7 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100"
        type="button"
        disabled={isCopied}
        onClick={() => handleCopy(code)}
      >
        {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      </button> */}
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
};

CodeBlock.defaultProps = {
  className: null,
  showLineNumbers: false,
};

export default CodeBlock;
