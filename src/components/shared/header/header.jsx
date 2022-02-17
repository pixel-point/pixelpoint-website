import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

const links = [
  {
    text: 'Services',
    to: '/',
  },
  {
    text: 'Case studies',
    to: '/',
  },
  {
    text: 'Blog',
    to: '/',
  },
];

// TODO: Implement mobile menu functionality and delete eslint comment below, example — https://user-images.githubusercontent.com/20713191/144221747-70dc933e-a5bd-4586-9019-08117afc13e0.png
// eslint-disable-next-line no-unused-vars
const Header = ({ isMobileMenuOpen, onBurgerClick }) => (
  <header className="safe-paddings absolute top-0 left-0 right-0 z-10 w-full">
    <div className="container flex h-[88px] items-center justify-between">
      <Link to="/">
        <span className="sr-only">Pixel Point</span>
        <Logo className="h-9" aria-hidden />
      </Link>
      <nav className="flex items-center space-x-6">
        <ul className="flex items-center space-x-10 border-r border-r-gray-8 pr-6">
          {links.map(({ text, to }, index) => (
            <li key={index}>
              <Link to={to} size="sm" theme="white">
                {text}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="mailto:info@pixelpoint.io" size="sm" theme="underline-red">
          info@pixelpoint.io
        </Link>
      </nav>
    </div>
  </header>
);

Header.propTypes = {
  isMobileMenuOpen: PropTypes.bool,
  onBurgerClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isMobileMenuOpen: false,
};

export default Header;
