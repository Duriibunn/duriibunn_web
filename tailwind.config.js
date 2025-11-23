/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfc',
          100: '#ccfdf8',
          200: '#9ff5f0',
          300: '#66ede6',
          400: '#52e3c2', // 메인 민트색
          500: '#52e3c2', // 메인 민트색
          600: '#48b8a3',
          700: '#3d9384',
          800: '#347569',
          900: '#2d5f56',
        },
      },
    },
  },
}
