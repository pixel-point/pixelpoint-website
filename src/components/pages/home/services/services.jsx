import React from 'react';

import Link from 'components/shared/link';

const Services = () => (
  <section className="safe-paddings mt-52 bg-black text-white">
    <div className="container">
      <div className="flex h-screen max-w-[592px] items-center">
        <h2 className="text-6xl font-normal leading-snug">
          We’ll get you covered on what we can do best:
        </h2>
      </div>
      <div className="flex h-screen max-w-[520px] flex-col justify-center">
        <h2 className="text-6xl font-normal leading-snug">Web-design</h2>
        <p className="mt-5">
          Our approach is rather inclusive: web-design to us is not only effective, efficient and
          visually pleasing displays, but also motion design with its live animations, as well as
          graphic design with its entertaining illustrations, exciting social media covers and, of
          course, high-quality branded items.
        </p>
        <Link className="mt-5" to="/" size="sm" theme="arrow-red">
          Read more
        </Link>
      </div>
      <div className="flex h-screen max-w-[520px] flex-col justify-center">
        <h2 className="text-6xl font-normal leading-snug">Front-end development</h2>
        <p className="mt-5">
          Clean codebase, flexible content management, robust release flow and custom integrations
          will please the business while website performance, accessibility and mobile devices
          adaptation will make and outstanding experience for your customers.
        </p>
        <Link className="mt-5" to="/" size="sm" theme="arrow-red">
          Read more
        </Link>
      </div>
    </div>
  </section>
);

export default Services;
