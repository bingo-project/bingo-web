# OAuth Social Login Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement OAuth social login with dynamic provider rendering, callback handling, and account binding management.

**Architecture:** Frontend calls backend API to get available providers and OAuth URLs, redirects user to OAuth provider, handles callback to exchange code for token. Account binding is managed in Security settings page.

**Tech Stack:** React, TypeScript, HeroUI, React Router, i18next, Zustand

---

## Task 1: Add OAuth API Types and Functions

**Files:**

- Modify: `packages/core/src/api/auth.ts`

**Step 1: Add OAuth type definitions**

Add these interfaces after the existing `TOTPDisableRequest` interface (around line 88):

```typescript
// OAuth
export interface AuthProvider {
  name: string
  authUrl: string
  redirectUrl: string
  isDefault: number
}

export interface OAuthUrlResponse {
  authUrl: string
  state: string
  codeVerifier: string
}

export interface OAuthLoginRequest {
  code: string
  state: string
  codeVerifier: string
}

export interface SocialBinding {
  provider: string
  boundAt: string
}
```

**Step 2: Add OAuth API functions**

Add these functions to the `authApi` object (before the closing brace):

```typescript
  // OAuth
  getProviders: () => request.get<AuthProvider[]>('/v1/auth/providers'),

  getOAuthUrl: (provider: string) => request.get<OAuthUrlResponse>(`/v1/auth/login/${provider}`),

  oauthLogin: (provider: string, params: OAuthLoginRequest) =>
    request.post<LoginResponse>(`/v1/auth/login/${provider}`, null, { params }),

  // Social Account Bindings
  getBindings: () => request.get<SocialBinding[]>('/v1/auth/bindings'),

  bindProvider: (provider: string, params: OAuthLoginRequest) =>
    request.post<LoginResponse>(`/v1/auth/bindings/${provider}`, null, { params }),

  unbindProvider: (provider: string) => request.delete<void>(`/v1/auth/bindings/${provider}`),
```

**Step 3: Run TypeScript check**

Run: `pnpm --filter @bingo/core build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add packages/core/src/api/auth.ts
git commit -m "feat(core): add OAuth API types and functions"
```

---

## Task 2: Add OAuth Internationalization

**Files:**

- Modify: `packages/locales/src/langs/en-US/auth.json`
- Modify: `packages/locales/src/langs/zh-CN/auth.json`
- Modify: `packages/locales/src/langs/en-US/settings.json`
- Modify: `packages/locales/src/langs/zh-CN/settings.json`

**Step 1: Add OAuth translations to en-US auth.json**

Add after the `"login"` section (after line 30), inside the login object:

```json
    "oauthError": "Login failed, please try again",
    "oauthCancelled": "Authorization cancelled",
    "invalidState": "Authorization expired, please try again",
    "processing": "Processing...",
```

**Step 2: Add OAuth translations to zh-CN auth.json**

Add matching keys in the same location:

```json
    "oauthError": "登录失败，请重试",
    "oauthCancelled": "授权已取消",
    "invalidState": "授权已过期，请重新登录",
    "processing": "处理中...",
```

**Step 3: Add social bindings translations to en-US settings.json**

Add after the `"totp"` section (after line 139), as a new section:

```json
  ,
    "socialAccounts": {
      "title": "Social Accounts",
      "description": "Link social accounts for quick login.",
      "linked": "Linked",
      "notLinked": "Not Linked",
      "link": "Link",
      "unlink": "Unlink",
      "unlinkConfirm": "Are you sure you want to unlink {{provider}}?",
      "unlinkSuccess": "{{provider}} unlinked successfully",
      "linkSuccess": "{{provider}} linked successfully",
      "providers": {
        "google": "Google",
        "github": "GitHub",
        "apple": "Apple",
        "microsoft": "Microsoft",
        "discord": "Discord",
        "twitter": "Twitter"
      }
    }
```

**Step 4: Add social bindings translations to zh-CN settings.json**

Add matching keys:

```json
  ,
    "socialAccounts": {
      "title": "社交账号",
      "description": "绑定社交账号以快速登录。",
      "linked": "已绑定",
      "notLinked": "未绑定",
      "link": "绑定",
      "unlink": "解绑",
      "unlinkConfirm": "确定要解绑 {{provider}} 吗？",
      "unlinkSuccess": "{{provider}} 解绑成功",
      "linkSuccess": "{{provider}} 绑定成功",
      "providers": {
        "google": "Google",
        "github": "GitHub",
        "apple": "Apple",
        "microsoft": "Microsoft",
        "discord": "Discord",
        "twitter": "Twitter"
      }
    }
```

**Step 5: Run build to verify JSON syntax**

Run: `pnpm --filter @bingo/locales build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add packages/locales/src/langs/
git commit -m "feat(locales): add OAuth and social binding translations"
```

---

## Task 3: Create OAuth Icon Components

**Files:**

- Create: `apps/web/src/components/auth/oauth-icons/index.tsx`

**Step 1: Create the oauth-icons directory and index file**

```typescript
// ABOUTME: OAuth provider icon components
// ABOUTME: SVG icons for Google, GitHub, Apple, Microsoft, Discord, Twitter

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// Map provider name to icon component
export const providerIcons: Record<string, React.FC<{ className?: string }>> = {
  google: GoogleIcon,
  github: GitHubIcon,
  apple: AppleIcon,
  microsoft: MicrosoftIcon,
  discord: DiscordIcon,
  twitter: TwitterIcon,
}

export function getProviderIcon(provider: string): React.FC<{ className?: string }> | null {
  return providerIcons[provider.toLowerCase()] || null
}
```

**Step 2: Run TypeScript check**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/web/src/components/auth/oauth-icons/
git commit -m "feat(web): add OAuth provider icon components"
```

---

## Task 4: Create OAuth Session Storage Utilities

**Files:**

- Create: `apps/web/src/utils/oauth.ts`

**Step 1: Create OAuth utility functions**

```typescript
// ABOUTME: OAuth session storage utilities
// ABOUTME: Manages state, code verifier, and redirect info for OAuth flow

const OAUTH_STATE_KEY = 'oauth_state'
const OAUTH_CODE_VERIFIER_KEY = 'oauth_code_verifier'
const OAUTH_ACTION_KEY = 'oauth_action'
const OAUTH_REDIRECT_KEY = 'oauth_redirect'

export type OAuthAction = 'login' | 'bind'

export interface OAuthSession {
  state: string
  codeVerifier: string
  action: OAuthAction
  redirect: string
}

export function saveOAuthSession(session: OAuthSession): void {
  sessionStorage.setItem(OAUTH_STATE_KEY, session.state)
  sessionStorage.setItem(OAUTH_CODE_VERIFIER_KEY, session.codeVerifier)
  sessionStorage.setItem(OAUTH_ACTION_KEY, session.action)
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, session.redirect)
}

export function getOAuthSession(): OAuthSession | null {
  const state = sessionStorage.getItem(OAUTH_STATE_KEY)
  const codeVerifier = sessionStorage.getItem(OAUTH_CODE_VERIFIER_KEY)
  const action = sessionStorage.getItem(OAUTH_ACTION_KEY) as OAuthAction | null
  const redirect = sessionStorage.getItem(OAUTH_REDIRECT_KEY)

  if (!state || !codeVerifier || !action) {
    return null
  }

  return { state, codeVerifier, action, redirect: redirect || '/' }
}

export function clearOAuthSession(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_CODE_VERIFIER_KEY)
  sessionStorage.removeItem(OAUTH_ACTION_KEY)
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY)
}

export function validateOAuthState(urlState: string): boolean {
  const savedState = sessionStorage.getItem(OAUTH_STATE_KEY)
  return savedState === urlState
}
```

**Step 2: Run TypeScript check**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/web/src/utils/oauth.ts
git commit -m "feat(web): add OAuth session storage utilities"
```

---

## Task 5: Refactor OAuthButtons Component

**Files:**

- Modify: `apps/web/src/components/auth/OAuthButtons.tsx`

**Step 1: Rewrite OAuthButtons with dynamic provider loading**

Replace the entire file content:

```typescript
// ABOUTME: OAuth login buttons with dynamic provider loading
// ABOUTME: Fetches available providers from backend and renders buttons

import { useState, useEffect } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useTranslation } from '@/locales'
import { authApi, type AuthProvider } from '@bingo/core'
import { getProviderIcon } from './oauth-icons'
import { saveOAuthSession, type OAuthAction } from '@/utils/oauth'

interface OAuthButtonsProps {
  action?: OAuthAction
  redirectTo?: string
}

export function OAuthButtons({ action = 'login', redirectTo = '/' }: OAuthButtonsProps) {
  const { t } = useTranslation()
  const [providers, setProviders] = useState<AuthProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const data = await authApi.getProviders()
      setProviders(data)
    } catch {
      // Silently fail - just don't show OAuth buttons
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthClick = async (provider: AuthProvider) => {
    setLoadingProvider(provider.name)
    try {
      const response = await authApi.getOAuthUrl(provider.name)

      // Save OAuth session data
      saveOAuthSession({
        state: response.state,
        codeVerifier: response.codeVerifier,
        action,
        redirect: redirectTo,
      })

      // Redirect to OAuth provider
      window.location.href = response.authUrl
    } catch {
      // Error handled by request interceptor
      setLoadingProvider(null)
    }
  }

  // Don't render anything while loading or if no providers
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    )
  }

  if (providers.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => {
        const Icon = getProviderIcon(provider.name)
        const isCurrentLoading = loadingProvider === provider.name
        const isDisabled = loadingProvider !== null

        return (
          <Button
            key={provider.name}
            variant="bordered"
            radius="full"
            isLoading={isCurrentLoading}
            isDisabled={isDisabled && !isCurrentLoading}
            className="h-12 border-divider bg-content2 text-foreground"
            startContent={!isCurrentLoading && Icon ? <Icon className="h-5 w-5" /> : undefined}
            onPress={() => handleOAuthClick(provider)}
          >
            {t(`settings.security.socialAccounts.providers.${provider.name}`, provider.name)}
          </Button>
        )
      })}
    </div>
  )
}
```

**Step 2: Run TypeScript check**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/web/src/components/auth/OAuthButtons.tsx
git commit -m "feat(web): refactor OAuthButtons with dynamic provider loading"
```

---

## Task 6: Create OAuth Callback Page

**Files:**

- Create: `apps/web/src/pages/auth/OAuthCallback.tsx`
- Modify: `apps/web/src/pages/index.ts`
- Modify: `apps/web/src/routes/index.tsx`

**Step 1: Create OAuthCallback page component**

```typescript
// ABOUTME: OAuth callback handler page
// ABOUTME: Exchanges authorization code for token and redirects user

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import { Spinner, Button } from '@heroui/react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { authApi, useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { getOAuthSession, clearOAuthSession, validateOAuthState } from '@/utils/oauth'

type CallbackStatus = 'processing' | 'error'

export function OAuthCallbackPage() {
  const { t } = useTranslation()
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    const code = searchParams.get('code')
    const urlState = searchParams.get('state')
    const error = searchParams.get('error')

    // User cancelled authorization
    if (error) {
      navigate('/login', { replace: true })
      return
    }

    // Missing required parameters
    if (!code || !urlState || !provider) {
      setStatus('error')
      setErrorMessage(t('auth.login.oauthError'))
      return
    }

    // Validate state (CSRF protection)
    if (!validateOAuthState(urlState)) {
      setStatus('error')
      setErrorMessage(t('auth.login.invalidState'))
      clearOAuthSession()
      return
    }

    const session = getOAuthSession()
    if (!session) {
      setStatus('error')
      setErrorMessage(t('auth.login.invalidState'))
      return
    }

    try {
      const params = {
        code,
        state: urlState,
        codeVerifier: session.codeVerifier,
      }

      if (session.action === 'login') {
        const response = await authApi.oauthLogin(provider, params)
        setAuth(response.accessToken, response.expiresAt)
        toast.success(t('auth.login.success'))
        clearOAuthSession()
        navigate(session.redirect, { replace: true })
      } else {
        // Bind action
        await authApi.bindProvider(provider, params)
        const providerName = t(`settings.security.socialAccounts.providers.${provider}`, provider)
        toast.success(t('settings.security.socialAccounts.linkSuccess', { provider: providerName }))
        clearOAuthSession()
        navigate(session.redirect, { replace: true })
      }
    } catch (err) {
      setStatus('error')
      // Check for specific error codes
      const errorResponse = err as { reason?: string }
      if (errorResponse.reason === 'Unauthenticated.InvalidState') {
        setErrorMessage(t('auth.login.invalidState'))
      } else {
        setErrorMessage(t('auth.login.oauthError'))
      }
      clearOAuthSession()
    }
  }

  const handleBackToLogin = () => {
    navigate('/login', { replace: true })
  }

  if (status === 'processing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">{t('auth.login.processing')}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="size-8 text-danger" />
      </div>
      <div className="text-center">
        <h1 className="mb-2 text-xl font-bold">{t('auth.login.oauthError')}</h1>
        <p className="text-default-500">{errorMessage}</p>
      </div>
      <Button color="primary" radius="full" onPress={handleBackToLogin}>
        {t('auth.common.backToHome')}
      </Button>
    </div>
  )
}
```

**Step 2: Export OAuthCallbackPage from pages/index.ts**

Add to the exports in `apps/web/src/pages/index.ts`:

```typescript
export { OAuthCallbackPage } from './auth/OAuthCallback'
```

**Step 3: Add route to routes/index.tsx**

Add the import at the top:

```typescript
import {
  HomePage,
  AboutPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ErrorPage,
  ProfileSettingsPage,
  SecuritySettingsPage,
  OAuthCallbackPage,
} from '@/pages'
```

Add the route after `/forgot-password`:

```typescript
  { path: '/auth/callback/:provider', element: <OAuthCallbackPage />, errorElement: <ErrorPage /> },
```

**Step 4: Run TypeScript check**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add apps/web/src/pages/auth/OAuthCallback.tsx apps/web/src/pages/index.ts apps/web/src/routes/index.tsx
git commit -m "feat(web): add OAuth callback page and route"
```

---

## Task 7: Add Social Accounts Section to Security Page

**Files:**

- Modify: `apps/web/src/pages/settings/Security.tsx`

**Step 1: Add imports for social accounts**

Add to the imports at the top of the file:

```typescript
import { Link2, LinkIcon } from 'lucide-react'
import { type AuthProvider, type SocialBinding } from '@bingo/core'
import { getProviderIcon } from '@/components/auth/oauth-icons'
import { saveOAuthSession } from '@/utils/oauth'
```

**Step 2: Add state for social accounts**

Add after the existing state declarations (around line 42):

```typescript
const [providers, setProviders] = useState<AuthProvider[]>([])
const [bindings, setBindings] = useState<SocialBinding[]>([])
const [isLoadingProviders, setIsLoadingProviders] = useState(true)
const [unbindingProvider, setUnbindingProvider] = useState<string | null>(null)
const [linkingProvider, setLinkingProvider] = useState<string | null>(null)
```

**Step 3: Load providers and bindings**

Add the load function after `loadSecurityStatus`:

```typescript
const loadSocialData = async () => {
  try {
    const [providersData, bindingsData] = await Promise.all([authApi.getProviders(), authApi.getBindings()])
    setProviders(providersData)
    setBindings(bindingsData)
  } catch {
    // Error handled by request interceptor
  } finally {
    setIsLoadingProviders(false)
  }
}
```

Add call in the useEffect:

```typescript
useEffect(() => {
  loadSecurityStatus()
  loadSocialData()
}, [])
```

**Step 4: Add handler for linking**

```typescript
const handleLinkProvider = async (provider: AuthProvider) => {
  setLinkingProvider(provider.name)
  try {
    const response = await authApi.getOAuthUrl(provider.name)
    saveOAuthSession({
      state: response.state,
      codeVerifier: response.codeVerifier,
      action: 'bind',
      redirect: '/settings/security',
    })
    window.location.href = response.authUrl
  } catch {
    setLinkingProvider(null)
  }
}

const handleUnlinkProvider = async (providerName: string) => {
  setUnbindingProvider(providerName)
  try {
    await authApi.unbindProvider(providerName)
    const providerLabel = t(`settings.security.socialAccounts.providers.${providerName}`, providerName)
    toast.success(t('settings.security.socialAccounts.unlinkSuccess', { provider: providerLabel }))
    loadSocialData()
  } catch {
    // Error handled by request interceptor
  } finally {
    setUnbindingProvider(null)
  }
}
```

**Step 5: Add SocialAccountsSection component and render it**

Add the component at the end of the file (before the closing of the module):

```typescript
// Social Accounts Section
function SocialAccountsSection({
  providers,
  bindings,
  isLoading,
  linkingProvider,
  unbindingProvider,
  onLink,
  onUnlink,
}: {
  providers: AuthProvider[]
  bindings: SocialBinding[]
  isLoading: boolean
  linkingProvider: string | null
  unbindingProvider: string | null
  onLink: (provider: AuthProvider) => void
  onUnlink: (providerName: string) => void
}) {
  const { t } = useTranslation()

  const isBound = (providerName: string) => bindings.some((b) => b.provider === providerName)

  if (isLoading || providers.length === 0) {
    return null
  }

  return (
    <Card className="border border-divider bg-content1">
      <CardBody className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Link2 className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('settings.security.socialAccounts.title')}</h3>
            <p className="text-sm text-default-500">{t('settings.security.socialAccounts.description')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {providers.map((provider) => {
            const Icon = getProviderIcon(provider.name)
            const bound = isBound(provider.name)
            const isLinking = linkingProvider === provider.name
            const isUnbinding = unbindingProvider === provider.name
            const providerLabel = t(`settings.security.socialAccounts.providers.${provider.name}`, provider.name)

            return (
              <div
                key={provider.name}
                className="flex items-center justify-between rounded-lg border border-divider bg-content2 p-4"
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="size-6" />}
                  <span className="font-medium">{providerLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Chip
                    color={bound ? 'success' : 'default'}
                    variant="flat"
                    size="sm"
                    startContent={bound ? <CheckCircle size={12} /> : undefined}
                  >
                    {bound
                      ? t('settings.security.socialAccounts.linked')
                      : t('settings.security.socialAccounts.notLinked')}
                  </Chip>
                  {bound ? (
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      radius="full"
                      isLoading={isUnbinding}
                      onPress={() => onUnlink(provider.name)}
                    >
                      {t('settings.security.socialAccounts.unlink')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      radius="full"
                      isLoading={isLinking}
                      startContent={!isLinking && <LinkIcon size={14} />}
                      onPress={() => onLink(provider)}
                    >
                      {t('settings.security.socialAccounts.link')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
```

Add the section to the page JSX after TOTP section (around line 111):

```typescript
        {/* Social Accounts */}
        <SocialAccountsSection
          providers={providers}
          bindings={bindings}
          isLoading={isLoadingProviders}
          linkingProvider={linkingProvider}
          unbindingProvider={unbindingProvider}
          onLink={handleLinkProvider}
          onUnlink={handleUnlinkProvider}
        />
```

**Step 6: Run TypeScript check**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add apps/web/src/pages/settings/Security.tsx
git commit -m "feat(web): add social accounts section to security settings"
```

---

## Task 8: Update Component Exports

**Files:**

- Modify: `apps/web/src/components/auth/index.ts`

**Step 1: Add oauth-icons export**

Add the export line:

```typescript
export * from './oauth-icons'
```

**Step 2: Run build and test**

Run: `pnpm build && pnpm test`
Expected: Build and tests pass

**Step 3: Commit**

```bash
git add apps/web/src/components/auth/index.ts
git commit -m "feat(web): export oauth-icons from auth components"
```

---

## Task 9: Final Verification

**Step 1: Run full build**

Run: `pnpm build`
Expected: All packages build successfully

**Step 2: Run linter**

Run: `pnpm lint`
Expected: No linting errors

**Step 3: Run tests**

Run: `pnpm test`
Expected: All tests pass

**Step 4: Manual verification checklist**

- [ ] Login page shows OAuth buttons when providers are available
- [ ] Clicking OAuth button redirects to provider
- [ ] OAuth callback handles success/error appropriately
- [ ] Security settings page shows social accounts section
- [ ] Can link/unlink social accounts

**Step 5: Create summary commit**

If any fixes were needed during verification, commit them now.
