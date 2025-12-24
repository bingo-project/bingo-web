// ABOUTME: Home page component
// ABOUTME: Displays landing page with Hero, Features, and Footer

import { Button, Chip, Card, CardBody } from '@heroui/react'
import { useTranslation } from '@/locales'

const TECH_STACK = [
  { name: 'React 19', color: 'primary' as const },
  { name: 'Vite', color: 'secondary' as const },
  { name: 'TypeScript', color: 'primary' as const },
  { name: 'HeroUI', color: 'default' as const },
]

const FEATURES = [
  { key: 'monorepo', icon: '📦' },
  { key: 'api', icon: '🔌' },
  { key: 'i18n', icon: '🌐' },
  { key: 'darkMode', icon: '🌙' },
  { key: 'typescript', icon: '🛡️' },
  { key: 'lint', icon: '✨' },
] as const

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 lg:min-h-[calc(50vh-32px)]">
        <h1 className="mb-4 bg-linear-to-r from-[#006FEE] to-[#00AAFF] bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400 md:text-xl">{t('hero.subtitle')}</p>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <Chip key={tech.name} color={tech.color} variant="flat">
              {tech.name}
            </Chip>
          ))}
        </div>
        <Button color="primary" size="lg">
          {t('hero.getStarted')}
        </Button>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.key} isHoverable shadow="md" className="rounded-2xl bg-gray-50 py-6 dark:bg-gray-900">
              <CardBody className="items-center text-center">
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-default-500">{t(`features.${feature.key}.desc`)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">{t('footer.copyright')}</footer>
    </div>
  )
}
