import React from 'react';

const items = [
  {
    title: 'Research',
    description:
      'Through organised surveys and dialogues you tell us about your company origin, your message, your product and what makes you stand out on competing market.',
  },
  {
    title: 'Visual Direction',
    description:
      'We reimagine the brand identity through various experiments with colors, graphics, animations, composition patterns and UI shapes, combining individual inputs into the big picture that communicates with the user exactly the way it should.',
  },
  {
    title: 'UI Design',
    description:
      'At this stage we create design system and consecutively draw every project page under its guidelines. We perform many short iterations on each section, illustration and animation until the mockup begins to shine.',
  },
  {
    title: 'Development',
    description:
      'We proceed with a pixel-perfect implementation the way we see best: using JAM stack within React ecosystem. This approach makes it possible to ship in very reasonable terms a performant, secure, and maintainable website that looks and behaves as intended.',
  },
  {
    title: 'Launch',
    description:
      'Pixel Point will share this important moment with you, backing you up on any related tech question, whether it is choosing a proper deploy platform, setting up ci/cd pipelines, content migration or gradual rollout.',
  },
  {
    title: 'Maintenance',
    description:
      'At this step your website is live, but we are still here in case you need anything. We will make sure the project stays up-to-date, provide social media assets to your marketing team, extend your components library if needed, and, of course, fix occasional bugs.',
  },
];

const Workflow = () => (
  <section className="safe-paddings mt-52 lg:mt-44 md:mt-36 sm:mt-20">
    <div className="container">
      <h2 className="max-w-[700px] text-4xl font-normal leading-snug lg:max-w-[600px] lg:text-3xl md:max-w-[490px] md:text-2xl sm:max-w-[410px] sm:text-xl">
        Let's break down the <span className="text-red">Magic</span> behind the&nbsp;result and
        reveal the whole process:
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-12 lg:grid-cols-2 lg:gap-y-12 md:mt-10 md:grid-cols-2 md:gap-y-10 sm:mt-8 sm:block sm:space-y-8">
        {items.map(({ title, description }, index) => (
          <li className="flex items-start" key={index}>
            <span className="text-2xl font-semibold leading-snug text-red md:text-xl">
              {index + 1}.
            </span>
            <div className="ml-2.5 lg:ml-2 md:ml-1.5">
              <h3 className="text-2xl font-normal leading-snug md:text-xl">{title}</h3>
              <p className="mt-3 md:mt-2.5">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Workflow;
