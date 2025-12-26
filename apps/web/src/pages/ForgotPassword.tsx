// ABOUTME: Forgot password page
// ABOUTME: Allows users to request a password reset link via email

import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@heroui/react'
import { Mail, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/locales'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard } from '@/components/auth'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      // TODO: Call API to send reset link
      console.log('Sending reset link to:', data.email)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      toast.success(t('auth.forgotPassword.success'))
    } catch {
      toast.error(t('auth.forgotPassword.error'))
    } finally {
      setIsLoading(false)
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
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <KeyRound size={28} />
              </div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {isSubmitted ? t('auth.forgotPassword.sentTitle') : t('auth.forgotPassword.title')}
              </h1>
              <p className="text-sm text-default-500">
                {isSubmitted
                  ? t('auth.forgotPassword.sentSubtitle', { email: getValues('email') })
                  : t('auth.forgotPassword.subtitle')}
              </p>
            </div>

            {!isSubmitted ? (
              /* Form */
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                  {...register('email')}
                  type="email"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.forgotPassword.emailLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  startContent={<Mail size={18} className="shrink-0 text-default-400" />}
                  classNames={{
                    input: 'pl-1',
                    innerWrapper: 'gap-2',
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <Button
                  type="submit"
                  color="primary"
                  radius="full"
                  className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold text-white"
                  isLoading={isLoading}
                  endContent={!isLoading && <ArrowRight size={18} />}
                >
                  {isLoading ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
                </Button>
              </form>
            ) : (
              /* Success state */
              <div className="flex flex-col gap-4">
                <Button
                  as={Link}
                  to="/login"
                  color="primary"
                  radius="full"
                  className="h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold text-white"
                >
                  {t('auth.forgotPassword.backToLogin')}
                </Button>
                <Button
                  variant="bordered"
                  radius="full"
                  className="h-12 border-divider text-foreground"
                  onPress={() => setIsSubmitted(false)}
                >
                  {t('auth.forgotPassword.tryAnotherEmail')}
                </Button>
              </div>
            )}

            {/* Security notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-default-400">
              <ShieldCheck size={14} />
              <span>{t('auth.forgotPassword.secureConnection')}</span>
            </div>
          </AuthCard>

          {/* Back to login link */}
          {!isSubmitted && (
            <p className="mt-6 text-center text-sm text-default-500">
              {t('auth.forgotPassword.rememberPassword')}{' '}
              <Link to="/login" className="font-bold text-foreground hover:text-primary">
                {t('auth.forgotPassword.signIn')}
              </Link>
            </p>
          )}

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
