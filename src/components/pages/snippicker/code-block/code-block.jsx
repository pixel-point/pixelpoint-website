import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const DEFAULT_LANGUAGE = 'bash';

const CodeBlock = ({
  className,
  children,
  showLineNumbers,
  theme,
  items,
  bgColor,
  activeIndex,
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

  return (
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
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  bgColor: PropTypes.string.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

CodeBlock.defaultProps = {
  className: null,
  showLineNumbers: false,
};

export default CodeBlock;
