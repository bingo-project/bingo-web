# Notification System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement notification UI including Header dropdown, settings page, and notification center page with mock data support.

**Architecture:** Three-layer implementation - (1) Core layer: API types and mock data in `@bingo/core`, (2) Components: NotificationDropdown and NotificationItem in `apps/web/src/components/notification`, (3) Pages: NotificationSettings in settings and NotificationCenter as standalone page.

**Tech Stack:** React, TypeScript, HeroUI (Popover, Switch, Card), Lucide icons, i18next, WebSocket integration

---

## Task 1: Add Notification Types and API Layer

**Files:**

- Create: `packages/core/src/api/notification.ts`
- Modify: `packages/core/src/api/index.ts`

**Step 1: Create notification API types and mock data**

Create `packages/core/src/api/notification.ts`:

```typescript
// ABOUTME: Notification API endpoints and types
// ABOUTME: Handles notification list, preferences, and mock data

import { request } from './request'

// Types
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

export interface NotificationPreferences {
  system: { inApp: boolean; email: boolean }
  security: { inApp: boolean; email: boolean }
  transaction: { inApp: boolean; email: boolean }
  social: { inApp: boolean; email: boolean }
}

export interface UnreadCountResponse {
  count: number
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
const useMock = () => import.meta.env.VITE_USE_MOCK === 'true'

// API functions
export const notificationApi = {
  getList: async (params: NotificationListParams = {}): Promise<NotificationListResponse> => {
    if (useMock()) {
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
    return request.get<NotificationListResponse>('/v1/notifications', { params })
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 100))
      return { count: mockNotifications.filter((n) => !n.isRead).length }
    }
    return request.get<UnreadCountResponse>('/v1/notifications/unread-count')
  },

  markAsRead: async (uuid: string): Promise<void> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 100))
      const notification = mockNotifications.find((n) => n.uuid === uuid)
      if (notification) notification.isRead = true
      return
    }
    return request.put(`/v1/notifications/${uuid}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 200))
      mockNotifications.forEach((n) => (n.isRead = true))
      return
    }
    return request.put('/v1/notifications/read-all')
  },

  delete: async (uuid: string): Promise<void> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 100))
      const index = mockNotifications.findIndex((n) => n.uuid === uuid)
      if (index > -1) mockNotifications.splice(index, 1)
      return
    }
    return request.delete(`/v1/notifications/${uuid}`)
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 200))
      return { ...mockPreferences }
    }
    return request.get<NotificationPreferences>('/v1/notifications/preferences')
  },

  updatePreferences: async (data: NotificationPreferences): Promise<void> => {
    if (useMock()) {
      await new Promise((r) => setTimeout(r, 200))
      Object.assign(mockPreferences, data)
      return
    }
    return request.put('/v1/notifications/preferences', data)
  },
}
```

**Step 2: Update barrel export**

Modify `packages/core/src/api/index.ts` - add at the end:

```typescript
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
```

**Step 3: Add environment variable**

Add to `apps/web/.env.development`:

```
VITE_USE_MOCK=true
```

**Step 4: Commit**

```bash
git add packages/core/src/api/notification.ts packages/core/src/api/index.ts apps/web/.env.development
git commit -m "feat(core): add notification API with mock data support"
```

---

## Task 2: Add Notification i18n Messages

**Files:**

- Modify: `packages/locales/src/langs/en-US/settings.json`
- Modify: `packages/locales/src/langs/zh-CN/settings.json`

**Step 1: Add English translations**

Add to `packages/locales/src/langs/en-US/settings.json` inside the root object (after `security` section):

```json
"notifications": {
  "title": "Notification Settings",
  "description": "Manage how you receive updates, alerts, and activity notifications.",
  "dropdown": {
    "title": "Notifications",
    "markAllRead": "Mark all read",
    "viewAll": "View all notifications",
    "empty": "No notifications yet"
  },
  "center": {
    "title": "Notification Center",
    "unread": "{{count}} unread",
    "filter": {
      "allCategories": "All Categories",
      "allStatus": "All Status",
      "unread": "Unread",
      "read": "Read"
    },
    "markAllRead": "Mark all as read",
    "settings": "Settings",
    "empty": {
      "title": "No notifications",
      "description": "You're all caught up! We'll notify you when something new arrives."
    },
    "emptyFiltered": {
      "title": "No notifications found",
      "description": "No notifications match your current filters.",
      "clearFilters": "Clear filters"
    },
    "loadMore": "Load more",
    "noMore": "No more notifications",
    "deleteConfirm": {
      "title": "Delete Notification",
      "description": "Are you sure you want to delete this notification?",
      "confirm": "Delete",
      "cancel": "Cancel"
    }
  },
  "categories": {
    "system": {
      "title": "System Notifications",
      "description": "Platform updates, maintenance notices, and announcements."
    },
    "security": {
      "title": "Security Alerts",
      "description": "Login alerts, password changes, and security events."
    },
    "transaction": {
      "title": "Transaction Notifications",
      "description": "Deposits, withdrawals, and payment confirmations."
    },
    "social": {
      "title": "Social Activity",
      "description": "Comments, replies, follows, and mentions."
    }
  },
  "channels": {
    "inApp": "In-app notifications",
    "email": "Email notifications"
  },
  "time": {
    "justNow": "Just now",
    "minutesAgo": "{{count}}m ago",
    "hoursAgo": "{{count}}h ago",
    "daysAgo": "{{count}}d ago"
  },
  "badge": {
    "announcement": "Announcement"
  }
}
```

**Step 2: Add Chinese translations**

Add to `packages/locales/src/langs/zh-CN/settings.json` inside the root object (after `security` section):

```json
"notifications": {
  "title": "通知设置",
  "description": "管理您接收更新、提醒和活动通知的方式。",
  "dropdown": {
    "title": "通知",
    "markAllRead": "全部已读",
    "viewAll": "查看全部通知",
    "empty": "暂无通知"
  },
  "center": {
    "title": "通知中心",
    "unread": "{{count}} 条未读",
    "filter": {
      "allCategories": "全部类型",
      "allStatus": "全部状态",
      "unread": "未读",
      "read": "已读"
    },
    "markAllRead": "全部标为已读",
    "settings": "设置",
    "empty": {
      "title": "暂无通知",
      "description": "您已阅读所有通知！有新消息时我们会通知您。"
    },
    "emptyFiltered": {
      "title": "没有找到通知",
      "description": "没有符合当前筛选条件的通知。",
      "clearFilters": "清除筛选"
    },
    "loadMore": "加载更多",
    "noMore": "没有更多通知了",
    "deleteConfirm": {
      "title": "删除通知",
      "description": "确定要删除这条通知吗？",
      "confirm": "删除",
      "cancel": "取消"
    }
  },
  "categories": {
    "system": {
      "title": "系统通知",
      "description": "平台更新、维护通知和公告。"
    },
    "security": {
      "title": "安全提醒",
      "description": "登录提醒、密码修改和安全事件。"
    },
    "transaction": {
      "title": "交易通知",
      "description": "充值、提现和支付确认。"
    },
    "social": {
      "title": "社交互动",
      "description": "评论、回复、关注和提及。"
    }
  },
  "channels": {
    "inApp": "站内通知",
    "email": "邮件通知"
  },
  "time": {
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟前",
    "hoursAgo": "{{count}}小时前",
    "daysAgo": "{{count}}天前"
  },
  "badge": {
    "announcement": "公告"
  }
}
```

**Step 3: Commit**

```bash
git add packages/locales/src/langs/en-US/settings.json packages/locales/src/langs/zh-CN/settings.json
git commit -m "feat(locales): add notification i18n messages"
```

---

## Task 3: Create NotificationItem Component

**Files:**

- Create: `apps/web/src/components/notification/NotificationItem.tsx`
- Create: `apps/web/src/components/notification/index.ts`

**Step 1: Create NotificationItem component**

Create `apps/web/src/components/notification/NotificationItem.tsx`:

```tsx
// ABOUTME: Notification list item component
// ABOUTME: Displays single notification with icon, content, time, and actions

import { Megaphone, Shield, CreditCard, Users, Trash2 } from 'lucide-react'
import { Chip, Button } from '@heroui/react'
import { useTranslation } from '@/locales'
import type { Notification, NotificationCategory } from '@bingo/core'

const categoryConfig: Record<NotificationCategory, { icon: typeof Megaphone; bgColor: string; iconColor: string }> = {
  system: { icon: Megaphone, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  security: { icon: Shield, bgColor: 'bg-red-500/10', iconColor: 'text-red-500' },
  transaction: { icon: CreditCard, bgColor: 'bg-green-500/10', iconColor: 'text-green-500' },
  social: { icon: Users, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-500' },
}

function formatRelativeTime(dateString: string, t: (key: string, options?: object) => string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return t('settings.notifications.time.justNow')
  if (diffMinutes < 60) return t('settings.notifications.time.minutesAgo', { count: diffMinutes })
  if (diffHours < 24) return t('settings.notifications.time.hoursAgo', { count: diffHours })
  return t('settings.notifications.time.daysAgo', { count: diffDays })
}

interface NotificationItemProps {
  notification: Notification
  variant?: 'dropdown' | 'full'
  onRead?: (uuid: string) => void
  onDelete?: (uuid: string) => void
  onClick?: (notification: Notification) => void
}

export function NotificationItem({ notification, variant = 'full', onRead, onDelete, onClick }: NotificationItemProps) {
  const { t } = useTranslation()
  const config = categoryConfig[notification.category]
  const Icon = config.icon

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification.uuid)
    }
    onClick?.(notification)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(notification.uuid)
  }

  const isDropdown = variant === 'dropdown'

  return (
    <div
      className={`group flex cursor-pointer items-start gap-3 transition-colors hover:bg-content2 ${
        isDropdown ? 'px-4 py-3' : 'px-5 py-4'
      }`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      <div className="flex w-2 shrink-0 items-center pt-3">
        {!notification.isRead && <span className="size-2 rounded-full bg-primary" />}
      </div>

      {/* Category icon */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${config.bgColor} ${
          isDropdown ? 'size-8' : 'size-10'
        }`}
      >
        <Icon className={config.iconColor} size={isDropdown ? 16 : 20} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`font-medium text-foreground ${isDropdown ? 'text-sm' : ''} truncate`}>{notification.title}</p>
        <p className={`text-default-500 ${isDropdown ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>
          {notification.content}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {notification.source === 'announcement' && (
            <Chip size="sm" variant="flat" color="primary" className="h-5 text-xs">
              {t('settings.notifications.badge.announcement')}
            </Chip>
          )}
          <span className="text-xs text-default-400">{formatRelativeTime(notification.createdAt, t)}</span>
        </div>
      </div>

      {/* Delete button (full variant only, for messages) */}
      {!isDropdown && notification.source === 'message' && onDelete && (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          radius="full"
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onPress={handleDelete as () => void}
          aria-label="Delete notification"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  )
}
```

**Step 2: Create barrel export**

Create `apps/web/src/components/notification/index.ts`:

```typescript
// ABOUTME: Notification components barrel export
// ABOUTME: Re-exports all notification-related components

export { NotificationItem } from './NotificationItem'
```

**Step 3: Commit**

```bash
git add apps/web/src/components/notification/
git commit -m "feat(web): add NotificationItem component"
```

---

## Task 4: Create NotificationDropdown Component

**Files:**

- Create: `apps/web/src/components/notification/NotificationDropdown.tsx`
- Modify: `apps/web/src/components/notification/index.ts`

**Step 1: Create NotificationDropdown component**

Create `apps/web/src/components/notification/NotificationDropdown.tsx`:

```tsx
// ABOUTME: Header notification dropdown component
// ABOUTME: Shows recent notifications with unread badge and quick actions

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Popover, PopoverTrigger, PopoverContent, Button, Skeleton, Badge } from '@heroui/react'
import { Bell } from 'lucide-react'
import { notificationApi, type Notification } from '@bingo/core'
import { wsClient } from '@bingo/websocket'
import { useTranslation } from '@/locales'
import { NotificationItem } from './NotificationItem'

export function NotificationDropdown() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const [listRes, countRes] = await Promise.all([
        notificationApi.getList({ pageSize: 5 }),
        notificationApi.getUnreadCount(),
      ])
      setNotifications(listRes.data)
      setUnreadCount(countRes.count)
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch initial data
    fetchNotifications()

    // Listen for WebSocket notifications
    const handleNewMessage = () => {
      fetchNotifications()
    }

    wsClient.on('ntf.message', handleNewMessage)
    wsClient.on('ntf.announcement', handleNewMessage)
    wsClient.on('ntf.unread_count', (data: { count: number }) => {
      setUnreadCount(data.count)
    })

    return () => {
      wsClient.off('ntf.message', handleNewMessage)
      wsClient.off('ntf.announcement', handleNewMessage)
      wsClient.off('ntf.unread_count', handleNewMessage)
    }
  }, [fetchNotifications])

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // Error handled by interceptor
    }
  }

  const handleNotificationRead = async (uuid: string) => {
    try {
      await notificationApi.markAsRead(uuid)
      setNotifications((prev) => prev.map((n) => (n.uuid === uuid ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Error handled by interceptor
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate('/notifications')
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end" offset={10}>
      <PopoverTrigger>
        <Button isIconOnly variant="light" radius="full" className="hidden sm:flex" aria-label="Notifications">
          <Badge
            content={unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined}
            color="danger"
            size="sm"
            shape="circle"
            isInvisible={unreadCount === 0}
          >
            <Bell size={20} className="text-default-700 dark:text-inherit" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-divider px-4 py-3">
          <h3 className="font-semibold text-foreground">{t('settings.notifications.dropdown.title')}</h3>
          {unreadCount > 0 && (
            <Button size="sm" variant="light" color="primary" onPress={handleMarkAllRead}>
              {t('settings.notifications.dropdown.markAllRead')}
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell size={40} className="mb-3 text-default-300" />
              <p className="text-sm text-default-500">{t('settings.notifications.dropdown.empty')}</p>
            </div>
          ) : (
            <div className="divide-y divide-divider">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.uuid}
                  notification={notification}
                  variant="dropdown"
                  onRead={handleNotificationRead}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-divider p-2">
          <Button variant="light" color="primary" radius="full" className="w-full" onPress={handleViewAll}>
            {t('settings.notifications.dropdown.viewAll')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

**Step 2: Update barrel export**

Modify `apps/web/src/components/notification/index.ts`:

```typescript
// ABOUTME: Notification components barrel export
// ABOUTME: Re-exports all notification-related components

export { NotificationItem } from './NotificationItem'
export { NotificationDropdown } from './NotificationDropdown'
```

**Step 3: Commit**

```bash
git add apps/web/src/components/notification/
git commit -m "feat(web): add NotificationDropdown component"
```

---

## Task 5: Integrate NotificationDropdown into Header

**Files:**

- Modify: `apps/web/src/components/layout/Header.tsx`

**Step 1: Replace static Bell button with NotificationDropdown**

Modify `apps/web/src/components/layout/Header.tsx`:

1. Add import at top (after other imports):

```typescript
import { NotificationDropdown } from '@/components/notification'
```

2. Replace the notifications button (around line 117-119):

Before:

```tsx
{
  /* Notifications */
}
;<Button isIconOnly variant="light" radius="full" className="hidden sm:flex" aria-label="Notifications">
  <Bell size={20} className="text-default-700 dark:text-inherit" />
</Button>
```

After:

```tsx
{
  /* Notifications */
}
;<NotificationDropdown />
```

3. Remove unused `Bell` from imports if it's only used there (keep it if used elsewhere in the file - check first).

**Step 2: Commit**

```bash
git add apps/web/src/components/layout/Header.tsx
git commit -m "feat(web): integrate NotificationDropdown into Header"
```

---

## Task 6: Create NotificationSettingsPage

**Files:**

- Create: `apps/web/src/pages/settings/Notifications.tsx`
- Modify: `apps/web/src/pages/settings/index.ts`

**Step 1: Create notification settings page**

Create `apps/web/src/pages/settings/Notifications.tsx`:

```tsx
// ABOUTME: Notification settings page
// ABOUTME: Allows users to configure notification preferences by category and channel

import { useState, useEffect } from 'react'
import { Card, CardBody, Switch, Skeleton } from '@heroui/react'
import { Bell, Megaphone, Shield, CreditCard, Users } from 'lucide-react'
import { toast } from 'sonner'
import { notificationApi, type NotificationPreferences, type NotificationCategory } from '@bingo/core'
import { useTranslation } from '@/locales'

const categoryConfig: Record<NotificationCategory, { icon: typeof Megaphone; bgColor: string; iconColor: string }> = {
  system: { icon: Megaphone, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  security: { icon: Shield, bgColor: 'bg-red-500/10', iconColor: 'text-red-500' },
  transaction: { icon: CreditCard, bgColor: 'bg-green-500/10', iconColor: 'text-green-500' },
  social: { icon: Users, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-500' },
}

const categories: NotificationCategory[] = ['system', 'security', 'transaction', 'social']

export function NotificationSettingsPage() {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const data = await notificationApi.getPreferences()
      setPreferences(data)
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (category: NotificationCategory, channel: 'inApp' | 'email', value: boolean) => {
    if (!preferences) return

    const key = `${category}.${channel}`
    setSavingKey(key)

    // Optimistic update
    const prevPreferences = { ...preferences }
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [channel]: value,
      },
    })

    try {
      await notificationApi.updatePreferences({
        ...preferences,
        [category]: {
          ...preferences[category],
          [channel]: value,
        },
      })
    } catch {
      // Rollback on error
      setPreferences(prevPreferences)
      toast.error(t('errors.http.unknown'))
    } finally {
      setSavingKey(null)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <div className="mb-10 hidden md:block">
          <Skeleton className="mb-3 h-10 w-64 rounded-lg" />
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-divider bg-content1">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Page Title - Hidden on mobile */}
      <div className="mb-10 hidden md:block">
        <h1 className="mb-3 flex items-center gap-3 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl">
          <Bell className="text-primary" />
          {t('settings.notifications.title')}
        </h1>
        <p className="text-default-500">{t('settings.notifications.description')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {categories.map((category) => {
          const config = categoryConfig[category]
          const Icon = config.icon
          const prefs = preferences?.[category]

          return (
            <Card key={category} className="border border-divider bg-content1">
              <CardBody className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Icon and text */}
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
                      <Icon className={config.iconColor} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(`settings.notifications.categories.${category}.title`)}
                      </h3>
                      <p className="text-sm text-default-500">
                        {t(`settings.notifications.categories.${category}.description`)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Switches */}
                  <div className="flex flex-col gap-3 sm:items-end">
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-sm text-default-500">{t('settings.notifications.channels.inApp')}</span>
                      <Switch
                        size="sm"
                        isSelected={prefs?.inApp ?? false}
                        isDisabled={savingKey === `${category}.inApp`}
                        onValueChange={(value) => handleToggle(category, 'inApp', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-sm text-default-500">{t('settings.notifications.channels.email')}</span>
                      <Switch
                        size="sm"
                        isSelected={prefs?.email ?? false}
                        isDisabled={savingKey === `${category}.email`}
                        onValueChange={(value) => handleToggle(category, 'email', value)}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: Update barrel export**

Modify `apps/web/src/pages/settings/index.ts`:

```typescript
// ABOUTME: Settings pages barrel export
// ABOUTME: Re-exports all settings page components

export { ProfileSettingsPage } from './Profile'
export { SecuritySettingsPage } from './Security'
export { NotificationSettingsPage } from './Notifications'
```

**Step 3: Commit**

```bash
git add apps/web/src/pages/settings/
git commit -m "feat(web): add NotificationSettingsPage"
```

---

## Task 7: Create NotificationCenterPage

**Files:**

- Create: `apps/web/src/pages/notifications/index.tsx`
- Modify: `apps/web/src/pages/index.ts`

**Step 1: Create notification center page**

Create `apps/web/src/pages/notifications/index.tsx`:

```tsx
// ABOUTME: Notification center page
// ABOUTME: Full notification history with filtering, pagination, and actions

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { Bell, ChevronDown, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { notificationApi, type Notification, type NotificationCategory, type NotificationListParams } from '@bingo/core'
import { useTranslation } from '@/locales'
import { Header } from '@/components/layout'
import { NotificationItem } from '@/components/notification'

const categories: (NotificationCategory | 'all')[] = ['all', 'system', 'security', 'transaction', 'social']
const statuses = ['all', 'unread', 'read'] as const
type StatusFilter = (typeof statuses)[number]

export function NotificationCenterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteModal = useDisclosure()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null)

  const pageSize = 10

  const fetchNotifications = useCallback(
    async (pageNum: number, append = false) => {
      if (pageNum === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      try {
        const params: NotificationListParams = {
          page: pageNum,
          pageSize,
        }
        if (categoryFilter !== 'all') {
          params.category = categoryFilter
        }
        if (statusFilter !== 'all') {
          params.isRead = statusFilter === 'read'
        }

        const [listRes, countRes] = await Promise.all([
          notificationApi.getList(params),
          pageNum === 1 ? notificationApi.getUnreadCount() : Promise.resolve(null),
        ])

        if (append) {
          setNotifications((prev) => [...prev, ...listRes.data])
        } else {
          setNotifications(listRes.data)
        }
        setTotal(listRes.total)
        setHasMore(listRes.data.length === pageSize)

        if (countRes) {
          setUnreadCount(countRes.count)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [categoryFilter, statusFilter]
  )

  useEffect(() => {
    setPage(1)
    fetchNotifications(1)
  }, [categoryFilter, statusFilter, fetchNotifications])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage, true)
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success(t('action.success'))
    } catch {
      // Error handled by interceptor
    }
  }

  const handleNotificationRead = async (uuid: string) => {
    try {
      await notificationApi.markAsRead(uuid)
      setNotifications((prev) => prev.map((n) => (n.uuid === uuid ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Error handled by interceptor
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const handleDeleteClick = (uuid: string) => {
    setDeletingUuid(uuid)
    deleteModal.onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUuid) return

    try {
      await notificationApi.delete(deletingUuid)
      setNotifications((prev) => prev.filter((n) => n.uuid !== deletingUuid))
      setTotal((prev) => prev - 1)
      toast.success(t('action.success'))
    } catch {
      // Error handled by interceptor
    } finally {
      setDeletingUuid(null)
      deleteModal.onClose()
    }
  }

  const handleClearFilters = () => {
    setCategoryFilter('all')
    setStatusFilter('all')
  }

  const getCategoryLabel = (cat: NotificationCategory | 'all') => {
    if (cat === 'all') return t('settings.notifications.center.filter.allCategories')
    return t(`settings.notifications.categories.${cat}.title`)
  }

  const getStatusLabel = (status: StatusFilter) => {
    if (status === 'all') return t('settings.notifications.center.filter.allStatus')
    return t(`settings.notifications.center.filter.${status}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNavLinks={false} />

      <div className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('settings.notifications.center.title')}</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-default-500">
                  {t('settings.notifications.center.unread', { count: unreadCount })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="bordered"
              radius="full"
              isDisabled={unreadCount === 0}
              onPress={handleMarkAllRead}
            >
              {t('settings.notifications.center.markAllRead')}
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              onPress={() => navigate('/settings/notifications')}
              aria-label={t('settings.notifications.center.settings')}
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" radius="full" size="sm" endContent={<ChevronDown size={16} />}>
                {getCategoryLabel(categoryFilter)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Category filter"
              selectedKeys={[categoryFilter]}
              selectionMode="single"
              onAction={(key) => setCategoryFilter(key as NotificationCategory | 'all')}
            >
              {categories.map((cat) => (
                <DropdownItem key={cat}>{getCategoryLabel(cat)}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" radius="full" size="sm" endContent={<ChevronDown size={16} />}>
                {getStatusLabel(statusFilter)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status filter"
              selectedKeys={[statusFilter]}
              selectionMode="single"
              onAction={(key) => setStatusFilter(key as StatusFilter)}
            >
              {statuses.map((status) => (
                <DropdownItem key={status}>{getStatusLabel(status)}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Notification List */}
        <div className="overflow-hidden rounded-2xl border border-divider bg-content1">
          {isLoading ? (
            <div className="divide-y divide-divider">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex gap-3 px-5 py-4">
                  <Skeleton className="size-2 shrink-0 rounded-full" />
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-48 rounded" />
                    <Skeleton className="mb-2 h-4 w-full rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell size={48} className="mb-4 text-default-300" />
              {categoryFilter !== 'all' || statusFilter !== 'all' ? (
                <>
                  <p className="mb-1 font-medium text-foreground">
                    {t('settings.notifications.center.emptyFiltered.title')}
                  </p>
                  <p className="mb-4 text-sm text-default-500">
                    {t('settings.notifications.center.emptyFiltered.description')}
                  </p>
                  <Button size="sm" variant="bordered" radius="full" onPress={handleClearFilters}>
                    {t('settings.notifications.center.emptyFiltered.clearFilters')}
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-1 font-medium text-foreground">{t('settings.notifications.center.empty.title')}</p>
                  <p className="text-sm text-default-500">{t('settings.notifications.center.empty.description')}</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-divider">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.uuid}
                  notification={notification}
                  variant="full"
                  onRead={handleNotificationRead}
                  onDelete={handleDeleteClick}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {!isLoading && notifications.length > 0 && (
          <div className="mt-4 text-center">
            {hasMore ? (
              <Button variant="bordered" radius="full" isLoading={isLoadingMore} onPress={handleLoadMore}>
                {t('settings.notifications.center.loadMore')}
              </Button>
            ) : (
              <p className="text-sm text-default-400">{t('settings.notifications.center.noMore')}</p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange} size="sm">
        <ModalContent>
          <ModalHeader>{t('settings.notifications.center.deleteConfirm.title')}</ModalHeader>
          <ModalBody>
            <p className="text-default-500">{t('settings.notifications.center.deleteConfirm.description')}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" radius="full" onPress={deleteModal.onClose}>
              {t('settings.notifications.center.deleteConfirm.cancel')}
            </Button>
            <Button color="danger" radius="full" onPress={handleDeleteConfirm}>
              {t('settings.notifications.center.deleteConfirm.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
```

**Step 2: Update pages barrel export**

Modify `apps/web/src/pages/index.ts` - add export:

```typescript
export { NotificationCenterPage } from './notifications'
```

**Step 3: Commit**

```bash
git add apps/web/src/pages/notifications/ apps/web/src/pages/index.ts
git commit -m "feat(web): add NotificationCenterPage"
```

---

## Task 8: Update Routes and Enable Settings Navigation

**Files:**

- Modify: `apps/web/src/routes/index.tsx`
- Modify: `apps/web/src/layouts/SettingsLayout.tsx`

**Step 1: Add routes**

Modify `apps/web/src/routes/index.tsx`:

1. Add import:

```typescript
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ErrorPage,
  ProfileSettingsPage,
  SecuritySettingsPage,
  NotificationSettingsPage,
  NotificationCenterPage,
  OAuthCallbackPage,
} from '@/pages'
```

2. Add notification routes:

In the settings children array, add:

```typescript
{ path: 'notifications', element: <NotificationSettingsPage /> },
```

Add standalone notification center route (before the `*` catch-all route):

```typescript
{ path: '/notifications', element: <NotificationCenterPage />, errorElement: <ErrorPage /> },
```

**Step 2: Enable notifications nav item**

Modify `apps/web/src/layouts/SettingsLayout.tsx`:

Change line 14 from:

```typescript
{ key: 'notifications', path: '/settings/notifications', icon: Bell, disabled: true },
```

To:

```typescript
{ key: 'notifications', path: '/settings/notifications', icon: Bell },
```

**Step 3: Commit**

```bash
git add apps/web/src/routes/index.tsx apps/web/src/layouts/SettingsLayout.tsx
git commit -m "feat(web): add notification routes and enable settings nav"
```

---

## Task 9: Build and Verify

**Step 1: Run build to check for errors**

```bash
pnpm build
```

Expected: Build succeeds without errors.

**Step 2: Run dev server and test manually**

```bash
pnpm dev
```

Test checklist:

- [ ] Header shows notification bell with dropdown
- [ ] Dropdown shows mock notifications
- [ ] "Mark all read" works
- [ ] "View all" navigates to /notifications
- [ ] /settings/notifications page loads with preference switches
- [ ] Switches toggle and save (with mock)
- [ ] /notifications page loads with notification list
- [ ] Filters work
- [ ] Delete confirmation modal works
- [ ] Dark mode works on all pages

**Step 3: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix(web): address build/test issues"
```

---

## Task 10: Final Commit

**Step 1: Ensure all changes are committed**

```bash
git status
```

**Step 2: Create summary commit if needed**

If there are uncommitted changes:

```bash
git add -A
git commit -m "feat(web): complete notification system implementation

- Add notification API with mock data support
- Add NotificationDropdown component for Header
- Add NotificationSettingsPage for preferences
- Add NotificationCenterPage for full history
- Add i18n messages (en-US, zh-CN)
- Integrate with WebSocket for real-time updates"
```
