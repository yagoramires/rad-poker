/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        'win98-gray': '#c0c0c0',
        'win98-dark-gray': '#808080',
        'win98-light-gray': '#d4d0c8',
        'win98-blue': '#000080',
        'win98-light-blue': '#1084d0',
        'win98-white': '#ffffff',
        'win98-black': '#000000',
      },
      fontFamily: {
        'win98': ['MS Sans Serif', 'Segoe UI', system-ui, 'sans-serif'],
      },
      boxShadow: {
        'win98': '2px 2px 0px 0px #000000',
        'win98-inset': 'inset 0 0 0 2px #000080',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
