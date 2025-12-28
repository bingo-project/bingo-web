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
