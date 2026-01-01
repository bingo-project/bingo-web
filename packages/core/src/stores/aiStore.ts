// ABOUTME: AI Chat state management
// ABOUTME: Manages roles, sessions, and real-time chat messages

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import {
  getAiRoles,
  getAiSessions,
  createAiSession,
  getAiSessionHistory,
  deleteAiSession,
  updateAiSession,
} from '../api/ai'
import type { V1AiRoleInfo, V1SessionInfo, V1ChatMessage } from '../api/generated/types.gen'

const TOKEN_KEY = 'accessToken'

export interface AiState {
  // Data
  roles: V1AiRoleInfo[]
  sessions: V1SessionInfo[]
  currentSessionId: string | null
  messages: Record<string, V1ChatMessage[]> // Key: sessionId

  // Loading States
  isLoadingRoles: boolean
  isLoadingSessions: boolean
  isLoadingHistory: boolean
  isSendingMessage: boolean

  // Actions
  fetchRoles: () => Promise<void>
  fetchSessions: () => Promise<void>
  createSession: (model: string, title?: string, roleId?: string) => Promise<string>
  deleteSession: (sessionId: string) => Promise<void>
  updateSession: (sessionId: string, title: string) => Promise<void>
  setCurrentSession: (sessionId: string) => void
  fetchHistory: (sessionId: string) => Promise<void>

  // Chat Actions
  sendMessage: (content: string, model: string, roleId?: string) => Promise<void>
  clearContext: (sessionId: string) => void
}

export const useAiStore = create<AiState>()(
  immer((set, get) => ({
    roles: [],
    sessions: [],
    currentSessionId: null,
    messages: {},

    isLoadingRoles: false,
    isLoadingSessions: false,
    isLoadingHistory: false,
    isSendingMessage: false,

    fetchRoles: async () => {
      set({ isLoadingRoles: true })
      try {
        const res = await getAiRoles()
        if (res && res.data) {
          set({ roles: res.data })
        }
      } finally {
        set({ isLoadingRoles: false })
      }
    },

    fetchSessions: async () => {
      set({ isLoadingSessions: true })
      try {
        const res = await getAiSessions()
        if (res) {
          // Sort by updated_at desc
          const sorted = [...res].sort((a, b) => {
            return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
          })
          set({ sessions: sorted })
        }
      } finally {
        set({ isLoadingSessions: false })
      }
    },

    createSession: async (model, title, roleId) => {
      const newSession = await createAiSession({ model, title, role_id: roleId })

      if (newSession && newSession.session_id) {
        set(
          produce((state: AiState) => {
            state.sessions.unshift(newSession)
            state.currentSessionId = newSession.session_id!
            state.messages[newSession.session_id!] = []
          })
        )
        return newSession.session_id
      }
      throw new Error('Failed to create session')
    },

    deleteSession: async (sessionId) => {
      await deleteAiSession(sessionId)
      set(
        produce((state: AiState) => {
          state.sessions = state.sessions.filter((s) => s.session_id !== sessionId)
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
          const session = state.sessions.find((s) => s.session_id === sessionId)
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

    sendMessage: async (content, model, roleId) => {
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
            role_id: roleId,
            session_id: sessionId,
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
