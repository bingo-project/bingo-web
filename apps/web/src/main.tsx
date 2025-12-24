// ABOUTME: Application entry point
// ABOUTME: Sets up React, HeroUI provider, router, and i18n

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HeroUIProvider } from '@heroui/react'
import { initI18n } from './locales'
import { router } from './routes'
import './index.css'

// Initialize i18n before rendering
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </React.StrictMode>
  )
})
