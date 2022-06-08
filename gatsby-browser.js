import './src/styles/main.css';

// eslint-disable-next-line import/prefer-default-export
export const onRouteUpdate = ({ location }) => {
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
