// ABOUTME: Authentication state management with Zustand
// ABOUTME: Handles user session, token storage, and auth actions

import { create } from 'zustand'
import { authApi, type UserInfo, type LoginRequest, type RegisterRequest } from '../api/auth'

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

  logout: () => {
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
    }
  },
}))
