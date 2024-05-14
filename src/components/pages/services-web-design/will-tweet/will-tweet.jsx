import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { Pagination, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'components/shared/link';

import 'swiper/css';
import 'swiper/css/pagination';

const cases = [
  {
    title: 'Harness',
    text: 'The modern software delivery platform',
    url: 'https://pixelpoint.io/case-studies/harness/',
    image: (
      <StaticImage src="./images/harness.jpg" width={920} height={546} alt="Harness website" />
    ),
  },
  {
    title: 'Neon',
    text: 'Open Source serverless Postgres',
    url: 'https://pixelpoint.io/case-studies/neon/',
    image: <StaticImage src="./images/neon.jpg" width={920} height={546} alt="Neon website" />,
  },
  {
    title: 'Gitness',
    text: 'Open-source code hosting & pipeline engine',
    url: 'https://pixelpoint.io/case-studies/gitness/',
    image: (
      <StaticImage src="./images/gitness.jpg" width={920} height={546} alt="Gitness website" />
    ),
  },
];

const paginationStyles =
  'relative before:absolute before:left-0 before:w-full before:h-8 before:-translate-y-1/2';

const WillTweet = () => (
  <section className="safe-paddings mt-[200px] pb-[245px] overflow-hidden lg:mt-36 lg:pb-44 md:mt-32 md:pb-36 sm:mt-20">
    <div className="container lg:max-w-none">
      <h2 className="mb-16 with-text-highlight-red mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug -tracking-[0.02em] lg:max-w-[712px] lg:mb-14 lg:text-[42px] md:mb-11 md:text-4xl sm:mb-6 sm:text-2xl">
        Get an enticing company marketing website people <span>Will tweet</span> about
      </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={44}
        breakpoints={{
          1024: {
            slidesPerView: 1.307,
          },
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} ${paginationStyles}">
              <span class="sr-only">Go to ${index + 1} slide</span>
            </span>`,
        }}
        mousewheel={{ enabled: true, forceToAxis: true }}
        modules={[Pagination, Mousewheel]}
        style={{
          '--swiper-pagination-bullet-width': '44px',
          '--swiper-pagination-bullet-height': '2px',
          '--swiper-pagination-bullet-border-radius': '0',
          '--swiper-pagination-color': '#ee2b6c',
          '--swiper-pagination-bullet-inactive-color': '#ee2b6c',
          '--swiper-pagination-bullet-inactive-opacity': '0.3',
          '--swiper-pagination-bottom': '-51px',
          overflow: 'visible',
        }}
        centeredSlides
      >
        {cases.map(({ title, text, url, image }) => (
          <SwiperSlide key={title}>
            <article className="flex flex-col-reverse bg-gray-2 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_max-content] gap-1.5 pt-4 pb-5 px-6 font-normal text-sm sm:grid-cols-1">
                <h3 className="leading-snug tracking-[0.02em]">{title}</h3>
                <p className="col-start-1 row-start-2 leading-none tracking-[0.014em] text-gray-7">
                  {text}
                </p>
                <Link
                  className="row-span-2 row-start-1 self-end text-sm after:absolute after:inset-0 after:z-10 sm:row-span-1 sm:justify-start"
                  to={url}
                  size="base"
                  theme="arrow-red"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read case study
                </Link>
              </div>
              {image}
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default WillTweet;
