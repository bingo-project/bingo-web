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

    const unsubMessage = wsClient.on('ntf.message', handleNewMessage)
    const unsubAnnouncement = wsClient.on('ntf.announcement', handleNewMessage)
    const unsubUnreadCount = wsClient.on('ntf.unread_count', (data: unknown) => {
      const payload = data as { count: number }
      setUnreadCount(payload.count)
    })

    return () => {
      unsubMessage()
      unsubAnnouncement()
      unsubUnreadCount()
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
    navigate('/settings/notifications')
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
