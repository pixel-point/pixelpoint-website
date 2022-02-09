import React from 'react';

import Blog from 'components/pages/home/blog';
import CaseStudies from 'components/pages/home/case-studies';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SeeDifference from 'components/pages/home/see-difference';
import Workflow from 'components/pages/home/workflow';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <SeeDifference />
    <Features />
    <Workflow />
    <section className="services default bg-black text-white">
      <div className="container">
        <div>
          <h2 className="max-w-[590px]">We’ll get you covered on what we can do best:</h2>
        </div>
        <div className="flex h-screen items-center">
          <div className="max-w-[520px]">
            <h2>Web-design</h2>
            <p className="text-md font-light">
              Our approach is rather inclusive: web-design to us is not only effective, efficient
              and visually pleasing displays, but also motion design with its live animations, as
              well as graphic design with its entertaining illustrations, exciting social media
              covers and, of course, high-quality branded items.
            </p>
            <a href="#">Read more</a>
          </div>
        </div>
        <div className="flex h-screen items-center">
          <div className="max-w-[520px]">
            <h2>Front-end development</h2>
            <p className="text-md font-light">
              Clean codebase , flexible content management, robust release flow and custom
              integrations will please the business while website performance, accessibility and
              mobile devices adaptation will make and outstanding experience for your customers.
            </p>
            <a href="#">Read more</a>
          </div>
        </div>
      </div>
    </section>
    <CaseStudies />
    <Blog />
    <section className="contact-us bg-black">
      <div className="container py-30 text-white">
        <h2>
          Let's have a chat:
          <br />
          <a href="mailto:info@pixelpoint.io">
            <strong>info@pixelpoint.io</strong>
          </a>
        </h2>
      </div>
    </section>
  </Layout>
);

export default HomePage;
