import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton } from 'react-share';

import LinkedinIcon from 'images/linkedin.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';

const SocialShare = ({ url }) => (
  <div className="mt-6 flex justify-center space-x-3">
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
);

SocialShare.propTypes = {
  url: PropTypes.string.isRequired,
};

export default SocialShare;
