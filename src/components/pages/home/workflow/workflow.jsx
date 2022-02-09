import React from 'react';

const data = [
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
  <section className="workflow default">
    <div className="container">
      <h3>
        Let's break down the <strong>Magic Behind</strong>
        <br /> the result and reveal the whole process:
      </h3>
      <ul className="grid list-decimal grid-cols-3 gap-x-8 gap-y-16 marker:text-2xl marker:text-primary">
        {data.map(({ title, description }, index) => (
          <li key={index} className="ml-7">
            <h4>{title}</h4>
            <p className="text-lg font-light">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Workflow;
