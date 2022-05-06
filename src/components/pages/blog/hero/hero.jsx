import { StaticImage } from 'gatsby-plugin-image';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import QuoteIcon from 'images/quote.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';

const Hero = () => {
  const [animationWrapperRef, isAnimationWrapperInView] = useInView({ triggerOnce: true });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/blog/hero.riv',
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isAnimationWrapperInView && rive) rive.play();
  }, [isAnimationWrapperInView, rive]);

  return (
    <section
      className="safe-paddings overflow-hidden bg-black pt-40 pb-32 text-white lg:pt-32 lg:pb-28 md:pt-28 md:pb-20 sm:pt-24 sm:pb-16"
      ref={animationWrapperRef}
    >
      <div className="container grid-gap-x grid grid-cols-12 md:flex md:flex-col">
        <h1 className="with-text-highlight-red hidden  font-normal leading-snug md:block md:text-4xl sm:text-2xl">
          Sharing Pixel Point <span>Collective experience:</span> OS, tools & processes
        </h1>
        <div className="col-span-6 md:order-last md:mt-8 sm:mt-5">
          <h1 className="with-text-highlight-red text-6xl font-normal leading-snug lg:max-w-[458px] lg:text-[42px] md:hidden">
            Sharing Pixel Point <span>Collective experience:</span> OS, tools & processes
          </h1>
          <figure className="mt-8 border-t border-t-gray-9 pt-8 lg:mt-0 sm:pt-5">
            <QuoteIcon className="w-10 lg:w-8" aria-hidden />
            <blockquote className="mt-4 text-2xl lg:text-xl">
              <p className="with-text-highlight-red">
                There is a key for sustainable growth and successful future for the humanity, and it
                is <span>Open Source</span> world with its community shared knowledge
              </p>
            </blockquote>
            <figcaption className="mt-5 flex items-center space-x-4 lg:mt-4 lg:space-x-2.5 md:mt-3.5 md:space-x-2.5 sm:block sm:space-x-0">
              <div className="flex items-center space-x-4 sm:space-x-3">
                <StaticImage
                  className="w-12 shrink-0 rounded-full sm:!h-10 sm:!w-10"
                  imgClassName="rounded-full"
                  src="../../../../images/alex-barashkov.jpg"
                  layout="fixed"
                  height={48}
                  width={48}
                  alt="Alex Barashkov"
                  loading="eager"
                />
                <span className="text-base font-normal">Alex Barashkov — CEO at Pixel Point</span>
              </div>
              <Link
                className="flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold transition-colors duration-200 hover:bg-[#1781cf] sm:mt-4 sm:inline-flex sm:w-full sm:justify-center"
                to={LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-5" /> <span>Follow</span>
              </Link>
            </figcaption>
          </figure>
        </div>
        <div
          className="relative col-start-8 col-end-13 flex items-center justify-center lg:col-start-9 md:mt-8 sm:mt-6"
          aria-hidden
        >
          <ImagePlaceholder
            className="!absolute left-1/2 -top-16 min-w-[640px] -translate-x-1/2 lg:left-auto lg:-right-10 lg:-top-8 lg:min-w-[500px] lg:translate-x-0 md:!relative md:left-0 md:top-0 md:mx-auto md:min-w-0 md:max-w-[596px] md:translate-x-0 sm:min-w-[100vw]"
            width={640}
            height={640}
            aria-hidden
          >
            <RiveComponent />
          </ImagePlaceholder>
        </div>
      </div>
    </section>
  );
};

export default Hero;
