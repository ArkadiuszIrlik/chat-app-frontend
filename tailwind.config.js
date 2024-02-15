/** @type {import('tailwindcss').Config} */
import { styleConsts } from './src/constants';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: styleConsts.colors,
    screens: styleConsts.screens,
    extend: {
      fontFamily: styleConsts.fontFamily,
    },
  },
  plugins: [],
};
