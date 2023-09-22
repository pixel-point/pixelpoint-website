import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useAnimation } from 'framer-motion';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import TitleAnimation from 'components/shared/title-animation';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';
import lgIllustration3 from './images/lg-illustration-3.svg';

const STATE_MACHINE_NAME = 'State Machine';
const INPUT_NAME = 'Fall Trigger';

const firstSectionTitleItems = [
  { value: 'A' },
  { value: 'marketing' },
  { value: 'website' },
  { value: 'is' },
  { value: 'a' },
  { value: 'complex', color: '#2b4bee' },
  { value: 'thing' },
  { value: 'to' },
  { value: 'build' },
  { value: 'on' },
  { value: 'your own', color: '#ee2b6c' },
];

const secondSectionTitleItems = [
  { value: 'You' },
  { value: 'either' },
  { value: 'ask' },
  { value: 'your' },
  { value: 'team', color: '#2b4bee' },
  { value: 'of' },
  { value: 'specialists' },
  { value: 'from' },
  { value: 'adjacent fields', color: '#ee2b6c' },
];

const thirdSectionTitleItems = [
  { value: 'Or' },
  { value: 'go' },
  { value: 'wild' },
  { value: 'cherry-picking', color: '#2b4bee' },
  { value: '&' },
  { value: 'managing' },
  { value: 'freelancers', color: '#ee2b6c' },
];

const Hero = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true });
  const [secondSectionRef, isSecondSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const [thirdSectionRef, isThirdSectionInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const firstSectionTitleControls = useAnimation();
  const secondSectionTitleControls = useAnimation();
  const thirdSectionTitleControls = useAnimation();

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/home/hero.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  const containerRef = useRef();
  const firstSectionRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  const [firstSectionHeight, setFirstSectionHeight] = useState(0);
  const [currentAnimState, setCurrentAnimState] = useState('');
  const [isInitialAnimationCompleted, setIsInitialAnimationCompleted] = useState(false);

  const fallState = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useLayoutEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
    setFirstSectionHeight(firstSectionRect.height);
    setContainerHeight(containerRect.height);
  }, []);

  useEffect(() => {
    if (rive && isInitialAnimationCompleted) {
      rive.play('State Machine');
    }
  }, [isInitialAnimationCompleted, rive]);

  useEffect(() => {
    if (isWrapperInView) {
      firstSectionTitleControls.start('animate').then(() => {
        setIsInitialAnimationCompleted(true);
      });
    }
  }, [isWrapperInView, firstSectionTitleControls]);

  useEffect(() => {
    if (currentAnimState === 'fall' && isSecondSectionInView)
      secondSectionTitleControls.start('animate');
  }, [currentAnimState, isSecondSectionInView, secondSectionTitleControls]);

  useEffect(() => {
    if (currentAnimState === 'fall' && isThirdSectionInView)
      thirdSectionTitleControls.start('animate');
  }, [currentAnimState, isThirdSectionInView, thirdSectionTitleControls]);

  useEffect(() => {
    // Add event listener to window scroll
    const handleScroll = () => {
      if (
        currentAnimState !== 'fall' &&
        rive &&
        rive.lastRenderTime > 0 &&
        window.scrollY > firstSectionHeight - 600
      ) {
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
      className="safe-paddings overflow-hidden bg-black text-white md:py-36 sm:pt-28 sm:pb-20"
      ref={wrapperRef}
    >
      <div className="container grid-gap-x relative grid grid-cols-2 md:block" ref={containerRef}>
        <div className="relative z-10 text-6xl font-normal leading-snug lg:text-[42px] md:mx-auto md:text-4xl sm:text-2xl">
          <div className="flex h-screen items-center md:block md:h-auto" ref={firstSectionRef}>
            <TitleAnimation
              className="md:max-w-[574px]"
              tag="h2"
              items={firstSectionTitleItems}
              animationName="first"
              controls={firstSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-11 hidden max-w-[468px] md:block sm:mt-8"
              width={468}
              height={380}
              aria-hidden
            >
              <img
                className="remove-image-loading-visual"
                src={lgIllustration1}
                width={468}
                height={380}
                loading="lazy"
                alt="Hero Illustration"
              />
            </ImagePlaceholder>
          </div>
          <div
            className="flex items-center pt-[100px] pb-[500px] lg:pb-[400px] md:mt-36 md:block md:py-0 sm:mt-20"
            ref={secondSectionRef}
          >
            <TitleAnimation
              className="md:max-w-[530px]"
              tag="h2"
              items={secondSectionTitleItems}
              animationName="first"
              controls={secondSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-11 hidden max-w-[590px] md:block sm:mt-8"
              width={590}
              height={700}
              aria-hidden
            >
              <img
                className="remove-image-loading-visual"
                src={lgIllustration2}
                width={590}
                height={700}
                loading="lazy"
                alt="Hero Illustration"
              />
            </ImagePlaceholder>
          </div>
          <div
            className="flex items-center pt-[200px] pb-[360px] lg:pt-[150px] lg:pb-[300px] md:mt-36 md:block md:py-0 sm:mt-20"
            ref={thirdSectionRef}
          >
            <TitleAnimation
              className="md:max-w-[434px]"
              tag="h2"
              items={thirdSectionTitleItems}
              animationName="first"
              controls={thirdSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-11 hidden max-w-[590px] md:block sm:mt-8"
              width={590}
              height={766}
              aria-hidden
            >
              <img
                className="remove-image-loading-visual"
                src={lgIllustration3}
                width={590}
                height={766}
                loading="lazy"
                alt="Hero Illustration"
              />
            </ImagePlaceholder>
          </div>
        </div>
        <div className="md:hidden">
          <div className="absolute top-0 h-[3000px] w-[1100px] translate-y-[calc(-505px_-_480px_/_2_+_100vh_/_2)] translate-x-[-254px] lg:h-[2307px] lg:w-[846px] lg:translate-y-[calc(-388px_-_369px_/_2_+_100vh_/_2)] lg:translate-x-[-174px] md:hidden">
            <RiveComponent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
