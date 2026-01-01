// ABOUTME: API module barrel export
// ABOUTME: Re-exports request wrapper and API modules

export { request, ApiError, type ErrResponse } from './request'
export { userApi, type User } from './example'
export {
  authApi,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type UserInfo,
  type SendCodeRequest,
  type SendCodeScene,
  type ResetPasswordRequest,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
  type SecurityStatus,
  type SetPayPasswordRequest,
  type TOTPSetupResponse,
  type TOTPEnableRequest,
  type TOTPDisableRequest,
  type AuthProvider,
  type OAuthUrlResponse,
  type OAuthLoginRequest,
  type SocialBinding,
} from './auth'
export {
  notificationApi,
  type Notification,
  type NotificationCategory,
  type NotificationSource,
  type NotificationListParams,
  type NotificationListResponse,
  type NotificationPreferences,
  type UnreadCountResponse,
} from './notification'
export * from './ai'
export * from './generated/types.gen'
