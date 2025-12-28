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
import { NotificationItem } from '@/components/notification'

const categories: (NotificationCategory | 'all')[] = ['all', 'system', 'security', 'transaction', 'social']
const statuses = ['all', 'unread', 'read'] as const
type StatusFilter = (typeof statuses)[number]

export function NotificationCenterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteModal = useDisclosure()

  const [notifications, setNotifications] = useState<Notification[]>([])
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
    <div>
      <div className="mx-auto max-w-3xl px-4 pb-10">
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
              onPress={() => navigate('/settings/notifications/preferences')}
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
