// ABOUTME: Landing page FAQ section
// ABOUTME: Accordion-style frequently asked questions

import { Accordion, AccordionItem } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/locales'

const FAQ_ITEMS = ['techStack', 'commercial', 'removeWeb3', 'deploy'] as const

export function FAQSection() {
  const { t } = useTranslation()

  return (
    <section id="faq" className="bg-slate-50 py-24 dark:bg-[#111111]">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-medium text-slate-900 md:text-4xl dark:text-white">{t('faq.title')}</h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          className="flex flex-col gap-4"
          itemClasses={{
            base: 'cursor-pointer bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-white/5 data-[open=true]:border-primary/50 dark:data-[open=true]:border-primary/50',
            title: 'font-medium text-slate-900 dark:text-white text-lg',
            content: 'text-slate-600 dark:text-slate-400 leading-relaxed pb-4',
            trigger: 'p-6',
            indicator: 'text-slate-900 dark:text-white data-[open=true]:rotate-180 transition-transform',
          }}
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item}
              aria-label={t(`faq.${item}.question`)}
              title={t(`faq.${item}.question`)}
              indicator={<ChevronDown size={20} />}
            >
              {t(`faq.${item}.answer`)}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
