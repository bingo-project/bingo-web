// ABOUTME: HeroUI Tailwind CSS v4 plugin configuration
// ABOUTME: Exports heroui plugin for @plugin directive in CSS

import { heroui } from '@heroui/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugin: any = heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: '#faf7ff',
          100: '#f3ebfe',
          200: '#e9d9fd',
          300: '#d6b8fb',
          400: '#bc8af7',
          500: '#9d5cf2',
          600: '#7238f0',
          700: '#5b2cb3',
          800: '#4a2391',
          900: '#3d1d76',
          DEFAULT: '#7238f0',
          foreground: '#ffffff',
        },
      },
    },
    dark: {
      colors: {
        primary: {
          50: '#faf7ff',
          100: '#f3ebfe',
          200: '#e9d9fd',
          300: '#d6b8fb',
          400: '#bc8af7',
          500: '#9d5cf2',
          600: '#7238f0',
          700: '#5b2cb3',
          800: '#4a2391',
          900: '#3d1d76',
          DEFAULT: '#7238f0',
          foreground: '#ffffff',
        },
      },
    },
  },
})

export default plugin
