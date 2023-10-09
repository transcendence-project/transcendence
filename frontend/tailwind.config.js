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
        'sideNav'   : "#34373d",      
        'topNav'    : "#212327",
        'compBg'    : '#24272c',
        'btn'       : '#697692',
        'btn-hover' : '#7c8392',
        'card-bg'   : '#61656e',
      },
      width:{
        '58' : '58%'
      },
      colors: {
        'hover-color': '#d9d9da',
      },
      borderWidth: {
        'groove': 'groove',
      },
    },
  },
  plugins: [],
  extend: {
    margin: {
      'mb-15': '15px',
    },
  },
}

