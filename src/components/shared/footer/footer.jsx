import React from 'react';

import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

const links = [
  [
    { text: 'Branding', to: '/' },
    { text: 'Website Design', to: '/' },
    { text: 'Motion Design', to: '/' },
  ],
  [
    { text: 'Frontend Development', to: '/' },
    { text: 'Graphic Design', to: '/' },
    { text: 'Product Design', to: '/' },
  ],
  [
    { text: 'Case Studies ', to: '/' },
    { text: 'Blog', to: '/' },
    { text: 'About Us', to: '/' },
  ],
  [
    { text: 'Github', to: '/' },
    { text: 'Twitter', to: '/' },
  ],
];

const Footer = () => (
  <footer className="safe-paddings bg-black">
    <div className="container flex justify-between pt-10 pb-14">
      <div className="flex flex-col items-start justify-between">
        <Link to="/">
          <span className="sr-only">Pixel Point</span>
          <Logo className="h-9" aria-hidden />
        </Link>
        <Link to="mailto:info@pixelpoint.io" size="sm" theme="underline-red">
          info@pixelpoint.io
        </Link>
      </div>
      <nav className="flex space-x-20 pt-2.5">
        {links.map((links, index) => (
          <ul className="space-y-8" key={index}>
            {links.map(({ to, text }, index) => (
              <li className="text-[0px]" key={index}>
                <Link to={to} size="sm" theme="white">
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </nav>
    </div>
  </footer>
);

export default Footer;
