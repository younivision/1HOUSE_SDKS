/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Inter Display', 'Poppins', 'sans-serif'],
      },
      colors: {
        chat: {
          // Dark theme
          dark: {
            bg: '#18181b',
            text: '#efeff1',
            header: '#1f1f23',
            message: 'rgba(255, 255, 255, 0.03)',
            input: '#2e2e33',
            border: '#2e2e33',
          },
          // Light theme
          light: {
            bg: '#ffffff',
            text: '#0e0e10',
            header: '#f7f7f8',
            message: 'rgba(0, 0, 0, 0.02)',
            input: '#ffffff',
            border: '#e5e5e8',
          },
          // Accent colors
          primary: '#9147ff',
          success: '#22c55e',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}

