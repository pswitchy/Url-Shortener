/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-vibrant': '#6366f1', // Vibrant blue-purple
        'secondary-vibrant': '#34d399', // Vibrant green
        'accent-vibrant': '#fde047',    // Vibrant yellow
        'neutral-light': '#f3f4f6',    // Light gray background (light mode)
        'neutral-dark': '#1e293b',     // Dark gray text/elements (light mode)
        'dark-bg': '#111827',           // Dark background (dark mode)
        'dark-text': '#f9fafb',         // Light text (dark mode)
        'dark-secondary': '#4b5563',    // Secondary dark text/elements
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
    },
  },
  plugins: [],
};