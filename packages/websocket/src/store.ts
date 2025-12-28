// ABOUTME: WebSocket connection state store using Zustand
// ABOUTME: Provides reactive state for connection status across components

import { create } from 'zustand'
import type { ConnectionState } from './types'

interface WebSocketStore {
  status: ConnectionState | null
  setStatus: (status: ConnectionState | null) => void
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
}))
