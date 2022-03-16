import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';

const Services = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.3 });

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
      className="safe-paddings mt-52 overflow-hidden bg-black text-white lg:mt-36 md:mt-28 md:py-28 sm:mt-20 sm:py-20"
      ref={wrapperRef}
    >
      <div className="container relative">
        <div className="flex max-w-[550px] items-center pt-[300px] lg:max-w-[560px] lg:pt-[200px] md:mx-auto md:max-w-[420px] md:pt-0 sm:max-w-[350px]">
          <h2 className="text-6xl font-normal leading-snug lg:text-5xl md:text-center md:text-4xl sm:text-3xl xs:text-2xl">
            We’ll get you covered on what we can do best:
          </h2>
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] lg:max-w-[424px] lg:pt-[225px] md:mx-auto md:mt-28 md:max-w-[590px] md:pt-0 sm:mt-20">
          <h2 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
            Web design
          </h2>
          <p className="mt-5 md:mt-4 sm:mt-3">
            Our approach is rather inclusive: web design to us is not only effective, efficient and
            visually pleasing screens, but motion design with its live animations, as well as
            graphic design with entertaining illustrations, exciting social media covers and, of
            course, high-quality branded items.
          </p>
          <Link
            className="mt-5 md:mt-4 sm:mt-3"
            to="/services/web-design"
            size="base"
            theme="arrow-red"
          >
            Read more
          </Link>
        </div>
        <ImagePlaceholder
          className="mx-auto mt-12 hidden md:block sm:mt-8"
          width={944}
          height={402}
          aria-hidden
        >
          <img src={lgIllustration1} alt="" />
        </ImagePlaceholder>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] pb-[365px] lg:max-w-[424px] lg:pt-[225px] lg:pb-[200px] md:mx-auto md:mt-28 md:max-w-[590px] md:py-0 sm:mt-20">
          <h2 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
            Web development
          </h2>
          <p className="mt-5 md:mt-4 sm:mt-3">
            Clean codebase, flexible content management, robust release flow and custom integrations
            will please the business while website performance, accessibility and mobile devices
            adaptation will ensure an outstanding experience for your customers.
          </p>
          <Link
            className="mt-5 md:mt-4 sm:mt-3"
            to="/services/web-development"
            size="base"
            theme="arrow-red"
          >
            Read more
          </Link>
          <ImagePlaceholder
            className="mx-auto mt-12 hidden max-w-[440px] md:block sm:mt-8 sm:max-w-full"
            width={540}
            height={437}
            aria-hidden
          >
            <img src={lgIllustration2} alt="" />
          </ImagePlaceholder>
        </div>
        <div className="absolute top-0 right-[-260px] h-[2050px] w-[1090px] lg:right-[-152px] lg:h-[1366px] lg:w-[726px] md:hidden">
          <RiveComponent />
        </div>
      </div>
    </section>
  );
};

export default Services;
