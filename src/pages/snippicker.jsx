import React, { useState } from 'react';

import Button from 'components/pages/snippicker/button';
import CodeBlock from 'components/pages/snippicker/code-block';
import SEO from 'components/shared/seo/seo';
import DEFAULT_CODE_SNIPPETS from 'constants/code-snippets';

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

const colorPickerStyles = 'h-8 w-8 !bg-white border-none';
const headerStyles = 'mb-2 font-sans text-sm font-semibold';
const descriptionStyles = 'ml-2.5 text-center text-base leading-denser';

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
  return (
    <div className="text-lg">
      <div className="flex">
        <div
          className="no-scrollbars relative mx-auto mt-20 max-h-[80vh] max-w-[900px] overflow-scroll rounded-lg px-5 pb-5"
          style={{ backgroundColor: bgColor }}
        >
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
            showLineNumbers
          />
        </div>

        <aside className="flex max-h-[100vh] w-[250px] flex-col overflow-scroll bg-white p-4">
          <div className="flex flex-col pt-4">
            <h3 className="mb-3 font-sans text-sm font-semibold">Tokens</h3>

            <div className="mb-3" id="color1">
              <p className={headerStyles}>Color 1</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color1"
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                />
                <span className={descriptionStyles}>{color1}</span>
              </div>
            </div>

            <div className="mb-3" id="color2">
              <p className={headerStyles}>Color 2</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color2"
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                />
                <span className={descriptionStyles}>{color2}</span>
              </div>
            </div>

            <div className="mb-3" id="color3">
              <p className={headerStyles}>Color 3</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color3"
                  type="color"
                  value={color3}
                  onChange={(e) => setColor3(e.target.value)}
                />
                <span className={descriptionStyles}>{color3}</span>
              </div>
            </div>

            <div className="mb-3" id="color4">
              <p className={headerStyles}>Color 4</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color4"
                  type="color"
                  value={color4}
                  onChange={(e) => setColor4(e.target.value)}
                />
                <span className={descriptionStyles}>{color4}</span>
              </div>
            </div>

            <div className="mb-3" id="color5">
              <p className={headerStyles}>Color 5</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color5"
                  type="color"
                  value={color5}
                  onChange={(e) => setColor5(e.target.value)}
                />
                <span className={descriptionStyles}>{color5}</span>
              </div>
            </div>

            <div className="mb-3" id="color6">
              <p className={headerStyles}>Color 6</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color6"
                  type="color"
                  value={color6}
                  onChange={(e) => setColor6(e.target.value)}
                />
                <span className={descriptionStyles}>{color6}</span>
              </div>
            </div>

            <div className="mb-3" id="color7">
              <p className={headerStyles}>Color 7</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color7"
                  type="color"
                  value={color7}
                  onChange={(e) => setColor7(e.target.value)}
                />
                <span className={descriptionStyles}>{color7}</span>
              </div>
            </div>

            <div className="mb-3" id="color8">
              <p className={headerStyles}>Color 8</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="color8"
                  type="color"
                  value={color8}
                  onChange={(e) => setColor8(e.target.value)}
                />
                <span className={descriptionStyles}>{color8}</span>
              </div>
            </div>

            <div className="mb-3 mt-4 border-t border-[#E6E6E6] pt-4" id="lineNumbersColor">
              <p className={headerStyles}>Line numbers color</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="lineNumbersColor"
                  type="color"
                  value={lineNumbersColor}
                  onChange={(e) => setLineNumbersColor(e.target.value)}
                />
                <span className={descriptionStyles}>{lineNumbersColor}</span>
              </div>
            </div>

            <div className="mb-3 mt-4 border-t border-[#E6E6E6] pt-4" id="backgroundColor">
              <p className={headerStyles}>Background</p>
              <div className="flex items-center">
                <input
                  className={colorPickerStyles}
                  name="backgroundColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />

                <span className={descriptionStyles}>{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-[#E6E6E6] pt-4">
            <p className={headerStyles}>Export</p>
            <Button type="button" onClick={() => navigator.clipboard.writeText(generatedCode)}>
              Copy CSS
            </Button>
          </div>

          {/* <Button>Copy CSS</Button> */}
        </aside>
      </div>
    </div>
  );
};

export default Snippicker;

export const Head = () => <SEO />;
