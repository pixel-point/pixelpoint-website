import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Animation = ({
  isContentInView,
  titleControls,
  descriptionControls,
  isIllustrationInView,
  src,
  width,
  height,
}) => {
  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isContentInView) {
      titleControls.start('animate').then(() => descriptionControls.start('animate'));
    }
    if (isIllustrationInView && rive) rive.play();
  }, [isContentInView, titleControls, descriptionControls, isIllustrationInView, rive]);

  return (
    <ImagePlaceholder width={width} height={height}>
      {isIllustrationInView && <RiveComponent width={width} height={height} />}
    </ImagePlaceholder>
  );
};

Animation.propTypes = {
  isContentInView: PropTypes.bool.isRequired,
  isIllustrationInView: PropTypes.bool.isRequired,
  titleControls: PropTypes.shape({
    start: PropTypes.func.isRequired,
  }).isRequired,
  descriptionControls: PropTypes.shape({
    start: PropTypes.func.isRequired,
  }).isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Animation;
