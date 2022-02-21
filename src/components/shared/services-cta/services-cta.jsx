import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import Arrow from 'images/arrow.inline.svg';

const ServicesCTA = ({ title, linkText, linkUrl }) => (
  <section className="safe-paddings mt-52">
    <div className="container text-center text-6xl font-normal leading-snug">
      <h2 className="mx-auto max-w-[800px]">{title}</h2>
      <Link className="text-red" to={linkUrl}>
        {linkText} <Arrow className="ml-4 inline-block h-7" aria-hidden />
      </Link>
    </div>
  </section>
);

ServicesCTA.propTypes = {
  title: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
};

export default ServicesCTA;
