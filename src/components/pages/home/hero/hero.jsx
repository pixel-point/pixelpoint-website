import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';
// useStateMachineInput,
const STATE_MACHINE_NAME = 'State Machine';
// const INPUT_NAME = 'Progress';

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const params = {
    src: '/rive/home-hero-3.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  };

  const { RiveComponent, rive } = useRive(params);

  useEffect(() => {
    if (inView && rive && currentAnimState !== 'Fall') {
      console.log('aaaaa');
      rive.play('Intro');
    }
  }, [inView, rive, currentAnimState]);

  const containerRef = useRef();
  const firstSectionRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  const [firstSectionHeight, setFirstSectionHeight] = useState(0);
  const [currentAnimState, setCurrentAnimState] = useState('');

  useLayoutEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const firstSectionRect = firstSectionRef.current.getBoundingClientRect();
    setFirstSectionHeight(firstSectionRect.height);
    setContainerHeight(containerRect.height);
  }, []);

  useEffect(() => {
    // Add event listener to window scroll
    const handleScroll = () => {
      if (currentAnimState !== 'Fall' && rive && window.scrollY > firstSectionHeight - 600) {
        console.log('bbb');
        window.rive = rive;
        setCurrentAnimState('Fall');
        rive.stop('Intro');
        rive.play('Fall');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerHeight, rive, currentAnimState, firstSectionHeight]);

  return (
    <section className="default bg-black" ref={ref}>
      <div ref={containerRef} className="container relative text-white">
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <div className="flex h-screen items-center" ref={firstSectionRef}>
              <div className="max-w-xl">
                <h2>Marketing website is a complex thing to build on your own</h2>
              </div>
            </div>
            <div className="flex items-center">
              <div className="max-w-xl">
                <h2>You either ask your team of specialists from adjacent fields</h2>
              </div>
            </div>
            <div className="flex items-center pt-[700px] pb-[360px]">
              <div className="max-w-xl">
                <h2>Or go wild cherry-picking & managing freelancers</h2>
              </div>
            </div>
          </div>
          <div>
            <div
              className="absolute top-0 h-[2300px] w-[592px]"
              style={{ transform: `translateY(${-500 - 480 / 2 + firstSectionHeight / 2}px)` }}
            >
              <RiveComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
