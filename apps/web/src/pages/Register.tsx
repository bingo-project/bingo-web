// ABOUTME: User registration page with two-step verification
// ABOUTME: Step 1: email input and send code, Step 2: code + password + terms

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox } from '@heroui/react'
import { Mail, Lock, KeyRound, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, authApi, ApiError } from '@bingo/core'
import { useTranslation } from '@/locales'
import { registerEmailSchema, registerFormSchema, type RegisterEmailFormData, type RegisterFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, Divider, PasswordInput, OAuthButtons } from '@/components/auth'

type Step = 'email' | 'register'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const { register: registerUser, isAuthenticated } = useAuthStore()

  const emailForm = useForm<RegisterEmailFormData>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email: '' },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      code: '',
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

  const onSendCode = async (data: RegisterEmailFormData) => {
    setIsLoading(true)
    try {
      await authApi.sendCode({ account: data.email, scene: 'register' })
      setEmail(data.email)
      setStep('register')
      toast.success(t('auth.register.codeSent'))
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        toast.error(t('auth.register.tooManyRequests'))
      } else {
        toast.error(t('auth.register.sendCodeError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser(email, data.password, data.code)
      toast.success(t('auth.register.success'))
      navigate('/login', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        const errorKey = `auth.register.errors.${error.reason}`
        const errorMessage = t(errorKey)
        // If translation exists for this reason, use it; otherwise use generic error
        if (errorMessage !== errorKey) {
          toast.error(errorMessage)
        } else {
          toast.error(t('auth.register.error'))
        }
      } else {
        toast.error(t('auth.register.error'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await authApi.sendCode({ account: email, scene: 'register' })
      toast.success(t('auth.register.codeSent'))
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        toast.error(t('auth.register.tooManyRequests'))
      } else {
        toast.error(t('auth.register.sendCodeError'))
      }
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
                <UserPlus size={28} />
              </div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {step === 'email' ? t('auth.register.title') : t('auth.register.verifyTitle')}
              </h1>
              <p className="text-sm text-default-500">
                {step === 'email' ? t('auth.register.subtitle') : t('auth.register.verifySubtitle', { email })}
              </p>
            </div>

            {step === 'email' ? (
              <>
                {/* OAuth */}
                <OAuthButtons />

                <Divider text={t('auth.register.orContinueWith')} />

                {/* Step 1: Email form */}
                <form onSubmit={emailForm.handleSubmit(onSendCode)} className="flex flex-col gap-4">
                  <Input
                    {...emailForm.register('email')}
                    type="email"
                    variant="bordered"
                    radius="full"
                    fullWidth
                    label={t('auth.register.emailLabel')}
                    labelPlacement="outside"
                    placeholder={t('auth.register.emailPlaceholder')}
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
                    {isLoading ? t('auth.register.sendingCode') : t('auth.register.sendCode')}
                  </Button>
                </form>
              </>
            ) : (
              /* Step 2: Register form */
              <form onSubmit={registerForm.handleSubmit(onRegister)} autoComplete="off" className="flex flex-col gap-4">
                {/* Hidden input to prevent Chrome from autofilling verification code */}
                <input type="text" autoComplete="username" className="hidden" aria-hidden="true" />

                <Input
                  key="verification-code-input"
                  {...registerForm.register('code')}
                  autoComplete="one-time-code"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.register.codeLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.register.codePlaceholder')}
                  isInvalid={!!registerForm.formState.errors.code}
                  errorMessage={registerForm.formState.errors.code?.message}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <PasswordInput
                  {...registerForm.register('password')}
                  autoComplete="new-password"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.register.passwordLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.register.passwordPlaceholder')}
                  isInvalid={!!registerForm.formState.errors.password}
                  errorMessage={registerForm.formState.errors.password?.message}
                  startContent={<Lock size={18} className="shrink-0 text-default-400" />}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <PasswordInput
                  {...registerForm.register('confirmPassword')}
                  autoComplete="new-password"
                  variant="bordered"
                  radius="full"
                  fullWidth
                  label={t('auth.register.confirmPasswordLabel')}
                  labelPlacement="outside"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  isInvalid={!!registerForm.formState.errors.confirmPassword}
                  errorMessage={registerForm.formState.errors.confirmPassword?.message}
                  startContent={<KeyRound size={18} className="shrink-0 text-default-400" />}
                  classNames={{
                    inputWrapper: 'h-12',
                    label: 'text-default-600 font-medium',
                  }}
                />

                <Controller
                  name="agreeTerms"
                  control={registerForm.control}
                  render={({ field }) => (
                    <div className="px-1">
                      <div className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          isSelected={field.value === true}
                          onValueChange={field.onChange}
                          size="sm"
                          isInvalid={!!registerForm.formState.errors.agreeTerms}
                        />
                        <span className="text-xs text-default-500" onClick={() => field.onChange(!field.value)}>
                          {t('auth.register.agreeTerms')}{' '}
                          <Link
                            to="/terms"
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
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
                      {registerForm.formState.errors.agreeTerms && (
                        <p className="mt-1 text-xs text-danger">{registerForm.formState.errors.agreeTerms.message}</p>
                      )}
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

                <div className="flex items-center justify-center gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    disabled={isLoading}
                    className="font-medium text-default-500 hover:text-foreground disabled:opacity-50"
                  >
                    {t('auth.register.changeEmail')}
                  </button>
                  <span className="text-default-300">|</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="font-medium text-primary hover:underline disabled:opacity-50"
                  >
                    {t('auth.register.resend')}
                  </button>
                </div>
              </form>
            )}

            {/* Security notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-default-400">
              <ShieldCheck size={14} />
              <span>{t('auth.register.secureConnection')}</span>
            </div>
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
