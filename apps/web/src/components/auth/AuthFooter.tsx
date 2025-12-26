// ABOUTME: Auth page footer component
// ABOUTME: Contains copyright and legal links

import { Link } from 'react-router'
import { useTranslation } from '@/locales'

export function AuthFooter() {
  const { t } = useTranslation()

  return (
    <footer className="mt-12 flex flex-col items-center gap-4 text-xs text-default-500">
      <div className="flex gap-6">
        <Link to="/terms" className="transition-colors hover:text-primary">
          {t('auth.register.termsOfService')}
        </Link>
        <Link to="/privacy" className="transition-colors hover:text-primary">
          {t('auth.register.privacyPolicy')}
        </Link>
      </div>
      <p>{t('auth.common.copyright')}</p>
    </footer>
  )
}
