// ABOUTME: wagmi configuration for wallet connections
// ABOUTME: Configures supported chains, connectors, and transports

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), ...(projectId ? [walletConnect({ projectId }), coinbaseWallet({ appName: 'Bingo' })] : [])],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
