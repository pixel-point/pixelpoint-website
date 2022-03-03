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
  <section className="safe-paddings bg-black pt-32 text-white">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug">Key Results and Outcomes</h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map((item, index) => {
          const Icon = icons[index];

          return (
            <li className="max-w-[275px]" key={index}>
              <Icon className="h-16" aria-hidden />
              <p className="mt-2.5 font-normal leading-snug">{item}</p>
            </li>
          );
        })}
      </ul>
    </div>
    <img className="mx-auto mt-32" src={illustration} loading="lazy" alt="" aria-hidden />
  </section>
);

Keynotes.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Keynotes;
