import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Animation = ({ className, setRive, isWrapperInView, src, width, height }) => {
  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitHeight,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    setRive(rive);
  }, [rive, setRive]);

  return (
    <ImagePlaceholder className={className} width={width} height={height}>
      {isWrapperInView && <RiveComponent width={width} height={height} />}
    </ImagePlaceholder>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
  setRive: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  isWrapperInView: PropTypes.bool.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

Animation.defaultProps = {
  className: null,
  width: null,
  height: null,
};

export default Animation;
