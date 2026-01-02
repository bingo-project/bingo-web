// ABOUTME: AI Chat state management
// ABOUTME: Manages agents, sessions, and real-time chat messages

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import {
  getAiAgents,
  getAiSessions,
  createAiSession,
  getAiSessionHistory,
  deleteAiSession,
  updateAiSession,
} from '../api/ai'
import type { V1AiAgentInfo, V1SessionInfo, V1ChatMessage } from '../api/generated/types.gen'

const TOKEN_KEY = 'accessToken'

export interface AiState {
  // Data
  agents: V1AiAgentInfo[]
  sessions: V1SessionInfo[]
  currentSessionId: string | null
  messages: Record<string, V1ChatMessage[]> // Key: sessionId

  // Loading States
  isLoadingAgents: boolean
  isLoadingSessions: boolean
  isLoadingHistory: boolean
  isSendingMessage: boolean

  // Actions
  fetchAgents: () => Promise<void>
  fetchSessions: () => Promise<void>
  createSession: (model: string, title?: string, agentId?: string) => Promise<string>
  deleteSession: (sessionId: string) => Promise<void>
  updateSession: (sessionId: string, title: string) => Promise<void>
  setCurrentSession: (sessionId: string) => void
  fetchHistory: (sessionId: string) => Promise<void>

  // Chat Actions
  sendMessage: (content: string, model: string, agentId?: string) => Promise<void>
  clearContext: (sessionId: string) => void
}

export const useAiStore = create<AiState>()(
  immer((set, get) => ({
    agents: [],
    sessions: [],
    currentSessionId: null,
    messages: {},

    isLoadingAgents: false,
    isLoadingSessions: false,
    isLoadingHistory: false,
    isSendingMessage: false,

    fetchAgents: async () => {
      set({ isLoadingAgents: true })
      try {
        const res = await getAiAgents()
        if (res && res.data) {
          set({ agents: res.data })
        }
      } finally {
        set({ isLoadingAgents: false })
      }
    },

    fetchSessions: async () => {
      set({ isLoadingSessions: true })
      try {
        const res = await getAiSessions()
        if (res) {
          // Sort by updatedAt desc
          const sorted = [...res].sort((a, b) => {
            return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
          })
          set({ sessions: sorted })
        }
      } finally {
        set({ isLoadingSessions: false })
      }
    },

    createSession: async (model, title, agentId) => {
      const newSession = await createAiSession({ model, title, agentId })

      if (newSession && newSession.sessionId) {
        set(
          produce((state: AiState) => {
            state.sessions.unshift(newSession)
            state.currentSessionId = newSession.sessionId!
            state.messages[newSession.sessionId!] = []
          })
        )
        return newSession.sessionId
      }
      throw new Error('Failed to create session')
    },

    deleteSession: async (sessionId) => {
      await deleteAiSession(sessionId)
      set(
        produce((state: AiState) => {
          state.sessions = state.sessions.filter((s) => s.sessionId !== sessionId)
          if (state.currentSessionId === sessionId) {
            state.currentSessionId = null
          }
          delete state.messages[sessionId]
        })
      )
    },

    updateSession: async (sessionId, title) => {
      await updateAiSession(sessionId, { title })
      // Manually update local state
      set(
        produce((state: AiState) => {
          const session = state.sessions.find((s) => s.sessionId === sessionId)
          if (session) {
            session.title = title
          }
        })
      )
    },

    setCurrentSession: (sessionId) => {
      set({ currentSessionId: sessionId })
    },

    fetchHistory: async (sessionId) => {
      set({ isLoadingHistory: true })
      try {
        const res = await getAiSessionHistory(sessionId)
        if (res && res.messages) {
          set(
            produce((state: AiState) => {
              state.messages[sessionId] = res.messages!
            })
          )
        }
      } finally {
        set({ isLoadingHistory: false })
      }
    },

    sendMessage: async (content, model, agentId) => {
      const sessionId = get().currentSessionId
      if (!sessionId) return

      // Optimistic update
      const userMsg: V1ChatMessage = { role: 'user', content }
      set(
        produce((state: AiState) => {
          if (!state.messages[sessionId]) state.messages[sessionId] = []
          state.messages[sessionId].push(userMsg)
        })
      )

      set({ isSendingMessage: true })

      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            model,
            messages: [...(get().messages[sessionId] || [])],
            stream: true,
            agentId: agentId,
            sessionId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Stream failed: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No reader available')

        const decoder = new TextDecoder()

        // Assistant message placeholder
        set(
          produce((state: AiState) => {
            state.messages[sessionId].push({ role: 'assistant', content: '' })
          })
        )

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6)
              if (dataStr === '[DONE]') continue

              try {
                const data = JSON.parse(dataStr)
                const content = data.choices?.[0]?.delta?.content || ''
                if (content) {
                  set(
                    produce((state: AiState) => {
                      const msgs = state.messages[sessionId]
                      if (msgs && msgs.length > 0) {
                        const lastMsg = msgs[msgs.length - 1]
                        if (lastMsg.role === 'assistant') {
                          lastMsg.content += content
                        }
                      }
                    })
                  )
                }
              } catch (e) {
                console.error('Failed to parse stream chunk', e)
              }
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        set({ isSendingMessage: false })
      }
    },

    clearContext: (sessionId) => {
      set(
        produce((state: AiState) => {
          state.messages[sessionId] = []
        })
      )
    },
  }))
)
