// ABOUTME: Axios request wrapper with interceptors
// ABOUTME: Provides typed HTTP methods and response handling

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    // Add token or other headers here
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message || 'Request failed'))
    }
    return response
  },
  (error) => Promise.reject(error)
)

export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<ApiResponse<T>>(url, config).then((res) => res.data.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<ApiResponse<T>>(url, config).then((res) => res.data.data),
}

export default request
