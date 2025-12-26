// ABOUTME: Landing page stats bar section
// ABOUTME: Displays key metrics and partner logos

import { type ReactNode } from 'react'
import { Triangle, Cloud, Package, GitBranch } from 'lucide-react'
import { useTranslation } from '@/locales'

const STATS = [
  { value: '10K+', labelKey: 'stats.downloads' },
  { value: '500+', labelKey: 'stats.projects' },
  { value: '1.2K', labelKey: 'stats.githubStars' },
] as const

const PARTNERS: { name: string; icon: ReactNode }[] = [
  { name: 'Vercel', icon: <Triangle size={24} /> },
  { name: 'Cloudflare', icon: <Cloud size={24} /> },
  { name: 'AWS', icon: <Package size={24} /> },
  { name: 'Polygon', icon: <GitBranch size={24} /> },
]

export function StatsBar() {
  const { t } = useTranslation()

  return (
    <section className="border-y border-divider bg-default-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
          {/* Stats */}
          <div className="flex shrink-0 gap-8 md:gap-12">
            {STATS.map((stat) => (
              <div key={stat.labelKey} className="flex flex-col">
                <span className="text-3xl font-medium text-foreground">{stat.value}</span>
                <span className="text-sm font-medium text-default-500">{t(stat.labelKey)}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-divider md:hidden" />

          {/* Partners */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 opacity-60 transition-all duration-500 grayscale hover:grayscale-0 md:justify-end">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-1 font-display text-xl font-medium tracking-tight text-foreground"
              >
                {partner.icon}
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
