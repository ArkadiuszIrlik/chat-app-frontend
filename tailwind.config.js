/** @type {import('tailwindcss').Config} */
import { styleConsts } from './src/constants';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: styleConsts.colors,
    screens: styleConsts.screens,
    extend: {
      fontFamily: styleConsts.fontFamily,
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addVariant }) {
      addVariant('using-touch', '.is-using-touch &');
      addVariant('using-mouse', '.is-using-mouse &');
    }),
  ],
};
