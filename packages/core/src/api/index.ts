// ABOUTME: API module barrel export
// ABOUTME: Re-exports request wrapper and API modules

export { request, type ErrResponse } from './request'
export { userApi, type User } from './example'
export { authApi, type LoginRequest, type LoginResponse, type RegisterRequest, type UserInfo } from './auth'
