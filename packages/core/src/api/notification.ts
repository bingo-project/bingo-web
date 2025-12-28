// ABOUTME: Notification API endpoints and types
// ABOUTME: Handles notification list, preferences, and mock data

import { request } from './request'

// Frontend types (camelCase)
export type NotificationCategory = 'system' | 'security' | 'transaction' | 'social'
export type NotificationSource = 'message' | 'announcement'

export interface Notification {
  uuid: string
  source: NotificationSource
  category: NotificationCategory
  type: string
  title: string
  content: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}

export interface NotificationListParams {
  category?: NotificationCategory
  isRead?: boolean
  page?: number
  pageSize?: number
}

export interface NotificationListResponse {
  data: Notification[]
  total: number
}

export interface ChannelPreference {
  inApp: boolean
  email: boolean
}

export interface NotificationPreferences {
  system: ChannelPreference
  security: ChannelPreference
  transaction: ChannelPreference
  social: ChannelPreference
}

export interface UnreadCountResponse {
  count: number
}

// Backend API types (snake_case)
interface ApiNotification {
  uuid: string
  source: NotificationSource
  category: NotificationCategory
  type: string
  title: string
  content: string
  actionUrl?: string
  is_read: boolean
  created_at: string
}

interface ApiNotificationListResponse {
  data: ApiNotification[]
  total: number
}

interface ApiChannelPreference {
  in_app: boolean
  email: boolean
}

interface ApiNotificationPreferences {
  system: ApiChannelPreference
  security: ApiChannelPreference
  transaction: ApiChannelPreference
  social: ApiChannelPreference
}

// Transform functions
function transformNotification(api: ApiNotification): Notification {
  return {
    uuid: api.uuid,
    source: api.source,
    category: api.category,
    type: api.type,
    title: api.title,
    content: api.content,
    actionUrl: api.actionUrl,
    isRead: api.is_read,
    createdAt: api.created_at,
  }
}

function transformPreferencesToFrontend(api: ApiNotificationPreferences): NotificationPreferences {
  const transform = (p: ApiChannelPreference): ChannelPreference => ({
    inApp: p.in_app,
    email: p.email,
  })
  return {
    system: transform(api.system),
    security: transform(api.security),
    transaction: transform(api.transaction),
    social: transform(api.social),
  }
}

function transformPreferencesToApi(prefs: NotificationPreferences): ApiNotificationPreferences {
  const transform = (p: ChannelPreference): ApiChannelPreference => ({
    in_app: p.inApp,
    email: p.email,
  })
  return {
    system: transform(prefs.system),
    security: transform(prefs.security),
    transaction: transform(prefs.transaction),
    social: transform(prefs.social),
  }
}

// Mock data
const mockNotifications: Notification[] = [
  {
    uuid: '1',
    source: 'message',
    category: 'system',
    type: 'system_update',
    title: 'System Update',
    content: 'Maintenance scheduled for 02:00 UTC.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    uuid: '2',
    source: 'message',
    category: 'security',
    type: 'login_alert',
    title: 'Security Alert',
    content: 'New login detected from 192.168.1.1.',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    uuid: '3',
    source: 'message',
    category: 'social',
    type: 'team_invite',
    title: 'Team Invite',
    content: "Alice invited you to 'Project Alpha'.",
    actionUrl: '/projects/alpha',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    uuid: '4',
    source: 'message',
    category: 'transaction',
    type: 'subscription_renewed',
    title: 'Subscription Renewed',
    content: 'Your invoice #INV-2024 is ready.',
    actionUrl: '/billing/invoices',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uuid: '5',
    source: 'announcement',
    category: 'system',
    type: 'announcement',
    title: 'Scheduled Backup',
    content: 'Weekly backup completed successfully.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockPreferences: NotificationPreferences = {
  system: { inApp: true, email: true },
  security: { inApp: true, email: true },
  transaction: { inApp: false, email: true },
  social: { inApp: true, email: false },
}

// Check if mock mode is enabled
const isMockEnabled = () => import.meta.env.VITE_USE_MOCK === 'true'

// API functions
export const notificationApi = {
  getList: async (params: NotificationListParams = {}): Promise<NotificationListResponse> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300))
      let filtered = [...mockNotifications]
      if (params.category) {
        filtered = filtered.filter((n) => n.category === params.category)
      }
      if (params.isRead !== undefined) {
        filtered = filtered.filter((n) => n.isRead === params.isRead)
      }
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const start = (page - 1) * pageSize
      return {
        data: filtered.slice(start, start + pageSize),
        total: filtered.length,
      }
    }
    // Transform params to snake_case for API
    const apiParams: Record<string, unknown> = {}
    if (params.category) apiParams.category = params.category
    if (params.isRead !== undefined) apiParams.is_read = params.isRead
    if (params.page) apiParams.page = params.page
    if (params.pageSize) apiParams.page_size = params.pageSize

    const response = await request.get<ApiNotificationListResponse>('/v1/notifications', { params: apiParams })
    return {
      data: response.data.map(transformNotification),
      total: response.total,
    }
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 100))
      return { count: mockNotifications.filter((n) => !n.isRead).length }
    }
    return request.get<UnreadCountResponse>('/v1/notifications/unread-count')
  },

  markAsRead: async (uuid: string): Promise<void> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 100))
      const notification = mockNotifications.find((n) => n.uuid === uuid)
      if (notification) notification.isRead = true
      return
    }
    return request.put(`/v1/notifications/${uuid}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 200))
      mockNotifications.forEach((n) => (n.isRead = true))
      return
    }
    return request.put('/v1/notifications/read-all')
  },

  delete: async (uuid: string): Promise<void> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 100))
      const index = mockNotifications.findIndex((n) => n.uuid === uuid)
      if (index > -1) mockNotifications.splice(index, 1)
      return
    }
    return request.delete(`/v1/notifications/${uuid}`)
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 200))
      return { ...mockPreferences }
    }
    const response = await request.get<ApiNotificationPreferences>('/v1/notifications/preferences')
    return transformPreferencesToFrontend(response)
  },

  updatePreferences: async (data: NotificationPreferences): Promise<void> => {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 200))
      Object.assign(mockPreferences, data)
      return
    }
    return request.put('/v1/notifications/preferences', transformPreferencesToApi(data))
  },
}
