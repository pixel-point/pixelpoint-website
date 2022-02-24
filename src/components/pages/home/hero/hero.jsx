import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

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
    <section className="safe-paddings overflow-hidden bg-black text-white" ref={wrapperRef}>
      <div className="container grid-gap-x relative grid grid-cols-2" ref={containerRef}>
        <div className="relative z-10 text-6xl font-normal leading-snug">
          <div className="flex h-screen items-center" ref={firstSectionRef}>
            <h2 className="max-w-[592px]">
              Marketing website is a complex thing to build on your own
            </h2>
          </div>
          <div className="flex items-center pt-[100px]">
            <h2 className="max-w-[592px]">
              You either ask your team of specialists from adjacent fields
            </h2>
          </div>
          <div className="flex items-center pt-[700px] pb-[360px]">
            <h2 className="max-w-[592px]">Or go wild cherry-picking & managing freelancers</h2>
          </div>
        </div>
        <div>
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
