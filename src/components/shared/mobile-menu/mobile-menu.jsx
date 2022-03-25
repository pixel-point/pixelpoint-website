import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Link from 'components/shared/link';
import useClickOutside from 'hooks/use-click-outside';

import ServicesWebDesignIcon from './images/services-web-design.inline.svg';
import ServicesWebDevelopmentIcon from './images/services-web-development.inline.svg';

const links = [
  {
    text: 'Services',
    items: [
      {
        icon: ServicesWebDesignIcon,
        text: 'Web design',
        to: '/services/web-design',
      },
      {
        icon: ServicesWebDevelopmentIcon,
        text: 'Web development',
        to: '/services/web-development',
      },
    ],
  },
  {
    text: 'Case studies',
    to: '/case-studies',
  },
  // {
  //   text: 'Blog',
  //   to: '/blog',
  // },
];

const MobileMenu = ({ isOpen, headerRef, onOutsideClick }) => {
  const ref = useRef(null);

  useClickOutside([ref, headerRef], onOutsideClick);

  return (
    <nav
      className={clsx(
        'invisible absolute left-1.5 top-1.5 right-1.5 z-40 hidden rounded-xl border border-gray-3 bg-white px-6 pt-24 pb-5 opacity-0 transition-[opacity,visibility] duration-200 md:block sm:pt-20',
        isOpen && '!visible !opacity-100'
      )}
      style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)' }}
      ref={ref}
    >
      <ul>
        {links.map(({ text, to, items }, index) => (
          <li className={clsx('border-b border-b-gray-3', items?.length > 0 && 'pb-5')} key={index}>
            <Link
              className={clsx('block text-lg font-normal leading-none', !items && 'py-5')}
              to={to}
            >
              {text}
            </Link>

            {items?.length > 0 && (
              <ul className="mt-5 space-y-5">
                {items.map(({ icon: Icon, text, to }, index) => (
                  <li key={index}>
                    <Link className="flex items-center space-x-3.5" to={to}>
                      <Icon className="h-12 shrink-0" />
                      <span className="text-lg font-semibold">{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li>
          <Link
            className="!flex py-5 !text-lg"
            to="https://calendly.com/pixel-point/30min"
            size="lg-only"
            theme="arrow-red"
          >
            Book a call
          </Link>
        </li>
      </ul>
    </nav>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool,
  // Typing was taken from here — https://stackoverflow.com/a/51127130
  headerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      // SSR workaround
      current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
    }),
  ]).isRequired,
  onOutsideClick: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  isOpen: false,
};

export default MobileMenu;
