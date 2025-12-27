// ABOUTME: Zod validation schemas for auth forms
// ABOUTME: Defines login and register form validation rules

import { z } from 'zod'
import { $t } from '@bingo/locales'

export const createLoginSchema = () =>
  z.object({
    account: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.account') })),
    password: z
      .string()
      .min(6, $t('ui.formRules.minLength', { field: $t('auth.fields.password'), min: '6' }))
      .max(18, $t('ui.formRules.maxLength', { field: $t('auth.fields.password'), max: '18' })),
    rememberMe: z.boolean().optional(),
  })

export const createRegisterEmailSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, $t('ui.formRules.required', { field: $t('auth.fields.email') }))
      .email($t('ui.formRules.invalidEmail')),
  })

export const createRegisterFormSchema = () =>
  z
    .object({
      code: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.verificationCode') })),
      password: z
        .string()
        .min(6, $t('ui.formRules.minLength', { field: $t('auth.fields.password'), min: '6' }))
        .max(18, $t('ui.formRules.maxLength', { field: $t('auth.fields.password'), max: '18' })),
      confirmPassword: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.confirmPassword') })),
      agreeTerms: z.literal(true, { message: $t('errors.validation.agreeTermsRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: $t('ui.formRules.mismatch', { field: $t('auth.fields.passwords') }),
      path: ['confirmPassword'],
    })

export const createForgotPasswordSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, $t('ui.formRules.required', { field: $t('auth.fields.email') }))
      .email($t('ui.formRules.invalidEmail')),
  })

export const createResetPasswordSchema = () =>
  z
    .object({
      code: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.verificationCode') })),
      password: z
        .string()
        .min(6, $t('ui.formRules.minLength', { field: $t('auth.fields.password'), min: '6' }))
        .max(18, $t('ui.formRules.maxLength', { field: $t('auth.fields.password'), max: '18' })),
      confirmPassword: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.confirmPassword') })),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: $t('ui.formRules.mismatch', { field: $t('auth.fields.passwords') }),
      path: ['confirmPassword'],
    })

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterEmailFormData = z.infer<ReturnType<typeof createRegisterEmailSchema>>
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterFormSchema>>
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>
export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>
