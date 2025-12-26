// ABOUTME: Landing page features section
// ABOUTME: Grid of feature cards with icons and descriptions

import { type ReactNode } from 'react'
import { Card, CardBody } from '@heroui/react'
import { FolderGit2, Webhook, Globe, Moon, ShieldCheck, Wallet } from 'lucide-react'
import { useTranslation } from '@/locales'

const FEATURES: {
  key: string
  icon: ReactNode
  bgColor: string
  iconColor: string
}[] = [
  {
    key: 'monorepo',
    icon: <FolderGit2 size={24} />,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'api',
    icon: <Webhook size={24} />,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'i18n',
    icon: <Globe size={24} />,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'darkMode',
    icon: <Moon size={24} />,
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'codeQuality',
    icon: <ShieldCheck size={24} />,
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
  {
    key: 'web3',
    icon: <Wallet size={24} />,
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
]

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">{t('features.title')}</h2>
          <p className="text-lg text-default-500">{t('features.subtitle')}</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.key}
              isHoverable
              radius="lg"
              shadow="none"
              className="group border border-divider bg-content1 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <CardBody className="p-8">
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full transition-colors group-hover:bg-primary group-hover:text-white ${feature.bgColor} ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-medium text-foreground">{t(`features.${feature.key}.title`)}</h3>
                <p className="leading-relaxed text-default-500">{t(`features.${feature.key}.desc`)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
