import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
    if (isAnimationWrapperInView && rive?.readyForPlaying) rive.play();
  }, [isAnimationWrapperInView, rive]);

  return (
    <section className="safe-paddings relative h-[var(--real-browser-height)] overflow-hidden bg-black">
      <div className="container h-full">
        <h1 className="sr-only">Magnetize new users with astonishing design</h1>
        <div
          className={clsx(
            'invisible absolute top-1/2 left-1/2 h-full w-full min-w-[1024px] max-w-[1920px] -translate-x-1/2 -translate-y-1/2 opacity-0 sm:w-[325vw] sm:max-w-[1440px]',
            rive?.readyForPlaying && '!visible !opacity-100'
          )}
          ref={animationWrapperRef}
        >
          <RiveComponent />
        </div>
      </div>
    </section>
  );
};

export default Hero;
