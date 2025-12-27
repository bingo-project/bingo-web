// ABOUTME: OAuth callback page that handles provider redirects
// ABOUTME: Validates state, exchanges code for token, and redirects user

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import { Spinner } from '@heroui/react'
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

  useEffect(() => {
    handleCallback()
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

    try {
      const params = {
        code,
        state,
        codeVerifier: session.codeVerifier,
      }

      if (session.action === 'login') {
        // OAuth login
        const response = await authApi.oauthLogin(provider, params)
        await setAuth(response.accessToken, response.expiresAt)
        clearOAuthSession()
        toast.success(t('auth.login.success'))
        navigate(session.redirect, { replace: true })
      } else {
        // Bind social account
        await authApi.bindProvider(provider, params)
        clearOAuthSession()
        const providerName = t(`settings.security.socialAccounts.providers.${provider}`, provider)
        toast.success(t('settings.security.socialAccounts.linkSuccess', { provider: providerName }))
        navigate(session.redirect, { replace: true })
      }
    } catch {
      // Error is handled by request interceptor, show generic message
      setStatus('error')
      clearOAuthSession()
      toast.error(t('auth.login.oauthError'))

      // Redirect based on action
      if (session.action === 'login') {
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
