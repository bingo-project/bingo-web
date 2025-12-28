// ABOUTME: Security settings page
// ABOUTME: Handles password change, payment password, and TOTP setup

import { useState, useEffect, lazy, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
} from '@heroui/react'
import { Shield, Key, Lock, Smartphone, CheckCircle, XCircle, Link2, LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  authApi,
  type SecurityStatus,
  type TOTPSetupResponse,
  type AuthProvider,
  type SocialBinding,
} from '@bingo/core'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { PasswordInput, PasswordStrengthIndicator } from '@/components/auth'
import { getProviderIcon } from '@/components/auth/oauth-icons'
import { saveOAuthSession } from '@/utils/oauth'
import {
  createChangePasswordSchema,
  createPayPasswordSchema,
  createTotpEnableSchema,
  createTotpDisableSchema,
  type ChangePasswordFormData,
  type PayPasswordFormData,
  type TOTPEnableFormData,
  type TOTPDisableFormData,
} from '@/schemas'

const WalletBindSection = lazy(() => import('@/features/web3').then((m) => ({ default: m.WalletBindSection })))

export function SecuritySettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null)
  const [totpSetup, setTotpSetup] = useState<TOTPSetupResponse | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  // Shared countdown for security scene verification code (used by TOTP disable and pay password)
  const [securityCodeCountdown, setSecurityCodeCountdown] = useState(0)
  const [providers, setProviders] = useState<AuthProvider[]>([])
  const [bindings, setBindings] = useState<SocialBinding[]>([])
  const [isLoadingProviders, setIsLoadingProviders] = useState(true)
  const [unbindingProvider, setUnbindingProvider] = useState<string | null>(null)
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null)
  const [hasWalletProvider, setHasWalletProvider] = useState(false)

  const changePasswordModal = useDisclosure()
  const totpEnableModal = useDisclosure()
  const totpDisableModal = useDisclosure()
  const payPasswordModal = useDisclosure()

  useEffect(() => {
    if (securityCodeCountdown > 0) {
      const timer = setTimeout(() => setSecurityCodeCountdown(securityCodeCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [securityCodeCountdown])

  useEffect(() => {
    loadSecurityStatus()
    loadSocialData()
  }, [])

  const loadSecurityStatus = async () => {
    try {
      const status = await authApi.getSecurityStatus()
      setSecurityStatus(status)
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const loadSocialData = async () => {
    try {
      const [providersData, bindingsData] = await Promise.all([authApi.getProviders(), authApi.getBindings()])
      const providerList = Array.isArray(providersData) ? providersData : []

      // Check for wallet provider
      setHasWalletProvider(providerList.some((p) => p.name === 'wallet'))

      // Filter out wallet from OAuth providers
      setProviders(providerList.filter((p) => p.name !== 'wallet'))
      setBindings(Array.isArray(bindingsData) ? bindingsData : [])
    } catch {
      // Error handled by request interceptor
    } finally {
      setIsLoadingProviders(false)
    }
  }

  const handleEnableTOTP = async () => {
    try {
      const setup = await authApi.getTOTPSetup()
      setTotpSetup(setup)
      totpEnableModal.onOpen()
    } catch {
      // Error toast handled by request interceptor
    }
  }

  const handleLinkProvider = async (provider: AuthProvider) => {
    setLinkingProvider(provider.name)
    try {
      const response = await authApi.getOAuthUrl(provider.name)
      saveOAuthSession({
        state: response.state,
        codeVerifier: response.codeVerifier,
        action: 'bind',
        redirect: '/settings/security',
      })
      window.location.href = response.authUrl
    } catch {
      setLinkingProvider(null)
    }
  }

  const handleUnlinkProvider = async (providerName: string) => {
    setUnbindingProvider(providerName)
    try {
      await authApi.unbindProvider(providerName)
      const providerLabel = t(`settings.security.socialAccounts.providers.${providerName}`, providerName)
      toast.success(t('settings.security.socialAccounts.unlinkSuccess', { provider: providerLabel }))
      loadSocialData()
    } catch {
      // Error handled by request interceptor
    } finally {
      setUnbindingProvider(null)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Page Title - Hidden on mobile since nav tabs show current page */}
      <div className="mb-10 hidden md:block">
        <h1 className="mb-3 flex items-center gap-3 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl">
          <Shield className="text-primary" />
          {t('settings.security.title')}
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Change Password */}
        <ChangePasswordSection onChangePassword={changePasswordModal.onOpen} />

        {/* Payment Password */}
        <PaymentPasswordSection
          isSet={securityStatus?.payPasswordSet || false}
          isLoading={isLoadingStatus}
          onSetup={payPasswordModal.onOpen}
          onReset={payPasswordModal.onOpen}
        />

        {/* TOTP */}
        <TOTPSection
          isEnabled={securityStatus?.totpEnabled || false}
          isLoading={isLoadingStatus}
          onEnable={handleEnableTOTP}
          onDisable={totpDisableModal.onOpen}
        />

        {/* Social Accounts */}
        <SocialAccountsSection
          providers={providers}
          bindings={bindings}
          isLoading={isLoadingProviders}
          linkingProvider={linkingProvider}
          unbindingProvider={unbindingProvider}
          onLink={handleLinkProvider}
          onUnlink={handleUnlinkProvider}
        />

        {/* Wallet Binding */}
        {hasWalletProvider && !isLoadingProviders && (
          <Suspense
            fallback={
              <Card className="border border-divider bg-content1">
                <CardBody className="p-6">
                  <Spinner />
                </CardBody>
              </Card>
            }
          >
            <WalletBindSection
              binding={bindings.find((b) => b.provider === 'wallet')}
              onBindingChange={loadSocialData}
            />
          </Suspense>
        )}
      </div>

      {/* TOTP Enable Modal */}
      <TOTPEnableModal
        isOpen={totpEnableModal.isOpen}
        onClose={totpEnableModal.onClose}
        setup={totpSetup}
        onSuccess={() => {
          loadSecurityStatus()
          totpEnableModal.onClose()
        }}
      />

      {/* TOTP Disable Modal */}
      <TOTPDisableModal
        isOpen={totpDisableModal.isOpen}
        onClose={totpDisableModal.onClose}
        userEmail={user?.email || ''}
        countdown={securityCodeCountdown}
        onCountdownChange={setSecurityCodeCountdown}
        onSuccess={() => {
          loadSecurityStatus()
          totpDisableModal.onClose()
        }}
      />

      {/* Pay Password Modal */}
      <PayPasswordModal
        isOpen={payPasswordModal.isOpen}
        onClose={payPasswordModal.onClose}
        userEmail={user?.email || ''}
        totpEnabled={securityStatus?.totpEnabled || false}
        isReset={securityStatus?.payPasswordSet || false}
        countdown={securityCodeCountdown}
        onCountdownChange={setSecurityCodeCountdown}
        onSuccess={() => {
          loadSecurityStatus()
          payPasswordModal.onClose()
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        onClose={changePasswordModal.onClose}
        onSuccess={changePasswordModal.onClose}
      />
    </div>
  )
}

// Change Password Section (Card)
function ChangePasswordSection({ onChangePassword }: { onChangePassword: () => void }) {
  const { t } = useTranslation()

  return (
    <Card className="border border-divider bg-content1">
      <CardBody className="flex flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Lock className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('settings.security.changePassword.title')}</h3>
            <p className="text-sm text-default-500">{t('settings.security.changePassword.description')}</p>
          </div>
        </div>
        <div className="shrink-0">
          <Button color="primary" radius="full" onPress={onChangePassword}>
            {t('settings.security.changePassword.button')}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

// Change Password Modal
function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(createChangePasswordSchema()),
  })

  const passwordNew = watch('passwordNew') || ''

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.changePassword({
        passwordOld: data.passwordOld,
        passwordNew: data.passwordNew,
      })
      toast.success(t('settings.security.changePassword.success'))
      reset()
      onSuccess()
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>{t('settings.security.changePassword.title')}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <PasswordInput
              {...register('passwordOld')}
              label={t('settings.security.changePassword.currentPassword')}
              placeholder={t('settings.security.changePassword.currentPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.passwordOld}
              errorMessage={errors.passwordOld?.message}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <PasswordInput
              {...register('passwordNew')}
              label={t('settings.security.changePassword.newPassword')}
              placeholder={t('settings.security.changePassword.newPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.passwordNew}
              errorMessage={errors.passwordNew?.message}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <PasswordInput
              {...register('passwordConfirm')}
              label={t('settings.security.changePassword.confirmPassword')}
              placeholder={t('settings.security.changePassword.confirmPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.passwordConfirm}
              errorMessage={errors.passwordConfirm?.message}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <PasswordStrengthIndicator password={passwordNew} />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={onClose}>
            {t('settings.security.changePassword.cancel')}
          </Button>
          <Button color="primary" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting
              ? t('settings.security.changePassword.submitting')
              : t('settings.security.changePassword.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Payment Password Section
function PaymentPasswordSection({
  isSet,
  isLoading,
  onSetup,
  onReset,
}: {
  isSet: boolean
  isLoading: boolean
  onSetup: () => void
  onReset: () => void
}) {
  const { t } = useTranslation()

  return (
    <Card className="border border-divider bg-content1">
      <CardBody className="flex flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Key className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('settings.security.payPassword.title')}</h3>
            <p className="text-sm text-default-500">{t('settings.security.payPassword.description')}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Chip
            color={isSet ? 'success' : 'warning'}
            variant="flat"
            startContent={isSet ? <CheckCircle size={14} /> : <XCircle size={14} />}
          >
            {isSet ? t('settings.security.payPassword.set') : t('settings.security.payPassword.notSet')}
          </Chip>
          {isSet ? (
            <Button color="primary" variant="bordered" radius="full" isLoading={isLoading} onPress={onReset}>
              {t('settings.security.payPassword.reset')}
            </Button>
          ) : (
            <Button color="primary" radius="full" isLoading={isLoading} onPress={onSetup}>
              {t('settings.security.payPassword.setup')}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

// TOTP Section
function TOTPSection({
  isEnabled,
  isLoading,
  onEnable,
  onDisable,
}: {
  isEnabled: boolean
  isLoading: boolean
  onEnable: () => void
  onDisable: () => void
}) {
  const { t } = useTranslation()

  return (
    <Card className="border border-divider bg-content1">
      <CardBody className="flex flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('settings.security.totp.title')}</h3>
            <p className="text-sm text-default-500">{t('settings.security.totp.description')}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Chip
            color={isEnabled ? 'success' : 'warning'}
            variant="flat"
            startContent={isEnabled ? <CheckCircle size={14} /> : <XCircle size={14} />}
          >
            {isEnabled ? t('settings.security.totp.enabled') : t('settings.security.totp.disabled')}
          </Chip>
          <Button
            color={isEnabled ? 'danger' : 'primary'}
            variant={isEnabled ? 'bordered' : 'solid'}
            radius="full"
            isLoading={isLoading}
            onPress={isEnabled ? onDisable : onEnable}
          >
            {isEnabled ? t('settings.security.totp.disable') : t('settings.security.totp.enable')}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

// TOTP Enable Modal
function TOTPEnableModal({
  isOpen,
  onClose,
  setup,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  setup: TOTPSetupResponse | null
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TOTPEnableFormData>({
    resolver: zodResolver(createTotpEnableSchema()),
  })

  const onSubmit = async (data: TOTPEnableFormData) => {
    if (!setup) return
    setIsSubmitting(true)
    try {
      await authApi.enableTOTP({ code: data.code, secret: setup.secret })
      toast.success(t('settings.security.totp.success.enabled'))
      reset()
      onSuccess()
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>{t('settings.security.totp.setup.title')}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-medium">{t('settings.security.totp.setup.step1')}</p>
              <p className="text-sm text-default-500">{t('settings.security.totp.setup.step1Desc')}</p>
            </div>
            <div>
              <p className="font-medium">{t('settings.security.totp.setup.step2')}</p>
              <p className="mb-4 text-sm text-default-500">{t('settings.security.totp.setup.step2Desc')}</p>
              {setup?.otpauthUrl && (
                <div className="flex justify-center rounded-lg bg-white p-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setup.otpauthUrl)}`}
                    alt="QR Code"
                    className="size-48"
                  />
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm text-default-500">{t('settings.security.totp.setup.secretKey')}</p>
                <code className="mt-1 block rounded bg-content2 p-2 text-sm">{setup?.secret}</code>
              </div>
            </div>
            <div>
              <p className="font-medium">{t('settings.security.totp.setup.step3')}</p>
              <p className="mb-4 text-sm text-default-500">{t('settings.security.totp.setup.step3Desc')}</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register('code')}
                  label={t('settings.security.totp.setup.verificationCode')}
                  placeholder={t('settings.security.totp.setup.verificationCodePlaceholder')}
                  variant="bordered"
                  radius="full"
                  isInvalid={!!errors.code}
                  errorMessage={errors.code?.message}
                  maxLength={6}
                  classNames={{ inputWrapper: 'h-12' }}
                />
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={onClose}>
            {t('settings.security.totp.setup.cancel')}
          </Button>
          <Button color="primary" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting ? t('settings.security.totp.setup.submitting') : t('settings.security.totp.setup.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// TOTP Disable Modal
function TOTPDisableModal({
  isOpen,
  onClose,
  userEmail,
  countdown,
  onCountdownChange,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  countdown: number
  onCountdownChange: (value: number) => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TOTPDisableFormData>({
    resolver: zodResolver(createTotpDisableSchema()),
  })

  const handleSendCode = async () => {
    setIsSendingCode(true)
    try {
      await authApi.sendCode({ account: userEmail, scene: 'security' })
      onCountdownChange(60)
      toast.success(t('settings.security.totp.disableModal.codeSent'))
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSendingCode(false)
    }
  }

  const onSubmit = async (data: TOTPDisableFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.disableTOTP({ verifyCode: data.verifyCode, totpCode: data.totpCode })
      toast.success(t('settings.security.totp.success.disabled'))
      reset()
      onSuccess()
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>{t('settings.security.totp.disableModal.title')}</ModalHeader>
        <ModalBody>
          <p className="mb-4 text-default-500">{t('settings.security.totp.disableModal.description')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <div className="flex items-end gap-2">
                <Input
                  {...register('verifyCode')}
                  label={t('settings.security.totp.disableModal.emailCode')}
                  placeholder={t('settings.security.totp.disableModal.emailCodePlaceholder')}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="full"
                  isInvalid={!!errors.verifyCode}
                  classNames={{ inputWrapper: 'h-12' }}
                />
                <Button
                  className="h-12 min-w-28 shrink-0"
                  variant="bordered"
                  radius="full"
                  isLoading={isSendingCode}
                  isDisabled={countdown > 0}
                  onPress={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : t('settings.security.totp.disableModal.sendCode')}
                </Button>
              </div>
              {errors.verifyCode?.message && <p className="mt-1 text-xs text-danger">{errors.verifyCode.message}</p>}
            </div>
            <Input
              {...register('totpCode')}
              label={t('settings.security.totp.disableModal.totpCode')}
              placeholder={t('settings.security.totp.disableModal.totpCodePlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.totpCode}
              errorMessage={errors.totpCode?.message}
              maxLength={6}
              classNames={{ inputWrapper: 'h-12' }}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={onClose}>
            {t('settings.security.totp.disableModal.cancel')}
          </Button>
          <Button color="danger" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting
              ? t('settings.security.totp.disableModal.submitting')
              : t('settings.security.totp.disableModal.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Pay Password Modal
function PayPasswordModal({
  isOpen,
  onClose,
  userEmail,
  totpEnabled,
  isReset,
  countdown,
  onCountdownChange,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  totpEnabled: boolean
  isReset: boolean
  countdown: number
  onCountdownChange: (value: number) => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayPasswordFormData>({
    resolver: zodResolver(createPayPasswordSchema(totpEnabled)),
  })

  const handleSendCode = async () => {
    setIsSendingCode(true)
    try {
      await authApi.sendCode({ account: userEmail, scene: 'security' })
      onCountdownChange(60)
      toast.success(t('settings.security.payPassword.codeSent'))
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSendingCode(false)
    }
  }

  const onSubmit = async (data: PayPasswordFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.setPayPassword({
        code: data.code,
        loginPassword: data.loginPassword,
        payPassword: data.payPassword,
        totpCode: totpEnabled ? data.totpCode : undefined,
      })
      toast.success(
        isReset ? t('settings.security.payPassword.resetSuccess') : t('settings.security.payPassword.success')
      )
      reset()
      onSuccess()
    } catch {
      // Error toast handled by request interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>
          {isReset ? t('settings.security.payPassword.resetTitle') : t('settings.security.payPassword.setup')}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-5">
            {/* Hidden input to prevent Chrome from autofilling verification code */}
            <input type="text" autoComplete="username" className="hidden" aria-hidden="true" />

            <PasswordInput
              {...register('loginPassword')}
              label={t('settings.security.payPassword.loginPassword')}
              placeholder={t('settings.security.payPassword.loginPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.loginPassword}
              errorMessage={errors.loginPassword?.message}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <Input
              {...register('payPassword')}
              type="password"
              label={
                isReset
                  ? t('settings.security.payPassword.newPayPassword')
                  : t('settings.security.payPassword.payPassword')
              }
              placeholder={t('settings.security.payPassword.payPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.payPassword}
              errorMessage={errors.payPassword?.message}
              maxLength={6}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <Input
              {...register('payPasswordConfirm')}
              type="password"
              label={t('settings.security.payPassword.confirmPayPassword')}
              placeholder={t('settings.security.payPassword.confirmPayPasswordPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.payPasswordConfirm}
              errorMessage={errors.payPasswordConfirm?.message}
              maxLength={6}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <div>
              <div className="flex items-end gap-2">
                <Input
                  {...register('code')}
                  autoComplete="one-time-code"
                  label={t('settings.security.payPassword.verificationCode')}
                  placeholder={t('settings.security.payPassword.verificationCodePlaceholder')}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="full"
                  isInvalid={!!errors.code}
                  classNames={{ inputWrapper: 'h-12' }}
                />
                <Button
                  className="h-12 min-w-28 shrink-0"
                  variant="bordered"
                  radius="full"
                  isLoading={isSendingCode}
                  isDisabled={countdown > 0}
                  onPress={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : t('settings.security.payPassword.sendCode')}
                </Button>
              </div>
              {errors.code?.message && <p className="mt-1 text-xs text-danger">{errors.code.message}</p>}
            </div>
            {totpEnabled && (
              <Input
                {...register('totpCode')}
                label={t('settings.security.payPassword.totpCode')}
                placeholder={t('settings.security.payPassword.totpCodePlaceholder')}
                labelPlacement="outside"
                variant="bordered"
                radius="full"
                isInvalid={!!errors.totpCode}
                errorMessage={errors.totpCode?.message}
                maxLength={6}
                classNames={{ inputWrapper: 'h-12' }}
              />
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={onClose}>
            {t('action.cancel')}
          </Button>
          <Button color="primary" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting ? t('settings.security.payPassword.submitting') : t('settings.security.payPassword.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Social Accounts Section
function SocialAccountsSection({
  providers,
  bindings,
  isLoading,
  linkingProvider,
  unbindingProvider,
  onLink,
  onUnlink,
}: {
  providers: AuthProvider[]
  bindings: SocialBinding[]
  isLoading: boolean
  linkingProvider: string | null
  unbindingProvider: string | null
  onLink: (provider: AuthProvider) => void
  onUnlink: (providerName: string) => void
}) {
  const { t } = useTranslation()

  const isBound = (providerName: string) => bindings.some((b) => b.provider === providerName)

  if (isLoading || providers.length === 0) {
    return null
  }

  return (
    <Card className="border border-divider bg-content1">
      <CardBody className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Link2 className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('settings.security.socialAccounts.title')}</h3>
            <p className="text-sm text-default-500">{t('settings.security.socialAccounts.description')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {providers.map((provider) => {
            const Icon = getProviderIcon(provider.name)
            const bound = isBound(provider.name)
            const isLinking = linkingProvider === provider.name
            const isUnbinding = unbindingProvider === provider.name
            const providerLabel = t(`settings.security.socialAccounts.providers.${provider.name}`, provider.name)

            return (
              <div
                key={provider.name}
                className="flex items-center justify-between rounded-lg border border-divider bg-content2 p-4"
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="size-6" />}
                  <span className="font-medium">{providerLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Chip
                    color={bound ? 'success' : 'default'}
                    variant="flat"
                    size="sm"
                    startContent={bound ? <CheckCircle size={12} /> : undefined}
                  >
                    {bound
                      ? t('settings.security.socialAccounts.linked')
                      : t('settings.security.socialAccounts.notLinked')}
                  </Chip>
                  {bound ? (
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      radius="full"
                      isLoading={isUnbinding}
                      onPress={() => onUnlink(provider.name)}
                    >
                      {t('settings.security.socialAccounts.unlink')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      radius="full"
                      isLoading={isLinking}
                      startContent={!isLinking && <LinkIcon size={14} />}
                      onPress={() => onLink(provider)}
                    >
                      {t('settings.security.socialAccounts.link')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
