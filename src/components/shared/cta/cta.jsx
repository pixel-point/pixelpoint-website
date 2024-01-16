import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const CTA = ({ className, withTopMargin }) => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const [animationWrapperRef, isAnimationWrapperInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { RiveComponent, rive } = useRive({
    src: '/animations/shared/cta-10-06-2022.riv',
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
    <section
      className={clsx(
        'safe-paddings bg-black py-20 lg:py-[74px] md:py-20 sm:pt-11 sm:pb-9',
        withTopMargin && 'mt-52 lg:mt-36 md:mt-28 sm:mt-20',
        className
      )}
      ref={wrapperRef}
    >
      <div className="container grid-gap-x grid grid-cols-2 items-center sm:block">
        <div className="sm:text-center">
          <h2 className="text-6xl font-normal leading-snug text-white lg:text-[42px] md:text-[32px] sm:text-2xl">
            Let's have a chat
          </h2>
          <Link size="6xl" theme="arrow-red" to={LINKS.getInTouch}>
            Get in touch
          </Link>
        </div>
        <div className="sm:mt-4.5" ref={animationWrapperRef}>
          <ImagePlaceholder className="sm:w-full" width={592} height={560}>
            {isWrapperInView && <RiveComponent width={592} height={560} />}
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

CTA.propTypes = {
  className: PropTypes.string,
  withTopMargin: PropTypes.bool,
};

CTA.defaultProps = {
  className: null,
  withTopMargin: false,
};

export default CTA;
