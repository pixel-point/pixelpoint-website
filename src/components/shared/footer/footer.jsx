import React from 'react';

import Link from 'components/shared/link';
import Logo from 'images/logo.inline.svg';

const links = [
  [
    { text: 'Web design', to: '/services/web-design' },
    { text: 'Web development', to: '/services/web-development' },
  ],
  // [
  //   { text: 'Case studies', to: '/case-studies' },
  //   { text: 'Blog', to: '/blog' },
  // ],
  [
    { text: 'Github', to: 'https://github.com/pixel-point' },
    { text: 'Twitter', to: 'https://twitter.com/alex_barashkov' },
  ],
];

const Footer = () => (
  <footer className="safe-paddings bg-black">
    <div className="container flex justify-between pt-10 pb-14 md:pt-0 sm:block sm:py-6">
      <div className="flex flex-col items-start justify-between">
        <Link to="/">
          <span className="sr-only">Pixel Point</span>
          <Logo className="h-9" aria-hidden />
        </Link>
        <Link
          className="sm:hidden"
          to="mailto:info@pixelpoint.io"
          size="base"
          theme="underline-red"
        >
          info@pixelpoint.io
        </Link>
      </div>
      <nav className="sm:grid-gap-x flex space-x-20 pt-2.5 sm:mt-10 sm:grid sm:grid-cols-2 sm:space-x-0 sm:pt-0">
        {links.map((links, index) => (
          <ul className="space-y-8 sm:space-y-6" key={index}>
            {links.map(({ to, text }, index) => (
              <li className="text-[0px]" key={index}>
                <Link to={to} size="base" theme="white">
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </nav>
      <Link
        className="hidden sm:mt-10 sm:inline-flex"
        to="mailto:info@pixelpoint.io"
        size="base"
        theme="underline-red"
      >
        info@pixelpoint.io
      </Link>
    </div>
  </footer>
);

export default Footer;
