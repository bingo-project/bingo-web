// ABOUTME: Landing page FAQ section
// ABOUTME: Accordion-style frequently asked questions

import { Accordion, AccordionItem } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/locales'

const FAQ_ITEMS = ['techStack', 'commercial', 'removeWeb3', 'deploy'] as const

export function FAQSection() {
  const { t } = useTranslation()

  return (
    <section id="faq" className="bg-default-50 py-24">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">{t('faq.title')}</h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          className="flex flex-col gap-4"
          itemClasses={{
            base: 'cursor-pointer bg-content1 border border-divider rounded-lg transition-colors hover:bg-default-100 data-[open=true]:border-primary/50',
            title: 'font-medium text-foreground text-lg',
            content: 'text-default-500 leading-relaxed pb-4',
            trigger: 'p-6',
            indicator: 'text-foreground data-[open=true]:rotate-180 transition-transform',
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
