import React, { useState } from 'react';

import Button from 'components/pages/snippicker/button';
import CodeBlock from 'components/pages/snippicker/code-block';
import ColorPicker from 'components/pages/snippicker/color-picker';
import SEO from 'components/shared/seo/seo';
import DEFAULT_CODE_SNIPPETS from 'constants/code-snippets';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

const generateCode = (
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
  lineNumbersColor
) => `
  @layer components {
    .highlighted-code {
      code {
        text-shadow: unset !important;

        span {
          @apply text-[${color1}];
        }
      }

      .token.keyword,
      .token.class-name,
      .token.url,
      .token.tag {
        @apply text-[${color2}];
      }

      .token.console,
      .token.class-name.namespace,
      .token.tag.attr-name {
        @apply text-[${color1}];
      }

      .token.builtin,
      .token.function,
      .token.string,
      .token.char,
      .token.selector,
      .token.tag.attr-value,
      .token.atrule,
      .token.inserted {
        @apply text-[${color3}];
      }

      .token.boolean,
      .token.number,
      .token.symbol,
      .token.variable,
      .token.constant,
      .token.property,
      .token.property-access,
      .token.deleted {
        @apply text-[${color4}];
      }

      .token.regex,
      .token.important {
        @apply text-[${color6}];
      }

      .token.operator,
      .token.entity {
        @apply text-[${color5}];
      }

      .token.punctuation {
        @apply text-[${color7}];
      }

      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        @apply text-[${color8}];
      }

      .react-syntax-highlighter-line-number.linenumber {
        @apply !min-w-[2.25em] text-[${lineNumbersColor}];
      }
    }
  }
  `;

const headerStyles = 'mb-2 font-sans text-sm font-semibold';

const Snippicker = () => {
  const [color1, setColor1] = useState('#000000');
  const [color2, setColor2] = useState('#8c53c6');
  const [color3, setColor3] = useState('#5d7e2a');
  const [color4, setColor4] = useState('#bf4040');
  const [color5, setColor5] = useState('#2d7786');
  const [color6, setColor6] = useState('#e5a11a');
  const [color7, setColor7] = useState('#999999');
  const [color8, setColor8] = useState('#bfbfbf');
  const [lineNumbersColor, setLineNumbersColor] = useState('#b3b3b3');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generatedCode = generateCode(
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color7,
    color8,
    lineNumbersColor
  );

  const colorPickers = [
    {
      value: color1,
      onChange: (e) => setColor1(e.target.value),
    },
    {
      value: color2,
      onChange: (e) => setColor2(e.target.value),
    },
    {
      value: color3,
      onChange: (e) => setColor3(e.target.value),
    },
    {
      value: color4,
      onChange: (e) => setColor4(e.target.value),
    },
    {
      value: color5,
      onChange: (e) => setColor5(e.target.value),
    },
    {
      value: color6,
      onChange: (e) => setColor6(e.target.value),
    },
    {
      value: color7,
      onChange: (e) => setColor7(e.target.value),
    },
    {
      value: color8,
      onChange: (e) => setColor8(e.target.value),
    },
  ];

  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <div className="text-lg">
      <div className="flex">
        <div
          className="no-scrollbars relative mx-auto mt-20 max-h-[80vh] max-w-[900px] overflow-scroll rounded-lg px-5 pb-5"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="sticky top-0 left-0 z-10 flex w-full gap-[8px] pb-4 pt-5"
            style={{ backgroundColor: bgColor }}
          >
            <span className="h-5 w-5 rounded-full bg-[#FE5F56]" />
            <span className="h-5 w-5 rounded-full bg-[#FFBD2D]" />
            <span className="h-5 w-5 rounded-full bg-[#26C940]" />
          </div>

          <CodeBlock
            theme={{
              '--color1': color1,
              '--color2': color2,
              '--color3': color3,
              '--color4': color4,
              '--color5': color5,
              '--color6': color6,
              '--color7': color7,
              '--color8': lineNumbersColor,
              '--lineNumbers': lineNumbersColor,
            }}
            items={DEFAULT_CODE_SNIPPETS}
            bgColor={`${bgColor}`}
            showLineNumbers
          />
        </div>

        <aside className="flex max-h-[100vh] min-h-[100vh] w-[250px] flex-col overflow-y-scroll bg-[#ffffff] p-4">
          <div className="flex flex-col pt-4">
            <h3 className="mb-3 font-sans text-sm font-semibold">Tokens</h3>

            {colorPickers.map((picker, index) => (
              <ColorPicker value={picker.value} key={index} onChange={picker.onChange} />
            ))}

            <div className="mb-3 mt-4 border-t border-[#E6E6E6] pt-4" id="lineNumbersColor">
              <p className={headerStyles}>Line numbers color</p>
              <ColorPicker
                value={lineNumbersColor}
                onChange={(e) => setLineNumbersColor(e.target.value)}
              />
            </div>

            <div className="mb-3 mt-4 border-t border-[#E6E6E6] pt-4" id="backgroundColor">
              <p className={headerStyles}>Background</p>

              <ColorPicker value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 border-t border-[#E6E6E6] pt-4">
            <p className={headerStyles}>Export</p>
            <Button disabled={isCopied} onClick={() => handleCopy(generatedCode)}>
              {isCopied ? 'CSS is copied!' : 'Copy CSS'}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Snippicker;

export const Head = () => <SEO />;
