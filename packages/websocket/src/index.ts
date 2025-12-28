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
