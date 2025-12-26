// ABOUTME: Generic error page component
// ABOUTME: Displays different error states (404, 403, 500) with i18n support

import { Link, useRouteError, isRouteErrorResponse } from 'react-router'
import { Button, Card } from '@heroui/react'
import { Home, RefreshCw, Search, ShieldX, ServerCrash, AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/locales'
import { AuthHeader } from '@/components/auth'

type ErrorType = '404' | '403' | '500' | 'unknown'

interface ErrorConfig {
  icon: React.ReactNode
  color: string
  glowColor: string
}

const errorConfigs: Record<ErrorType, ErrorConfig> = {
  '404': {
    icon: <Search className="size-12 sm:size-14" />,
    color: 'text-warning',
    glowColor: 'bg-warning/20',
  },
  '403': {
    icon: <ShieldX className="size-12 sm:size-14" />,
    color: 'text-danger',
    glowColor: 'bg-danger/20',
  },
  '500': {
    icon: <ServerCrash className="size-12 sm:size-14" />,
    color: 'text-danger',
    glowColor: 'bg-danger/20',
  },
  unknown: {
    icon: <AlertTriangle className="size-12 sm:size-14" />,
    color: 'text-warning',
    glowColor: 'bg-warning/20',
  },
}

interface ErrorPageProps {
  errorType?: ErrorType
}

function getErrorType(error: unknown): ErrorType {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return '404'
    if (error.status === 403) return '403'
    if (error.status >= 500) return '500'
  }
  return 'unknown'
}

export function ErrorPage({ errorType: propErrorType }: ErrorPageProps = {}) {
  const { t } = useTranslation()
  const routeError = useRouteError()

  // Use prop errorType if provided, otherwise detect from route error
  // If no error at all (e.g., catch-all route), default to 404
  const errorType = propErrorType ?? (routeError ? getErrorType(routeError) : '404')
  const config = errorConfigs[errorType]

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
          {/* Icon container */}
          <div className="group relative mb-8">
            <div
              className={`absolute inset-0 ${config.glowColor} scale-75 rounded-full blur-xl transition-transform duration-500 group-hover:scale-100`}
            />
            <Card className="relative flex size-28 items-center justify-center border border-divider sm:size-32">
              <span className={config.color}>{config.icon}</span>
            </Card>
            {/* Error code badge */}
            {errorType !== 'unknown' && (
              <div className="absolute -top-2 -right-2 rounded-full border-2 border-background bg-danger px-3 py-1 text-xs font-bold text-white shadow-lg">
                {errorType}
              </div>
            )}
          </div>

          {/* Error text */}
          <div className="mb-10 space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t(`page.error.${errorType}.title`)}
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-default-500 sm:text-lg">
              {t(`page.error.${errorType}.description`)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <Button
              as={Link}
              to="/"
              color="primary"
              radius="full"
              className="w-full bg-gradient-to-r from-primary to-blue-600 font-bold text-white sm:w-auto"
              startContent={<Home size={18} />}
            >
              {t('page.error.actions.goHome')}
            </Button>
            <Button
              variant="bordered"
              radius="full"
              className="w-full border-divider text-foreground hover:bg-default-100 sm:w-auto"
              startContent={<RefreshCw size={18} />}
              onPress={handleRetry}
            >
              {t('page.error.actions.tryAgain')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
