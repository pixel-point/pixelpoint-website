import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const WillTweet = () => (
  <section className="safe-paddings mt-52">
    <div className="container">
      <h2 className="mx-auto max-w-[950px] text-center text-6xl font-normal leading-snug">
        Get an enticing company marketing website people{' '}
        <span className="text-red">Will tweet</span> about
      </h2>
      <StaticImage
        className="mt-20 rounded-2xl"
        imgClassName="rounded-2xl"
        src="../will-tweet/images/illustration.jpg"
        alt=""
        loading="lazy"
        aria-hidden
      />
    </div>
  </section>
);

export default WillTweet;
