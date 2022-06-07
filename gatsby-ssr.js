import React from 'react';

const SITE_DOMAIN = 'pixelpoint.io';
const PLAUSIBLE_DOMAIN = 'plausible.pixelpoint.io';
const SCRIPT_URI = '/js/plausible.js';

// eslint-disable-next-line import/prefer-default-export
export const onRenderBody = ({ setHeadComponents, setPreBodyComponents }) => {
  if (process.env.NODE_ENV === 'production') {
    const scriptProps = {
      'data-domain': SITE_DOMAIN,
      src: `https://${PLAUSIBLE_DOMAIN}${SCRIPT_URI}`,
    };

    return setHeadComponents([
      // eslint-disable-next-line react/jsx-filename-extension
      <link key="plausible-preconnect" rel="preconnect" href={`https://${PLAUSIBLE_DOMAIN}`} />,
      <script key="plausible-script" defer {...scriptProps} />,
      // See: https://plausible.io/docs/custom-event-goals#1-trigger-custom-events-with-javascript-on-your-site
      <script
        key="plausible-custom-events"
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
          `,
        }}
      />,
    ]);
  }

  const ThemeSet = () => {
    const codeToRunOnClient = `
    (function() {
      let preferredTheme;
      try {
        preferredTheme = localStorage.getItem('theme');
      } catch (e) {}

      if (preferredTheme === 'dark') {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
      }
      
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (userPrefersDark === true) {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
      }
    })();
    `;
    return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
  };
  setPreBodyComponents(<ThemeSet />);
};
