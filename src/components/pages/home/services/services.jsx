import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import Link from 'components/shared/link';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';

const Services = () => {
  const params = {
    src: '/animations/pages/home/services.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  };

  const { RiveComponent, rive } = useRive(params);
  const [wrapperRef, isWrapperInView] = useInView({
    threshold: 0.3,
  });

  useEffect(() => {
    if (isWrapperInView && rive) {
      rive.play();
    }
  }, [isWrapperInView, rive]);

  return (
    <section
      className="safe-paddings mt-52 overflow-hidden bg-black text-white lg:mt-44 md:mt-36 sm:mt-20"
      ref={wrapperRef}
    >
      <div className="container relative">
        <div className="flex max-w-[550px] items-center pt-[300px] lg:max-w-[560px] lg:pt-44 md:max-w-[420px] md:pt-36 sm:max-w-[350px] sm:pt-20">
          <h2 className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
            We’ll get you covered on what we can do best:
          </h2>
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] lg:max-w-none lg:pt-44 md:pt-36 sm:pt-20">
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
          <img
            className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
            src={lgIllustration1}
            alt=""
            aria-hidden
          />
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] pb-[365px] lg:max-w-none lg:py-44 md:py-36 sm:py-20">
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
          <img
            className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
            src={lgIllustration2}
            alt=""
            aria-hidden
          />
        </div>
        <div className="lg:hidden">
          <div className="absolute top-0 right-[-260px] h-[2050px] w-[1090px]">
            <RiveComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
