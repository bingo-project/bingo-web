// ABOUTME: Hook for wallet binding flow in settings
// ABOUTME: Handles connect, sign message, and bind API call

import { useState, useCallback } from 'react'
import { useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { authApi } from '@bingo/core'

export type WalletBindStep = 'idle' | 'connecting' | 'signing' | 'binding' | 'success' | 'error'

interface UseWalletBindOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useWalletBind(options: UseWalletBindOptions = {}) {
  const [step, setStep] = useState<WalletBindStep>('idle')
  const [error, setError] = useState<Error | null>(null)

  const { connectors: rawConnectors, connectAsync } = useConnect()
  const { signMessageAsync } = useSignMessage()
  const { disconnectAsync } = useDisconnect()

  // Filter duplicate connectors (injected vs metaMask both point to MetaMask)
  const connectors = rawConnectors.filter((connector) => {
    if (connector.id === 'injected') {
      return !rawConnectors.some((c) => c.id === 'metaMask')
    }
    return true
  })

  const bind = useCallback(
    async (connectorId?: string) => {
      try {
        setStep('connecting')
        setError(null)

        const connector = connectorId ? connectors.find((c) => c.id === connectorId) : connectors[0]
        if (!connector) {
          throw new Error('No wallet connector available')
        }

        const result = await connectAsync({ connector })
        const walletAddress = result.accounts[0]
        if (!walletAddress) {
          throw new Error('No address returned from wallet')
        }

        setStep('signing')
        const nonceResponse = await authApi.getNonce(walletAddress)

        const signature = await signMessageAsync({
          message: nonceResponse.message,
        })

        setStep('binding')
        await authApi.bindWallet({
          message: nonceResponse.message,
          signature,
        })

        // Disconnect wallet after binding (we only needed the signature)
        await disconnectAsync().catch(() => {})

        setStep('success')
        options.onSuccess?.()
      } catch (err) {
        setStep('error')
        const error = err instanceof Error ? err : new Error('Wallet binding failed')
        setError(error)
        options.onError?.(error)
        await disconnectAsync().catch(() => {})
      }
    },
    [connectors, connectAsync, signMessageAsync, disconnectAsync, options]
  )

  const reset = useCallback(() => {
    setStep('idle')
    setError(null)
  }, [])

  return { step, error, bind, reset, connectors }
}
