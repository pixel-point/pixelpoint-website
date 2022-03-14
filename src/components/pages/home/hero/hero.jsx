import { useAnimation } from 'framer-motion';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import TitleAnimation, {
  OPACITY_DURATION,
  COLOR_DURATION,
  COLOR_DELAY,
} from 'components/shared/title-animation';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';
import lgIllustration3 from './images/lg-illustration-3.svg';

const STATE_MACHINE_NAME = 'State Machine';
const INPUT_NAME = 'Fall Trigger';

const firstSectionTitleItems = [
  { value: 'Marketing', delay: { opacity: OPACITY_DURATION * 0 } },
  { value: 'website', delay: { opacity: OPACITY_DURATION * 1 } },
  { value: 'is', delay: { opacity: OPACITY_DURATION * 2 } },
  { value: 'a', delay: { opacity: OPACITY_DURATION * 3 } },
  {
    value: 'complex',
    color: '#2b4bee',
    delay: { opacity: OPACITY_DURATION * 4, color: OPACITY_DURATION * 4 + COLOR_DELAY },
  },
  { value: 'thing', delay: { opacity: OPACITY_DURATION * 5 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'to', delay: { opacity: OPACITY_DURATION * 6 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'build', delay: { opacity: OPACITY_DURATION * 7 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'on', delay: { opacity: OPACITY_DURATION * 8 + COLOR_DURATION + COLOR_DELAY } },
  {
    value: 'your own',
    color: '#ee2b6c',
    delay: {
      opacity: OPACITY_DURATION * 9 + COLOR_DURATION + COLOR_DELAY,
      color: OPACITY_DURATION * 9 + COLOR_DURATION + COLOR_DELAY + COLOR_DELAY,
    },
  },
];

const secondSectionTitleItems = [
  { value: 'You', delay: { opacity: OPACITY_DURATION * 0 } },
  { value: 'either', delay: { opacity: OPACITY_DURATION * 1 } },
  { value: 'ask', delay: { opacity: OPACITY_DURATION * 2 } },
  { value: 'your', delay: { opacity: OPACITY_DURATION * 3 } },
  {
    value: 'team',
    color: '#2b4bee',
    delay: { opacity: OPACITY_DURATION * 4, color: OPACITY_DURATION * 4 + COLOR_DELAY },
  },
  { value: 'of', delay: { opacity: OPACITY_DURATION * 5 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'specialists', delay: { opacity: OPACITY_DURATION * 6 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'from', delay: { opacity: OPACITY_DURATION * 7 + COLOR_DURATION + COLOR_DELAY } },
  {
    value: 'adjacent fields',
    color: '#ee2b6c',
    delay: {
      opacity: OPACITY_DURATION * 8 + COLOR_DURATION + COLOR_DELAY,
      color: OPACITY_DURATION * 8 + COLOR_DURATION + COLOR_DELAY + COLOR_DELAY,
    },
  },
];

const thirdSectionTitleItems = [
  { value: 'Or', delay: { opacity: OPACITY_DURATION * 0 } },
  { value: 'go', delay: { opacity: OPACITY_DURATION * 1 } },
  { value: 'wild', delay: { opacity: OPACITY_DURATION * 2 } },
  {
    value: 'cherry-picking',
    color: '#2b4bee',
    delay: { opacity: OPACITY_DURATION * 3, color: OPACITY_DURATION * 3 + COLOR_DELAY },
  },
  { value: '&', delay: { opacity: OPACITY_DURATION * 4 + COLOR_DURATION + COLOR_DELAY } },
  { value: 'managing', delay: { opacity: OPACITY_DURATION * 5 + COLOR_DURATION + COLOR_DELAY } },
  {
    value: 'freelancers',
    color: '#ee2b6c',
    delay: {
      opacity: OPACITY_DURATION * 6 + COLOR_DURATION + COLOR_DELAY,
      color: OPACITY_DURATION * 6 + COLOR_DURATION + COLOR_DELAY + COLOR_DELAY,
    },
  },
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

  const fallState = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useLayoutEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
    setFirstSectionHeight(firstSectionRect.height);
    setContainerHeight(containerRect.height);
  }, []);

  useEffect(() => {
    if (isWrapperInView && rive && currentAnimState !== 'fall') {
      firstSectionTitleControls.start('animate').then(() => {
        rive.play('State Machine');
      });
    }
  }, [isWrapperInView, rive, currentAnimState, firstSectionTitleControls]);

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
      className="safe-paddings overflow-hidden bg-black text-white md:pt-28 sm:pt-20"
      ref={wrapperRef}
    >
      <div className="container grid-gap-x relative grid grid-cols-2 md:block" ref={containerRef}>
        <div className="relative z-10 text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          <div className="flex h-screen items-center md:block md:h-auto" ref={firstSectionRef}>
            <TitleAnimation
              tag="h2"
              items={firstSectionTitleItems}
              controls={firstSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-12 hidden max-w-[440px] md:block sm:mt-8 sm:max-w-full"
              width={620}
              height={367}
              aria-hidden
            >
              <img src={lgIllustration1} alt="" />
            </ImagePlaceholder>
          </div>
          <div
            className="flex items-center pt-[100px] pb-[500px] lg:pb-[400px] md:block md:pb-0 md:pt-36 sm:pt-20"
            ref={secondSectionRef}
          >
            <TitleAnimation
              tag="h2"
              items={secondSectionTitleItems}
              controls={secondSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-12 hidden max-w-[440px] md:block sm:mt-8 sm:max-w-full"
              width={620}
              height={339}
              aria-hidden
            >
              <img src={lgIllustration2} alt="" />
            </ImagePlaceholder>
          </div>
          <div
            className="flex items-center pt-[200px] pb-[360px] lg:pt-[150px] lg:pb-[300px] md:block md:py-36 sm:py-20"
            ref={thirdSectionRef}
          >
            <TitleAnimation
              tag="h2"
              items={thirdSectionTitleItems}
              controls={thirdSectionTitleControls}
            />
            <ImagePlaceholder
              className="mx-auto mt-12 hidden max-w-[440px] md:block sm:mt-8 sm:max-w-full"
              width={620}
              height={294}
              aria-hidden
            >
              <img src={lgIllustration3} alt="" />
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
