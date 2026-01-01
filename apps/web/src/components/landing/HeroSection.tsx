// ABOUTME: Landing page hero section
// ABOUTME: Main banner with title, subtitle, tech stack badges, and CTA buttons

import { type ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@heroui/react'
import { Code, Zap, Braces, Coins, ArrowRight, MessageSquarePlus } from 'lucide-react'
import { useTranslation } from '@/locales'

const TECH_STACK: { name: string; icon: ReactNode; color: string }[] = [
  { name: 'React 19', icon: <Code size={16} />, color: '#61dafb' },
  { name: 'Vite', icon: <Zap size={16} />, color: '#ffd700' },
  { name: 'TypeScript', icon: <Braces size={16} />, color: '#3178c6' },
  { name: 'Web3', icon: <Coins size={16} />, color: '#7238f0' },
]

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full max-w-7xl -translate-x-1/2">
        <div className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[100px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
        {/* Tech Stack Badges */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-surface-dark/50 px-3 py-1.5 backdrop-blur-sm"
            >
              <span style={{ color: tech.color }}>{tech.icon}</span>
              <span className="text-xs font-medium text-white">{tech.name}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="mx-auto mb-6 max-w-4xl text-4xl leading-[1.15] font-medium tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block sm:inline">{t('hero.titlePrefix')}</span>{' '}
          <span className="block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent sm:inline">
            {t('hero.titleHighlight')}
          </span>{' '}
          <span className="block sm:inline">{t('hero.titleSuffix')}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-default-600 sm:text-lg md:text-xl">
          {t('hero.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Button
            as={Link}
            to="/register"
            size="lg"
            radius="full"
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 bg-gradient-primary px-8 text-base font-medium text-white shadow-lg shadow-primary/25 transition-transform duration-200 hover:scale-105 sm:w-auto"
          >
            {t('hero.getStarted')}
            <ArrowRight size={20} className="shrink-0" />
          </Button>

          <div className="flex w-full items-center justify-center gap-3 sm:w-auto">
            {/* Start AI Chat Button */}
            <Button
              as={Link}
              to="/ai"
              size="lg"
              radius="full"
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 border border-default-200 bg-default-100 px-8 text-base font-medium text-foreground transition-all hover:bg-default-200 hover:scale-105 sm:w-auto"
            >
              <MessageSquarePlus size={20} className="shrink-0 text-purple-500" />
              {t('hero.startAiChat') || 'AI Square'}
            </Button>

            <Button
              variant="bordered"
              size="lg"
              radius="full"
              className="hidden h-12 w-full shrink-0 items-center justify-center gap-2 border-divider bg-content1 px-8 text-base font-medium text-foreground transition-all hover:bg-default-100 sm:inline-flex sm:w-auto"
            >
              <svg className="size-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              {t('hero.viewOnGitHub')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
