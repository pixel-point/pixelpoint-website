import { useAnimation, m, LazyMotion, domAnimation } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';
import TitleAnimation from 'components/shared/title-animation';
import LINKS from 'constants/links';

import gatsbyBackground from './images/gatsby-background.svg';
import GatsbyLogo from './images/gatsby.inline.svg';
import NextjsLogo from './images/nextjs.inline.svg';
import RemixLogo from './images/remix.inline.svg';

const items = [
  {
    logo: RemixLogo,
    name: 'Remix',
    description: 'For full-stack dynamic applications',
  },
  {
    logo: NextjsLogo,
    name: 'Next.js',
    description: 'For enterprise-grade dynamic web applications',
  },
];

const titleItems = [
  { value: 'We' },
  { value: 'leverage' },
  { value: 'the' },
  { value: 'greatest' },
  { value: 'React', color: '#ee2b6c' },
  { value: 'frameworks' },
];

const descriptionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const itemsWrapperVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, translateY: 200 },
  animate: { opacity: 1, translateY: 0, transition: { duration: 1, ease: [0, 0, 0, 1] } },
};

const Frameworks = () => {
  const [contentRef, isContentInView] = useInView({ triggerOnce: true, threshold: 0.8 });
  const [itemsWrapperRef, isItemsWrapperInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  const titleControls = useAnimation();
  const descriptionControls = useAnimation();
  const itemsWrapperControls = useAnimation();

  useEffect(() => {
    if (isContentInView) {
      titleControls.start('animate').then(() => descriptionControls.start('animate'));
    }
    if (isItemsWrapperInView) itemsWrapperControls.start('animate');
  }, [
    isContentInView,
    titleControls,
    descriptionControls,
    isItemsWrapperInView,
    itemsWrapperControls,
  ]);

  return (
    <section className="safe-paddings bg-black pt-52 text-white lg:pt-18 sm:pt-11">
      <div className="container grid-gap-x grid grid-cols-2 items-center md:block">
        <LazyMotion features={domAnimation}>
          <div ref={contentRef}>
            <TitleAnimation
              tag="h2"
              className="text-6xl font-normal leading-snug lg:text-[42px] md:max-w-[470px] md:text-4xl sm:text-2xl"
              items={titleItems}
              animationName="second"
              controls={titleControls}
            />
            <m.p
              className="mt-5 max-w-[410px] text-lg md:mt-3 md:max-w-[470px] sm:mt-2.5 sm:text-base"
              initial="initial"
              animate={descriptionControls}
              variants={descriptionVariants}
            >
              Always ready to jump on a project quickly with our custom inclusive{' '}
              <Link
                to={LINKS.gatsbyStarter}
                theme="underline-red"
                target="_blank"
                rel="noopener noreferrer"
              >
                GatsbyJS
              </Link>{' '}
              &{' '}
              <Link
                to={LINKS.nextjsStarter}
                theme="underline-red"
                target="_blank"
                rel="noopener noreferrer"
              >
                NextJS
              </Link>{' '}
              starters.
            </m.p>
          </div>
          <m.div
            className="md:mx-auto md:mt-11 md:max-w-[590px] sm:mt-8 sm:block sm:space-y-4"
            initial="initial"
            animate={itemsWrapperControls}
            variants={itemsWrapperVariants}
            ref={itemsWrapperRef}
          >
            <m.div
              className="relative flex min-h-[224px] items-center justify-between overflow-hidden rounded-2xl pl-10 pr-6 lg:min-h-[168px] lg:rounded-xl lg:pl-7 md:min-h-[140px] md:py-8 md:px-4 md:pl-12 md:pr-7 sm:flex sm:flex-col sm:items-start sm:justify-between sm:p-5"
              variants={itemVariants}
              style={{ background: 'linear-gradient(261.85deg, #773399 19.08%, #402060 81.57%)' }}
            >
              <GatsbyLogo className="relative z-10 h-14 lg:h-10 sm:h-8" aria-hidden />
              <span className="sr-only">Gatsby</span>
              <p className="relative z-10 max-w-[256px] text-lg lg:max-w-[190px] lg:text-base md:max-w-[256px] sm:max-w-none">
                Best for building SEO-friendly, high-performing marketing websites
              </p>
              <img
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src={gatsbyBackground}
                alt=""
                loading="lazy"
                aria-hidden
              />
            </m.div>
            <div className="mt-8 flex space-x-8 lg:mt-7 lg:space-x-7 md:mt-5 md:space-x-5 sm:block sm:space-x-0 sm:space-y-4">
              {items.map(({ logo: Logo, name, description }, index) => (
                <m.div
                  className="flex min-h-[224px] w-1/2 flex-col items-start justify-between rounded-2xl bg-gray-9 px-6 pt-4 pb-5 lg:min-h-[168px] lg:rounded-xl lg:px-5 lg:pt-3 md:min-h-[140px] sm:w-full"
                  variants={itemVariants}
                  key={index}
                >
                  <Logo className="h-14 lg:h-11" aria-hidden />
                  <span className="sr-only">{name}</span>
                  <p className="text-base lg:text-sm">{description}</p>
                </m.div>
              ))}
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
};

export default Frameworks;
