// ABOUTME: Zod validation schemas for settings forms
// ABOUTME: Defines profile, password, and security form validation rules

import { z } from 'zod'
import { $t } from '@bingo/locales'

export const createProfileSchema = () =>
  z.object({
    nickname: z
      .string()
      .min(2, $t('ui.formRules.minLength', { field: $t('settings.fields.nickname'), min: '2' }))
      .max(255, $t('ui.formRules.maxLength', { field: $t('settings.fields.nickname'), max: '255' })),
  })

export const createChangePasswordSchema = () =>
  z
    .object({
      passwordOld: z
        .string()
        .min(6, $t('ui.formRules.minLength', { field: $t('settings.fields.currentPassword'), min: '6' }))
        .max(18, $t('ui.formRules.maxLength', { field: $t('settings.fields.currentPassword'), max: '18' })),
      passwordNew: z
        .string()
        .min(6, $t('ui.formRules.minLength', { field: $t('settings.fields.newPassword'), min: '6' }))
        .max(18, $t('ui.formRules.maxLength', { field: $t('settings.fields.newPassword'), max: '18' })),
      passwordConfirm: z.string().min(1, $t('ui.formRules.required', { field: $t('settings.fields.confirmPassword') })),
    })
    .refine((data) => data.passwordNew === data.passwordConfirm, {
      message: $t('ui.formRules.mismatch', { field: $t('settings.fields.passwords') }),
      path: ['passwordConfirm'],
    })

export const createPayPasswordSchema = (totpEnabled: boolean = false) =>
  z
    .object({
      loginPassword: z
        .string()
        .min(6, $t('ui.formRules.minLength', { field: $t('settings.fields.loginPassword'), min: '6' }))
        .max(18, $t('ui.formRules.maxLength', { field: $t('settings.fields.loginPassword'), max: '18' })),
      payPassword: z
        .string()
        .length(6, $t('ui.formRules.length', { field: $t('settings.fields.payPassword'), len: '6' }))
        .regex(/^\d+$/, $t('ui.formRules.digitsOnly', { field: $t('settings.fields.payPassword') })),
      payPasswordConfirm: z
        .string()
        .min(1, $t('ui.formRules.required', { field: $t('settings.fields.confirmPayPassword') })),
      code: z.string().min(1, $t('ui.formRules.required', { field: $t('settings.fields.verificationCode') })),
      totpCode: totpEnabled
        ? z
            .string()
            .length(6, $t('ui.formRules.length', { field: $t('settings.fields.totpCode'), len: '6' }))
            .regex(/^\d+$/, $t('ui.formRules.digitsOnly', { field: $t('settings.fields.totpCode') }))
        : z.string().optional(),
    })
    .refine((data) => data.payPassword === data.payPasswordConfirm, {
      message: $t('ui.formRules.mismatch', { field: $t('settings.fields.payPasswords') }),
      path: ['payPasswordConfirm'],
    })

export const createTotpEnableSchema = () =>
  z.object({
    code: z
      .string()
      .length(6, $t('ui.formRules.length', { field: $t('settings.fields.totpCode'), len: '6' }))
      .regex(/^\d+$/, $t('ui.formRules.digitsOnly', { field: $t('settings.fields.totpCode') })),
  })

export const createTotpDisableSchema = () =>
  z.object({
    verifyCode: z.string().min(1, $t('ui.formRules.required', { field: $t('settings.fields.emailCode') })),
    totpCode: z
      .string()
      .length(6, $t('ui.formRules.length', { field: $t('settings.fields.totpCode'), len: '6' }))
      .regex(/^\d+$/, $t('ui.formRules.digitsOnly', { field: $t('settings.fields.totpCode') })),
  })

export const createBindEmailSchema = () =>
  z.object({
    email: z.string().email($t('ui.formRules.invalidEmail')),
    code: z.string().min(1, $t('ui.formRules.required', { field: $t('settings.fields.verificationCode') })),
  })

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>
export type ChangePasswordFormData = z.infer<ReturnType<typeof createChangePasswordSchema>>
export type PayPasswordFormData = z.infer<ReturnType<typeof createPayPasswordSchema>>
export type TOTPEnableFormData = z.infer<ReturnType<typeof createTotpEnableSchema>>
export type TOTPDisableFormData = z.infer<ReturnType<typeof createTotpDisableSchema>>
export type BindEmailFormData = z.infer<ReturnType<typeof createBindEmailSchema>>
