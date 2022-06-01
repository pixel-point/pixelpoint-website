import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

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
    <section className="safe-paddings relative h-screen overflow-hidden bg-black">
      <div className="container h-full">
        <h1 className="sr-only">Magnetize new users with astonishing design</h1>
        <div
          className="absolute top-1/2 left-1/2 h-full w-full min-w-[1024px] max-w-[1920px] -translate-x-1/2 -translate-y-1/2 sm:min-w-[768px]"
          ref={animationWrapperRef}
        >
          <RiveComponent />
        </div>
      </div>
    </section>
  );
};

export default Hero;
