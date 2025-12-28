// ABOUTME: Application entry point
// ABOUTME: Sets up React, HeroUI provider, router, and i18n

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'sonner'
import { useAuthStore, initWebSocketHandlers } from '@bingo/core'
import { initI18n } from './locales'
import { router } from './routes'
import './index.css'

// Initialize app before rendering
Promise.all([initI18n(), useAuthStore.getState().initAuth()]).then(() => {
  // Initialize WebSocket handlers after auth is ready
  initWebSocketHandlers(() => router.navigate('/login'))

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HeroUIProvider disableRipple>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </HeroUIProvider>
    </React.StrictMode>
  )
})
