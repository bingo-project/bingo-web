// ABOUTME: Singleton WebSocket client instance
// ABOUTME: Configured via environment variables, syncs state to Zustand store

import { WebSocketClient } from './client'
import { useWebSocketStore } from './store'

const WS_ENABLED = import.meta.env.VITE_WEBSOCKET_ENABLED === 'true'
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8081/ws'

class WebSocketClientWrapper {
  private client: WebSocketClient | null = null

  private getClient(): WebSocketClient {
    if (!this.client) {
      this.client = new WebSocketClient({ url: WS_URL })
      this.client.onStateChange((state) => {
        useWebSocketStore.getState().setStatus(state)
      })
    }
    return this.client
  }

  get isEnabled(): boolean {
    return WS_ENABLED
  }

  async connect(token: string): Promise<void> {
    if (!WS_ENABLED) return
    return this.getClient().connect(token)
  }

  disconnect(): void {
    if (!WS_ENABLED || !this.client) return
    this.client.disconnect()
    useWebSocketStore.getState().setStatus(null)
  }

  async call<T = unknown>(method: string, params?: unknown): Promise<T> {
    if (!WS_ENABLED) {
      throw new Error('WebSocket is disabled')
    }
    return this.getClient().call<T>(method, params)
  }

  async subscribe(topics: string[]): Promise<void> {
    if (!WS_ENABLED) return
    return this.getClient().subscribe(topics)
  }

  async unsubscribe(topics: string[]): Promise<void> {
    if (!WS_ENABLED) return
    return this.getClient().unsubscribe(topics)
  }

  on(method: string, handler: (data: unknown) => void): () => void {
    if (!WS_ENABLED) return () => {}
    return this.getClient().on(method, handler)
  }
}

export const wsClient = new WebSocketClientWrapper()
