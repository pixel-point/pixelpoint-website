import React from 'react';
import { useInView } from 'react-intersection-observer';

import Animation from 'components/shared/animation';
import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';

const Services = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section
      className="safe-paddings mt-52 overflow-hidden bg-black text-white lg:mt-36 md:pb-24 md:pt-20 sm:mt-20 sm:pb-20"
      ref={wrapperRef}
    >
      <div className="container relative">
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
          </Link>
        </div>
        <div className="mt-14 hidden md:block sm:mt-8" aria-hidden>
          <ImagePlaceholder width={1544} height={658}>
            <img src={lgIllustration1} width={1544} height={658} alt="" />
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
          </Link>
          <ImagePlaceholder
            className="mx-auto mt-14 hidden max-w-[468px] md:block sm:mt-8"
            width={540}
            height={437}
            aria-hidden
          >
            <img src={lgIllustration2} width={540} height={437} alt="" />
          </ImagePlaceholder>
        </div>
        <div className="absolute top-0 right-[-260px] h-[2050px] w-[1090px] lg:right-[-152px] lg:h-[1366px] lg:w-[726px] md:hidden">
          <Animation
            src="/animations/pages/home/services.riv"
            isAnimationInView={isWrapperInView}
            width={1090}
            height={2050}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
