import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';
import PlayButtonIcon from 'images/play.inline.svg';
import SpinnerIcon from 'images/spinner.inline.svg';

const VideoWithCover = (props) => {
  const { videoCovers, poster, ...additionalProps } = props;
  // Get a poster file name from a url eg /0b989e9f686d885a42960ef916848b16/video-cover-1.jpg
  const coverName = poster?.split('/').pop();

  // Fail build if cover name is not found
  if (videoCovers === null) {
    throw Error(`Video cover has to be provided if autoplay is disabled`);
  }

  const coverData = videoCovers[coverName]?.childImageSharp;

  // Fail build if cover is not found
  if (coverData === undefined) {
    throw Error(`Video cover with name ${coverName} does not exist`);
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showCover, setShowCover] = useState(true);

  const videoRef = useRef(null);

  const handlePlay = async () => {
    await setIsPlaying(true);
    await setIsVideoLoading(true);
    await videoRef.current.play();
    await setShowCover(false);
  };

  return (
    <div className="relative my-5">
      {isPlaying && (
        <video
          className={clsx(
            'absolute top-0 left-0 h-auto w-full cursor-pointer',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoadedData={() => setIsVideoLoaded(true)}
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
        {/* On a slow internet connection the lag between pressing play and the video playing can be visible, so we hold spinner until the video loaded */}
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
  const { ...additionalProps } = props;

  const [imagePlaceholderRef, inView] = useInView({
    rootMargin: '500px',
    triggerOnce: true,
  });
  // If video has autoplay option we want to lazy load it by preserving original aspect ratio to avoid layout shift
  return autoPlay ? (
    <ImagePlaceholder
      className="relative my-5"
      width={Number(width)}
      height={Number(height)}
      ref={imagePlaceholderRef}
    >
      {inView && <video {...additionalProps} />}
    </ImagePlaceholder>
  ) : (
    // If video does not have autplay option, we want to prevent it from loading until user press play button
    // and have a thumbnail optimized with Gatsby image to avoid penalities from Lighthouse test
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
