/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554",'gray-900': '#030712','gray-950':'#374151', 'gray-700':'#E5E7EB',}
      }
    },
    fontFamily: {
      'body': [
    "Plus Jakarta Sans",
  ],
     
    }
  },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin')
  ],
}

