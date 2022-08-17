/* eslint-disable jsx-a11y/media-has-caption */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import ImagePlaceholder from 'components/shared/image-placeholder';

import PlayButtonIcon from './images/play.inline.svg';

const generateVideoThumbnail = (url) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    video.crossOrigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.src = url;

    video.onloadeddata = () => {
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL('image/png'));
    };
  });

const VideoWithCover = (props) => {
  const { src, width, height } = props;
  const videoUrl = src?.replace('\n', '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [cover, setCover] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    async function getCover() {
      const response = await generateVideoThumbnail(videoUrl);
      setCover(response);
    }
    getCover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ImagePlaceholder className="relative my-5" width={Number(width)} height={Number(height)}>
      {cover && (
        <>
          <video
            style={{ margin: '0 auto' }}
            className={clsx(
              'absolute top-0 left-0 h-auto w-full cursor-pointer',
              isVideoLoaded ? 'visible opacity-100' : 'hidden opacity-0'
            )}
            {...props}
            onLoadedData={() => setIsVideoLoaded(true)}
            onClick={() => setIsPlaying(true)}
          />

          <img
            className={clsx(
              'pointer-events-none absolute top-0 left-0 h-auto w-full',
              isPlaying && 'hidden opacity-0'
            )}
            src={cover}
            width={width}
            height={height}
            alt=""
            aria-hidden
          />
          <PlayButtonIcon
            className={clsx(
              'pointer-events-none absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg',
              isPlaying && 'hidden opacity-0'
            )}
          />
        </>
      )}
    </ImagePlaceholder>
  );
};

VideoWithCover.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

VideoWithCover.defaultProps = {
  width: null,
  height: null,
};

const Video = (props) => {
  const { autoPlay } = props;
  const [videoRef, inView] = useInView({
    rootMargin: '500px',
    triggerOnce: true,
  });
  return (
    <div ref={videoRef}>
      {!autoPlay && <VideoWithCover {...props} />}
      {autoPlay && inView && <video {...props} />}
    </div>
  );
};

Video.propTypes = {
  autoPlay: PropTypes.bool,
};

Video.defaultProps = {
  autoPlay: false,
};

export default Video;
