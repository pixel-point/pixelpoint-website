import { useAnimation, m, LazyMotion, domAnimation } from 'framer-motion';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';

import TitleAnimation from 'components/shared/title-animation';

import IllustrationHeartIcon from './images/illustration-heart.inline.svg';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const titleItems = [
  { value: 'Pixel-perfect' },
  { value: 'interface' },
  { value: 'styled' },
  { value: 'with' },
  { value: 'TailwindCSS', color: '#ee2b6c' },
];

// If you are replacing the code, don't forget to fix the code and remove cursor-pointer classes
const illustrationCode = `<article className="flex overflow-hidden rounded-2xl">
  <StaticImage className="h-56 w-52 shrink-0" imgClassName="rounded-l-2xl object-center" src="./illustration.jpg" loading="lazy" alt="" />
  <div className="bg-white px-7 py-5">
    <h1 className="max-w-[240px] text-xl font-semibold leading-snug">Welcome to Conference in London</h1>
    <p className="mt-2 text-sm font-normal text-gray-7">The home of global innovators, disruptors, and tech leaders. Registration is open!</p>
    <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5">
      <button className="flex h-11 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white">Join now</button>
      <HeartIcon className="h-11" />`;

const descriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const itemsWrapperVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, translateY: 200 },
  animate: { opacity: 1, translateY: 0, transition: { duration: 1, ease: [0, 0, 0, 1] } },
};

const Tailwindcss = () => {
  const [contentRef, isContentInView] = useInView({ triggerOnce: true, threshold: 0.8 });
  const [itemsWrapperRef, isItemsWrapperInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  const titleControls = useAnimation();
  const descriptionControls = useAnimation();
  const itemsWrapperControls = useAnimation();

  useEffect(() => {
    if (isContentInView) {
      titleControls.start('animate').then(() => descriptionControls.start('animate'));
    }
    if (isItemsWrapperInView) itemsWrapperControls.start('animate');
  }, [
    isContentInView,
    titleControls,
    descriptionControls,
    isItemsWrapperInView,
    itemsWrapperControls,
  ]);

  return (
    <section className="safe-paddings bg-black pt-80 lg:pt-56 md:pt-40 sm:pt-24">
      <div className="col-span-6 text-white" ref={contentRef}>
        <LazyMotion features={domAnimation}>
          <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
            <TitleAnimation
              tag="h2"
              className="max-w-[520px] text-6xl font-normal leading-snug lg:max-w-[400px] lg:text-[42px] md:max-w-[470px] md:text-4xl sm:text-2xl"
              items={titleItems}
              animationName="second"
              controls={titleControls}
            />
            <m.p
              className="mt-5 max-w-[420px] text-lg md:mt-3 md:max-w-[470px] sm:mt-2.5 sm:text-base"
              initial="initial"
              animate={descriptionControls}
              variants={descriptionVariants}
            >
              Scalable, adaptive and highly customizable styling solution with a tiny CSS bundle
              size.
            </m.p>
          </div>
          <m.div
            className="col-span-6 md:mx-auto md:mt-11 md:max-w-[590px] sm:mt-8"
            initial="initial"
            animate={itemsWrapperControls}
            variants={itemsWrapperVariants}
            ref={itemsWrapperRef}
            aria-hidden
          >
            <m.div
              className="flex overflow-hidden rounded-2xl lg:rounded-xl sm:block"
              variants={itemVariants}
            >
              <StaticImage
                className="h-56 w-52 shrink-0 lg:h-full lg:w-[136px] md:w-52 sm:h-52 sm:w-full"
                imgClassName="rounded-l-2xl object-center lg:rounded-l-xl sm:rounded-t-2xl sm:rounded-bl-none sm:object-[50%_40%]"
                src="./images/illustration-photo.jpg"
                loading="lazy"
                alt=""
              />
              <div className="bg-white px-7 py-5 lg:px-4.5 lg:py-4 md:px-7 sm:p-4">
                <div className="max-w-[240px] text-xl font-bold leading-snug lg:max-w-[230px] lg:text-lg md:max-w-[240px] md:text-xl sm:max-w-none sm:text-base">
                  Welcome to Conference in London
                </div>
                <div className="mt-2 text-sm font-normal text-gray-7">
                  The home of global innovators, disruptors, and tech leaders. Registration is open!
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-t-gray-4 pt-5 lg:mt-3.5 lg:pt-3.5">
                  <span className="flex h-11 cursor-pointer items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white lg:h-10 lg:text-xs md:h-11 md:px-7 md:text-sm sm:h-10">
                    Join now
                  </span>
                  <IllustrationHeartIcon className="h-11 cursor-pointer lg:h-10 md:h-11 sm:h-10" />
                </div>
              </div>
            </m.div>
            <m.div variants={itemVariants}>
              <SyntaxHighlighter
                className="tailwindcss-code-block mt-8 p-3 text-sm lg:mt-7 lg:text-[13px] md:text-sm sm:hidden"
                language="jsx"
                useInlineStyles={false}
                showLineNumbers
              >
                {illustrationCode}
              </SyntaxHighlighter>
              <SyntaxHighlighter
                className="tailwindcss-code-block mt-8 hidden p-3 text-[13px] sm:block"
                language="jsx"
                useInlineStyles={false}
              >
                {illustrationCode}
              </SyntaxHighlighter>
            </m.div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
};

export default Tailwindcss;
