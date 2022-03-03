import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';

import illustration from './images/illustration.svg';

const CTA = ({ withTopMargin }) => (
  <section
    className={clsx(
      'safe-paddings bg-black py-32 lg:py-28 md:py-24 sm:py-16',
      withTopMargin && 'mt-52 lg:mt-44 md:mt-36 sm:mt-28'
    )}
  >
    <div className="container grid-gap-x grid grid-cols-2 items-center sm:block">
      <div className="sm:text-center">
        <h2 className="text-6xl font-normal leading-snug text-white lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl">
          Need assistance?
        </h2>
        <Link size="6xl" theme="arrow-red" to="mailto:info@pixelpoint.io">
          Schedule a call
        </Link>
      </div>
      <img className="sm:mt-8 sm:w-full" src={illustration} alt="" loading="lazy" aria-hidden />
    </div>
  </section>
);

CTA.propTypes = {
  withTopMargin: PropTypes.bool,
};

CTA.defaultProps = {
  withTopMargin: false,
};

export default CTA;
