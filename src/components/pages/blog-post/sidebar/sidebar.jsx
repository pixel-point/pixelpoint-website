import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links.js';
import TwitterIcon from 'images/twitter.inline.svg';

const Sidebar = () => (
  <aside className="absolute -right-8 top-0 h-full max-w-[326px] translate-x-full border-l border-l-gray-3 pt-16 lg:hidden">
    <div className="sticky right-0 top-16 pl-8">
      <StaticImage
        className="w-16 shrink-0 rounded-full"
        imgClassName="rounded-full"
        src="../../../../images/alex-barashkov.jpg"
        layout="fixed"
        height={64}
        width={64}
        alt="Alex Barashkov"
        loading="lazy"
      />
      <h2 className="mt-5 font-semibold">Alex Barashkov</h2>
      <p className="mt-2.5">
        CEO at Pixel Point. Software engineer with 10+ years of web development experience.
        Currently focused on React, Next.js, Gatsby.
      </p>
      <Link
        className="mt-5 inline-flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1781cf]"
        to={LINKS.twitter}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon className="h-5" /> <span>Follow on Twitter</span>
      </Link>
    </div>
  </aside>
);

export default Sidebar;
