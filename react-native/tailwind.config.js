/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins-Regular'],
        'sans-medium': ['Poppins-Medium'],
        'sans-semibold': ['Poppins-SemiBold'],
        'sans-bold': ['Poppins-Bold'],
        display: ['InterDisplay-SemiBold'],
        'display-regular': ['InterDisplay-Regular'],
        'display-medium': ['InterDisplay-Medium'],
      },
      colors: {
        chat: {
          // Dark theme
          'dark-bg': '#18181b',
          'dark-text': '#efeff1',
          'dark-header': '#1f1f23',
          'dark-message': 'rgba(255, 255, 255, 0.03)',
          'dark-input': '#2e2e33',
          'dark-border': '#2e2e33',
          
          // Light theme
          'light-bg': '#ffffff',
          'light-text': '#0e0e10',
          'light-header': '#f7f7f8',
          'light-message': 'rgba(0, 0, 0, 0.02)',
          'light-input': '#ffffff',
          'light-border': '#e5e5e8',
          
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
};

