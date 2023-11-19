/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // すべてのJSX/TSXファイルをスキャン
    "./public/index.html", // publicディレクトリ内のHTMLファイルもスキャン
  ],
  theme: {
    extend: {
      colors: {
        'custom-turquoise': '#009b9f',
        'custom-hover-turquoise': '#007b80',
        'custom-gray': '#999999',
        'custom-hover-gray': '#808080'
      }
    },
  },
  plugins: [],
};

