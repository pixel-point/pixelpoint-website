/* eslint-disable import/no-extraneous-dependencies, global-require */
// const defaultTheme = require('tailwindcss/defaultTheme');

const BREAKPOINTS = {
  '2xl': { min: '1920px', max: '1919px' },
  xl: { min: '1536px', max: '1535px' },
  lg: { min: '1280px', max: '1279px' },
  md: { min: '1024px', max: '1023px' },
  sm: { min: '768px', max: '767px' },
  xs: { min: '360px', max: '359px' },
};

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    // TODO: Uncomment this part of the code and the import of "defaultTheme" above, and complete TODOs
    // fontFamily: {
    //   // TODO: Add font families
    //   //       Delete "mono" if it isn't needed
    //   sans: ['', ...defaultTheme.fontFamily.sans],
    //   mono: ['', ...defaultTheme.fontFamily.mono],
    // },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      // TODO: Add colors
      // Make sure that they are prepared in the Figma and follow the naming primary/secondary/gray-${number}
      // Example of correctly prepared colors in Figma — https://user-images.githubusercontent.com/20713191/143586876-5e834233-9639-4166-9811-b00e63820d98.png
      // Example of incorrectly prepared colors in Figma — https://user-images.githubusercontent.com/20713191/143586974-6986149f-aee3-450c-a1dd-26e73e3aca02.png
      // black: '',
      // white: '',
      // primary: {
      //   1: '',
      // },
      // secondary: {
      //   1: '',
      // },
      // gray: {
      //   1: '',
      // },
    }),
    screens: {
      '2xl': { max: BREAKPOINTS['2xl'].max },
      xl: { max: BREAKPOINTS.xl.max },
      lg: { max: BREAKPOINTS.lg.max },
      md: { max: BREAKPOINTS.md.max },
      sm: { max: BREAKPOINTS.sm.max },
      xs: { max: BREAKPOINTS.xs.max },

      'xl-up': { min: BREAKPOINTS.xl.min },
      'lg-up': { min: BREAKPOINTS.lg.min },
      'md-up': { min: BREAKPOINTS.md.min },
      'sm-up': { min: BREAKPOINTS.sm.min },
      'xs-up': { min: BREAKPOINTS.xs.min },

      '2xl-only': { min: BREAKPOINTS.xl.min, max: BREAKPOINTS['2xl'].max },
      'xl-only': { min: BREAKPOINTS.lg.min, max: BREAKPOINTS.xl.max },
      'lg-only': { min: BREAKPOINTS.md.min, max: BREAKPOINTS.lg.max },
      'md-only': { min: BREAKPOINTS.sm.min, max: BREAKPOINTS.md.max },
      'sm-only': { min: BREAKPOINTS.xs.min, max: BREAKPOINTS.sm.max },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
};
