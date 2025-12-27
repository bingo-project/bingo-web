// ABOUTME: Axios request wrapper with interceptors
// ABOUTME: Provides typed HTTP methods and response handling

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

export interface ErrResponse {
  message: string
  reason?: string
  metadata?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  reason?: string

  constructor(message: string, status: number, reason?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.reason = reason
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const TOKEN_KEY = 'accessToken'

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 0
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('expiresAt')
      window.location.href = '/login'
    }
    const errData = error.response?.data as ErrResponse | undefined
    const message = errData?.message || error.message || 'Request failed'
    return Promise.reject(new ApiError(message, status, errData?.reason))
  }
)

export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) => instance.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) => instance.delete<T>(url, config).then((res) => res.data),
}

export default request
