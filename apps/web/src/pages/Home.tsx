// ABOUTME: Home page component
// ABOUTME: Displays the landing page content

import { Button } from '@heroui/react'
import { useTranslation } from '@/locales'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('home.title')}</h1>
        <p className="mb-6 text-gray-600">{t('home.welcome')}</p>
        <Button color="primary">{t('home.getStarted')}</Button>
      </div>
    </div>
  )
}
