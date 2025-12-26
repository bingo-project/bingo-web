// ABOUTME: Application router configuration
// ABOUTME: Defines all routes using React Router 7

import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts'
import { HomePage, AboutPage, LoginPage, RegisterPage, ForgotPasswordPage, ErrorPage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  { path: '/login', element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: '/register', element: <RegisterPage />, errorElement: <ErrorPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage />, errorElement: <ErrorPage /> },
  { path: '*', element: <ErrorPage /> },
])
