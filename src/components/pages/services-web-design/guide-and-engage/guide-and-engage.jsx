import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';

const GuideAndEngage = () => {
  const [wrapperRef, isWrapperView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '500px' });

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
      className="safe-paddings bg-black py-52 text-white lg:py-36 md:py-28 sm:py-16"
      ref={wrapperRef}
    >
      <div className="container" ref={containerRef}>
        <h2 className="sm::text-2xl with-text-highlight-red mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug lg:max-w-[690px] lg:text-[42px] md:max-w-[650px] md:text-4xl sm:text-2xl">
          <span>Guide and engage</span> your customers with sleek, on-point animations
        </h2>
        <ImagePlaceholder
          className="mt-20 lg:mt-14 md:mt-11 sm:mt-8"
          width={1216}
          height={724}
          aria-hidden
        >
          {isContainerInView && <RiveComponent width={1216} height={724} />}
        </ImagePlaceholder>
      </div>
    </section>
  );
};

export default GuideAndEngage;
