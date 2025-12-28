// ABOUTME: React hooks for WebSocket functionality
// ABOUTME: Provides useWebSocketStatus hook for connection state access

import { useWebSocketStore } from './store'
import type { ConnectionState } from './types'

export function useWebSocketStatus(): ConnectionState | null {
  return useWebSocketStore((state) => state.status)
}
