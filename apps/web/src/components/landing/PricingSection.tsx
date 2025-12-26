// ABOUTME: Landing page pricing section
// ABOUTME: Three-tier pricing cards with features list

import { useState } from 'react'
import { Button, Card, CardBody, Switch } from '@heroui/react'
import { Check, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/locales'

interface PricingPlan {
  key: string
  price: { monthly: string; yearly: string } | null
  period?: { monthly: string; yearly: string }
  features: string[]
  isPopular?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    key: 'free',
    price: { monthly: '$0', yearly: '$0' },
    period: { monthly: '/forever', yearly: '/forever' },
    features: ['1Project', 'basicComponents', 'communitySupport'],
  },
  {
    key: 'pro',
    price: { monthly: '$19', yearly: '$15' },
    period: { monthly: '/month', yearly: '/month' },
    features: ['unlimitedProjects', 'advancedComponents', 'prioritySupport', 'privateDiscord'],
    isPopular: true,
  },
  {
    key: 'enterprise',
    price: null,
    features: ['everythingInPro', 'customIntegrations', 'dedicatedSupport', 'sla'],
  },
]

export function PricingSection() {
  const { t } = useTranslation()
  const [isYearly, setIsYearly] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const billingPeriod = isYearly ? 'yearly' : 'monthly'

  return (
    <section id="pricing" className="relative py-24">
      {/* Background Effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">{t('pricing.title')}</h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${isYearly ? 'text-default-500' : 'text-foreground'}`}>
              {t('pricing.monthly')}
            </span>
            <Switch
              isSelected={isYearly}
              onValueChange={setIsYearly}
              size="sm"
              color="primary"
              aria-label="Toggle billing period"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-default-500'}`}>
              {t('pricing.yearly')}
            </span>
            <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
              {t('pricing.save20')}
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 pt-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const isSelected = plan.key === selectedPlan
            return (
              <div
                key={plan.key}
                className={`relative cursor-pointer transition-transform duration-300 ${isSelected ? 'z-10 scale-102' : ''}`}
                onClick={() => setSelectedPlan(plan.key)}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    {t('pricing.mostPopular')}
                  </div>
                )}
                <Card
                  radius="lg"
                  shadow="none"
                  className={`flex h-full flex-col transition-all duration-300 ${
                    isSelected
                      ? 'border-2 border-primary bg-content1 shadow-2xl shadow-primary/20'
                      : 'border border-divider bg-content1'
                  }`}
                >
                  <CardBody className="flex flex-1 flex-col p-8">
                    <h3 className="mb-2 text-xl font-medium text-foreground">{t(`pricing.${plan.key}.name`)}</h3>
                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl font-medium text-foreground">
                        {plan.price ? plan.price[billingPeriod] : t('pricing.custom')}
                      </span>
                      {plan.period && <span className="text-default-500">{plan.period[billingPeriod]}</span>}
                    </div>
                    <p className="mb-6 text-sm text-default-500">{t(`pricing.${plan.key}.description`)}</p>
                    <ul className="mb-8 flex flex-1 flex-col gap-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                          {isSelected ? (
                            <CheckCircle size={18} className="text-primary" />
                          ) : (
                            <Check size={18} className="text-green-500" />
                          )}
                          {t(`pricing.features.${feature}`)}
                        </li>
                      ))}
                    </ul>
                    <Button
                      fullWidth
                      radius="full"
                      variant={isSelected ? 'solid' : 'bordered'}
                      color={isSelected ? 'primary' : 'default'}
                      className={`font-medium transition-all ${isSelected ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25' : ''}`}
                      isDisabled={!isSelected}
                    >
                      {t(`pricing.${plan.key}.cta`)}
                    </Button>
                  </CardBody>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
