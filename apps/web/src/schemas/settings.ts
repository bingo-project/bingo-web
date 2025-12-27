// ABOUTME: Zod validation schemas for settings forms
// ABOUTME: Defines profile, password, and security form validation rules

import { z } from 'zod'

export const profileSchema = z.object({
  nickname: z.string().min(2, '昵称至少 2 个字符').max(255, '昵称最多 255 个字符'),
})

export const changePasswordSchema = z
  .object({
    passwordOld: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    passwordNew: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    passwordConfirm: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.passwordNew === data.passwordConfirm, {
    message: '两次密码不一致',
    path: ['passwordConfirm'],
  })

export const payPasswordSchema = z
  .object({
    loginPassword: z.string().min(6, '请输入登录密码').max(18),
    payPassword: z.string().length(6, '支付密码必须是 6 位数字').regex(/^\d+$/, '支付密码只能是数字'),
    payPasswordConfirm: z.string().min(1, '请确认支付密码'),
    code: z.string().min(1, '请输入验证码'),
  })
  .refine((data) => data.payPassword === data.payPasswordConfirm, {
    message: '两次支付密码不一致',
    path: ['payPasswordConfirm'],
  })

export const totpEnableSchema = z.object({
  code: z.string().length(6, '验证码必须是 6 位').regex(/^\d+$/, '验证码只能是数字'),
})

export const totpDisableSchema = z.object({
  code: z.string().length(6, '验证码必须是 6 位').regex(/^\d+$/, '验证码只能是数字'),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type PayPasswordFormData = z.infer<typeof payPasswordSchema>
export type TOTPEnableFormData = z.infer<typeof totpEnableSchema>
export type TOTPDisableFormData = z.infer<typeof totpDisableSchema>
