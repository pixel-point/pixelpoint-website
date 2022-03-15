import { useAnimation, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import TitleAnimation from 'components/shared/title-animation';

const titleItems = [
  { value: 'Developed' },
  { value: 'with' },
  { value: 'industry' },
  { value: 'best practices', color: '#ee2b6c' },
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

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-development/code-quality.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isContentInView) {
      titleControls.start('animate').then(() => descriptionControls.start('animate'));
    }
    if (isIllustrationInView && rive) rive.play();
  }, [isContentInView, titleControls, descriptionControls, isIllustrationInView, rive]);

  return (
    <section className="safe-paddings bg-black py-80 lg:py-64 md:pt-52 sm:py-24">
      <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
        <div className="col-span-6 text-white" ref={contentRef}>
          <TitleAnimation
            tag="h2"
            className="max-w-[520px] text-6xl font-normal leading-snug lg:text-5xl md:max-w-none md:text-4xl sm:text-3xl xs:text-2xl"
            items={titleItems}
            animationName="second"
            controls={titleControls}
          />
          <motion.p
            className="mt-5 max-w-[520px] md:mt-4 md:max-w-none sm:mt-3"
            initial="initial"
            animate={descriptionControls}
            variants={descriptionVariants}
          >
            A lean and maintainable code base as a guaranteed part of Pixel Point front-end
            development services.
          </motion.p>
        </div>
        <div
          className="relative col-span-6 flex items-center justify-center md:mt-8 sm:mt-6"
          ref={illustrationRef}
          aria-label="Prettier, ESLint, Lighthouse CI, Webpack bundle with pre/post processing, MarkdownLint, Conventional commits"
        >
          <ImagePlaceholder width={592} height={518}>
            <RiveComponent />
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

export default CodeQuality;
