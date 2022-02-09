/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    fontFamily: {
      sans: ['Usual', ...defaultTheme.fontFamily.sans],
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: '#000',
      white: '#fff',
      primary: '#EE2B6C',
      secondary: '#2B4BEE',
      'gray-0': '#F5F5F5',
    }),
    screens: {
      '2xl': { max: '1919px' },
      xl: { max: '1535px' },
      lg: { max: '1279px' },
      md: { max: '1023px' },
      sm: { max: '767px' },
      xs: { max: '359px' },
    },
    extend: {
      fontSize: {
        base: ['16px', 1.5],
        lg: ['18px', 1.5],
        xl: ['20px', 1.5],
        '2xl': ['24px', 1.3],
        '4xl': ['36px', 1.3],
        '6xl': ['56px', 1.3],
      },
      spacing: {
        30: '120px',
      },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
};
