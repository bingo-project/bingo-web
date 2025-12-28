// ABOUTME: Hook for wallet login flow
// ABOUTME: Handles connect, sign message, and login API call

import { useState, useCallback } from 'react'
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { authApi, useAuthStore } from '@bingo/core'

export type WalletLoginStep = 'idle' | 'connecting' | 'signing' | 'verifying' | 'success' | 'error'

interface UseWalletLoginOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useWalletLogin(options: UseWalletLoginOptions = {}) {
  const [step, setStep] = useState<WalletLoginStep>('idle')
  const [error, setError] = useState<Error | null>(null)

  const { connectors, connectAsync } = useConnect()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnectAsync } = useDisconnect()
  const { setAuth } = useAuthStore()

  const login = useCallback(
    async (connectorId?: string) => {
      try {
        setStep('connecting')
        setError(null)

        // Find connector
        const connector = connectorId ? connectors.find((c) => c.id === connectorId) : connectors[0]

        if (!connector) {
          throw new Error('No wallet connector available')
        }

        // Connect wallet
        const result = await connectAsync({ connector })
        const walletAddress = result.accounts[0]

        if (!walletAddress) {
          throw new Error('No address returned from wallet')
        }

        // Get nonce from backend
        setStep('signing')
        const nonceResponse = await authApi.getNonce(walletAddress)

        // Sign message
        const signature = await signMessageAsync({
          message: nonceResponse.message,
        })

        // Verify signature with backend
        setStep('verifying')
        const loginResponse = await authApi.walletLogin({
          message: nonceResponse.message,
          signature,
        })

        // Save token and fetch user info
        await setAuth(loginResponse.accessToken, loginResponse.expiresAt)

        setStep('success')
        options.onSuccess?.()
      } catch (err) {
        setStep('error')
        const error = err instanceof Error ? err : new Error('Wallet login failed')
        setError(error)
        options.onError?.(error)

        // Disconnect on error
        if (isConnected) {
          await disconnectAsync().catch(() => {})
        }
      }
    },
    [connectors, connectAsync, signMessageAsync, disconnectAsync, setAuth, isConnected, options]
  )

  const reset = useCallback(() => {
    setStep('idle')
    setError(null)
  }, [])

  return {
    step,
    error,
    login,
    reset,
    connectors,
    address,
    isConnected,
  }
}
