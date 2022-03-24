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
  { value: 'graphic,' },
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
    <section className="safe-paddings bg-black pt-80 lg:pt-52 md:pt-40 sm:pt-28">
      <div className="container grid-gap-x grid grid-cols-12 items-center md:block">
        <div className="col-span-6 text-white" ref={contentRef}>
          <TitleAnimation
            tag="h2"
            className="max-w-[520px] text-6xl font-normal leading-snug lg:max-w-[400px] lg:text-[42px] md:max-w-none md:text-4xl sm:text-2xl"
            items={titleItems}
            animationName="second"
            controls={titleControls}
          />
          <motion.p
            className="mt-5 max-w-[520px] text-lg md:mt-3 md:max-w-none sm:mt-2.5 sm:text-base"
            initial="initial"
            animate={descriptionControls}
            variants={descriptionVariants}
          >
            With years of experience supplying visuals for tech companies' marketing platforms.
          </motion.p>
        </div>
        <div
          className="relative col-span-6 flex items-center justify-center md:mx-auto md:mt-11 md:max-w-[590px] sm:mt-8"
          ref={illustrationRef}
        >
          <ImagePlaceholder
            className="mb-[-199px] lg:mb-[-153px] md:mb-[-196px] sm:mb-[-129px] xs:mb-[-97px]"
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
