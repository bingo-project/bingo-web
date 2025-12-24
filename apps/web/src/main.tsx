// ABOUTME: Application entry point
// ABOUTME: Sets up React, HeroUI provider, and router

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HeroUIProvider } from '@heroui/react'
import { router } from './routes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </React.StrictMode>
)
