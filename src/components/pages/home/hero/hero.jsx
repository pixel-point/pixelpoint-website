import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

import lgIllustration1 from './images/lg-illustration-1.svg';
import lgIllustration2 from './images/lg-illustration-2.svg';
import lgIllustration3 from './images/lg-illustration-3.svg';

const STATE_MACHINE_NAME = 'State Machine';
const INPUT_NAME = 'Fall Trigger';

const OPACITY_DURATION = 0.05;
const COLOR_DURATION = 0.2;
const COLOR_DELAY = 0.3;

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

const titleSpanVariants = {
  initial: ({ color }) => ({
    opacity: 0,
    ...(color && { color }),
  }),
  animate: ({ delay }) => ({
    opacity: 1,
    color: '#ffffff',
    transition: {
      opacity: { duration: OPACITY_DURATION, delay: delay.opacity },
      color: { duration: COLOR_DURATION, delay: delay.color },
    },
  }),
};

const Title = ({ items, controls }) => (
  <h2 className="max-w-[592px] lg:max-w-none">
    {items.map(({ value, color, delay }, index) => (
      <motion.span
        initial="initial"
        animate={controls}
        variants={titleSpanVariants}
        custom={{ color, delay }}
        key={index}
      >
        {value}{' '}
      </motion.span>
    ))}
  </h2>
);

Title.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
      delay: PropTypes.exact({
        opacity: PropTypes.number.isRequired,
        color: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,
  controls: PropTypes.object.isRequired,
};

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
      className="safe-paddings overflow-hidden bg-black text-white lg:pt-32 md:pt-28 sm:pt-20"
      ref={wrapperRef}
    >
      <div className="container grid-gap-x relative grid grid-cols-2 lg:block" ref={containerRef}>
        <div className="relative z-10 text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          <div className="flex h-screen items-center lg:block lg:h-auto" ref={firstSectionRef}>
            <Title items={firstSectionTitleItems} controls={firstSectionTitleControls} />
            <img
              className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
              src={lgIllustration1}
              alt=""
              aria-hidden
            />
          </div>
          <div
            className="flex items-center pt-[100px] lg:block lg:pt-44 md:pt-36 sm:pt-20"
            ref={secondSectionRef}
          >
            <Title items={secondSectionTitleItems} controls={secondSectionTitleControls} />
            <img
              className="mx-auto mt-16 hidden max-w-[620px] lg:block md:mt-12 md:max-w-[440px] sm:mt-8 sm:max-w-full"
              src={lgIllustration2}
              alt=""
              aria-hidden
            />
          </div>
          <div
            className="flex items-center pt-[700px] pb-[360px] lg:block lg:py-44 md:py-36 sm:py-20"
            ref={thirdSectionRef}
          >
            <Title items={thirdSectionTitleItems} controls={thirdSectionTitleControls} />
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
