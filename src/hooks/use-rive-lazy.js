import React, { useCallback } from 'react';
import { useRive } from 'rive-react';

export default function useRiveLazy(riveParams, inView) {
  const { RiveComponent, rive } = useRive(riveParams);

  const RiveLazyComponent = useCallback(
    ({ width, height, className }) => (
      <>{inView && <RiveComponent className={className} width={width} height={height} />}</>
    ),
    [inView]
  );

  return {
    RiveLazyComponent,
    rive,
  };
}
