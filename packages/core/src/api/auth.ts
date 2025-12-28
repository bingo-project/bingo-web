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

export type SendCodeScene = 'register' | 'reset_password' | 'bind' | 'security'

export interface SendCodeRequest {
  account: string
  scene: SendCodeScene
}

export interface ResetPasswordRequest {
  account: string
  code: string
  password: string
}

// Settings - Profile
export interface UpdateProfileRequest {
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  code?: string
}

// Settings - Security
export interface ChangePasswordRequest {
  passwordOld: string
  passwordNew: string
}

export interface SecurityStatus {
  payPasswordSet: boolean
  totpEnabled: boolean
}

export interface SetPayPasswordRequest {
  code: string
  loginPassword: string
  payPassword: string
  totpCode?: string
}

// TOTP (Google Authenticator)
export interface TOTPSetupResponse {
  secret: string
  otpauthUrl: string
}

export interface TOTPEnableRequest {
  code: string
  secret: string
}

export interface TOTPDisableRequest {
  verifyCode: string
  totpCode: string
}

// OAuth
export interface AuthProvider {
  name: string
  authUrl: string
  redirectUrl: string
  isDefault: number
}

export interface OAuthUrlResponse {
  authUrl: string
  state: string
  codeVerifier?: string
}

export interface OAuthLoginRequest {
  code: string
  state: string
  codeVerifier?: string
}

export interface SocialBinding {
  provider: string
  accountId: string
  username: string
  avatar: string
  bindTime: string
}

export const authApi = {
  login: (data: LoginRequest) => request.post<LoginResponse>('/v1/auth/login', data),

  register: (data: RegisterRequest) => request.post<void>('/v1/auth/register', data),

  getUserInfo: () => request.get<UserInfo>('/v1/auth/user-info'),

  sendCode: (data: SendCodeRequest) => request.post<void>('/v1/auth/code', data),

  resetPassword: (data: ResetPasswordRequest) => request.post<void>('/v1/auth/reset-password', data),

  // Settings - Profile
  updateProfile: (data: UpdateProfileRequest) => request.put<void>('/v1/auth/user', data),

  // Settings - Security
  changePassword: (data: ChangePasswordRequest) => request.put<void>('/v1/auth/change-password', data),

  getSecurityStatus: () => request.get<SecurityStatus>('/v1/auth/security/status'),

  setPayPassword: (data: SetPayPasswordRequest) => request.put<void>('/v1/auth/security/pay-password', data),

  // TOTP (Google Authenticator)
  getTOTPSetup: () => request.post<TOTPSetupResponse>('/v1/auth/security/totp/setup'),

  enableTOTP: (data: TOTPEnableRequest) => request.post<void>('/v1/auth/security/totp/enable', data),

  disableTOTP: (data: TOTPDisableRequest) => request.post<void>('/v1/auth/security/totp/disable', data),

  // File upload (returns the file URL as string)
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<string>('/v1/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // OAuth
  getProviders: () => request.get<AuthProvider[]>('/v1/auth/providers'),

  getOAuthUrl: (provider: string) => request.get<OAuthUrlResponse>(`/v1/auth/login/${provider}`),

  oauthLogin: (provider: string, data: OAuthLoginRequest) =>
    request.post<LoginResponse>(`/v1/auth/login/${provider}`, data),

  // Social Account Bindings
  getBindings: () => request.get<SocialBinding[]>('/v1/auth/bindings'),

  bindProvider: (provider: string, data: OAuthLoginRequest) =>
    request.post<LoginResponse>(`/v1/auth/bindings/${provider}`, data),

  unbindProvider: (provider: string) => request.delete<void>(`/v1/auth/bindings/${provider}`),
}
