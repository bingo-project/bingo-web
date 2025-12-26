// ABOUTME: User registration page
// ABOUTME: Email/password registration with terms agreement

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox } from '@heroui/react'
import { Mail, Lock, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { registerSchema, type RegisterFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, Divider, PasswordInput, OAuthButtons } from '@/components/auth'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { register: registerUser, isAuthenticated, isLoading } = useAuthStore()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      account: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false as unknown as true,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.account, data.password)
      toast.success(t('auth.register.success'))
      navigate('/login', { replace: true })
    } catch {
      toast.error(t('auth.register.error'))
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
              <h1 className="mb-2 text-2xl font-bold text-foreground">{t('auth.register.title')}</h1>
              <p className="text-sm text-default-500">{t('auth.register.subtitle')}</p>
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

              <PasswordInput
                {...register('confirmPassword')}
                variant="bordered"
                radius="full"
                fullWidth
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                startContent={<KeyRound size={18} className="shrink-0 text-default-400" />}
                classNames={{
                  inputWrapper: 'h-12',
                }}
              />

              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <div className="px-1">
                    <div className="flex cursor-pointer items-start gap-3">
                      <Checkbox
                        isSelected={field.value === true}
                        onValueChange={field.onChange}
                        size="sm"
                        isInvalid={!!errors.agreeTerms}
                        classNames={{
                          base: 'mt-0.5',
                        }}
                      />
                      <span
                        className="text-xs leading-relaxed text-default-500"
                        onClick={() => field.onChange(!field.value)}
                      >
                        {t('auth.register.agreeTerms')}{' '}
                        <Link to="/terms" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          {t('auth.register.termsOfService')}
                        </Link>{' '}
                        {t('auth.register.and')}{' '}
                        <Link
                          to="/privacy"
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('auth.register.privacyPolicy')}
                        </Link>
                      </span>
                    </div>
                    {errors.agreeTerms && <p className="mt-1 text-xs text-danger">{errors.agreeTerms.message}</p>}
                  </div>
                )}
              />

              <Button
                type="submit"
                color="primary"
                radius="full"
                className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold text-white"
                isLoading={isLoading}
              >
                {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
              </Button>
            </form>
          </AuthCard>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-default-500">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="font-bold text-foreground hover:text-primary">
              {t('auth.register.signIn')}
            </Link>
          </p>

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
