// ABOUTME: Axios request wrapper with interceptors
// ABOUTME: Provides typed HTTP methods and response handling

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { $t } from '@bingo/locales'

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

// Get HTTP error message based on status code
function getHttpErrorMessage(status: number): string | null {
  const errorMap: Record<number, string> = {
    400: $t('errors.http.badRequest'),
    401: $t('errors.http.unauthorized'),
    403: $t('errors.http.forbidden'),
    404: $t('errors.http.notFound'),
    408: $t('errors.http.requestTimeout'),
    429: $t('errors.http.tooManyRequests'),
    500: $t('errors.http.internalServerError'),
    502: $t('errors.http.badGateway'),
    503: $t('errors.http.serviceUnavailable'),
    504: $t('errors.http.gatewayTimeout'),
  }
  return errorMap[status] || null
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network error
    if (error.message?.includes('Network Error')) {
      toast.error($t('errors.NetworkError'))
      return Promise.reject(new ApiError($t('errors.NetworkError'), 0))
    }

    // Handle timeout
    if (error.message?.includes('timeout')) {
      toast.error($t('errors.RequestTimeout'))
      return Promise.reject(new ApiError($t('errors.RequestTimeout'), 0))
    }

    const status = error.response?.status || 0
    const errData = error.response?.data as ErrResponse | undefined

    // Handle 401 - redirect to login
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('expiresAt')
      window.location.href = '/login'
      return Promise.reject(new ApiError($t('errors.http.unauthorized'), status))
    }

    // Show error toast: try reason translation first, then HTTP status message
    if (errData?.reason) {
      const errorKey = `errors.${errData.reason}`
      const translated = $t(errorKey)
      if (translated !== errorKey) {
        toast.error(translated)
      } else {
        // No translation for reason, fall back to HTTP status message
        const httpErrorMsg = getHttpErrorMessage(status)
        toast.error(httpErrorMsg || errData.message || $t('errors.default'))
      }
    } else {
      // No reason, use HTTP status message
      const httpErrorMsg = getHttpErrorMessage(status)
      if (httpErrorMsg) {
        toast.error(httpErrorMsg)
      }
    }

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

// Export axios instance for adding custom interceptors
export const axiosInstance = instance

export default request
