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
