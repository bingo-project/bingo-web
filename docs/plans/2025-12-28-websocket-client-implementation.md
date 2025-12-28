# WebSocket Client Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add WebSocket client infrastructure to bingo-web with JSON-RPC 2.0 protocol support, auto-reconnect, and auth integration.

**Architecture:** Create a new `@bingo/websocket` package containing the WebSocket client, JSON-RPC protocol handler, and React hooks. Integrate with existing auth store to connect on login and disconnect on logout. Connection status displayed via existing avatar indicator.

**Tech Stack:** TypeScript, Zustand (for connection state), native WebSocket API, JSON-RPC 2.0

---

## Task 1: Create websocket package structure

**Files:**

- Create: `packages/websocket/package.json`
- Create: `packages/websocket/tsconfig.json`
- Create: `packages/websocket/src/index.ts`

**Step 1: Create package.json**

```json
{
  "name": "@bingo/websocket",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "zustand": "^5.0.2"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*",
    "@types/react": "^19.0.2"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "@bingo/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

**Step 3: Create src/index.ts placeholder**

```typescript
// ABOUTME: WebSocket package barrel export
// ABOUTME: Exports client, hooks, and types for WebSocket communication

export {}
```

**Step 4: Run pnpm install**

Run: `pnpm install`
Expected: Dependencies installed, no errors

**Step 5: Commit**

```bash
git add packages/websocket
git commit -m "feat(websocket): initialize @bingo/websocket package"
```

---

## Task 2: Implement JSON-RPC types and utilities

**Files:**

- Create: `packages/websocket/src/types.ts`
- Create: `packages/websocket/src/jsonrpc.ts`

**Step 1: Create types.ts**

```typescript
// ABOUTME: WebSocket and JSON-RPC 2.0 type definitions
// ABOUTME: Defines connection states, message formats, and client options

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'authenticated' | 'reconnecting'

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  method: string
  params?: unknown
  id: number
}

export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0'
  result: unknown
  id: number
}

export interface JsonRpcErrorResponse {
  jsonrpc: '2.0'
  error: {
    code: number
    reason?: string
    message: string
  }
  id: number
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse

export interface JsonRpcPush {
  jsonrpc: '2.0'
  method: string
  data?: unknown
}

export type JsonRpcMessage = JsonRpcResponse | JsonRpcPush

export interface WebSocketClientOptions {
  url: string
  heartbeatInterval?: number
  reconnectBaseDelay?: number
  reconnectMaxDelay?: number
  requestTimeout?: number
}

export type PushHandler = (data: unknown) => void
```

**Step 2: Create jsonrpc.ts**

```typescript
// ABOUTME: JSON-RPC 2.0 protocol utilities
// ABOUTME: Handles request creation, response parsing, and message type detection

import type { JsonRpcRequest, JsonRpcMessage, JsonRpcResponse, JsonRpcPush } from './types'

let requestId = 0

export function createRequest(method: string, params?: unknown): JsonRpcRequest {
  return {
    jsonrpc: '2.0',
    method,
    params,
    id: ++requestId,
  }
}

export function isResponse(message: JsonRpcMessage): message is JsonRpcResponse {
  return 'id' in message && message.id !== undefined
}

export function isPush(message: JsonRpcMessage): message is JsonRpcPush {
  return !('id' in message) || message.id === undefined
}

export function isErrorResponse(response: JsonRpcResponse): response is import('./types').JsonRpcErrorResponse {
  return 'error' in response
}

export function parseMessage(data: string): JsonRpcMessage | null {
  try {
    return JSON.parse(data) as JsonRpcMessage
  } catch {
    return null
  }
}
```

**Step 3: Commit**

```bash
git add packages/websocket/src/types.ts packages/websocket/src/jsonrpc.ts
git commit -m "feat(websocket): add JSON-RPC 2.0 types and utilities"
```

---

## Task 3: Implement WebSocket client core

**Files:**

- Create: `packages/websocket/src/client.ts`

**Step 1: Create client.ts with connection management**

```typescript
// ABOUTME: WebSocket client with JSON-RPC 2.0 protocol
// ABOUTME: Handles connection lifecycle, auto-reconnect, heartbeat, and message routing

import type { ConnectionState, WebSocketClientOptions, JsonRpcRequest, JsonRpcResponse, PushHandler } from './types'
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

    await this.sendRequest('auth.login', { token: this.token })
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

  private handlePush(push: import('./types').JsonRpcPush): void {
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
```

**Step 2: Commit**

```bash
git add packages/websocket/src/client.ts
git commit -m "feat(websocket): implement WebSocket client with reconnect and heartbeat"
```

---

## Task 4: Create connection state store and React hook

**Files:**

- Create: `packages/websocket/src/store.ts`
- Create: `packages/websocket/src/hooks.ts`
- Modify: `packages/websocket/src/index.ts`

**Step 1: Create store.ts**

```typescript
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
```

**Step 2: Create hooks.ts**

```typescript
// ABOUTME: React hooks for WebSocket functionality
// ABOUTME: Provides useWebSocketStatus hook for connection state access

import { useWebSocketStore } from './store'
import type { ConnectionState } from './types'

export function useWebSocketStatus(): ConnectionState | null {
  return useWebSocketStore((state) => state.status)
}
```

**Step 3: Update index.ts with exports**

```typescript
// ABOUTME: WebSocket package barrel export
// ABOUTME: Exports client, hooks, and types for WebSocket communication

export { WebSocketClient } from './client'
export { useWebSocketStatus } from './hooks'
export { useWebSocketStore } from './store'
export type {
  ConnectionState,
  WebSocketClientOptions,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcPush,
  PushHandler,
} from './types'
```

**Step 4: Commit**

```bash
git add packages/websocket/src/store.ts packages/websocket/src/hooks.ts packages/websocket/src/index.ts
git commit -m "feat(websocket): add connection state store and React hook"
```

---

## Task 5: Create singleton client instance with config

**Files:**

- Create: `packages/websocket/src/instance.ts`
- Modify: `packages/websocket/src/index.ts`

**Step 1: Create instance.ts**

```typescript
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
```

**Step 2: Update index.ts to export wsClient**

```typescript
// ABOUTME: WebSocket package barrel export
// ABOUTME: Exports client, hooks, and types for WebSocket communication

export { WebSocketClient } from './client'
export { wsClient } from './instance'
export { useWebSocketStatus } from './hooks'
export { useWebSocketStore } from './store'
export type {
  ConnectionState,
  WebSocketClientOptions,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcPush,
  PushHandler,
} from './types'
```

**Step 3: Commit**

```bash
git add packages/websocket/src/instance.ts packages/websocket/src/index.ts
git commit -m "feat(websocket): add singleton client instance with env config"
```

---

## Task 6: Add environment variables

**Files:**

- Modify: `apps/web/.env.development`
- Create: `apps/web/.env.example` (if not exists, update if exists)

**Step 1: Update .env.development**

Add these lines:

```bash
# WebSocket
VITE_WEBSOCKET_ENABLED=true
VITE_WEBSOCKET_URL=ws://localhost:8081/ws
```

**Step 2: Update .env.example with WebSocket config**

Add these lines:

```bash
# WebSocket
VITE_WEBSOCKET_ENABLED=false
VITE_WEBSOCKET_URL=ws://localhost:8081/ws
```

**Step 3: Commit**

```bash
git add apps/web/.env.development apps/web/.env.example
git commit -m "feat(websocket): add WebSocket environment variables"
```

---

## Task 7: Add i18n messages

**Files:**

- Modify: `packages/locales/src/langs/en-US/auth.json`
- Modify: `packages/locales/src/langs/zh-CN/auth.json`

**Step 1: Add English messages**

Add to `auth.json` under a new `websocket` key:

```json
"websocket": {
  "sessionKicked": "You have been logged out because your account was signed in from another location.",
  "connectionLost": "Connection lost. Reconnecting...",
  "connectionRestored": "Connection restored."
}
```

**Step 2: Add Chinese messages**

Add to `auth.json` under a new `websocket` key:

```json
"websocket": {
  "sessionKicked": "您的账号已在其他地方登录，您已被强制下线。",
  "connectionLost": "连接已断开，正在重新连接...",
  "connectionRestored": "连接已恢复。"
}
```

**Step 3: Commit**

```bash
git add packages/locales/src/langs/en-US/auth.json packages/locales/src/langs/zh-CN/auth.json
git commit -m "feat(locales): add WebSocket-related i18n messages"
```

---

## Task 8: Integrate WebSocket with auth store

**Files:**

- Modify: `packages/core/package.json`
- Modify: `packages/core/src/stores/authStore.ts`

**Step 1: Add @bingo/websocket dependency to core package**

Add to dependencies in `packages/core/package.json`:

```json
"@bingo/websocket": "workspace:*"
```

**Step 2: Run pnpm install**

Run: `pnpm install`
Expected: Dependencies updated

**Step 3: Update authStore.ts to integrate WebSocket**

```typescript
// ABOUTME: Authentication state management with Zustand
// ABOUTME: Handles user session, token storage, auth actions, and WebSocket connection

import { create } from 'zustand'
import { authApi, type UserInfo, type LoginRequest, type RegisterRequest } from '../api/auth'
import { wsClient } from '@bingo/websocket'

const TOKEN_KEY = 'accessToken'
const EXPIRES_KEY = 'expiresAt'

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (account: string, password: string) => Promise<void>
  register: (account: string, password: string, code: string) => Promise<void>
  setAuth: (accessToken: string, expiresAt: string) => Promise<void>
  logout: () => void
  fetchUserInfo: () => Promise<void>
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (account: string, password: string) => {
    set({ isLoading: true })
    try {
      const data: LoginRequest = { account, password }
      const response = await authApi.login(data)

      localStorage.setItem(TOKEN_KEY, response.accessToken)
      localStorage.setItem(EXPIRES_KEY, response.expiresAt)

      set({
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
        isAuthenticated: true,
      })

      await get().fetchUserInfo()

      // Connect WebSocket after successful login
      await wsClient.connect(response.accessToken)
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (account: string, password: string, code: string) => {
    set({ isLoading: true })
    try {
      const data: RegisterRequest = { account, password, code }
      await authApi.register(data)
    } finally {
      set({ isLoading: false })
    }
  },

  setAuth: async (accessToken: string, expiresAt: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(EXPIRES_KEY, expiresAt)

    set({
      accessToken,
      expiresAt,
      isAuthenticated: true,
    })

    await get().fetchUserInfo()

    // Connect WebSocket after OAuth login
    await wsClient.connect(accessToken)
  },

  logout: () => {
    // Disconnect WebSocket before clearing auth
    wsClient.disconnect()

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_KEY)
    set({
      user: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
    })
  },

  fetchUserInfo: async () => {
    try {
      const user = await authApi.getUserInfo()
      set({ user })
    } catch {
      get().logout()
    }
  },

  initAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    const expiresAt = localStorage.getItem(EXPIRES_KEY)

    if (token && expiresAt) {
      set({ accessToken: token, expiresAt, isAuthenticated: true })
      await get().fetchUserInfo()

      // Connect WebSocket on app init if authenticated
      await wsClient.connect(token)
    }
  },
}))
```

**Step 4: Commit**

```bash
git add packages/core/package.json packages/core/src/stores/authStore.ts
git commit -m "feat(core): integrate WebSocket with auth store"
```

---

## Task 9: Add session.kicked handler

**Files:**

- Create: `packages/core/src/websocket.ts`
- Modify: `packages/core/src/index.ts`

**Step 1: Create websocket.ts for event handlers**

```typescript
// ABOUTME: WebSocket event handlers and initialization
// ABOUTME: Sets up session.kicked handler for forced logout

import { wsClient } from '@bingo/websocket'
import { $t } from '@bingo/locales'
import { toast } from 'sonner'
import { useAuthStore } from './stores/authStore'

let initialized = false

export function initWebSocketHandlers(onLogout?: () => void): void {
  if (initialized || !wsClient.isEnabled) return
  initialized = true

  wsClient.on('session.kicked', () => {
    toast.warning($t('auth.websocket.sessionKicked'))
    useAuthStore.getState().logout()
    onLogout?.()
  })
}
```

**Step 2: Update index.ts to export**

Add to exports:

```typescript
export { initWebSocketHandlers } from './websocket'
```

**Step 3: Commit**

```bash
git add packages/core/src/websocket.ts packages/core/src/index.ts
git commit -m "feat(core): add session.kicked handler for forced logout"
```

---

## Task 10: Update Header to show connection status

**Files:**

- Modify: `apps/web/src/components/layout/Header.tsx`

**Step 1: Import useWebSocketStatus hook**

Add import at top:

```typescript
import { useWebSocketStatus } from '@bingo/websocket'
```

**Step 2: Use hook in component**

Add inside Header function:

```typescript
const wsStatus = useWebSocketStatus()

const getStatusColor = () => {
  if (!wsStatus) return 'bg-green-500'
  switch (wsStatus) {
    case 'authenticated':
      return 'bg-green-500'
    case 'connected':
    case 'connecting':
    case 'reconnecting':
      return 'bg-yellow-500'
    case 'disconnected':
    default:
      return 'bg-default-400'
  }
}
```

**Step 3: Update status indicator span**

Replace the hardcoded green span:

```tsx
<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-green-500" />
```

With:

```tsx
<span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background ${getStatusColor()}`} />
```

**Step 4: Commit**

```bash
git add apps/web/src/components/layout/Header.tsx
git commit -m "feat(web): show WebSocket connection status on avatar indicator"
```

---

## Task 11: Initialize WebSocket handlers in App

**Files:**

- Modify: `apps/web/src/App.tsx` (or main entry point)

**Step 1: Find and read App.tsx**

Locate the main App component that calls `initAuth()`.

**Step 2: Add WebSocket handler initialization**

Import and call after auth init:

```typescript
import { initWebSocketHandlers } from '@bingo/core'
import { useNavigate } from 'react-router'

// Inside component or effect:
const navigate = useNavigate()

useEffect(() => {
  initWebSocketHandlers(() => navigate('/login'))
}, [navigate])
```

**Step 3: Commit**

```bash
git add apps/web/src/App.tsx
git commit -m "feat(web): initialize WebSocket handlers on app startup"
```

---

## Task 12: Add @bingo/websocket to web app dependencies

**Files:**

- Modify: `apps/web/package.json`

**Step 1: Add dependency**

Add to dependencies:

```json
"@bingo/websocket": "workspace:*"
```

**Step 2: Run pnpm install**

Run: `pnpm install`
Expected: Dependencies updated

**Step 3: Verify build**

Run: `pnpm --filter @bingo/web build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): add @bingo/websocket dependency"
```

---

## Task 13: Final verification and documentation

**Files:**

- Modify: `docs/plans/2025-12-28-websocket-client-design.md`

**Step 1: Run full build**

Run: `pnpm build`
Expected: All packages build successfully

**Step 2: Run lint**

Run: `pnpm lint`
Expected: No lint errors

**Step 3: Update design doc to mark complete**

Update the implementation checklist to show all items complete.

**Step 4: Final commit**

```bash
git add .
git commit -m "docs: mark WebSocket implementation complete"
```

---

## Summary

| Task | Description              | Files                    |
| ---- | ------------------------ | ------------------------ |
| 1    | Create package structure | `packages/websocket/*`   |
| 2    | JSON-RPC types/utils     | `types.ts`, `jsonrpc.ts` |
| 3    | WebSocket client core    | `client.ts`              |
| 4    | State store + hook       | `store.ts`, `hooks.ts`   |
| 5    | Singleton instance       | `instance.ts`            |
| 6    | Environment variables    | `.env.*`                 |
| 7    | i18n messages            | `locales/*/auth.json`    |
| 8    | Auth store integration   | `authStore.ts`           |
| 9    | session.kicked handler   | `websocket.ts`           |
| 10   | Header status indicator  | `Header.tsx`             |
| 11   | App initialization       | `App.tsx`                |
| 12   | Web app dependency       | `package.json`           |
| 13   | Final verification       | Build + lint             |
