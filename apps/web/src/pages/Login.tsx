// ABOUTME: User login page
// ABOUTME: Email/password login with OAuth options

import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox } from '@heroui/react'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { createLoginSchema, type LoginFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, Divider, PasswordInput, OAuthButtons } from '@/components/auth'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const { login, isAuthenticated, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: {
      account: '',
      password: '',
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, navigate, redirect])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.account, data.password)
      navigate(redirect, { replace: true })
    } catch {
      toast.error(t('auth.login.error'))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative z-10 w-full max-w-[440px]">
          <AuthCard>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">{t('auth.login.title')}</h1>
              <p className="text-sm text-default-500">{t('auth.login.subtitle')}</p>
            </div>

            {/* OAuth */}
            <OAuthButtons />

            <Divider text={t('auth.login.orContinueWith')} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                {...register('account')}
                variant="bordered"
                radius="full"
                fullWidth
                placeholder={t('auth.login.accountPlaceholder')}
                isInvalid={!!errors.account}
                errorMessage={errors.account?.message}
                startContent={<Mail size={18} className="shrink-0 text-default-400" />}
                classNames={{
                  input: 'pl-1',
                  innerWrapper: 'gap-2',
                  inputWrapper: 'h-12',
                }}
              />

              <PasswordInput
                {...register('password')}
                variant="bordered"
                radius="full"
                fullWidth
                placeholder={t('auth.login.passwordPlaceholder')}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                startContent={<Lock size={18} className="shrink-0 text-default-400" />}
                classNames={{
                  inputWrapper: 'h-12',
                }}
              />

              <div className="flex items-center justify-between px-1">
                <Checkbox
                  {...register('rememberMe')}
                  size="sm"
                  classNames={{
                    label: 'text-sm text-default-500',
                  }}
                >
                  {t('auth.login.rememberMe')}
                </Checkbox>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                radius="full"
                className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold text-white"
                isLoading={isLoading}
              >
                {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
              </Button>
            </form>
          </AuthCard>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-default-500">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="font-bold text-foreground hover:text-primary">
              {t('auth.login.signUp')}
            </Link>
          </p>

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
