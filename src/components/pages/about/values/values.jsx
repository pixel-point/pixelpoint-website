import React from 'react';

import BrainIcon from './images/brain.inline.svg';
import ChestKingIcon from './images/chest-king.inline.svg';
import FireIcon from './images/fire.inline.svg';
import HeartIcon from './images/heart.inline.svg';
import InfoIcon from './images/info.inline.svg';
import ThumbsupIcon from './images/thumbs-up.inline.svg';

const items = [
  { icon: ChestKingIcon, description: 'Great is not enough, we aim for WOW' },
  {
    icon: InfoIcon,
    description: 'Continuous Information Delivery is the oxygen of a distributed company',
  },
  { icon: ThumbsupIcon, description: 'There is work beyond the Notion board' },
  { icon: FireIcon, description: 'Think big, move fast and enjoy the ride' },
  {
    icon: BrainIcon,
    description: 'Mistakes are invitations to evolve and adapt',
  },
  { icon: HeartIcon, description: 'Help each other thrive and reap the benefits' },
];

const Values = () => (
  <section className="safe-paddings bg-black py-52 text-white lg:py-36 md:py-32 sm:py-20">
    <div className="container">
      <h2 className="with-text-highlight-red text-4xl font-normal leading-snug lg:text-[32px] sm:text-2xl">
        Our <span>core values</span> that shape the way we work
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-14 lg:gap-y-14 md:mt-11 md:grid-cols-2 md:gap-y-11 sm:mt-10 sm:gap-y-10">
        {items.map(({ icon: Icon, description }, index) => (
          <li className="max-w-[275px] sm:max-w-none" key={index}>
            <Icon className="h-18" aria-hidden />
            <p className="mt-3 text-lg font-normal leading-snug lg:text-base sm:max-w-[95%] sm:text-sm">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Values;
