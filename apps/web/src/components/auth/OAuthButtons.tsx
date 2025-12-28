// ABOUTME: OAuth login buttons with dynamic provider loading
// ABOUTME: Fetches available providers from backend and renders buttons

import { useState, useEffect, lazy, Suspense } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useTranslation } from '@/locales'
import { authApi, type AuthProvider } from '@bingo/core'
import { getProviderIcon } from './oauth-icons'
import { saveOAuthSession, type OAuthAction } from '@/utils/oauth'

// Lazy load WalletLoginButton
const WalletLoginButton = lazy(() => import('@/features/web3').then((m) => ({ default: m.WalletLoginButton })))

interface OAuthButtonsProps {
  action?: OAuthAction
  redirectTo?: string
}

export function OAuthButtons({ action = 'login', redirectTo = '/' }: OAuthButtonsProps) {
  const { t } = useTranslation()
  const [providers, setProviders] = useState<AuthProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [hasWallet, setHasWallet] = useState(false)

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const data = await authApi.getProviders()
      const providerList = Array.isArray(data) ? data : []

      // Separate wallet from OAuth providers
      const walletProvider = providerList.find((p) => p.name === 'wallet')
      const oauthProviders = providerList.filter((p) => p.name !== 'wallet')

      setProviders(oauthProviders)
      setHasWallet(!!walletProvider)
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

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    )
  }

  // No providers at all
  if (providers.length === 0 && !hasWallet) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* OAuth buttons */}
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

      {/* Wallet login button (lazy loaded) */}
      {hasWallet && (
        <Suspense
          fallback={
            <Button
              variant="bordered"
              radius="full"
              isLoading
              className="h-12 border-divider bg-content2 text-foreground"
            />
          }
        >
          <WalletLoginButton redirectTo={redirectTo} disabled={loadingProvider !== null} />
        </Suspense>
      )}
    </div>
  )
}
