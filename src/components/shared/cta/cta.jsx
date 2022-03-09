import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';

const CTA = ({ withTopMargin }) => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const { RiveComponent, rive } = useRive({
    src: '/animations/shared/cta.riv',
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
      className={clsx(
        'safe-paddings bg-black py-20 md:py-18 sm:pt-16 sm:pb-10',
        withTopMargin && 'mt-52 lg:mt-44 md:mt-36 sm:mt-28'
      )}
      ref={wrapperRef}
    >
      <div className="container grid-gap-x grid grid-cols-2 items-center sm:block">
        <div className="sm:text-center">
          <h2 className="text-6xl font-normal leading-snug text-white lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
            Let's have a chat
          </h2>
          <Link size="6xl" theme="arrow-red" to="https://calendly.com/pixel-point/30min">
            Book a call
          </Link>
        </div>
        <ImagePlaceholder className="sm:mt-2 sm:w-full" width={592} height={560}>
          <RiveComponent />
        </ImagePlaceholder>
      </div>
    </section>
  );
};

CTA.propTypes = {
  withTopMargin: PropTypes.bool,
};

CTA.defaultProps = {
  withTopMargin: false,
};

export default CTA;
