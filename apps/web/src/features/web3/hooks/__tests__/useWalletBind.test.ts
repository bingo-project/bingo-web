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
})
