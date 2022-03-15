import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const STATE_MACHINE_NAME = 'State Machine';

const Hero = () => {
  const [wrapperRef, isWrapperView] = useInView({ triggerOnce: true });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-development/hero.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isWrapperView && rive) rive.play();
  }, [isWrapperView, rive]);

  return (
    <section
      className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20"
      ref={wrapperRef}
    >
      <div className="container">
        <h1 className="mx-auto max-w-[700px] text-center text-6xl font-normal leading-snug lg:max-w-[600px] lg:text-5xl md:max-w-[450px] md:text-4xl sm:max-w-[400px] sm:text-3xl xs:max-w-[300px] xs:text-2xl">
          Bring the power of <span className="text-red">JAMStack</span> to your project
        </h1>
        <ImagePlaceholder
          className="mx-auto mt-16 max-w-[1096px] lg:mt-12 md:mt-10 sm:mt-8"
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
