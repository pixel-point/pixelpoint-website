import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import Burger from 'components/shared/burger';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import MENUS from 'constants/menus';
import Logo from 'images/logo.inline.svg';

import ServicesWebDesignIcon from './images/services-web-design.inline.svg';
import ServicesWebDevelopmentIcon from './images/services-web-development.inline.svg';

const icons = {
  webDevelopment: ServicesWebDesignIcon,
  webDesign: ServicesWebDevelopmentIcon,
};

const Header = forwardRef(({ theme, isMobileMenuOpen, onBurgerClick }, ref) => (
  <header className="safe-paddings absolute top-0 left-0 right-0 z-50 w-full" ref={ref}>
    <div className="container-lg flex h-[88px] items-center justify-between sm:h-18">
      <Link to="/">
        <span className="sr-only">Pixel Point</span>
        <Logo
          className={clsx(
            'h-9 transition-all duration-200',
            isMobileMenuOpen && 'md:invert',
            theme === 'black' && 'invert'
          )}
          aria-hidden
        />
      </Link>
      <nav className="flex items-center">
        <ul className="flex items-center space-x-10 text-[0px] md:hidden">
          {MENUS.header.map(({ text, to, items }, index) => (
            <li
              className={clsx(
                items?.length > 0 &&
                  'group relative cursor-pointer pr-2.5 after:absolute after:top-2 after:right-0 after:h-0 after:w-0 after:border-[3px] after:border-b-0 after:transition-colors after:duration-200 after:hover:border-t-red',
                items?.length > 0 && theme === 'white' && 'after:border-black after:border-t-white',
                items?.length > 0 && theme === 'black' && 'after:border-white after:border-t-black'
              )}
              key={index}
            >
              <Link className="group-hover:text-red" to={to} size="base" theme={theme}>
                {text}
              </Link>

              {items?.length > 0 && (
                <div className="invisible absolute -left-24 bottom-0 w-[500px] translate-y-full pt-6 text-[0px] opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
                  <ul
                    className="rounded-2xl bg-white p-6 pb-7"
                    style={{
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05), 0px 6px 20px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {items.map(({ iconName, text, description, linkText, to }, index) => {
                      const Icon = icons[iconName];
                      return (
                        <li
                          className={clsx(index !== 0 && 'mt-7 border-t border-t-gray-4 pt-7')}
                          key={index}
                        >
                          <Link className="with-nested-link-red-hover flex space-x-5" to={to}>
                            <Icon className="h-14 shrink-0" />
                            <div>
                              <span className="text-2xl font-normal leading-snug">{text}</span>
                              <p className="mt-2.5 text-base">{description}</p>
                              <Link
                                className="nested-link-red mt-4"
                                size="base"
                                theme="arrow-red"
                                withoutHover
                              >
                                {linkText}
                              </Link>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          ))}

          <li
            className={clsx(
              '!ml-6 border-l pl-6',
              theme === 'white' && 'border-l-gray-8',
              theme === 'black' && 'border-l-gray-4'
            )}
          >
            <Link to={LINKS.email} size="base" theme="underline-red">
              info@pixelpoint.io
            </Link>
          </li>
        </ul>

        <Burger
          className="hidden md:block"
          theme={theme}
          isToggled={isMobileMenuOpen}
          onClick={onBurgerClick}
        />
      </nav>
    </div>
  </header>
));

Header.propTypes = {
  theme: PropTypes.oneOf(['white', 'black']).isRequired,
  isMobileMenuOpen: PropTypes.bool,
  onBurgerClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isMobileMenuOpen: false,
};

export default Header;
