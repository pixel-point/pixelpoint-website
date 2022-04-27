import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links.js';
import TwitterIcon from 'images/twitter.inline.svg';
import getBlogPostPath from 'utils/get-blog-post-path';

const Sidebar = ({ readMorePosts }) => (
  <aside className="absolute -right-24 top-0 h-full max-w-[360px] translate-x-full border-l border-l-gray-3 pt-8 pb-44 lg:-right-8 lg:max-w-[300px] lg:pb-28 md:hidden">
    <div className="scrollbar-hidden sticky right-0 top-0 max-h-screen overflow-auto pt-8 pb-8 pl-8 lg:pl-6">
      <StaticImage
        className="w-16 shrink-0 rounded-full"
        imgClassName="rounded-full"
        src="../../../../images/alex-barashkov.jpg"
        layout="fixed"
        height={64}
        width={64}
        alt="Alex Barashkov"
        loading="eager"
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
      <h2 className="mt-16 font-semibold md:mt-10">More from Pixel Point</h2>
      <ul className="mt-7 space-y-7 md:mt-5 md:space-x-5">
        {readMorePosts.map(({ slug, frontmatter: { title, smallCover: cover } }, index) => (
          <li key={index}>
            <Link
              className="flex items-center space-x-3 transition-colors duration-200 hover:text-red"
              to={getBlogPostPath(slug)}
            >
              <h3 className="font-normal line-clamp-2 lg:text-sm">{title}</h3>
              <GatsbyImage
                className="w-20 shrink-0 rounded-sm"
                imgClassName="rounded-sm"
                image={getImage(cover)}
                loading="eager"
                alt=""
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

Sidebar.propTypes = {
  readMorePosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        mediumCover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
        smallCover: PropTypes.exact({
          childImageSharp: PropTypes.exact({
            gatsbyImageData: PropTypes.object.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};

export default Sidebar;
