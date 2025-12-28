# Web3 钱包登录实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为前端添加 Web3 钱包登录功能，支持 MetaMask、WalletConnect、Coinbase Wallet

**Architecture:** 使用 wagmi v2 + viem 作为钱包连接库，Web3 模块作为独立 feature 按需加载。钱包登录按钮与 OAuth 按钮并列展示，通过后端 providers 配置控制是否显示。

**Tech Stack:** wagmi v2, viem, @tanstack/react-query, HeroUI

**Design Doc:** [2025-12-28-web3-wallet-login-design.md](./2025-12-28-web3-wallet-login-design.md)

---

## Phase 1: 基础设施

### Task 1: 安装依赖

**Files:**

- Modify: `apps/web/package.json`

**Step 1: 安装 wagmi 和相关依赖**

```bash
pnpm --filter @bingo/web add wagmi viem @tanstack/react-query
```

**Step 2: 验证安装**

```bash
pnpm --filter @bingo/web list wagmi viem @tanstack/react-query
```

Expected: 显示已安装的版本

**Step 3: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "chore(web): add wagmi, viem, and react-query dependencies"
```

---

### Task 2: 添加环境变量

**Files:**

- Modify: `apps/web/.env.example`

**Step 1: 添加 WalletConnect projectId 环境变量**

在 `.env.example` 添加：

```env
# Web3 Wallet Connect
VITE_WALLETCONNECT_PROJECT_ID=
```

**Step 2: Commit**

```bash
git add apps/web/.env.example
git commit -m "chore(web): add WalletConnect projectId env variable"
```

---

### Task 3: 扩展 API 类型和方法

**Files:**

- Modify: `packages/core/src/api/auth.ts`

**Step 1: 添加 Web3 登录相关类型和 API 方法**

在 `auth.ts` 中添加：

```typescript
// Web3 Login
export interface NonceResponse {
  message: string
  nonce: string
}

export interface WalletLoginRequest {
  message: string
  signature: string
}
```

在 `authApi` 对象中添加：

```typescript
  // Web3 Login
  getNonce: (address: string) =>
    request.get<NonceResponse>('/v1/auth/nonce', { params: { address } }),

  walletLogin: (data: WalletLoginRequest) =>
    request.post<LoginResponse>('/v1/auth/login/address', data),

  // Web3 Binding
  bindWallet: (data: WalletLoginRequest) =>
    request.post<void>('/v1/auth/bindings/wallet', data),
```

**Step 2: 验证类型正确**

```bash
pnpm --filter @bingo/core build
```

Expected: 编译成功

**Step 3: Commit**

```bash
git add packages/core/src/api/auth.ts
git commit -m "feat(core): add Web3 wallet login API methods"
```

---

## Phase 2: Web3 Feature 模块（Hooks）

### Task 4: 创建 wagmi 配置

**Files:**

- Create: `apps/web/src/features/web3/config.ts`

**Step 1: 创建 wagmi 配置文件**

```typescript
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
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/config.ts
git commit -m "feat(web): add wagmi configuration"
```

---

### Task 5: 创建 WagmiProvider

**Files:**

- Create: `apps/web/src/features/web3/WagmiProvider.tsx`

**Step 1: 创建 Provider 组件**

```typescript
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
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/WagmiProvider.tsx
git commit -m "feat(web): add WagmiProvider component"
```

---

### Task 6: 创建 useWalletLogin hook

**Files:**

- Create: `apps/web/src/features/web3/hooks/useWalletLogin.ts`

**Step 1: 创建钱包登录 hook**

```typescript
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
  const { setToken, fetchUserInfo } = useAuthStore()

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
        setToken(loginResponse.accessToken, loginResponse.expiresAt)
        await fetchUserInfo()

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
    [connectors, connectAsync, signMessageAsync, disconnectAsync, setToken, fetchUserInfo, isConnected, options]
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
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/hooks/useWalletLogin.ts
git commit -m "feat(web): add useWalletLogin hook"
```

---

### Task 7: 创建 useWalletBind hook

**Files:**

- Create: `apps/web/src/features/web3/hooks/useWalletBind.ts`

**Step 1: 创建钱包绑定 hook**

```typescript
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

  const { connectors, connectAsync } = useConnect()
  const { signMessageAsync } = useSignMessage()
  const { disconnectAsync } = useDisconnect()

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
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/hooks/useWalletBind.ts
git commit -m "feat(web): add useWalletBind hook"
```

---

## Phase 3: Web3 Feature 模块（UI 组件）

### Task 8: 创建 WalletSelectModal 组件

**Files:**

- Create: `apps/web/src/features/web3/WalletSelectModal.tsx`

**Step 1: 创建钱包选择弹窗**

```typescript
// ABOUTME: Modal for selecting wallet type
// ABOUTME: Displays available wallet connectors with loading states

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from '@heroui/react'
import { useTranslation } from '@/locales'
import type { Connector } from 'wagmi'
import type { WalletLoginStep } from './hooks/useWalletLogin'
import type { WalletBindStep } from './hooks/useWalletBind'

type WalletStep = WalletLoginStep | WalletBindStep

interface Props {
  isOpen: boolean
  onClose: () => void
  connectors: readonly Connector[]
  step: WalletStep
  onSelectConnector: (connectorId: string) => void
}

const connectorIcons: Record<string, string> = {
  injected: '🦊',
  metaMask: '🦊',
  walletConnect: '🔗',
  coinbaseWalletSDK: '💰',
}

const connectorNames: Record<string, string> = {
  injected: 'MetaMask',
  metaMask: 'MetaMask',
  walletConnect: 'WalletConnect',
  coinbaseWalletSDK: 'Coinbase Wallet',
}

export function WalletSelectModal({
  isOpen,
  onClose,
  connectors,
  step,
  onSelectConnector,
}: Props) {
  const { t } = useTranslation()
  const isLoading = step === 'connecting' || step === 'signing' || step === 'verifying' || step === 'binding'

  const getStepMessage = () => {
    switch (step) {
      case 'connecting':
        return t('auth.wallet.connectingWallet')
      case 'signing':
        return t('auth.wallet.signingMessage')
      case 'verifying':
      case 'binding':
        return t('auth.login.processing')
      default:
        return null
    }
  }

  const stepMessage = getStepMessage()

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()} size="sm" placement="center">
      <ModalContent>
        <ModalHeader>{t('auth.wallet.selectWallet')}</ModalHeader>
        <ModalBody className="pb-6">
          {stepMessage ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner size="lg" />
              <p className="text-default-500">{stepMessage}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="bordered"
                  radius="lg"
                  className="h-14 justify-start gap-4 border-divider bg-content2 px-4"
                  onPress={() => onSelectConnector(connector.id)}
                >
                  <span className="text-2xl">{connectorIcons[connector.id] || '👛'}</span>
                  <span className="font-medium">
                    {connectorNames[connector.id] || connector.name}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/WalletSelectModal.tsx
git commit -m "feat(web): add WalletSelectModal component"
```

---

### Task 9: 创建 WalletLoginButton 组件

**Files:**

- Create: `apps/web/src/features/web3/WalletLoginButton.tsx`

**Step 1: 创建钱包登录按钮**

```typescript
// ABOUTME: Wallet login button with modal integration
// ABOUTME: Handles the complete wallet login flow

import { useState } from 'react'
import { Button, useDisclosure } from '@heroui/react'
import { Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useTranslation } from '@/locales'
import { WagmiProvider } from './WagmiProvider'
import { WalletSelectModal } from './WalletSelectModal'
import { useWalletLogin } from './hooks/useWalletLogin'

interface Props {
  redirectTo?: string
  disabled?: boolean
}

function WalletLoginButtonInner({ redirectTo = '/', disabled }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const modal = useDisclosure()
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const { step, login, reset, connectors } = useWalletLogin({
    onSuccess: () => {
      toast.success(t('auth.login.success'))
      modal.onClose()
      navigate(redirectTo)
    },
    onError: (error) => {
      // Check for user rejection
      if (error.message.includes('rejected') || error.message.includes('denied')) {
        toast.error(t('auth.wallet.userRejectedConnection'))
      } else {
        toast.error(t('auth.wallet.walletLoginFailed'))
      }
      reset()
    },
  })

  const handleButtonClick = () => {
    setIsButtonLoading(true)
    modal.onOpen()
    setIsButtonLoading(false)
  }

  const handleSelectConnector = (connectorId: string) => {
    login(connectorId)
  }

  const handleClose = () => {
    reset()
    modal.onClose()
  }

  return (
    <>
      <Button
        variant="bordered"
        radius="full"
        isLoading={isButtonLoading}
        isDisabled={disabled}
        className="h-12 border-divider bg-content2 text-foreground"
        startContent={!isButtonLoading && <Wallet className="h-5 w-5" />}
        onPress={handleButtonClick}
      >
        {t('auth.wallet.walletLogin')}
      </Button>

      <WalletSelectModal
        isOpen={modal.isOpen}
        onClose={handleClose}
        connectors={connectors}
        step={step}
        onSelectConnector={handleSelectConnector}
      />
    </>
  )
}

export function WalletLoginButton(props: Props) {
  return (
    <WagmiProvider>
      <WalletLoginButtonInner {...props} />
    </WagmiProvider>
  )
}
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/WalletLoginButton.tsx
git commit -m "feat(web): add WalletLoginButton component"
```

---

### Task 10: 创建 feature 模块入口

**Files:**

- Create: `apps/web/src/features/web3/index.ts`

**Step 1: 创建导出入口**

```typescript
// ABOUTME: Web3 feature module entry point
// ABOUTME: Exports all Web3 related components and hooks

export { WalletLoginButton } from './WalletLoginButton'
export { WagmiProvider } from './WagmiProvider'
export { WalletSelectModal } from './WalletSelectModal'
export { useWalletLogin } from './hooks/useWalletLogin'
export { useWalletBind } from './hooks/useWalletBind'
export type { WalletLoginStep } from './hooks/useWalletLogin'
export type { WalletBindStep } from './hooks/useWalletBind'
```

**Step 2: Commit**

```bash
git add apps/web/src/features/web3/index.ts
git commit -m "feat(web): add web3 feature module entry"
```

---

## Phase 4: 集成到登录页

### Task 11: 添加钱包图标

**Files:**

- Modify: `apps/web/src/components/auth/oauth-icons/index.tsx`

**Step 1: 添加钱包图标到 providerIcons**

在文件末尾的 `providerIcons` 对象中添加 wallet：

```typescript
import { Wallet } from 'lucide-react'

// 在 providerIcons 对象中添加：
export const providerIcons: Record<string, React.FC<{ className?: string }>> = {
  google: GoogleIcon,
  github: GitHubIcon,
  apple: AppleIcon,
  microsoft: MicrosoftIcon,
  discord: DiscordIcon,
  twitter: TwitterIcon,
  wallet: ({ className }) => <Wallet className={className} />,
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/auth/oauth-icons/index.tsx
git commit -m "feat(web): add wallet icon to provider icons"
```

---

### Task 12: 修改 OAuthButtons 支持钱包登录

**Files:**

- Modify: `apps/web/src/components/auth/OAuthButtons.tsx`

**Step 1: 添加动态加载钱包按钮**

修改 `OAuthButtons.tsx`，在 OAuth 按钮列表后动态加载钱包按钮：

```typescript
// ABOUTME: OAuth login buttons with dynamic provider loading
// ABOUTME: Fetches available providers from backend and renders buttons

import { useState, useEffect, lazy, Suspense } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useTranslation } from '@/locales'
import { authApi, type AuthProvider } from '@bingo/core'
import { getProviderIcon } from './oauth-icons'
import { saveOAuthSession, type OAuthAction } from '@/utils/oauth'

// Lazy load WalletLoginButton
const WalletLoginButton = lazy(() =>
  import('@/features/web3').then((m) => ({ default: m.WalletLoginButton }))
)

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
```

**Step 2: 验证编译**

```bash
pnpm --filter @bingo/web build
```

Expected: 编译成功

**Step 3: Commit**

```bash
git add apps/web/src/components/auth/OAuthButtons.tsx
git commit -m "feat(web): integrate wallet login into OAuthButtons"
```

---

## Phase 5: 国际化

### Task 13: 添加中文翻译

**Files:**

- Modify: `packages/locales/src/langs/zh-CN/auth.json`

**Step 1: 添加钱包登录相关翻译**

在 `auth.json` 中添加 `wallet` 对象：

```json
{
  "wallet": {
    "walletLogin": "钱包登录",
    "selectWallet": "选择钱包",
    "connectingWallet": "正在连接...",
    "signingMessage": "请在钱包中签名...",
    "walletLoginFailed": "钱包登录失败",
    "userRejectedConnection": "已取消连接",
    "userRejectedSign": "已取消签名",
    "bindWallet": "绑定钱包",
    "unbindWallet": "解绑钱包",
    "walletAddress": "钱包地址",
    "unbindWalletConfirm": "确定解绑该钱包地址吗？"
  }
}
```

**Step 2: Commit**

```bash
git add packages/locales/src/langs/zh-CN/auth.json
git commit -m "feat(locales): add Chinese translations for wallet login"
```

---

### Task 14: 添加英文翻译

**Files:**

- Modify: `packages/locales/src/langs/en-US/auth.json`

**Step 1: 添加钱包登录相关翻译**

在 `auth.json` 中添加 `wallet` 对象：

```json
{
  "wallet": {
    "walletLogin": "Wallet Login",
    "selectWallet": "Select Wallet",
    "connectingWallet": "Connecting...",
    "signingMessage": "Please sign in your wallet...",
    "walletLoginFailed": "Wallet login failed",
    "userRejectedConnection": "Connection cancelled",
    "userRejectedSign": "Signature cancelled",
    "bindWallet": "Link Wallet",
    "unbindWallet": "Unlink",
    "walletAddress": "Wallet Address",
    "unbindWalletConfirm": "Are you sure you want to unlink this wallet?"
  }
}
```

**Step 2: Commit**

```bash
git add packages/locales/src/langs/en-US/auth.json
git commit -m "feat(locales): add English translations for wallet login"
```

---

## Phase 6: 设置页钱包绑定

### Task 15: 创建 WalletBindSection 组件

**Files:**

- Create: `apps/web/src/features/web3/WalletBindSection.tsx`

**Step 1: 创建钱包绑定区块组件**

```typescript
// ABOUTME: Wallet binding section for security settings
// ABOUTME: Allows users to link/unlink wallet address

import { useState } from 'react'
import { Button, Card, CardBody, Chip, useDisclosure } from '@heroui/react'
import { Wallet, CheckCircle, LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/locales'
import { authApi, type SocialBinding } from '@bingo/core'
import { WagmiProvider } from './WagmiProvider'
import { WalletSelectModal } from './WalletSelectModal'
import { useWalletBind } from './hooks/useWalletBind'

interface Props {
  binding: SocialBinding | undefined
  onBindingChange: () => void
}

function WalletBindSectionInner({ binding, onBindingChange }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()
  const [isUnbinding, setIsUnbinding] = useState(false)

  const { step, connectors, bind, reset } = useWalletBind({
    onSuccess: () => {
      toast.success(t('settings.security.socialAccounts.linkSuccess', { provider: t('auth.wallet.walletAddress') }))
      modal.onClose()
      onBindingChange()
    },
    onError: (error) => {
      if (error.message.includes('rejected') || error.message.includes('denied')) {
        toast.error(t('auth.wallet.userRejectedConnection'))
      } else {
        toast.error(t('auth.wallet.walletLoginFailed'))
      }
      reset()
    },
  })

  const handleBind = () => {
    modal.onOpen()
  }

  const handleSelectConnector = (connectorId: string) => {
    bind(connectorId)
  }

  const handleUnbind = async () => {
    setIsUnbinding(true)
    try {
      await authApi.unbindProvider('wallet')
      toast.success(t('settings.security.socialAccounts.unlinkSuccess', { provider: t('auth.wallet.walletAddress') }))
      onBindingChange()
    } catch {
      // Error handled by request interceptor
    } finally {
      setIsUnbinding(false)
    }
  }

  const handleClose = () => {
    reset()
    modal.onClose()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      <Card className="border border-divider bg-content1">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{t('auth.wallet.walletAddress')}</h3>
                <p className="text-sm text-default-500">
                  {binding ? truncateAddress(binding.accountId) : t('settings.security.socialAccounts.notLinked')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Chip
                color={binding ? 'success' : 'default'}
                variant="flat"
                size="sm"
                startContent={binding ? <CheckCircle size={12} /> : undefined}
              >
                {binding ? t('settings.security.socialAccounts.linked') : t('settings.security.socialAccounts.notLinked')}
              </Chip>
              {binding ? (
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  radius="full"
                  isLoading={isUnbinding}
                  onPress={handleUnbind}
                >
                  {t('settings.security.socialAccounts.unlink')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  radius="full"
                  startContent={<LinkIcon size={14} />}
                  onPress={handleBind}
                >
                  {t('settings.security.socialAccounts.link')}
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <WalletSelectModal
        isOpen={modal.isOpen}
        onClose={handleClose}
        connectors={connectors}
        step={step}
        onSelectConnector={handleSelectConnector}
      />
    </>
  )
}

export function WalletBindSection(props: Props) {
  return (
    <WagmiProvider>
      <WalletBindSectionInner {...props} />
    </WagmiProvider>
  )
}
```

**Step 2: 导出组件**

在 `apps/web/src/features/web3/index.ts` 添加：

```typescript
export { WalletBindSection } from './WalletBindSection'
```

**Step 3: Commit**

```bash
git add apps/web/src/features/web3/WalletBindSection.tsx apps/web/src/features/web3/index.ts
git commit -m "feat(web): add WalletBindSection component"
```

---

### Task 16: 集成到 Security 页面

**Files:**

- Modify: `apps/web/src/pages/settings/Security.tsx`

**Step 1: 添加钱包绑定区块**

在 Security.tsx 中：

1. 添加 import：

```typescript
import { lazy, Suspense } from 'react'

// Lazy load WalletBindSection
const WalletBindSection = lazy(() => import('@/features/web3').then((m) => ({ default: m.WalletBindSection })))
```

2. 在 `SecuritySettingsPage` 组件中添加状态来追踪是否有 wallet provider：

```typescript
const [hasWalletProvider, setHasWalletProvider] = useState(false)
```

3. 修改 `loadSocialData` 函数：

```typescript
const loadSocialData = async () => {
  try {
    const [providersData, bindingsData] = await Promise.all([authApi.getProviders(), authApi.getBindings()])
    const providerList = Array.isArray(providersData) ? providersData : []

    // Check for wallet provider
    setHasWalletProvider(providerList.some((p) => p.name === 'wallet'))

    // Filter out wallet from OAuth providers
    setProviders(providerList.filter((p) => p.name !== 'wallet'))
    setBindings(Array.isArray(bindingsData) ? bindingsData : [])
  } catch {
    // Error handled by request interceptor
  } finally {
    setIsLoadingProviders(false)
  }
}
```

4. 在 `SocialAccountsSection` 后添加钱包绑定区块：

```typescript
{/* Wallet Binding */}
{hasWalletProvider && !isLoadingProviders && (
  <Suspense fallback={<Card className="border border-divider bg-content1"><CardBody className="p-6"><Spinner /></CardBody></Card>}>
    <WalletBindSection
      binding={bindings.find((b) => b.provider === 'wallet')}
      onBindingChange={loadSocialData}
    />
  </Suspense>
)}
```

**Step 2: 验证编译**

```bash
pnpm --filter @bingo/web build
```

Expected: 编译成功

**Step 3: Commit**

```bash
git add apps/web/src/pages/settings/Security.tsx
git commit -m "feat(web): integrate wallet binding into Security page"
```

---

## Phase 7: 测试

### Task 17: 为 hooks 添加单元测试

**Files:**

- Create: `apps/web/src/features/web3/hooks/__tests__/useWalletLogin.test.ts`
- Create: `apps/web/src/features/web3/hooks/__tests__/useWalletBind.test.ts`

**Step 1: 创建 useWalletLogin 测试**

```typescript
// ABOUTME: Unit tests for useWalletLogin hook
// ABOUTME: Tests wallet connection and login flow states

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWalletLogin } from '../useWalletLogin'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useConnect: vi.fn(() => ({
    connectors: [{ id: 'injected', name: 'MetaMask' }],
    connectAsync: vi.fn(),
  })),
  useAccount: vi.fn(() => ({
    address: undefined,
    isConnected: false,
  })),
  useSignMessage: vi.fn(() => ({
    signMessageAsync: vi.fn(),
  })),
  useDisconnect: vi.fn(() => ({
    disconnectAsync: vi.fn(),
  })),
}))

// Mock auth API
vi.mock('@bingo/core', () => ({
  authApi: {
    getNonce: vi.fn(),
    walletLogin: vi.fn(),
  },
  useAuthStore: vi.fn(() => ({
    setToken: vi.fn(),
    fetchUserInfo: vi.fn(),
  })),
}))

describe('useWalletLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useWalletLogin())

    expect(result.current.step).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.connectors).toHaveLength(1)
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useWalletLogin())

    act(() => {
      result.current.reset()
    })

    expect(result.current.step).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  // Add more tests for login flow, error handling, etc.
})
```

**Step 2: 创建 useWalletBind 测试**

```typescript
// ABOUTME: Unit tests for useWalletBind hook
// ABOUTME: Tests wallet connection and binding flow states

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWalletBind } from '../useWalletBind'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useConnect: vi.fn(() => ({
    connectors: [{ id: 'injected', name: 'MetaMask' }],
    connectAsync: vi.fn(),
  })),
  useSignMessage: vi.fn(() => ({
    signMessageAsync: vi.fn(),
  })),
  useDisconnect: vi.fn(() => ({
    disconnectAsync: vi.fn(),
  })),
}))

// Mock auth API
vi.mock('@bingo/core', () => ({
  authApi: {
    getNonce: vi.fn(),
    bindWallet: vi.fn(),
  },
}))

describe('useWalletBind', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useWalletBind())

    expect(result.current.step).toBe('idle')
    expect(result.current.error).toBeNull()
    expect(result.current.connectors).toHaveLength(1)
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useWalletBind())

    act(() => {
      result.current.reset()
    })

    expect(result.current.step).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  // Add more tests for bind flow, error handling, etc.
})
```

**Step 3: 运行测试**

```bash
pnpm --filter @bingo/web test -- --run src/features/web3
```

Expected: 测试通过

**Step 4: Commit**

```bash
git add apps/web/src/features/web3/hooks/__tests__/
git commit -m "test(web): add unit tests for wallet hooks"
```

---

## Phase 8: 最终验证

### Task 18: 完整构建验证

**Step 1: 运行完整构建**

```bash
pnpm build
```

Expected: 所有包构建成功

**Step 2: 检查 Web3 模块是否独立打包**

```bash
ls -la apps/web/dist/assets/ | grep -i web3
```

Expected: 应该看到独立的 chunk 文件

**Step 3: Commit (如有修改)**

如果有任何修复，提交它们。

---

## 依赖项

- **后端要求：** 需要后端实现 SIWE 标准的 API（参见设计文档中的后端修改计划）
- **环境变量：** 需要配置 `VITE_WALLETCONNECT_PROJECT_ID`（可选，不配置则只支持 injected wallets）
