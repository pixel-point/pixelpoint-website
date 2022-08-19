/* eslint-disable jsx-a11y/media-has-caption */
import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';

import PlayButtonIcon from './images/play.inline.svg';

const VideoWithCover = (props) => {
  const { videoCovers, poster, ...additionalProps } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const coverName = poster?.split('/').pop();
  const coverData = videoCovers[coverName]?.childImageSharp;

  const handleVideoClick = (e) => {
    setIsPlaying(true);
    if (isVideoLoaded) {
      e.target.play();
    }
  };

  return (
    <>
      <video
        role="button"
        tabIndex={0}
        style={{ margin: '0 auto' }}
        className={clsx(
          'absolute top-0 left-0 h-auto w-full cursor-pointer',
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...additionalProps}
        onLoadedData={() => setIsVideoLoaded(true)}
        onClick={() => setIsPlaying(true)}
        onTouchStart={handleVideoClick}
      />

      {!isPlaying && (
        <>
          <div className="pointer-events-none absolute top-0 left-0 h-auto w-full">
            <GatsbyImage image={getImage(coverData)} alt="" aria-hidden />
          </div>
          <PlayButtonIcon className="pointer-events-none absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full drop-shadow-md" />
        </>
      )}
    </>
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

  const [videoRef, inView] = useInView({
    rootMargin: '500px',
    triggerOnce: true,
  });

  return (
    <ImagePlaceholder
      className="relative my-5"
      width={Number(width)}
      height={Number(height)}
      wrapperRef={videoRef}
    >
      {inView &&
        (autoPlay ? (
          <video style={{ margin: '0 auto' }} {...props} />
        ) : (
          <VideoWithCover {...props} />
        ))}
    </ImagePlaceholder>
  );
};

Video.propTypes = {
  autoPlay: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
};

Video.defaultProps = {
  autoPlay: false,
  width: null,
  height: null,
};

export default Video;
