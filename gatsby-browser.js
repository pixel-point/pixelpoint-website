import './src/styles/main.css';

// eslint-disable-next-line import/prefer-default-export
export const onRouteUpdate = ({ location }) => {
  // TODO: Fix of gatsby-plugin-image bug, that prevents images from being displayed
  // It happens because gatsby does not trigger a function that sets to an element opacity: 1
  // Bug is very hard to reproduce, it happens only in production builds

  const mainImages = document.querySelectorAll('.gatsby-image-wrapper [data-main-image]');
  mainImages.forEach((mainImage) => {
    if (mainImage.complete) {
      mainImage.classList.add('loaded');
    } else {
      mainImage.addEventListener('load', () => {
        mainImage.classList.add('loaded');
      });
    }
  });

  if (process.env.NODE_ENV === 'production' && typeof window.plausible !== 'undefined') {
    window.plausible('pageview');
  }

  const isBlog = location.pathname.startsWith('/blog');
  const isDarkModeSetInLocalStorage =
    typeof localStorage !== 'undefined' && localStorage.theme === 'dark';
  // prettier-ignore
  const isSystemModeDark = !('theme' in localStorage) && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (isBlog && (isDarkModeSetInLocalStorage || isSystemModeDark)) {
    document.documentElement.classList.add('disable-transition');
    document.documentElement.classList.add('dark');
    setTimeout(() => document.documentElement.classList.remove('disable-transition'), 0);
  } else {
    document.documentElement.classList.add('disable-transition');
    document.documentElement.classList.remove('dark');
    setTimeout(() => document.documentElement.classList.remove('disable-transition'), 0);
  }
};
