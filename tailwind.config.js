/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        warning: '#EF4444',
        neutral: '#6B7280',
        'object-ball': '#F97316',
        'object-car': '#3B82F6',
        'object-rocket': '#EF4444',
      },
    },
  },
  plugins: [],
}
