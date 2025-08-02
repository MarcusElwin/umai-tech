/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'umai-primary': '#0a0a0a',
        'umai-secondary': '#f5f5f5',
        'umai-accent': '#8B5CF6',
        'umai-accent-dark': '#7C3AED',
        'umai-accent-darker': '#6D28D9',
        'umai-accent-light': '#A78BFA',
        'umai-gray': {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'japanese': ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}