// ABOUTME: Auth page header component
// ABOUTME: Contains logo and back to home link

import { Link } from 'react-router'
import { Button } from '@heroui/react'
import { Layers, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/locales'

export function AuthHeader() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Layers size={20} />
          </div>
          <span className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">Bingo</span>
        </Link>

        <Button
          as={Link}
          to="/"
          variant="bordered"
          radius="full"
          className="border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          startContent={<ArrowLeft size={18} />}
        >
          {t('auth.common.backToHome')}
        </Button>
      </div>
    </header>
  )
}
