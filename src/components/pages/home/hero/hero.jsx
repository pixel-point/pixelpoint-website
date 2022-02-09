import { transform } from 'framer-motion';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';

const STATE_MACHINE_NAME = 'State Machine';
const INPUT_NAME = 'Progress';

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const params = {
    src: '/rive/home-hero.riv',
    autoplay: false,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  };

  const { RiveComponent, rive } = useRive(params);
  const progress = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useEffect(() => {
    if (inView && rive) {
      window.rive = rive;
      rive.play('State Machine');
    }
  }, [inView, rive]);

  useEffect(() => {
    if (progress) {
      window.progress = progress;
      // setTimeout(() => {
      //   progress.value = 50;
      // }, 5000);
    }
  }, [progress]);

  const containerRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    setContainerHeight(containerRect.height);
  }, []);

  useEffect(() => {
    // Add event listener to window scroll
    console.log('added-event listener');
    const handleScroll = () => {
      console.log(window.scrollY);
      console.log(containerHeight);
      const progressPosition = transform(window.scrollY, [0, containerHeight - 500], [0, 100]);
      console.log(progressPosition);
      if (progress) {
        progress.value = progressPosition;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      console.log('removed-event listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerHeight, progress]);
  return (
    <section className="default bg-black" ref={ref}>
      <div ref={containerRef} className="container relative text-white">
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <div className="flex items-center pt-[360px]">
              <div className="max-w-xl">
                <h2>Marketing website is a complex thing to build on your own</h2>
              </div>
            </div>
            <div className="flex items-center pt-[700px]">
              <div className="max-w-xl">
                <h2>You either ask your team of specialists from adjacent fields</h2>
              </div>
            </div>
            <div className="flex h-screen items-center pt-[700px] pb-[360px]">
              <div className="max-w-xl">
                <h2>Or go wild cherry-picking & managing freelancers</h2>
              </div>
            </div>
          </div>
          <div>
            <div className="sticky top-0 h-screen w-[592px]">
              <RiveComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
