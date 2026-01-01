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
  AiSquarePage,
  AiChatPage,
  AiLayout,
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
      { index: true, element: <Navigate to="/settings/notifications" replace /> },
      { path: 'notifications', element: <NotificationCenterPage /> },
      { path: 'notifications/preferences', element: <NotificationSettingsPage /> },
      { path: 'profile', element: <ProfileSettingsPage /> },
      { path: 'security', element: <SecuritySettingsPage /> },
    ],
  },
  {
    path: '/ai',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AiLayout />,
        children: [
          { index: true, element: <AiSquarePage /> },
          { path: 'chat/:sessionId', element: <AiChatPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <ErrorPage /> },
])
