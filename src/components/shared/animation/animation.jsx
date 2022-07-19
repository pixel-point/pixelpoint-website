import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Animation = ({ className, src, isAnimationInView, width, height }) => {
  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isAnimationInView && rive) rive.play();
  }, [isAnimationInView, rive]);

  return (
    <ImagePlaceholder className={className} width={width} height={height}>
      {isAnimationInView && <RiveComponent />}
    </ImagePlaceholder>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  isAnimationInView: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Animation.defaultProps = {
  className: null,
  isAnimationInView: false,
};

export default Animation;
