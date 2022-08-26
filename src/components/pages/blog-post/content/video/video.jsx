/* eslint-disable jsx-a11y/media-has-caption */
import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import SpinnerIcon from 'images/spinner.inline.svg';

import PlayButtonIcon from './images/play.inline.svg';

const VideoWithCover = (props) => {
  const { videoCovers, poster, ...additionalProps } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showCover, setShowCover] = useState(true);

  const coverName = poster?.split('/').pop();
  const coverData = videoCovers[coverName]?.childImageSharp;
  const videoRef = useRef(null);

  const handlePlay = async () => {
    await setIsPlaying(true);
    await setIsVideoLoading(true);
    await videoRef.current.play();
    await setShowCover(false);
  };

  return (
    <div className="relative">
      {isPlaying && (
        <video
          style={{ margin: '0 auto' }}
          className="absolute top-0 left-0 h-auto w-full cursor-pointer"
          {...additionalProps}
          ref={videoRef}
        />
      )}

      <div
        role="button"
        tabIndex={0}
        className={clsx('relative', !showCover && 'invisible opacity-0')}
        onClick={handlePlay}
        onKeyDown={handlePlay}
      >
        <GatsbyImage image={getImage(coverData)} alt="" aria-hidden />
        {!isVideoLoading ? (
          <PlayButtonIcon className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full drop-shadow-md" />
        ) : (
          <SpinnerIcon className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference" />
        )}
      </div>
    </div>
  );
};

VideoWithCover.propTypes = {
  videoCovers: PropTypes.shape({}).isRequired,
  poster: PropTypes.string,
};

VideoWithCover.defaultProps = {
  poster: null,
};

const Video = (props) => {
  const { autoPlay, width, height } = props;
  const { videoCovers, ...additionalProps } = props;

  const [wrapperRef, inView] = useInView({
    rootMargin: '500px',
    triggerOnce: true,
  });

  return autoPlay ? (
    <ImagePlaceholder
      className="relative my-5"
      width={Number(width)}
      height={Number(height)}
      wrapperRef={wrapperRef}
    >
      {inView && <video style={{ margin: '0 auto' }} {...additionalProps} />}
    </ImagePlaceholder>
  ) : (
    <VideoWithCover {...props} />
  );
};

Video.propTypes = {
  videoCovers: PropTypes.shape({}),
  autoPlay: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
};

Video.defaultProps = {
  videoCovers: null,
  autoPlay: false,
  width: null,
  height: null,
};

export default Video;
