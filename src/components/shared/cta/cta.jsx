import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import Arrow from 'images/arrow.inline.svg';

import illustration from './images/illustration.svg';

const CTA = ({ withTopMargin }) => (
  <section
    className={clsx(
      'safe-paddings bg-black py-32 lg:py-28 md:py-24 sm:py-16',
      withTopMargin && 'mt-52 lg:mt-44 md:mt-36 sm:mt-28'
    )}
  >
    <div className="container grid-gap-x grid grid-cols-2 items-center sm:block">
      <div className="text-6xl font-normal leading-snug lg:text-5xl md:text-4xl sm:text-center sm:text-3xl xs:text-2xl">
        <h2 className="text-white">Need assistance?</h2>
        <Link className="text-red" to="mailto:info@pixelpoint.io">
          Schedule a call
          <Arrow
            className="ml-4 inline-block h-7 lg:ml-3 lg:h-6 md:ml-2 md:h-5 sm:ml-1.5 sm:h-4 xs:ml-1 xs:h-3"
            aria-hidden
          />
        </Link>
      </div>
      <img
        className="sm:mx-auto sm:mt-8 sm:max-w-[382px] xs:max-w-full"
        src={illustration}
        alt=""
        loading="lazy"
        aria-hidden
      />
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
