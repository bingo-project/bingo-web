// ABOUTME: Security settings page
// ABOUTME: Handles password change, payment password, and TOTP setup

import { useState, useEffect } from 'react'
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
} from '@heroui/react'
import { Shield, Key, Lock, Smartphone, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { authApi, type SecurityStatus, type TOTPSetupResponse } from '@bingo/core'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { PasswordInput } from '@/components/auth'
import {
  changePasswordSchema,
  payPasswordSchema,
  totpEnableSchema,
  totpDisableSchema,
  type ChangePasswordFormData,
  type PayPasswordFormData,
  type TOTPEnableFormData,
  type TOTPDisableFormData,
} from '@/schemas'

export function SecuritySettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null)
  const [totpSetup, setTotpSetup] = useState<TOTPSetupResponse | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  const changePasswordModal = useDisclosure()
  const totpEnableModal = useDisclosure()
  const totpDisableModal = useDisclosure()
  const payPasswordModal = useDisclosure()

  useEffect(() => {
    loadSecurityStatus()
  }, [])

  const loadSecurityStatus = async () => {
    try {
      const status = await authApi.getSecurityStatus()
      setSecurityStatus(status)
    } catch {
      toast.error('Failed to load security status')
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const handleEnableTOTP = async () => {
    try {
      const setup = await authApi.getTOTPSetup()
      setTotpSetup(setup)
      totpEnableModal.onOpen()
    } catch {
      toast.error(t('settings.security.totp.error.setup'))
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
        />

        {/* TOTP */}
        <TOTPSection
          isEnabled={securityStatus?.totpEnabled || false}
          isLoading={isLoadingStatus}
          onEnable={handleEnableTOTP}
          onDisable={totpDisableModal.onOpen}
        />
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
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

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
      toast.error(t('settings.security.changePassword.error'))
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
}: {
  isSet: boolean
  isLoading: boolean
  onSetup: () => void
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
          {!isSet && (
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
    resolver: zodResolver(totpEnableSchema),
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
      toast.error(t('settings.security.totp.error.enable'))
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
    formState: { errors },
  } = useForm<TOTPDisableFormData>({
    resolver: zodResolver(totpDisableSchema),
  })

  const onSubmit = async (data: TOTPDisableFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.disableTOTP({ code: data.code })
      toast.success(t('settings.security.totp.success.disabled'))
      reset()
      onSuccess()
    } catch {
      toast.error(t('settings.security.totp.error.disable'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} placement="center">
      <ModalContent>
        <ModalHeader>{t('settings.security.totp.disableModal.title')}</ModalHeader>
        <ModalBody>
          <p className="mb-4 text-default-500">{t('settings.security.totp.disableModal.description')}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('code')}
              label={t('settings.security.totp.disableModal.verificationCode')}
              placeholder={t('settings.security.totp.disableModal.verificationCodePlaceholder')}
              variant="bordered"
              radius="full"
              isInvalid={!!errors.code}
              errorMessage={errors.code?.message}
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
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  onSuccess: () => void
}) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayPasswordFormData>({
    resolver: zodResolver(payPasswordSchema),
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    setIsSendingCode(true)
    try {
      await authApi.sendCode({ account: userEmail, scene: 'bind' })
      setCountdown(60)
      toast.success(t('settings.security.payPassword.codeSent'))
    } catch {
      toast.error('Failed to send code')
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
      })
      toast.success(t('settings.security.payPassword.success'))
      reset()
      onSuccess()
    } catch {
      toast.error(t('settings.security.payPassword.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      classNames={{
        wrapper: 'fixed inset-0 z-50 flex items-center justify-center',
        backdrop: 'fixed inset-0 z-40 bg-black/50',
      }}
    >
      <ModalContent>
        <ModalHeader>{t('settings.security.payPassword.setup')}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              label={t('settings.security.payPassword.payPassword')}
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
            <div className="flex items-end gap-2">
              <Input
                {...register('code')}
                label={t('settings.security.payPassword.verificationCode')}
                placeholder={t('settings.security.payPassword.verificationCodePlaceholder')}
                labelPlacement="outside"
                variant="bordered"
                radius="full"
                isInvalid={!!errors.code}
                errorMessage={errors.code?.message}
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
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting ? t('settings.security.payPassword.submitting') : t('settings.security.payPassword.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
