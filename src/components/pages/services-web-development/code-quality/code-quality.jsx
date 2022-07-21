import { useAnimation, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Animation from 'components/shared/animation';
import TitleAnimation from 'components/shared/title-animation';

const titleItems = [
  { value: 'Developed' },
  { value: 'with' },
  { value: 'industry' },
  { value: 'Best practices', color: '#ee2b6c' },
];

const descriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const CodeQuality = () => {
  const [contentRef, isContentInView] = useInView({ triggerOnce: true, threshold: 0.8 });
  const [illustrationRef, isIllustrationInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  const titleControls = useAnimation();
  const descriptionControls = useAnimation();

  useEffect(() => {
    if (isContentInView) {
      titleControls.start('animate').then(() => descriptionControls.start('animate'));
    }
  }, [descriptionControls, isContentInView, titleControls]);

  return (
    <section className="safe-paddings bg-black py-80 lg:py-56 md:py-40 sm:py-24">
      <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
        <div className="col-span-6 text-white" ref={contentRef}>
          <TitleAnimation
            tag="h2"
            className="max-w-[520px] text-6xl font-normal leading-snug lg:max-w-[420px] lg:text-[42px] md:max-w-[490px] md:text-4xl sm:text-2xl"
            items={titleItems}
            animationName="second"
            controls={titleControls}
          />
          <motion.p
            className="mt-5 max-w-[520px] text-lg md:mt-3 md:max-w-[490px] sm:mt-2.5 sm:max-w-none sm:text-base"
            initial="initial"
            animate={descriptionControls}
            variants={descriptionVariants}
          >
            A lean and maintainable code base as a guaranteed part of Pixel Point front-end
            development services.
          </motion.p>
        </div>
        <div
          className="relative col-span-6 flex items-center justify-center md:mx-auto md:mt-11 md:max-w-[590px] sm:mt-8"
          aria-label="Prettier, ESLint, Lighthouse CI, Webpack bundle with pre/post processing, MarkdownLint, Conventional commits"
          ref={illustrationRef}
        >
          <Animation
            isAnimationInView={isIllustrationInView}
            src="/animations/pages/services-web-development/code-quality.riv"
            width={592}
            height={518}
          />
        </div>
      </div>
    </section>
  );
};

export default CodeQuality;
