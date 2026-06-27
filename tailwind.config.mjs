import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#1A1D22',
        'surface-container': '#202329',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353534',
        primary: '#f2ca83',
        'on-primary': '#412d00',
        'primary-container': '#d4af6a',
        'on-primary-container': '#5b4205',
        secondary: '#c4c6cd',
        'on-secondary': '#2e3036',
        'secondary-container': '#46494f',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#d1c5b4',
        outline: '#9a8f80',
        'outline-variant': '#4e4639',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
