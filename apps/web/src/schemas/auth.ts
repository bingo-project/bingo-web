// ABOUTME: Zod validation schemas for auth forms
// ABOUTME: Defines login and register form validation rules

import { z } from 'zod'

export const loginSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
  rememberMe: z.boolean().optional(),
})

export const registerEmailSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
})

export const registerFormSchema = z
  .object({
    code: z.string().min(1, '请输入验证码'),
    password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    confirmPassword: z.string().min(1, '请确认密码'),
    agreeTerms: z.literal(true, { message: '请同意服务条款' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
})

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, '请输入验证码'),
    password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterEmailFormData = z.infer<typeof registerEmailSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
