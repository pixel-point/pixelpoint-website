import PropTypes from 'prop-types';
import React from 'react';

import Icon1 from './images/icon-1.inline.svg';
import Icon2 from './images/icon-2.inline.svg';
import Icon3 from './images/icon-3.inline.svg';
import Icon4 from './images/icon-4.inline.svg';
import Icon5 from './images/icon-5.inline.svg';
import Icon6 from './images/icon-6.inline.svg';
import illustration from './images/illustration.svg';

const icons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6];

const Keynotes = ({ items }) => (
  <section className="safe-paddings bg-black pt-32 text-white lg:pt-28 md:pt-24 sm:pt-16">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug lg:text-3xl md:text-2xl sm:text-xl">
        Key Results and Outcomes
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-12 lg:gap-y-12 md:mt-10 md:grid-cols-2 md:gap-y-10 sm:mt-8 sm:block sm:space-y-8">
        {items.map((item, index) => {
          const Icon = icons[index];

          return (
            <li className="max-w-[275px] sm:max-w-none" key={index}>
              <Icon className="h-16 md:h-14" aria-hidden />
              <p className="mt-3 font-normal leading-snug md:mt-2.5">{item}</p>
            </li>
          );
        })}
      </ul>
    </div>
    <img
      className="mx-auto mt-32 lg:mt-28 md:mt-24 sm:mt-16"
      src={illustration}
      loading="lazy"
      alt=""
      aria-hidden
    />
  </section>
);

Keynotes.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Keynotes;
