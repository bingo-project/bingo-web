// ABOUTME: User profile settings page
// ABOUTME: Allows editing avatar, nickname, and binding email

import { useState, useRef, useEffect } from 'react'
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
} from '@heroui/react'
import { Upload, Trash2, CheckCircle, Mail, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, authApi } from '@bingo/core'
import { useTranslation } from '@/locales'
import { createProfileSchema, createBindEmailSchema, type ProfileFormData, type BindEmailFormData } from '@/schemas'

export function ProfileSettingsPage() {
  const { t } = useTranslation()
  const { user, fetchUserInfo } = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bindEmailModal = useDisclosure()

  const hasEmail = Boolean(user?.email)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema()),
    defaultValues: {
      nickname: user?.nickname || '',
    },
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    setIsUploading(true)
    try {
      const avatarUrl = await authApi.uploadFile(file)
      await authApi.updateProfile({ avatar: avatarUrl })
      await fetchUserInfo()
      toast.success(t('settings.profile.success'))
    } catch {
      toast.error(t('settings.profile.error'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleAvatarRemove = async () => {
    if (!user?.avatar) return

    setIsRemoving(true)
    try {
      await authApi.updateProfile({ avatar: '' })
      await fetchUserInfo()
      toast.success(t('settings.profile.success'))
    } catch {
      toast.error(t('settings.profile.error'))
    } finally {
      setIsRemoving(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.updateProfile(data)
      await fetchUserInfo()
      toast.success(t('settings.profile.success'))
    } catch {
      toast.error(t('settings.profile.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Page Title - Hidden on mobile since nav tabs show current page */}
      <div className="mb-10 hidden md:block">
        <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl">
          {t('settings.profile.title')}
        </h1>
        <p className="max-w-2xl text-base text-default-500 md:text-lg">{t('settings.profile.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Avatar Section */}
        <Card className="border border-divider bg-content1">
          <CardBody className="flex flex-row items-center gap-4 p-4 sm:gap-6 sm:p-6">
            <div className="group relative shrink-0 cursor-pointer" onClick={handleAvatarClick}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="size-16 rounded-full object-cover shadow-2xl shadow-black/20 sm:size-24 md:size-32"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-2xl shadow-black/20 sm:size-24 sm:text-3xl md:size-32">
                  {(user?.nickname || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="text-white" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-4">
              <div>
                <h3 className="mb-1 text-base font-bold text-foreground sm:text-xl">
                  {t('settings.profile.avatar.title')}
                </h3>
                <p className="text-xs text-default-500 sm:text-sm">{t('settings.profile.avatar.description')}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  variant="bordered"
                  radius="full"
                  startContent={<Upload size={18} />}
                  isLoading={isUploading}
                  onPress={handleAvatarClick}
                >
                  {t('settings.profile.avatar.change')}
                </Button>
                <Button
                  variant="light"
                  color="danger"
                  radius="full"
                  startContent={<Trash2 size={18} />}
                  isLoading={isRemoving}
                  isDisabled={!user?.avatar}
                  onPress={handleAvatarRemove}
                >
                  {t('settings.profile.avatar.remove')}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Form */}
        <Card className="border border-divider bg-content1">
          <div className="border-b border-divider bg-content2/50 px-6 py-4">
            <h3 className="text-lg font-bold text-foreground">{t('settings.profile.form.personalInfo')}</h3>
            <p className="mt-1 text-xs text-default-400">UID: {user?.uid || '-'}</p>
          </div>
          <CardBody className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  {...register('nickname')}
                  label={t('settings.profile.form.nickname')}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="full"
                  placeholder={t('settings.profile.form.nicknamePlaceholder')}
                  isInvalid={!!errors.nickname}
                  errorMessage={errors.nickname?.message}
                  classNames={{
                    label: 'text-xs font-bold uppercase tracking-wider text-default-500',
                    inputWrapper: 'h-12',
                  }}
                />

                <div className="flex flex-col gap-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-default-500">
                    {t('settings.profile.form.email')}
                  </label>
                  {hasEmail ? (
                    <div className="relative">
                      <Input
                        value={user?.email || ''}
                        variant="bordered"
                        radius="full"
                        isReadOnly
                        classNames={{
                          inputWrapper: 'h-12 bg-content2/50',
                          input: 'text-default-500',
                        }}
                      />
                      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-success">
                        <CheckCircle size={14} />
                        <span className="text-xs font-bold">{t('settings.profile.form.verified')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-12 items-center justify-between rounded-full border-2 border-dashed border-warning/50 bg-warning/5 px-4">
                      <div className="flex items-center gap-2 text-warning">
                        <AlertCircle size={16} />
                        <span className="text-sm">{t('settings.profile.form.notBound')}</span>
                      </div>
                      <Button
                        size="sm"
                        color="warning"
                        variant="flat"
                        radius="full"
                        startContent={<Mail size={14} />}
                        onPress={bindEmailModal.onOpen}
                      >
                        {t('settings.profile.bindEmail.button')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-divider pt-6">
                <span className="text-sm text-default-500">
                  {t('settings.profile.form.lastUpdated', {
                    date: user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-',
                  })}
                </span>
                <Button
                  type="submit"
                  color="primary"
                  radius="full"
                  className="bg-gradient-to-r from-primary to-blue-600 font-bold text-white"
                  isLoading={isSubmitting}
                  isDisabled={!isDirty}
                >
                  {isSubmitting ? t('settings.profile.actions.saving') : t('settings.profile.actions.save')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <BindEmailModal
        isOpen={bindEmailModal.isOpen}
        onClose={bindEmailModal.onClose}
        onSuccess={() => {
          fetchUserInfo()
          bindEmailModal.onClose()
        }}
      />
    </div>
  )
}

function BindEmailModal({
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
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BindEmailFormData>({
    resolver: zodResolver(createBindEmailSchema()),
  })

  const emailValue = watch('email')

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!emailValue) return

    setIsSendingCode(true)
    try {
      await authApi.sendCode({ account: emailValue, scene: 'bind' })
      setCountdown(60)
      toast.success(t('settings.profile.bindEmail.codeSent'))
    } catch {
      // Error handled by request interceptor
    } finally {
      setIsSendingCode(false)
    }
  }

  const onSubmit = async (data: BindEmailFormData) => {
    setIsSubmitting(true)
    try {
      await authApi.updateProfile({ email: data.email, code: data.code })
      toast.success(t('settings.profile.bindEmail.success'))
      reset()
      setCountdown(0)
      onSuccess()
    } catch {
      // Error handled by request interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setCountdown(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>{t('settings.profile.bindEmail.title')}</ModalHeader>
        <ModalBody>
          <p className="mb-4 text-default-500">{t('settings.profile.bindEmail.description')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              {...register('email')}
              type="email"
              label={t('settings.profile.bindEmail.email')}
              placeholder={t('settings.profile.bindEmail.emailPlaceholder')}
              labelPlacement="outside"
              variant="bordered"
              radius="full"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              classNames={{ inputWrapper: 'h-12' }}
            />
            <div>
              <div className="flex items-end gap-2">
                <Input
                  {...register('code')}
                  label={t('settings.profile.bindEmail.code')}
                  placeholder={t('settings.profile.bindEmail.codePlaceholder')}
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
                  isDisabled={countdown > 0 || !emailValue}
                  onPress={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : t('settings.profile.bindEmail.sendCode')}
                </Button>
              </div>
              {errors.code?.message && <p className="mt-1 text-xs text-danger">{errors.code.message}</p>}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" radius="full" onPress={handleClose}>
            {t('settings.profile.bindEmail.cancel')}
          </Button>
          <Button color="primary" radius="full" isLoading={isSubmitting} onPress={() => handleSubmit(onSubmit)()}>
            {isSubmitting ? t('settings.profile.bindEmail.submitting') : t('settings.profile.bindEmail.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
