// ABOUTME: Wagmi and React Query provider for Web3 features
// ABOUTME: Wraps children with necessary context providers

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider as WagmiProviderBase } from 'wagmi'
import { wagmiConfig } from './config'

const queryClient = new QueryClient()

interface Props {
  children: React.ReactNode
}

export function WagmiProvider({ children }: Props) {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  )
}
