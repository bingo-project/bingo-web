// ABOUTME: JSON-RPC 2.0 protocol utilities
// ABOUTME: Handles request creation, response parsing, and message type detection

import type { JsonRpcRequest, JsonRpcMessage, JsonRpcResponse, JsonRpcPush, JsonRpcErrorResponse } from './types'

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

export function isErrorResponse(response: JsonRpcResponse): response is JsonRpcErrorResponse {
  return 'error' in response
}

export function parseMessage(data: string): JsonRpcMessage | null {
  try {
    return JSON.parse(data) as JsonRpcMessage
  } catch {
    return null
  }
}
