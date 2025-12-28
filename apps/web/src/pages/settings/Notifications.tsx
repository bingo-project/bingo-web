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
