import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import ImagePlaceholder from 'components/shared/image-placeholder';

import EditingCircleBlueIcon from './images/editing-icon-circle-blue.inline.svg';
import EditingCirclePinkIcon from './images/editing-icon-circle-pink.inline.svg';
import EditingSquareBlueIcon from './images/editing-icon-square-blue.inline.svg';
import EditingSquarePinkIcon from './images/editing-icon-square-pink.inline.svg';
import EditingSquareWhiteIcon from './images/editing-icon-square-white.inline.svg';
import FingerprintSquareIcon from './images/fingerprint-icon-square.inline.svg';
import FingerprintIcon from './images/fingerprint-icon.inline.svg';
import GatbsyIcon from './images/gatsby-icon.inline.svg';
import GithubIcon from './images/github-icon.inline.svg';
import GrafanaIcon from './images/grafana-icon.inline.svg';
import HarnessIcon from './images/harness-icon.inline.svg';
import illustrationSm from './images/illustration-sm.svg';
import illustration from './images/illustration.svg';
import IntegrationsIcon from './images/integrations-icon.inline.svg';
import LayoutIcon from './images/layout-icon.inline.svg';
import LikeIcon from './images/like-icon.inline.svg';
import PerformanceIcon from './images/performance-icon.inline.svg';
import ProductHuntIcon from './images/ph-icon.inline.svg';
import SpeakerIcon from './images/speaker-icon.inline.svg';
import WebsiteIcon from './images/website-icon.inline.svg';
import WritingSquareIcon from './images/writing-icon-square.inline.svg';
import WritingIcon from './images/writing-icon.inline.svg';

const icons = {
  browserless: [WebsiteIcon, EditingCirclePinkIcon, GatbsyIcon],
  cilium: [WebsiteIcon, IntegrationsIcon, EditingCircleBlueIcon],
  ebpf: [WebsiteIcon, IntegrationsIcon, EditingCircleBlueIcon],
  drone: [GithubIcon, HarnessIcon, WebsiteIcon, WritingIcon, LayoutIcon, LikeIcon],
  flagsmith: [
    EditingSquareWhiteIcon,
    FingerprintIcon,
    WebsiteIcon,
    PerformanceIcon,
    GithubIcon,
    ProductHuntIcon,
  ],
  isovalent: [WebsiteIcon, IntegrationsIcon, EditingCircleBlueIcon],
  k6: [
    GithubIcon,
    GrafanaIcon,
    FingerprintSquareIcon,
    EditingSquarePinkIcon,
    SpeakerIcon,
    PerformanceIcon,
  ],
  novu: [WebsiteIcon, FingerprintIcon, EditingSquareBlueIcon],
  revenuecat: [WebsiteIcon, IntegrationsIcon, PerformanceIcon],
  neon: [WebsiteIcon, EditingSquarePinkIcon, FingerprintIcon],
  parca: [WebsiteIcon, EditingSquarePinkIcon, PerformanceIcon],
  nayms: [WebsiteIcon, EditingSquarePinkIcon, PerformanceIcon],
  configu: [WebsiteIcon, EditingCirclePinkIcon, WritingSquareIcon],
  bindplane: [WebsiteIcon, EditingSquarePinkIcon, PerformanceIcon],
  bytebase: [WebsiteIcon, EditingCirclePinkIcon, PerformanceIcon],
  terzo: [WebsiteIcon, EditingCirclePinkIcon, PerformanceIcon],
  fonoa: [LayoutIcon, WritingIcon, PerformanceIcon],
  harness: [FingerprintSquareIcon, IntegrationsIcon, PerformanceIcon],
  gitness: [LikeIcon, IntegrationsIcon, PerformanceIcon],
  taipy: [FingerprintIcon, WebsiteIcon, PerformanceIcon],
  huly: [FingerprintIcon, WebsiteIcon, PerformanceIcon],
  agentql: [FingerprintIcon, WebsiteIcon, ProductHuntIcon],
  glassflow: [FingerprintSquareIcon, PerformanceIcon, IntegrationsIcon],
  vectara: [FingerprintIcon, WebsiteIcon, WritingSquareIcon],
  solarpunk: [FingerprintSquareIcon, LayoutIcon, ProductHuntIcon],
  invertase: [FingerprintSquareIcon, LayoutIcon, EditingSquarePinkIcon],
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
