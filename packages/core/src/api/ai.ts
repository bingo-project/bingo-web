// ABOUTME: AI module API manual wrapper
// ABOUTME: Uses request.ts for consistent auth/error handling

import { request } from './request'
import type {
  V1ListAiRoleResponse,
  V1ListModelsResponse,
  V1SessionInfo,
  V1CreateSessionRequest,
  V1UpdateSessionRequest,
  V1SessionHistoryResponse,
} from './generated/types.gen'

// Roles
export const getAiRoles = () => {
  return request.get<V1ListAiRoleResponse>('/v1/ai/roles')
}

// Models
export const getAiModels = () => {
  return request.get<V1ListModelsResponse>('/v1/models')
}

// Sessions
export const getAiSessions = () => {
  return request.get<V1SessionInfo[]>('/v1/ai/sessions')
}

export const createAiSession = (data: V1CreateSessionRequest & { role_id?: string }) => {
  return request.post<V1SessionInfo>('/v1/ai/sessions', data)
}

export const updateAiSession = (sessionId: string, data: V1UpdateSessionRequest) => {
  return request.put<V1SessionInfo>(`/v1/ai/sessions/${sessionId}`, data)
}

export const deleteAiSession = (sessionId: string) => {
  return request.delete<void>(`/v1/ai/sessions/${sessionId}`)
}

export const getAiSessionHistory = (sessionId: string) => {
  return request.get<V1SessionHistoryResponse>(`/v1/ai/sessions/${sessionId}/history`)
}
