/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(213, 97%, 53%)',
        },
        background: {
          primary: 'hsl(0, 0%, 100%)',
          dark: 'hsl(213, 97%, 53%)',
          darker: 'hsl(213, 97%, 40%)',
          hover: 'hsl(0, 0%,96%)',
        },
        text: {
          primary: 'hsl(195, 3%, 24%)',
          secondary: 'hsl(195, 3%, 30%)',
          invert: 'hsl(0, 0%, 100%)',
        },
        border: {
          DEFAULT: 'hsl(210, 0%, 89%)',
        },
        checkbox: {
          border: 'hsl(210, 0%, 89%)',
          checked: 'hsl(213, 97%, 53%)',
        }
      },
      borderRadius: {
        DEFAULT: '3px',
        'sm': '3px',
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}
