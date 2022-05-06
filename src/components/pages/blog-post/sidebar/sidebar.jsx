import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton } from 'react-share';

import Link from 'components/shared/link';
import LINKS from 'constants/links.js';
import LinkedinIcon from 'images/linkedin.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';
import getBlogPostPath from 'utils/get-blog-post-path';

const Sidebar = ({ readMorePosts, socialShareUrl }) => (
  <aside className="absolute -right-12 top-0 h-full max-w-[344px] translate-x-full xl:-right-20 lg:-right-8 lg:max-w-[300px] md:relative md:right-0 md:mt-10 md:max-w-none md:translate-x-0">
    <div className="scrollbar-hidden sticky right-0 top-4 max-h-screen overflow-auto rounded-2xl border border-gray-3 p-8 md:relative md:top-0 md:max-h-full md:border-0 md:p-0">
      <StaticImage
        className="h-auto w-16 shrink-0 rounded-full"
        imgClassName="rounded-full"
        src="../../../../images/alex-barashkov.jpg"
        layout="fixed"
        height={64}
        width={64}
        alt="Alex Barashkov"
        loading="eager"
      />
      <h2 className="mt-3.5 text-lg font-semibold">Alex Barashkov</h2>
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
      <h2 className="mt-8 border-t border-t-gray-3 pt-8 text-lg font-semibold">
        More from Pixel Point
      </h2>
      <ul className="mt-5 space-y-6">
        {readMorePosts.map(({ slug, frontmatter: { title, smallCover: cover } }, index) => (
          <li className="sidebar-posts-item" key={index}>
            <Link
              className="flex items-center space-x-4 text-sm transition-colors duration-200 hover:text-red"
              to={getBlogPostPath(slug)}
            >
              <GatsbyImage
                className="w-20 shrink-0 rounded-sm"
                imgClassName="rounded-sm"
                image={getImage(cover)}
                loading="eager"
                alt=""
              />
              <h3 className="text-sm font-normal line-clamp-2">{title}</h3>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 border-t border-t-gray-3 pt-8 text-sm font-normal">
        Share this article:
      </h2>
      <ul className="mt-3.5 flex space-x-4">
        <li>
          <TwitterShareButton
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#259df4] hover:text-white md:bg-[#259df4] md:text-white"
            url={socialShareUrl}
            resetButtonStyle={false}
          >
            <TwitterIcon className="h-5" />
          </TwitterShareButton>
        </li>
        <li>
          <LinkedinShareButton
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#3380cc] hover:text-white md:bg-[#3380cc] md:text-white"
            url={socialShareUrl}
            resetButtonStyle={false}
          >
            <LinkedinIcon className="h-4.5" />
          </LinkedinShareButton>
        </li>
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
  socialShareUrl: PropTypes.string.isRequired,
};

export default Sidebar;
