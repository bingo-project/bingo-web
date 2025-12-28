// ABOUTME: Application router configuration
// ABOUTME: Defines all routes using React Router 7

import { createBrowserRouter, Navigate } from 'react-router'
import { RootLayout, SettingsLayout } from '@/layouts'
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ErrorPage,
  ProfileSettingsPage,
  SecuritySettingsPage,
  NotificationSettingsPage,
  NotificationCenterPage,
  OAuthCallbackPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
  { path: '/login', element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: '/register', element: <RegisterPage />, errorElement: <ErrorPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage />, errorElement: <ErrorPage /> },
  { path: '/auth/callback/:provider', element: <OAuthCallbackPage />, errorElement: <ErrorPage /> },
  {
    path: '/settings',
    element: <SettingsLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/settings/profile" replace /> },
      { path: 'profile', element: <ProfileSettingsPage /> },
      { path: 'security', element: <SecuritySettingsPage /> },
      { path: 'notifications', element: <NotificationSettingsPage /> },
    ],
  },
  { path: '/notifications', element: <NotificationCenterPage />, errorElement: <ErrorPage /> },
  { path: '*', element: <ErrorPage /> },
])
