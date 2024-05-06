/* eslint-disable global-require */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    screens: {
      '2xl': { max: '1919px' },
      xl: { max: '1535px' },
      lg: { max: '1279px' },
      md: { max: '1023px' },
      sm: { max: '767px' },
      xs: { max: '413px' },
    },
    fontFamily: {
      sans: ['Usual', 'Usual Fallback', ...defaultTheme.fontFamily.sans],
      mono: ['IBM Plex Mono', 'IBM Plex Mono Fallback', ...defaultTheme.fontFamily.mono],
    },
    fontSize: {
      // Commented sizes are not being used yet
      // Before starting to use them, please make sure to check if values are correct!
      xs: ['12px'],
      sm: ['14px'],
      base: ['16px'],
      lg: ['18px'],
      xl: ['20px'],
      '2xl': ['24px'],
      '3xl': ['30px'],
      '4xl': ['36px'],
      '5xl': ['48px'],
      '6xl': ['56px'],
      // '7xl': ['72px'],
      '8xl': ['96px'],
      // '9xl': ['128px'],
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: '#000000',
      white: '#ffffff',
      red: '#ee2b6c',
      blue: '#2b4bee',
      green: '#00cc76',
      gray: {
        1: '#fafafa',
        2: '#f5f5f5',
        3: '#ebebeb',
        4: '#e6e6e6',
        5: '#cccccc',
        6: '#999999',
        7: '#666666',
        8: '#333333',
        9: '#1a1a1a',
        10: '#0d0d0d',
      },
    }),
    extend: {
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
};
