import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Hero = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-design/hero.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isWrapperInView && rive) rive.play();
  }, [isWrapperInView, rive]);

  return (
    <section
      className="safe-paddings bg-black pt-40 text-white lg:pt-32 md:pt-28 sm:pt-20"
      ref={wrapperRef}
    >
      <div className="container">
        <h1 className="mx-auto max-w-[660px] text-center text-6xl font-normal leading-snug lg:max-w-[570px] lg:text-5xl md:max-w-[440px] md:text-4xl sm:max-w-[360px] sm:text-3xl xs:max-w-[290px] xs:text-2xl">
          Get your idea shaped into <span className="text-red">Astonishing</span> website
        </h1>
        <div className="mt-10 flex justify-center lg:mt-8 lg:block md:mt-6 sm:mt-4">
          <ImagePlaceholder
            className="min-w-[1580px] 2xl:min-w-[calc(100vw-64px)] lg:min-w-0"
            width={1580}
            height={1100}
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
