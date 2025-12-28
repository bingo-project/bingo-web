// ABOUTME: OAuth callback page that handles provider redirects
// ABOUTME: Validates state, exchanges code for token, and redirects user

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import { Spinner } from '@heroui/react'
import { toast } from 'sonner'
import { authApi, useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { getOAuthSession, clearOAuthSession, validateOAuthState } from '@/utils/oauth'

// Module-level flag to prevent duplicate processing across StrictMode remounts
let isCallbackProcessed = false

type CallbackStatus = 'processing' | 'error'

export function OAuthCallbackPage() {
  const { t } = useTranslation()
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [status, setStatus] = useState<CallbackStatus>('processing')

  useEffect(() => {
    if (isCallbackProcessed) return
    isCallbackProcessed = true
    handleCallback()

    return () => {
      // Reset flag when navigating away (not on StrictMode unmount)
      setTimeout(() => {
        isCallbackProcessed = false
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCallback = async () => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth provider errors (e.g., user cancelled)
    if (error) {
      toast.error(t('auth.login.oauthCancelled'))
      navigate('/login', { replace: true })
      return
    }

    // Validate required parameters
    if (!code || !state || !provider) {
      toast.error(t('auth.login.oauthError'))
      navigate('/login', { replace: true })
      return
    }

    // Validate state against stored session (CSRF protection)
    if (!validateOAuthState(state)) {
      toast.error(t('auth.login.invalidState'))
      clearOAuthSession()
      navigate('/login', { replace: true })
      return
    }

    const session = getOAuthSession()
    if (!session) {
      toast.error(t('auth.login.invalidState'))
      navigate('/login', { replace: true })
      return
    }

    // Clear session immediately to prevent duplicate API calls
    const { action, redirect, codeVerifier } = session
    clearOAuthSession()

    try {
      const params: { code: string; state: string; codeVerifier?: string } = {
        code,
        state,
      }

      // Only include codeVerifier if present (not all providers support PKCE)
      if (codeVerifier) {
        params.codeVerifier = codeVerifier
      }

      if (action === 'login') {
        // OAuth login
        const response = await authApi.oauthLogin(provider, params)
        await setAuth(response.accessToken, response.expiresAt)
        toast.success(t('auth.login.success'))
        navigate(redirect, { replace: true })
      } else {
        // Bind social account
        await authApi.bindProvider(provider, params)
        const providerName = t(`settings.security.socialAccounts.providers.${provider}`, provider)
        toast.success(t('settings.security.socialAccounts.linkSuccess', { provider: providerName }))
        navigate(redirect, { replace: true })
      }
    } catch {
      // Error toast is handled by request interceptor
      setStatus('error')

      // Redirect based on action
      if (action === 'login') {
        navigate('/login', { replace: true })
      } else {
        navigate('/settings/security', { replace: true })
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {status === 'processing' && (
          <>
            <Spinner size="lg" />
            <p className="text-default-500">{t('auth.login.processing')}</p>
          </>
        )}
      </div>
    </div>
  )
}
