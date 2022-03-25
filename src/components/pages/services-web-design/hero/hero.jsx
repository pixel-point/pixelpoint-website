import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Hero = () => {
  const [animationWrapperRef, isAnimationWrapperInView] = useInView({ triggerOnce: true });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-design/hero.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isAnimationWrapperInView && rive) rive.play();
  }, [isAnimationWrapperInView, rive]);

  return (
    <section className="safe-paddings overflow-hidden bg-black pt-28 text-center text-white sm:pt-24">
      <div className="container">
        <h1 className="with-text-highlight-red relative z-10 mx-auto max-w-[660px] text-center text-6xl font-normal leading-snug lg:max-w-[570px] lg:text-[42px] md:max-w-[440px] md:text-4xl sm:max-w-[290px] sm:text-2xl">
          Get your idea shaped into <span>Astonishing</span> website
        </h1>
        <div
          className="mt-[-366px] flex justify-center 2xl:mt-[-20vw] lg:mt-[-22vw] lg:block md:mt-[-20vw] sm:mt-[-18vw]"
          ref={animationWrapperRef}
        >
          <ImagePlaceholder
            className="min-w-[1550px] 2xl:min-w-[calc(100vw-256px)] lg:min-w-0"
            width={1550}
            height={1004}
            aria-hidden
          >
            <RiveComponent />
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

export default Hero;
