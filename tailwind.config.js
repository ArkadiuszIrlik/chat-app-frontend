/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '36rem',
      sm: '48rem',
      md: '64rem',
      lg: '85.375rem',
      xl: '120rem',
      '2xl': '160rem',
    },
    extend: {
      colors: {
        dark: {
          900: '#131313',
          600: '#2C2C2C',
          500: '#7D7D7D',
        },
        primary: {
          600: '#4E2D79',
        },
      },
      fontFamily: {
        ui: ['"Nunito Sans"', 'sans-serif'],
        beluga: ['Reef', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
