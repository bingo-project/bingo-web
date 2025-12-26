// ABOUTME: Zod validation schemas for auth forms
// ABOUTME: Defines login and register form validation rules

import { z } from 'zod'

export const loginSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    account: z.string().min(1, '请输入账号'),
    password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    confirmPassword: z.string().min(1, '请确认密码'),
    agreeTerms: z.literal(true, { message: '请同意服务条款' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
