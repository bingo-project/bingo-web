// ABOUTME: Zod validation schemas for settings forms
// ABOUTME: Defines profile, password, and security form validation rules

import { z } from 'zod'
import { $t } from '@bingo/locales'

export const profileSchema = z.object({
  nickname: z.string().min(2, $t('errors.validation.nicknameMin')).max(255, $t('errors.validation.nicknameMax')),
})

export const changePasswordSchema = z
  .object({
    passwordOld: z.string().min(6, $t('errors.validation.passwordMin')).max(18, $t('errors.validation.passwordMax')),
    passwordNew: z.string().min(6, $t('errors.validation.passwordMin')).max(18, $t('errors.validation.passwordMax')),
    passwordConfirm: z.string().min(1, $t('errors.validation.confirmPasswordRequired')),
  })
  .refine((data) => data.passwordNew === data.passwordConfirm, {
    message: $t('errors.validation.passwordMismatch'),
    path: ['passwordConfirm'],
  })

export const payPasswordSchema = z
  .object({
    loginPassword: z.string().min(6, $t('errors.validation.passwordMin')).max(18, $t('errors.validation.passwordMax')),
    payPassword: z
      .string()
      .length(6, $t('errors.validation.payPasswordLength'))
      .regex(/^\d+$/, $t('errors.validation.payPasswordDigits')),
    payPasswordConfirm: z.string().min(1, $t('errors.validation.confirmPayPasswordRequired')),
    code: z.string().min(1, $t('errors.validation.codeRequired')),
    totpCode: z.string().optional(),
  })
  .refine((data) => data.payPassword === data.payPasswordConfirm, {
    message: $t('errors.validation.payPasswordMismatch'),
    path: ['payPasswordConfirm'],
  })

export const totpEnableSchema = z.object({
  code: z
    .string()
    .length(6, $t('errors.validation.totpCodeLength'))
    .regex(/^\d+$/, $t('errors.validation.totpCodeDigits')),
})

export const totpDisableSchema = z.object({
  verifyCode: z.string().min(1, $t('errors.validation.emailCodeRequired')),
  totpCode: z
    .string()
    .length(6, $t('errors.validation.totpCodeLength'))
    .regex(/^\d+$/, $t('errors.validation.totpCodeDigits')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type PayPasswordFormData = z.infer<typeof payPasswordSchema>
export type TOTPEnableFormData = z.infer<typeof totpEnableSchema>
export type TOTPDisableFormData = z.infer<typeof totpDisableSchema>
