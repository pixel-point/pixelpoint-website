import React from 'react';

const items = [
  {
    title: 'Every pro you need',
    description:
      'It requires many creative specialists to collaborate on a landing page design, and we have all of them. You will discuss every design aspect of your project, from color scheme to animations, in a single shared Slack channel.',
  },
  {
    title: 'Always in a context',
    description:
      'Every designer knows what your project is about, aware your vision, customers and how you want to be perceived. This excludes the possibility for having incohesive and seemingly detached elements in UI.',
  },
  {
    title: 'Synergy',
    description:
      'We are no strangers to each other: together, we brainstorm, fight author bias with a second opinion, come up with solutions to complex problems and cover up each other in case of emergency, so you’re never left hanging.',
  },
];

const Benefits = () => (
  <section className="safe-paddings bg-black py-52 text-white">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug">
        Unlock design process with benefits you wouldn’t want to lose:
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3">
        {items.map(({ title, description }, index) => (
          <li className="flex items-start" key={index}>
            <span className="text-2xl font-semibold text-red">{index + 1}.</span>
            <div className="ml-2.5">
              <h3 className="text-2xl font-normal leading-snug">{title}</h3>
              <p className="mt-3">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Benefits;
