// ABOUTME: Example API module demonstrating request usage
// ABOUTME: Shows typed API calls with the request wrapper

import { request } from './request'

export interface User {
  id: number
  name: string
  email: string
}

export const userApi = {
  getUser: (id: number) => request.get<User>(`/users/${id}`),
  getUsers: () => request.get<User[]>('/users'),
  createUser: (data: Omit<User, 'id'>) => request.post<User>('/users', data),
  updateUser: (id: number, data: Partial<User>) => request.put<User>(`/users/${id}`, data),
  deleteUser: (id: number) => request.delete<void>(`/users/${id}`),
}
