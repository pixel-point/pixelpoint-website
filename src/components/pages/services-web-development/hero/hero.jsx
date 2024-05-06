import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';

const STATE_MACHINE_NAME = ['loop', 'intro'];

const Hero = () => {
  const [wrapperRef, isWrapperView] = useInView({ triggerOnce: true });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-development/hero-v2.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });
  useEffect(() => {
    // window.rives = rive;
    if (isWrapperView && rive) {
      rive.play();
    }
  }, [isWrapperView, rive]);

  return (
    <section
      className="safe-paddings overflow-hidden bg-black pt-32 text-center text-white sm:pt-24"
      ref={wrapperRef}
    >
      <div className="container">
        <h1 className="with-text-highlight-red mx-auto max-w-[1000px] text-center text-6xl font-normal leading-snug lg:max-w-[520px] lg:text-[42px] md:max-w-[450px] md:text-4xl sm:max-w-[300px] sm:text-2xl">
          You develop your product. <span>We develop your site.</span>
        </h1>
        <ImagePlaceholder
          className="mx-auto mt-16 max-w-[1096px] lg:mt-14 md:mt-12 sm:mt-6"
          width={1096}
          height={600}
          aria-hidden
        >
          <RiveComponent />
        </ImagePlaceholder>
      </div>
    </section>
  );
};

export default Hero;
