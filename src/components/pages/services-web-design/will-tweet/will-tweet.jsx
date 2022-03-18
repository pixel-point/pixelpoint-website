import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const WillTweet = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-28 sm:mt-20">
    <div className="container">
      <h2 className="mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
        Get an enticing company marketing website people{' '}
        <span className="text-red">Will tweet</span> about
      </h2>
      <StaticImage
        className="mt-20 rounded-2xl lg:mt-16 lg:rounded-xl md:mt-12 md:rounded-lg sm:mt-8 sm:rounded-md xs:rounded-sm"
        imgClassName="rounded-2xl lg:rounded-xl md:rounded-lg sm:rounded-md"
        src="../will-tweet/images/illustration.jpg"
        alt=""
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default WillTweet;
