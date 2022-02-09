import { useState, useLayoutEffect } from 'react';

import useWindowWidth from 'hooks/use-window-width';

const useSectionOffset = (sectionRef, useScreenHeight = false) => {
  const [sectionStart, setSectionStart] = useState(null);
  const [sectionEnd, setSectionEnd] = useState(null);
  const [sectionHidden, setSectionHidden] = useState(null);

  const windowWidth = useWindowWidth();

  useLayoutEffect(() => {
    if (!sectionRef.current) {
      return;
    }
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const screenHeight = document.documentElement.clientHeight;

    // section appears in view
    const offsetStart = rect.top + scrollTop - (useScreenHeight ? screenHeight : rect.height);
    // full section in view
    const offsetEnd = offsetStart + rect.height;
    // section is out of view, above the viewport
    const offsetHidden = offsetEnd + rect.height;

    setSectionStart(offsetStart);
    setSectionEnd(offsetEnd);
    setSectionHidden(offsetHidden);
  }, [sectionRef, useScreenHeight, windowWidth]);

  return [sectionStart, sectionEnd, sectionHidden];
};

export default useSectionOffset;
