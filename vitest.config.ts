// ABOUTME: Vitest configuration for unit testing
// ABOUTME: Configures test environment, coverage, and React Testing Library

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/*.d.ts', '**/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      '@bingo/core': path.resolve(__dirname, './packages/core/src'),
      '@bingo/utils': path.resolve(__dirname, './packages/utils/src'),
      '@bingo/locales': path.resolve(__dirname, './packages/locales/src'),
    },
  },
})
