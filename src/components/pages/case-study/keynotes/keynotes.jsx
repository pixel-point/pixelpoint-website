import PropTypes from 'prop-types';
import React from 'react';

import illustration from './images/illustration.svg';

const Keynotes = ({ items }) => (
  <section className="safe-paddings bg-black pt-32 text-white">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug">Design and Development Keynotes</h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16">
        {items.map(({ icon: Icon, description }, index) => (
          <li className="max-w-[275px]" key={index}>
            <Icon className="h-16" aria-hidden />
            <p className="mt-2.5 font-normal leading-snug">{description}</p>
          </li>
        ))}
      </ul>
    </div>
    <img className="mx-auto mt-32" src={illustration} loading="lazy" alt="" aria-hidden />
  </section>
);

Keynotes.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      icon: PropTypes.elementType.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default Keynotes;
