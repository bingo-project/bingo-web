// ABOUTME: WebSocket client with JSON-RPC 2.0 protocol
// ABOUTME: Handles connection lifecycle, auto-reconnect, heartbeat, and message routing

import type { ConnectionState, WebSocketClientOptions, JsonRpcResponse, JsonRpcPush, PushHandler } from './types'
import { createRequest, parseMessage, isResponse, isPush, isErrorResponse } from './jsonrpc'

const DEFAULT_OPTIONS: Required<Omit<WebSocketClientOptions, 'url'>> = {
  heartbeatInterval: 30000,
  reconnectBaseDelay: 1000,
  reconnectMaxDelay: 30000,
  requestTimeout: 10000,
}

type StateChangeHandler = (state: ConnectionState) => void

interface PendingRequest {
  resolve: (result: unknown) => void
  reject: (error: Error) => void
  timeout: ReturnType<typeof setTimeout>
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private options: Required<WebSocketClientOptions>
  private state: ConnectionState = 'disconnected'
  private token: string | null = null
  private pendingRequests = new Map<number, PendingRequest>()
  private pushHandlers = new Map<string, Set<PushHandler>>()
  private stateHandlers = new Set<StateChangeHandler>()
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private shouldReconnect = false
  private subscribedTopics = new Set<string>()

  constructor(options: WebSocketClientOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  get connectionState(): ConnectionState {
    return this.state
  }

  async connect(token: string): Promise<void> {
    if (this.state !== 'disconnected') {
      this.disconnect()
    }

    this.token = token
    this.shouldReconnect = true
    this.reconnectAttempts = 0

    return this.doConnect()
  }

  disconnect(): void {
    this.shouldReconnect = false
    this.cleanup()
    this.setState('disconnected')
  }

  async call<T = unknown>(method: string, params?: unknown): Promise<T> {
    if (this.state !== 'authenticated') {
      throw new Error('WebSocket not authenticated')
    }

    return this.sendRequest<T>(method, params)
  }

  async subscribe(topics: string[]): Promise<void> {
    const newTopics = topics.filter((t) => !this.subscribedTopics.has(t))
    if (newTopics.length === 0) return

    await this.sendRequest('subscribe', { topics: newTopics })
    newTopics.forEach((t) => this.subscribedTopics.add(t))
  }

  async unsubscribe(topics: string[]): Promise<void> {
    const existingTopics = topics.filter((t) => this.subscribedTopics.has(t))
    if (existingTopics.length === 0) return

    await this.sendRequest('unsubscribe', { topics: existingTopics })
    existingTopics.forEach((t) => this.subscribedTopics.delete(t))
  }

  on(method: string, handler: PushHandler): () => void {
    if (!this.pushHandlers.has(method)) {
      this.pushHandlers.set(method, new Set())
    }
    this.pushHandlers.get(method)!.add(handler)

    return () => {
      this.pushHandlers.get(method)?.delete(handler)
    }
  }

  onStateChange(handler: StateChangeHandler): () => void {
    this.stateHandlers.add(handler)
    return () => this.stateHandlers.delete(handler)
  }

  private async doConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.setState('connecting')

      try {
        this.ws = new WebSocket(this.options.url)
      } catch (error) {
        this.setState('disconnected')
        reject(error)
        return
      }

      this.ws.onopen = async () => {
        this.setState('connected')
        this.reconnectAttempts = 0

        try {
          await this.authenticate()
          this.startHeartbeat()
          await this.restoreSubscriptions()
          resolve()
        } catch (error) {
          this.handleAuthFailure()
          reject(error)
        }
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      this.ws.onclose = () => {
        this.handleClose()
      }

      this.ws.onerror = () => {
        if (this.state === 'connecting') {
          reject(new Error('WebSocket connection failed'))
        }
      }
    })
  }

  private async authenticate(): Promise<void> {
    if (!this.token) {
      throw new Error('No token available')
    }

    await this.sendRequest('auth.loginByToken', { token: this.token, platform: 'web' })
    this.setState('authenticated')
  }

  private async restoreSubscriptions(): Promise<void> {
    if (this.subscribedTopics.size > 0) {
      const topics = Array.from(this.subscribedTopics)
      this.subscribedTopics.clear()
      await this.subscribe(topics)
    }
  }

  private handleAuthFailure(): void {
    this.shouldReconnect = false
    this.cleanup()
    this.setState('disconnected')
  }

  private handleClose(): void {
    this.stopHeartbeat()
    this.rejectAllPending()

    if (this.shouldReconnect) {
      this.scheduleReconnect()
    } else {
      this.setState('disconnected')
    }
  }

  private scheduleReconnect(): void {
    this.setState('reconnecting')

    const delay = Math.min(
      this.options.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts),
      this.options.reconnectMaxDelay
    )

    this.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.doConnect().catch(() => {
        // Reconnect failed, will try again via onclose
      })
    }, delay)
  }

  private sendRequest<T>(method: string, params?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'))
        return
      }

      const request = createRequest(method, params)

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id)
        reject(new Error(`Request timeout: ${method}`))
      }, this.options.requestTimeout)

      this.pendingRequests.set(request.id, {
        resolve: resolve as (result: unknown) => void,
        reject,
        timeout,
      })

      this.ws.send(JSON.stringify(request))
    })
  }

  private handleMessage(data: string): void {
    const message = parseMessage(data)
    if (!message) return

    if (isResponse(message)) {
      this.handleResponse(message)
    } else if (isPush(message)) {
      this.handlePush(message)
    }
  }

  private handleResponse(response: JsonRpcResponse): void {
    const pending = this.pendingRequests.get(response.id)
    if (!pending) return

    clearTimeout(pending.timeout)
    this.pendingRequests.delete(response.id)

    if (isErrorResponse(response)) {
      pending.reject(new Error(response.error.message))
    } else {
      pending.resolve(response.result)
    }
  }

  private handlePush(push: JsonRpcPush): void {
    const handlers = this.pushHandlers.get(push.method)
    if (handlers) {
      handlers.forEach((handler) => handler(push.data))
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.sendRequest('heartbeat').catch(() => {
        // Heartbeat failed, connection will close
      })
    }, this.options.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private rejectAllPending(): void {
    const error = new Error('WebSocket disconnected')
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeout)
      pending.reject(error)
    })
    this.pendingRequests.clear()
  }

  private cleanup(): void {
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.rejectAllPending()

    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.close()
      this.ws = null
    }
  }

  private setState(state: ConnectionState): void {
    if (this.state === state) return
    this.state = state
    this.stateHandlers.forEach((handler) => handler(state))
  }
}
