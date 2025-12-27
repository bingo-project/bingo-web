// ABOUTME: Application router configuration
// ABOUTME: Defines all routes using React Router 7

import { createBrowserRouter, Navigate } from 'react-router'
import { RootLayout, SettingsLayout } from '@/layouts'
import {
  HomePage,
  AboutPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ErrorPage,
  ProfileSettingsPage,
  SecuritySettingsPage,
} from '@/pages'

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
  {
    path: '/settings',
    element: <SettingsLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/settings/profile" replace /> },
      { path: 'profile', element: <ProfileSettingsPage /> },
      { path: 'security', element: <SecuritySettingsPage /> },
    ],
  },
  { path: '*', element: <ErrorPage /> },
])
