// ABOUTME: About page component
// ABOUTME: Displays information about the application

import { useTranslation } from '@/locales'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="py-8">
      <h1 className="mb-4 text-2xl font-bold">{t('about.title')}</h1>
      <p className="text-gray-600">{t('about.description')}</p>
    </div>
  )
}
