import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import Link from 'components/shared/link';

const Services = () => {
  const params = {
    src: '/rive/services.riv',
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
    <section className="safe-paddings mt-52 overflow-hidden bg-black text-white" ref={wrapperRef}>
      <div className="container relative">
        <div className="flex max-w-[592px] items-center pt-[300px]">
          <h2 className="text-6xl font-normal leading-snug">
            We’ll get you covered on what we can do best:
          </h2>
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px]">
          <h2 className="text-6xl font-normal leading-snug">Web design</h2>
          <p className="mt-5">
            Our approach is rather inclusive: web design to us is not only effective, efficient and
            visually pleasing screens, but motion design with its live animations, as well as
            graphic design with entertaining illustrations, exciting social media covers and, of
            course, high-quality branded items.
          </p>
          <Link className="mt-5" to="/services/web-design" size="sm" theme="arrow-red">
            Read more
          </Link>
        </div>
        <div className="flex max-w-[520px] flex-col justify-center pt-[400px] pb-[365px]">
          <h2 className="text-6xl font-normal leading-snug">Web development</h2>
          <p className="mt-5">
            Clean codebase, flexible content management, robust release flow and custom integrations
            will please the business while website performance, accessibility and mobile devices
            adaptation will ensure an outstanding experience for your customers.
          </p>
          <Link className="mt-5" to="/services/web-development" size="sm" theme="arrow-red">
            Read more
          </Link>
        </div>
        <div>
          <div className="absolute top-0 right-[-260px] h-[2050px] w-[1090px]">
            <RiveComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
