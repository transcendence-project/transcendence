/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/components/**/*.{vue,js,ts,}',
    './src/**/*.{vue,js,ts,}',
    './src/views/**/*.{vue,js,ts,}',

  ],
  theme: {
    extend: {
      backgroundColor:{
        'sideNav' : "#34373d",      
        'topNav' : "#212327",
        
      }
    },
  },
  plugins: [],
  extend: {
    margin: {
      'mb-15': '15px',
    },
  },
}

