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

function formatRelativeTime(dateString: string, t: ReturnType<typeof useTranslation>['t']): string {
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
