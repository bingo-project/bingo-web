// ABOUTME: HeroUI Tailwind CSS v4 plugin configuration
// ABOUTME: Exports heroui plugin for @plugin directive in CSS

import { heroui } from '@heroui/react'

// Primary color palette
const primaryColors = {
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugin: any = heroui({
  themes: {
    light: {
      colors: {
        background: '#f8fafc', // slate-50
        foreground: '#0f172a', // slate-900
        divider: '#e2e8f0', // slate-200
        content1: '#ffffff',
        content2: '#f8fafc',
        content3: '#f1f5f9',
        content4: '#e2e8f0',
        default: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        primary: primaryColors,
      },
    },
    dark: {
      colors: {
        background: '#161022', // custom dark purple
        foreground: '#f8fafc', // slate-50
        divider: 'rgba(255, 255, 255, 0.05)',
        content1: '#1e162e', // custom card background
        content2: '#251d38',
        content3: '#2d2442',
        content4: '#352b4c',
        default: {
          50: '#1e162e',
          100: '#251d38',
          200: '#2d2442',
          300: '#352b4c',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
        },
        primary: primaryColors,
      },
    },
  },
})

export default plugin
