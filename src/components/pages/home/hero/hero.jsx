import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';
import lgIllustration3 from './images/lg-illustration-3.svg';

const STATE_MACHINE_NAME = 'State Machine';
const INPUT_NAME = 'Fall Trigger';

const Hero = () => {
  const [wrapperRef, isWrapperInView] = useInView();

  const params = {
    src: '/rive/home-hero.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  };

  const { RiveComponent, rive } = useRive(params);

  const containerRef = useRef();
  const firstSectionRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  const [firstSectionHeight, setFirstSectionHeight] = useState(0);
  const [currentAnimState, setCurrentAnimState] = useState('');

  const fallState = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useLayoutEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
    setFirstSectionHeight(firstSectionRect.height);
    setContainerHeight(containerRect.height);
  }, []);

  useEffect(() => {
    if (isWrapperInView && rive && currentAnimState !== 'fall') {
      rive.play('State Machine');
    }
  }, [isWrapperInView, rive, currentAnimState]);

  useEffect(() => {
    // Add event listener to window scroll
    const handleScroll = () => {
      if (currentAnimState !== 'fall' && rive && window.scrollY > firstSectionHeight - 600) {
        window.rive = rive;
        setCurrentAnimState('fall');
        fallState.fire();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerHeight, rive, currentAnimState, firstSectionHeight, fallState]);

  return (
    <section
      className="safe-paddings overflow-hidden bg-black text-white lg:pt-32 md:pt-28 sm:pt-20"
      ref={wrapperRef}
    >
      <div className="container grid-gap-x relative grid grid-cols-2 lg:block" ref={containerRef}>
        <div className="relative z-10 text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          <div className="flex h-screen items-center lg:block lg:h-auto" ref={firstSectionRef}>
            <h2 className="max-w-[592px] lg:max-w-none">
              Marketing website is a complex thing to build on your own
            </h2>
            <img
              className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
              src={lgIllustration1}
              alt=""
              aria-hidden
            />
          </div>
          <div className="flex items-center pt-[100px] lg:block lg:pt-44 md:pt-36 sm:pt-20">
            <h2 className="max-w-[592px] lg:max-w-none">
              You either ask your team of specialists from adjacent fields
            </h2>
            <img
              className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
              src={lgIllustration2}
              alt=""
              aria-hidden
            />
          </div>
          <div className="flex items-center pt-[700px] pb-[360px] lg:block lg:py-44 md:py-36 sm:py-20">
            <h2 className="max-w-[592px] lg:max-w-none">
              Or go wild cherry-picking & managing freelancers
            </h2>
            <img
              className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
              src={lgIllustration3}
              alt=""
              aria-hidden
            />
          </div>
        </div>
        <div className="lg:hidden">
          <div
            className="absolute top-0 h-[3000px] w-[1100px]"
            style={{
              transform: `translateY(${
                -505 - 480 / 2 + firstSectionHeight / 2
              }px) translateX(-254px)`,
            }}
          >
            <RiveComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
