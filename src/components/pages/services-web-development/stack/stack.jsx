import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import TitleAnimation from 'components/shared/title-animation';

const titleItems = [
  { value: 'The' },
  { value: 'setup' },
  { value: 'of' },
  { value: 'choice' },
  { value: 'for' },
  { value: 'effortless', color: '#ee2b6c' },
  { value: 'editing', color: '#ee2b6c' },
  { value: 'and' },
  { value: 'seamless' },
  { value: 'scaling' },
];

const descriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const STATE_MACHINE_NAME = 'SM';

const Frameworks = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [contentRef, isContentInView] = useInView({ triggerOnce: true, threshold: 0.8 });
  const [illustrationRef, isIllustrationInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  const titleControls = useAnimation();
  const descriptionControls = useAnimation();

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-development/stack.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
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
  }, [isContentInView, titleControls, descriptionControls, rive, isIllustrationInView]);

  return (
    <section className="safe-paddings bg-black pt-52 text-white lg:pt-18 sm:pt-11" ref={wrapperRef}>
      <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
        <div className="col-span-6 text-white" ref={contentRef}>
          <TitleAnimation
            tag="h2"
            className="text-6xl tracking-[-1.12px] font-normal leading-snug lg:text-[42px] max-w-[586px] md:max-w-[470px] md:text-4xl sm:text-2xl"
            items={titleItems}
            animationName="second"
            controls={titleControls}
          />
          <motion.p
            className="mt-5 max-w-[410px] text-lg md:mt-3 md:max-w-[470px] sm:mt-2.5 sm:text-base"
            initial="initial"
            animate={descriptionControls}
            variants={descriptionVariants}
          >
            A highly customizable stack with zero legacy and great scalability: Next.js, modern CMS
            solutions, and Markdown for your documentation portal.
          </motion.p>
        </div>
        <div
          className="relative col-span-6 flex items-center justify-center md:mx-auto md:mt-11 md:max-w-[590px] sm:mt-8"
          aria-label="Prettier, ESLint, Lighthouse CI, Webpack bundle with pre/post processing, MarkdownLint, Conventional commits"
          ref={illustrationRef}
        >
          <ImagePlaceholder width={592} height={536}>
            {/* Negative offset for adjusting extra space in Rive animation needed for animation */}
            {isWrapperInView && (
              <div className="absolute -top-[25px] -bottom-[65px] -right-[0px] -left-[0px]">
                <RiveComponent width={592} height={626} />
              </div>
            )}
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

export default Frameworks;
