import React from 'react';

import projectsSvg from './images/projects.svg';

const Projects = () => (
  <section className="safe-paddings mt-52 lg:mt-36 md:mt-32 sm:mt-20">
    <div className="container flex items-center justify-between space-x-16">
      <div className="max-w-[488px]">
        <h2 className="with-text-highlight-red text-6xl font-normal leading-snug">
          Who and what we can <span>help with</span>
        </h2>
        <div className="mt-5 space-y-5 text-lg">
          <p>
            Pixel Point is like a satellite for tech companies, who is capable of building an
            awesome marketing website, cover up on product design and assist with front-end
            development. We handle what we are experts in, making it possible for you to focus on
            what matters the most - your product.
          </p>
          <p>
            As big time fans and active participants of the open source world, we have a weak spot
            for clients that are coming from this space. It is a pleasure to help such a company go
            mature and we know exactly how to do it - proven by our open source customers success
            stories.
          </p>
        </div>
      </div>
      <img src={projectsSvg} alt="Project logos" loading="lazy" width={621} height={518} />
    </div>
  </section>
);

export default Projects;
