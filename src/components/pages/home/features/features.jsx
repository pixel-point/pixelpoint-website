import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Animation from './animation';

const items = [
  {
    text: 'Astonishingly looking</br> pixel-perfect UI',
    src: '/animations/pages/home/features/1.riv',
  },
  {
    text: 'Dazzling illustrations</br> and animations',
    src: '/animations/pages/home/features/2.riv',
  },
  {
    text: 'Obvious and clear way to</br> operate on your content',
    src: '/animations/pages/home/features/3.riv',
  },
  { text: 'Robust release</br> management flow', src: '/animations/pages/home/features/4.riv' },
  {
    text: 'Integrations, 3rd parties</br> and analytics set up',
    src: '/animations/pages/home/features/5.riv',
  },
  {
    text: 'High-performing,</br> SEO & a11y friendly',
    src: '/animations/pages/home/features/6.riv',
  },
];

const Features = () => {
  const [wrapperRef, isWrapperInView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [icons, setIcons] = useState({});

  const addIcon = useCallback((newIcon, index) => {
    setIcons((current) => ({ ...current, [index]: newIcon }));
  }, []);

  const allIcons = Object.entries(icons).map(([, value]) => value);

  useEffect(() => {
    if (allIcons.length === items.length && isWrapperInView) {
      allIcons[0].play(['Animations']);
      allIcons[0].on('stop', () => allIcons[1].play(['Animations']));
      allIcons[1].on('stop', () => allIcons[2].play(['Animations']));
      allIcons[2].on('stop', () => allIcons[3].play(['Animations']));
      allIcons[3].on('stop', () => allIcons[4].play(['Animations']));
      allIcons[4].on('stop', () => allIcons[5].play(['Animations']));
      allIcons[5].on('stop', () => allIcons[0].play(['Animations']));
    }
  }, [allIcons, isWrapperInView]);

  return (
    <section className="safe-paddings mt-52 lg:mt-36 sm:mt-20" ref={wrapperRef}>
      <div className="container">
        <h2 className="max-w-[700px] text-4xl font-normal leading-snug lg:text-[32px] sm:max-w-[370px] sm:text-2xl">
          Here is what we have to offer for the next ideal marketing website of yours:
        </h2>
        <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-14 lg:gap-y-14 md:mt-11 md:gap-y-11 sm:mt-10 sm:grid-cols-2 sm:gap-y-10">
          {items.map(({ text, src }, index) => (
            <li className="sm:max-w-[150px]" key={index}>
              {src && (
                <Animation
                  src={src}
                  addIcon={addIcon}
                  isWrapperInView={isWrapperInView}
                  index={index + 1}
                />
              )}
              <p
                className="sm:hide-br mt-3 text-lg font-normal leading-snug lg:text-base"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
