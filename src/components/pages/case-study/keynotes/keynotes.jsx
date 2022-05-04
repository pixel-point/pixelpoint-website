import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import ImagePlaceholder from 'components/shared/image-placeholder';

import BrowserlessIcon1 from './images/browserless-icon-1.inline.svg';
import BrowserlessIcon2 from './images/browserless-icon-2.inline.svg';
import BrowserlessIcon3 from './images/browserless-icon-3.inline.svg';
import CiliumIcon1 from './images/cilium-icon-1.inline.svg';
import CiliumIcon2 from './images/cilium-icon-2.inline.svg';
import CiliumIcon3 from './images/cilium-icon-3.inline.svg';
import DroneIcon1 from './images/drone-icon-1.inline.svg';
import DroneIcon2 from './images/drone-icon-2.inline.svg';
import DroneIcon3 from './images/drone-icon-3.inline.svg';
import DroneIcon4 from './images/drone-icon-4.inline.svg';
import DroneIcon5 from './images/drone-icon-5.inline.svg';
import DroneIcon6 from './images/drone-icon-6.inline.svg';
import FlagsmithIcon1 from './images/flagsmith-icon-1.inline.svg';
import FlagsmithIcon2 from './images/flagsmith-icon-2.inline.svg';
import FlagsmithIcon3 from './images/flagsmith-icon-3.inline.svg';
import FlagsmithIcon4 from './images/flagsmith-icon-4.inline.svg';
import FlagsmithIcon5 from './images/flagsmith-icon-5.inline.svg';
import FlagsmithIcon6 from './images/flagsmith-icon-6.inline.svg';
import illustrationSm from './images/illustration-sm.svg';
import illustration from './images/illustration.svg';
import IsovalentIcon1 from './images/isovalent-icon-1.inline.svg';
import IsovalentIcon2 from './images/isovalent-icon-2.inline.svg';
import IsovalentIcon3 from './images/isovalent-icon-3.inline.svg';
import K6Icon1 from './images/k6-icon-1.inline.svg';
import K6Icon2 from './images/k6-icon-2.inline.svg';
import K6Icon3 from './images/k6-icon-3.inline.svg';
import K6Icon4 from './images/k6-icon-4.inline.svg';
import K6Icon5 from './images/k6-icon-5.inline.svg';
import K6Icon6 from './images/k6-icon-6.inline.svg';
import NovuIcon1 from './images/novu-icon-1.inline.svg';
import NovuIcon2 from './images/novu-icon-2.inline.svg';
import NovuIcon3 from './images/novu-icon-3.inline.svg';
import ZenithIcon1 from './images/zenith-icon-1.inline.svg';
import ZenithIcon2 from './images/zenith-icon-2.inline.svg';
import ZenithIcon3 from './images/zenith-icon-3.inline.svg';

const icons = {
  browserless: [BrowserlessIcon1, BrowserlessIcon2, BrowserlessIcon3],
  cilium: [CiliumIcon1, CiliumIcon2, CiliumIcon3],
  drone: [DroneIcon1, DroneIcon2, DroneIcon3, DroneIcon4, DroneIcon5, DroneIcon6],
  flagsmith: [
    FlagsmithIcon1,
    FlagsmithIcon2,
    FlagsmithIcon3,
    FlagsmithIcon4,
    FlagsmithIcon5,
    FlagsmithIcon6,
  ],
  isovalent: [IsovalentIcon1, IsovalentIcon2, IsovalentIcon3],
  k6: [K6Icon1, K6Icon2, K6Icon3, K6Icon4, K6Icon5, K6Icon6],
  novu: [NovuIcon1, NovuIcon2, NovuIcon3],
  zenith: [ZenithIcon1, ZenithIcon2, ZenithIcon3],
};

const Keynotes = ({ items, iconsName }) => (
  <section className="safe-paddings overflow-hidden bg-black pt-32 text-white lg:pt-14">
    <div className="container">
      <h2 className="text-4xl font-normal leading-snug lg:text-[32px] sm:text-2xl">
        Key Results and Outcomes
      </h2>
      <ul className="grid-gap-x mt-16 grid grid-cols-3 gap-y-16 lg:mt-14 lg:gap-y-14 md:mt-11 md:grid-cols-2 md:gap-y-11 sm:mt-10 sm:gap-y-10">
        {items.map((item, index) => {
          const Icon = icons[iconsName]?.[index];

          return (
            <li
              className={clsx(
                'max-w-[275px] sm:max-w-none',
                index === 0 && 'md:order-1',
                index === 1 && 'md:order-2',
                index === 2 && 'md:order-3',
                index === 3 && 'md:order-6',
                index === 4 && 'md:order-4',
                index === 5 && 'md:order-5'
              )}
              key={index}
            >
              {Icon && <Icon className="h-18" aria-hidden />}
              <p className="mt-3 text-lg font-normal leading-snug lg:text-base sm:max-w-[95%] sm:text-sm">
                {item}
              </p>
            </li>
          );
        })}
      </ul>
    </div>

    <div className="mt-32 flex justify-center lg:mt-28 md:mt-24 sm:hidden" aria-hidden>
      <ImagePlaceholder className="mx-2" width={1270} height={134}>
        <img src={illustration} alt="" loading="lazy" />
      </ImagePlaceholder>
    </div>

    <div className="mt-11 hidden justify-center sm:flex" aria-hidden>
      <ImagePlaceholder className="mx-1 w-full max-w-[414px]" width={466} height={90}>
        <img src={illustrationSm} alt="" loading="lazy" />
      </ImagePlaceholder>
    </div>
  </section>
);

Keynotes.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  iconsName: PropTypes.oneOf(Object.keys(icons)).isRequired,
};

export default Keynotes;
