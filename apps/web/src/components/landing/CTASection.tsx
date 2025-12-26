// ABOUTME: Landing page CTA section
// ABOUTME: Final call-to-action before footer

import { Button } from '@heroui/react'
import { Rocket } from 'lucide-react'
import { useTranslation } from '@/locales'

export function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden py-24 text-center">
      {/* Background Effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="container relative z-10 mx-auto px-4">
        <h2 className="mb-6 text-4xl font-medium tracking-tight text-slate-900 md:text-5xl dark:text-white">
          {t('cta.title')}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600 dark:text-slate-300">{t('cta.subtitle')}</p>
        <Button
          size="lg"
          radius="full"
          className="inline-flex h-14 min-w-[200px] items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary px-10 text-lg font-medium text-white shadow-xl shadow-primary/30 transition-transform duration-200 hover:scale-105"
        >
          {t('cta.button')}
          <Rocket size={20} className="shrink-0" />
        </Button>
      </div>
    </section>
  )
}
