import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links.js';
import POST_AUTHORS from 'constants/post-authors';
import TwitterIcon from 'images/twitter.inline.svg';

const Author = ({ author }) => (
  <section className="safe-paddings mt-20 text-white sm:mt-10">
    <div className="container-xs">
      <div
        className="flex space-x-8 rounded-2xl p-8 sm:block sm:space-x-0 sm:space-y-6 sm:p-6"
        style={{ background: 'linear-gradient(254.82deg, #333333 0%, #000000 100%)' }}
      >
        <img
          className="h-20 w-20 shrink-0 rounded-full"
          src={POST_AUTHORS[author].photo}
          alt={POST_AUTHORS[author].name}
          loading="lazy"
        />
        <div>
          <h2 className="with-text-highlight-red text-2xl font-normal leading-snug sm:text-xl">
            Written by <span>{POST_AUTHORS[author].name}</span>
          </h2>
          <p className="mt-3 sm:mt-2.5 sm:text-base">{POST_AUTHORS[author].description}</p>
          {POST_AUTHORS[author].twitterUrl && (
            <Link
              className="mt-5 inline-flex items-center space-x-3 rounded-full bg-[#259df4] py-2.5 pl-3.5 pr-5 text-sm font-semibold transition-colors duration-200 hover:bg-[#1781cf] md:mt-4 sm:w-full sm:justify-center"
              to={LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="h-5" /> <span>Follow on Twitter</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
);

Author.propTypes = {
  author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
};

export default Author;
