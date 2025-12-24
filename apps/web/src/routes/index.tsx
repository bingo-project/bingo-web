// ABOUTME: Application router configuration
// ABOUTME: Defines all routes using React Router 7

import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts'
import { HomePage, AboutPage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])
