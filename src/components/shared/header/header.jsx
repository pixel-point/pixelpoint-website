import PropTypes from 'prop-types';
import React from 'react';

import LogoSvg from 'images/logo.inline.svg';

// TODO: Implement mobile menu functionality and delete eslint comment below, example — https://user-images.githubusercontent.com/20713191/144221747-70dc933e-a5bd-4586-9019-08117afc13e0.png
// eslint-disable-next-line no-unused-vars
const Header = ({ isMobileMenuOpen, onBurgerClick }) => (
  <header className="safe-paddings absolute top-0 left-0 right-0">
    <div className="container flex h-[88px] items-center justify-between">
      <a href="#">
        <LogoSvg width="143" height="36" />
      </a>
      <nav className="flex">
        <ul className="flex gap-10 text-white">
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Case studies </a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
        </ul>
        <div className="mx-6 w-px bg-white opacity-20" />
        <a className="text-primary" href="#">
          info@pixelpoint.io
        </a>
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
