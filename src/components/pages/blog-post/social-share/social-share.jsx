import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton } from 'react-share';

import LinkedinIcon from 'images/linkedin.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';

const SocialShare = ({ url }) => (
  <div className="absolute -right-20 top-0 h-full translate-x-full md:relative md:right-0 md:mt-6 md:translate-x-0">
    <div className="sticky right-0 top-5 space-y-3 md:relative md:top-0 md:flex md:space-y-0 md:space-x-3">
      <TwitterShareButton
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#259df4] hover:text-white md:bg-[#259df4] md:text-white"
        url={url}
        resetButtonStyle={false}
      >
        <TwitterIcon className="h-5" />
      </TwitterShareButton>
      <LinkedinShareButton
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#3380cc] hover:text-white md:bg-[#3380cc] md:text-white"
        url={url}
        resetButtonStyle={false}
      >
        <LinkedinIcon className="h-4.5" />
      </LinkedinShareButton>
    </div>
  </div>
);

SocialShare.propTypes = {
  url: PropTypes.string.isRequired,
};

export default SocialShare;
