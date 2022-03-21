import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const GuideAndEngage = () => {
  const [wrapperRef, isWrapperView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/services-web-design/guide-and-engage.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      if (isWrapperView) {
        rive.play();
      } else {
        rive.pause();
      }
    }
  }, [isWrapperView, rive]);

  return (
    <section
      className="safe-paddings mt-52 bg-black py-52 text-white lg:mt-36 lg:py-36 md:mt-28 md:py-28 sm:mt-20 sm:py-20"
      ref={wrapperRef}
    >
      <div className="container">
        <h2 className="mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug lg:max-w-[800px] lg:text-5xl md:max-w-[650px] md:text-4xl sm:text-3xl xs:text-2xl">
          <span className="text-red">Guide and engage</span> your customers with sleek, on-point
          animations
        </h2>
        <ImagePlaceholder
          className="mt-20 lg:mt-16 md:mt-12 sm:mt-8"
          width={1216}
          height={724}
          aria-hidden
        >
          <RiveComponent />
        </ImagePlaceholder>
      </div>
    </section>
  );
};

export default GuideAndEngage;
