import { request } from './request'
import type {
  V1ListAiAgentResponse,
  V1ListModelsResponse,
  V1SessionInfo,
  V1CreateSessionRequest,
  V1UpdateSessionRequest,
  V1SessionHistoryResponse,
  V1AiAgentInfo,
} from './generated/types.gen'

// Agents
export const getAiAgents = () => {
  return request.get<V1ListAiAgentResponse>('/v1/ai/agents')
}

export const getAiAgent = (agentId: string) => {
  return request.get<V1AiAgentInfo>(`/v1/ai/agents/${agentId}`)
}

// Models
export const getAiModels = () => {
  return request.get<V1ListModelsResponse>('/v1/models')
}

// Sessions
export const getAiSessions = () => {
  return request.get<V1SessionInfo[]>('/v1/ai/sessions')
}

export const createAiSession = (data: V1CreateSessionRequest) => {
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
