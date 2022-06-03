import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Footer from 'components/shared/footer';
import Header from 'components/shared/header';
import MobileMenu from 'components/shared/mobile-menu';
import SEO from 'components/shared/seo';

function setRealBrowserHeight() {
  document.documentElement.style.setProperty('--real-browser-height', `${window.innerHeight}px`);
}

const Layout = ({ seo, headerClassName, headerTheme, children }) => {
  const headerRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOutsideClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleHeaderBurgerClick = () => {
    setIsMobileMenuOpen((isMobileMenuOpen) => !isMobileMenuOpen);
  };

  useEffect(() => {
    setRealBrowserHeight();

    if (typeof window !== 'undefined') window.addEventListener('resize', setRealBrowserHeight);

    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('resize', setRealBrowserHeight);
    };
  }, []);

  return (
    <>
      <SEO {...seo} />
      <div className="flex min-h-screen flex-col">
        <Header
          className={headerClassName}
          theme={headerTheme}
          isMobileMenuOpen={isMobileMenuOpen}
          ref={headerRef}
          onBurgerClick={handleHeaderBurgerClick}
        />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          headerRef={headerRef}
          onOutsideClick={handleMobileMenuOutsideClick}
        />
      </div>
    </>
  );
};

Layout.propTypes = {
  seo: PropTypes.exact({
    title: PropTypes.string,
    description: PropTypes.string,
    ogImage: PropTypes.string,
    canonicalUrl: PropTypes.string,
  }),
  headerClassName: PropTypes.string,
  headerTheme: PropTypes.oneOf(['black', 'white']).isRequired,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  seo: {},
  headerClassName: null,
};

export default Layout;
