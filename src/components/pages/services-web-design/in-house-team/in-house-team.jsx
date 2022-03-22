import { useAnimation, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import TitleAnimation from 'components/shared/title-animation';

const titleItems = [
  { value: 'In-house team', color: '#ee2b6c' },
  { value: 'of' },
  { value: 'motion,' },
  { value: 'graphic' },
  { value: 'and' },
  { value: 'web' },
  { value: 'designers' },
];

const descriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const InHouseTeam = () => {
  const [contentRef, isContentInView] = useInView({ triggerOnce: true, threshold: 0.8 });
  const [illustrationRef, isIllustrationInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  const titleControls = useAnimation();
  const descriptionControls = useAnimation();

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-design/in-house-team.riv',
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
    <section className="safe-paddings bg-black pt-80 lg:pt-64 md:pt-52 sm:pt-32">
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
            With years of experience supplying visuals for tech companies' marketing platforms.
          </motion.p>
        </div>
        <div
          className="relative col-span-6 flex items-center justify-center md:mx-auto md:mt-8 md:max-w-[440px] sm:mt-6"
          ref={illustrationRef}
        >
          <ImagePlaceholder
            className="mb-[-199px] lg:mb-[-153px] md:mb-[-148px] sm:mb-[-129px] xs:mb-[-97px]"
            width={592}
            height={679}
          >
            <RiveComponent />
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

export default InHouseTeam;
