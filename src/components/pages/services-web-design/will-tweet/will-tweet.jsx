import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const WillTweet = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container">
      <h2 className="with-text-highlight-red mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug lg:max-w-[712px] lg:text-[42px] md:text-4xl sm:text-2xl">
        Get an enticing company marketing website people <span>will tweet</span> about
      </h2>
      <StaticImage
        className="mt-20 rounded-2xl lg:mt-14 lg:rounded-xl md:mt-11 sm:mt-6"
        imgClassName="rounded-2xl lg:rounded-xl"
        src="../will-tweet/images/illustration.jpg"
        alt="Browserless hero section"
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default WillTweet;
