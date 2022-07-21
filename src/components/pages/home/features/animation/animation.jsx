import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from 'rive-react';

import ImagePlaceholder from 'components/shared/image-placeholder';

const Animation = ({ src, addIcon, isWrapperInView, index }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive && !isAdded) {
      addIcon(rive, index);
      setIsAdded(true);
    }
  }, [rive, addIcon, isAdded, index]);

  return (
    <ImagePlaceholder className="w-20" width={80} height={62} aria-hidden>
      {isWrapperInView && <RiveComponent width={80} height={62} />}
    </ImagePlaceholder>
  );
};

Animation.propTypes = {
  src: PropTypes.string.isRequired,
  addIcon: PropTypes.func.isRequired,
  isWrapperInView: PropTypes.bool,
  index: PropTypes.number.isRequired,
};

Animation.defaultProps = {
  isWrapperInView: false,
};

export default Animation;
