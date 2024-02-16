import colors from 'tailwindcss/colors';

export default {
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    white: colors.white,
    gray: {
      100: '#D9D9D9',
      200: '#B3B3B3',
      300: '#979797',
      400: '#616161',
      500: '#454545',
      600: '#333333',
      700: '#262626',
      800: '#1B1B1B',
      900: '#141414',
    },
    blue: {
      400: '#5DC6FF',
    },
    red: {
      100: '#FFF5F5',
      200: '#FCCFCF',
      300: '#F19D9D',
      400: '#DD6C6C',
      500: '#D14747',
      600: '#AB2121',
      700: '#760A0A',
      800: '#420000',
      900: '#240000',
    },
    cerise: {
      600: '#f80099',
    },
    clairvoyant: {
      900: '#4b1259',
    },
    dark: {
      900: '#131313',
      600: '#2C2C2C',
      500: '#7D7D7D',
    },
    primary: {
      600: '#4E2D79',
    },
  },
  screens: {
    xs: '36rem',
    sm: '48rem',
    md: '64rem',
    lg: '85.375rem',
    xl: '120rem',
    '2xl': '160rem',
  },
  fontFamily: {
    ui: ['"Nunito Sans"', 'sans-serif'],
    beluga: ['Reef', 'sans-serif'],
  },
};
