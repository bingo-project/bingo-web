// ABOUTME: Forgot password page
// ABOUTME: Two-step flow: send code then reset password with code

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@heroui/react'
import { Mail, ArrowRight, KeyRound, ShieldCheck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '@bingo/core'
import { useTranslation } from '@/locales'
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, PasswordInput, PasswordStrengthIndicator } from '@/components/auth'

type Step = 'email' | 'reset'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordSchema()),
    defaultValues: { email: '' },
  })

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema()),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  })

  const onSendCode = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authApi.sendCode({ account: data.email, scene: 'reset_password' })
      setEmail(data.email)
      setStep('reset')
      toast.success(t('auth.forgotPassword.codeSent'))
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const onResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    try {
      await authApi.resetPassword({ account: email, code: data.code, password: data.password })
      toast.success(t('auth.forgotPassword.resetSuccess'))
      navigate('/login')
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await authApi.sendCode({ account: email, scene: 'reset_password' })
      toast.success(t('auth.forgotPassword.codeSent'))
    } catch {
      // Error toast handled by request interceptor
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
                {step === 'email' ? t('auth.forgotPassword.title') : t('auth.forgotPassword.resetTitle')}
              </h1>
              <p className="text-sm text-default-500">
                {step === 'email'
                  ? t('auth.forgotPassword.subtitle')
                  : t('auth.forgotPassword.resetSubtitle', { email })}
              </p>
            </div>

            {step === 'email' ? (
              /* Step 1: Email form */
              <form onSubmit={emailForm.handleSubmit(onSendCode)} className="flex flex-col gap-4">
                <Input
                  {...emailForm.register('email')}
                  type="email"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.forgotPassword.emailLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  isInvalid={!!emailForm.formState.errors.email}
                  errorMessage={emailForm.formState.errors.email?.message}
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
              /* Step 2: Reset password form */
              <form
                onSubmit={resetForm.handleSubmit(onResetPassword)}
                autoComplete="off"
                className="flex flex-col gap-4"
              >
                {/* Hidden input to prevent Chrome from autofilling verification code */}
                <input type="text" autoComplete="username" className="hidden" aria-hidden="true" />
                <Input
                  key="verification-code-input"
                  {...resetForm.register('code')}
                  autoComplete="one-time-code"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.forgotPassword.codeLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.forgotPassword.codePlaceholder')}
                  isInvalid={!!resetForm.formState.errors.code}
                  errorMessage={resetForm.formState.errors.code?.message}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <PasswordInput
                  {...resetForm.register('password')}
                  autoComplete="new-password"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.forgotPassword.newPasswordLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
                  isInvalid={!!resetForm.formState.errors.password}
                  errorMessage={resetForm.formState.errors.password?.message}
                  startContent={<Lock size={18} className="shrink-0 text-default-400" />}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <PasswordInput
                  {...resetForm.register('confirmPassword')}
                  autoComplete="new-password"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.forgotPassword.confirmPasswordLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
                  isInvalid={!!resetForm.formState.errors.confirmPassword}
                  errorMessage={resetForm.formState.errors.confirmPassword?.message}
                  startContent={<Lock size={18} className="shrink-0 text-default-400" />}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <PasswordStrengthIndicator password={resetForm.watch('password') || ''} />

                <Button
                  type="submit"
                  color="primary"
                  radius="full"
                  className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold text-white"
                  isLoading={isLoading}
                >
                  {isLoading ? t('auth.forgotPassword.resetting') : t('auth.forgotPassword.resetSubmit')}
                </Button>

                <div className="flex items-center justify-center gap-1 text-sm">
                  <span className="text-default-500">{t('auth.forgotPassword.noCode')}</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    {t('auth.forgotPassword.resend')}
                  </button>
                </div>
              </form>
            )}

            {/* Security notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-default-400">
              <ShieldCheck size={14} />
              <span>{t('auth.forgotPassword.secureConnection')}</span>
            </div>
          </AuthCard>

          {/* Back to login link */}
          <p className="mt-6 text-center text-sm text-default-500">
            {t('auth.forgotPassword.rememberPassword')}{' '}
            <Link to="/login" className="font-bold text-foreground hover:text-primary">
              {t('auth.forgotPassword.signIn')}
            </Link>
          </p>

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
