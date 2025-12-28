// ABOUTME: Unit tests for useWalletLogin hook
// ABOUTME: Tests wallet connection and login flow states

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
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

// Mock auth API and store
vi.mock('@bingo/core', () => ({
  authApi: {
    getNonce: vi.fn(),
    walletLogin: vi.fn(),
  },
  useAuthStore: vi.fn(() => ({
    setAuth: vi.fn(),
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
})
