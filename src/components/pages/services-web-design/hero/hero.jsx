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
    <section className="safe-paddings overflow-hidden bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20">
      <div className="container">
        <h1 className="relative z-10 mx-auto max-w-[660px] text-center text-6xl font-normal leading-snug lg:max-w-[570px] lg:text-5xl md:max-w-[440px] md:text-4xl sm:max-w-[360px] sm:text-3xl xs:max-w-[290px] xs:text-2xl">
          Get your idea shaped into <span className="text-red">Astonishing</span> website
        </h1>
        <div
          className="mt-[-306px] flex justify-center 2xl:mt-[-276px] lg:mt-[-176px] md:mt-[-132px] sm:mt-[-104px] xs:mt-[-78px]"
          ref={animationWrapperRef}
        >
          <ImagePlaceholder
            className="min-w-[1550px] 2xl:min-w-[calc(100vw-256px)] lg:min-w-0 sm:min-w-[514px] xs:min-w-[414px]"
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
