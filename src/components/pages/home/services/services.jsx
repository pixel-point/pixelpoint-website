import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';

const Services = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [containerRef, isContainerInView] = useInView({ triggerOnce: true, rootMargin: '500px' });
  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/home/services.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  useEffect(() => {
    if (isWrapperInView && rive) {
      rive.play();
    }
  }, [isWrapperInView, rive]);

  return (
    <section
      className="safe-paddings mt-52 overflow-hidden bg-black text-white lg:mt-36 md:pb-24 md:pt-20 sm:mt-20 sm:pb-20"
      ref={wrapperRef}
    >
      <div className="container relative" ref={containerRef}>
        <div className="flex max-w-[592px] items-center pt-[300px] lg:max-w-[458px] lg:pt-[200px] md:max-w-[430px] md:pt-0 sm:max-w-[350px]">
          <h2 className="text-6xl font-normal leading-snug lg:text-[42px] md:text-4xl sm:text-2xl">
            We’ll get you covered on what we can do best:
          </h2>
        </div>
        <div className="flex max-w-[488px] flex-col justify-center pt-[400px] lg:max-w-[406px] lg:pt-[200px] md:mt-36 md:max-w-none md:pt-0 sm:mt-20">
          <h2 className="text-6xl font-normal leading-snug lg:text-[42px] md:text-4xl sm:text-2xl">
            Web design
          </h2>
          <p className="mt-5 text-lg md:mt-3 sm:text-base">
            Our approach is rather inclusive: web design to us is not only effective, efficient and
            visually pleasing screens, but motion design with its live animations, as well as
            graphic design with entertaining illustrations, exciting social media covers and, of
            course, high-quality branded items.
          </p>
          <Link className="mt-5 md:mt-4" to={LINKS.webDesign} size="base" theme="arrow-red">
            Read more
            <span className="sr-only"> about web design</span>
          </Link>
        </div>
        <div className="mt-14 hidden md:block sm:mt-8" aria-hidden>
          <ImagePlaceholder width={1544} height={658}>
            <img
              className="remove-image-loading-visual"
              src={lgIllustration1}
              width={1544}
              height={658}
              loading="lazy"
              alt="Service Illustration"
            />
          </ImagePlaceholder>
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] pb-[365px] lg:max-w-[406px] lg:pt-[200px] lg:pb-[200px] md:mt-36 md:max-w-none md:py-0 sm:mt-20">
          <h2 className="text-6xl font-normal leading-snug lg:text-[42px] md:text-4xl sm:text-2xl">
            Web development
          </h2>
          <p className="mt-5 text-lg md:mt-3 sm:text-base">
            Clean codebase, flexible content management, robust release flow and custom integrations
            will please the business while website performance, accessibility and mobile devices
            adaptation will ensure an outstanding experience for your customers.
          </p>
          <Link className="mt-5 md:mt-4" to={LINKS.webDevelopment} size="base" theme="arrow-red">
            Read more
            <span className="sr-only"> about web development</span>
          </Link>
          <ImagePlaceholder
            className="mx-auto mt-14 hidden max-w-[468px] md:block sm:mt-8"
            width={540}
            height={437}
            aria-hidden
          >
            <img
              className="remove-image-loading-visual"
              src={lgIllustration2}
              width={540}
              height={437}
              loading="lazy"
              alt="Service Illustration"
            />
          </ImagePlaceholder>
        </div>
        <div className="absolute top-0 right-[-260px] h-[2050px] w-[1090px] lg:right-[-152px] lg:h-[1366px] lg:w-[726px] md:hidden">
          {isContainerInView && <RiveComponent />}
        </div>
      </div>
    </section>
  );
};

export default Services;
