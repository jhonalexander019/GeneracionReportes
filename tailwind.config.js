/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      colors: {
        autofill: '#000000', // Color del texto para los campos autocompletados
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out forwards',
        slideOut: 'slideOut 0.5s ease-in forwards',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-animations'),
    function ({ addBase, theme }) {
      addBase({
        'input:-webkit-autofill': {
          '-webkit-text-fill-color': theme('colors.autofill'),
          'transition': 'background-color 5000s ease-in-out 0s',
        },
        'input:-webkit-autofill:hover': {
          '-webkit-text-fill-color': theme('colors.autofill'),
        },
        'input:-webkit-autofill:focus': {
          '-webkit-text-fill-color': theme('colors.autofill'),
        },
        'input:-webkit-autofill:active': {
          '-webkit-text-fill-color': theme('colors.autofill'),
        },
        'input': {
          'color': theme('colors.gray.700'),
          'background-color': theme('colors.white'),
          '&:disabled': {
            'background-color': theme('colors.transparent'),
            'color': theme('colors.gray.700'),
            'border-color': theme('colors.gray.300'),
          },
        },
      });
    }
  ],
}