// ABOUTME: Authentication API endpoints
// ABOUTME: Handles login, register, and user info requests

import { request } from './request'

export interface LoginRequest {
  account: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
}

export interface RegisterRequest {
  account: string
  password: string
  code: string
  nickname?: string
}

export interface UserInfo {
  uid: string
  username: string
  email: string
  nickname: string
  avatar: string
  status: number
  createdAt: string
  updatedAt: string
}

export type SendCodeScene = 'register' | 'reset_password' | 'bind'

export interface SendCodeRequest {
  account: string
  scene: SendCodeScene
}

export interface ResetPasswordRequest {
  account: string
  code: string
  password: string
}

export const authApi = {
  login: (data: LoginRequest) => request.post<LoginResponse>('/v1/auth/login', data),

  register: (data: RegisterRequest) => request.post<void>('/v1/auth/register', data),

  getUserInfo: () => request.get<UserInfo>('/v1/auth/user-info'),

  sendCode: (data: SendCodeRequest) => request.post<void>('/v1/auth/code', data),

  resetPassword: (data: ResetPasswordRequest) => request.post<void>('/v1/auth/reset-password', data),
}
