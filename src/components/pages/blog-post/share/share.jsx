import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton } from 'react-share';

import LinkedinIcon from 'images/linkedin.inline.svg';
import TwitterIcon from 'images/twitter.inline.svg';

const Share = ({ url }) => (
  <div className="absolute -right-20 top-0 h-full translate-x-full">
    <div className="sticky right-0 top-5 space-y-3">
      <TwitterShareButton
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#259df4] hover:text-white"
        url={url}
        resetButtonStyle={false}
      >
        <TwitterIcon className="h-5" />
      </TwitterShareButton>
      <LinkedinShareButton
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 transition-colors duration-200 hover:bg-[#3380cc] hover:text-white"
        url={url}
        resetButtonStyle={false}
      >
        <LinkedinIcon className="h-4.5" />
      </LinkedinShareButton>
    </div>
  </div>
);

Share.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Share;
