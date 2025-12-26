# Auth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现登录和注册页面，包含表单验证、API 对接、Token 存储和登录态管理。

**Architecture:** 使用 Zustand 管理认证状态，react-hook-form + zod 处理表单验证，API 调用基于已有的 request 封装。登录/注册页面使用独立布局，复用 AuthCard 等共享组件。

**Tech Stack:** React 19, HeroUI, Zustand, react-hook-form, zod, Axios

---

## Task 1: 安装依赖

**Files:**

- Modify: `apps/web/package.json`

**Step 1: 安装 react-hook-form 和 zod**

```bash
pnpm --filter @bingo/web add react-hook-form zod @hookform/resolvers
```

**Step 2: 验证安装成功**

```bash
pnpm --filter @bingo/web list react-hook-form zod
```

Expected: 显示已安装的版本

**Step 3: Commit**

```bash
git add pnpm-lock.yaml apps/web/package.json
git commit -m "chore(web): add react-hook-form and zod dependencies"
```

---

## Task 2: 创建 API 类型和接口

**Files:**

- Create: `packages/core/src/api/auth.ts`
- Modify: `packages/core/src/api/index.ts`

**Step 1: 创建 auth API 文件**

```typescript
// packages/core/src/api/auth.ts
// ABOUTME: Authentication API endpoints
// ABOUTME: Handles login, register, and user info requests

import { request } from './request'

export type AuthType = 'username' | 'email' | 'phone'

export interface LoginRequest {
  authType: AuthType
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
}

export interface RegisterRequest {
  authType: AuthType
  email: string
  password: string
  nickname?: string
}

export interface UserInfo {
  uid: string
  username: string
  email: string
  nickname: string
  avatar: string
  status: number
  createdAt: string
  updatedAt: string
}

export const authApi = {
  login: (data: LoginRequest) => request.post<LoginResponse>('/v1/auth/login', data),

  register: (data: RegisterRequest) => request.post<void>('/v1/auth/register', data),

  getUserInfo: () => request.get<UserInfo>('/v1/auth/user-info'),
}
```

**Step 2: 导出 auth API**

在 `packages/core/src/api/index.ts` 添加:

```typescript
export * from './auth'
```

**Step 3: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web && pnpm --filter @bingo/core tsc --noEmit
```

**Step 4: Commit**

```bash
git add packages/core/src/api/auth.ts packages/core/src/api/index.ts
git commit -m "feat(core): add auth API types and endpoints"
```

---

## Task 3: 创建表单验证 Schema

**Files:**

- Create: `apps/web/src/schemas/auth.ts`
- Create: `apps/web/src/schemas/index.ts`

**Step 1: 创建 auth schema 文件**

```typescript
// apps/web/src/schemas/auth.ts
// ABOUTME: Zod validation schemas for auth forms
// ABOUTME: Defines login and register form validation rules

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    confirmPassword: z.string().min(1, '请确认密码'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: '请同意服务条款' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
```

**Step 2: 创建 index 导出文件**

```typescript
// apps/web/src/schemas/index.ts
// ABOUTME: Schema exports
// ABOUTME: Re-exports all validation schemas

export * from './auth'
```

**Step 3: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web/apps/web && npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add apps/web/src/schemas/
git commit -m "feat(web): add zod validation schemas for auth forms"
```

---

## Task 4: 创建 Auth Store

**Files:**

- Create: `packages/core/src/stores/authStore.ts`
- Modify: `packages/core/src/stores/index.ts`

**Step 1: 创建 authStore**

```typescript
// packages/core/src/stores/authStore.ts
// ABOUTME: Authentication state management with Zustand
// ABOUTME: Handles user session, token storage, and auth actions

import { create } from 'zustand'
import { authApi, type UserInfo, type LoginRequest, type RegisterRequest } from '../api/auth'

const TOKEN_KEY = 'accessToken'
const EXPIRES_KEY = 'expiresAt'

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchUserInfo: () => Promise<void>
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const data: LoginRequest = { authType: 'email', email, password }
      const response = await authApi.login(data)

      localStorage.setItem(TOKEN_KEY, response.accessToken)
      localStorage.setItem(EXPIRES_KEY, response.expiresAt)

      set({
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
        isAuthenticated: true,
      })

      await get().fetchUserInfo()
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const data: RegisterRequest = { authType: 'email', email, password }
      await authApi.register(data)
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_KEY)
    set({
      user: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
    })
  },

  fetchUserInfo: async () => {
    try {
      const user = await authApi.getUserInfo()
      set({ user })
    } catch {
      get().logout()
    }
  },

  initAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    const expiresAt = localStorage.getItem(EXPIRES_KEY)

    if (token && expiresAt) {
      set({ accessToken: token, expiresAt, isAuthenticated: true })
      await get().fetchUserInfo()
    }
  },
}))
```

**Step 2: 导出 authStore**

在 `packages/core/src/stores/index.ts` 添加:

```typescript
// Export stores
export { useAuthStore } from './authStore'
```

**Step 3: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web && pnpm --filter @bingo/core tsc --noEmit
```

**Step 4: Commit**

```bash
git add packages/core/src/stores/
git commit -m "feat(core): add auth store with Zustand"
```

---

## Task 5: 更新 Request 拦截器

**Files:**

- Modify: `packages/core/src/api/request.ts`

**Step 1: 添加 Token 到请求头**

更新 request interceptor:

```typescript
// packages/core/src/api/request.ts
// ABOUTME: Axios request wrapper with interceptors
// ABOUTME: Provides typed HTTP methods and response handling

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const TOKEN_KEY = 'accessToken'

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message || 'Request failed'))
    }
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('expiresAt')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<ApiResponse<T>>(url, config).then((res) => res.data.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<ApiResponse<T>>(url, config).then((res) => res.data.data),
}

export default request
```

**Step 2: Commit**

```bash
git add packages/core/src/api/request.ts
git commit -m "feat(core): add token to request headers and handle 401"
```

---

## Task 6: 添加 i18n 翻译文件

**Files:**

- Create: `apps/web/src/locales/langs/zh-CN/auth.json`
- Create: `apps/web/src/locales/langs/en-US/auth.json`

**Step 1: 创建中文翻译**

```json
{
  "login": {
    "title": "欢迎回来",
    "subtitle": "登录您的账户继续使用",
    "email": "邮箱地址",
    "emailPlaceholder": "name@example.com",
    "password": "密码",
    "passwordPlaceholder": "输入密码",
    "rememberMe": "记住我",
    "forgotPassword": "忘记密码？",
    "submit": "登录",
    "submitting": "登录中...",
    "noAccount": "还没有账户？",
    "signUp": "立即注册",
    "orContinueWith": "或使用以下方式登录",
    "continueWithGoogle": "使用 Google 登录",
    "continueWithGithub": "使用 GitHub 登录",
    "success": "登录成功",
    "error": "邮箱或密码错误"
  },
  "register": {
    "title": "创建账户",
    "subtitle": "开始您的旅程",
    "confirmPassword": "确认密码",
    "confirmPasswordPlaceholder": "再次输入密码",
    "agreeTerms": "我同意",
    "termsOfService": "服务条款",
    "and": "和",
    "privacyPolicy": "隐私政策",
    "submit": "创建账户",
    "submitting": "创建中...",
    "hasAccount": "已有账户？",
    "signIn": "立即登录",
    "success": "注册成功，请登录",
    "error": "注册失败，请重试"
  },
  "common": {
    "backToHome": "返回首页",
    "copyright": "© 2024 Bingo. All rights reserved."
  },
  "errors": {
    "emailRequired": "请输入邮箱",
    "emailInvalid": "邮箱格式不正确",
    "passwordRequired": "请输入密码",
    "passwordMin": "密码至少 6 位",
    "passwordMax": "密码最多 18 位",
    "passwordMismatch": "两次密码不一致",
    "confirmPasswordRequired": "请确认密码",
    "agreeTermsRequired": "请同意服务条款"
  }
}
```

**Step 2: 创建英文翻译**

```json
{
  "login": {
    "title": "Welcome back",
    "subtitle": "Sign in to your account to continue",
    "email": "Email Address",
    "emailPlaceholder": "name@example.com",
    "password": "Password",
    "passwordPlaceholder": "Enter password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "submit": "Sign in",
    "submitting": "Signing in...",
    "noAccount": "Don't have an account?",
    "signUp": "Sign up",
    "orContinueWith": "or continue with",
    "continueWithGoogle": "Continue with Google",
    "continueWithGithub": "Continue with GitHub",
    "success": "Login successful",
    "error": "Invalid email or password"
  },
  "register": {
    "title": "Create your account",
    "subtitle": "Start your journey with us",
    "confirmPassword": "Confirm Password",
    "confirmPasswordPlaceholder": "Enter password again",
    "agreeTerms": "I agree to the",
    "termsOfService": "Terms of Service",
    "and": "and",
    "privacyPolicy": "Privacy Policy",
    "submit": "Create account",
    "submitting": "Creating...",
    "hasAccount": "Already have an account?",
    "signIn": "Sign in",
    "success": "Registration successful, please sign in",
    "error": "Registration failed, please try again"
  },
  "common": {
    "backToHome": "Back to home",
    "copyright": "© 2024 Bingo. All rights reserved."
  },
  "errors": {
    "emailRequired": "Please enter email",
    "emailInvalid": "Invalid email format",
    "passwordRequired": "Please enter password",
    "passwordMin": "Password must be at least 6 characters",
    "passwordMax": "Password must be at most 18 characters",
    "passwordMismatch": "Passwords do not match",
    "confirmPasswordRequired": "Please confirm password",
    "agreeTermsRequired": "Please agree to the terms"
  }
}
```

**Step 3: Commit**

```bash
git add apps/web/src/locales/langs/
git commit -m "feat(web): add i18n translations for auth pages"
```

---

## Task 7: 创建共享 Auth 组件

**Files:**

- Create: `apps/web/src/components/auth/AuthHeader.tsx`
- Create: `apps/web/src/components/auth/AuthFooter.tsx`
- Create: `apps/web/src/components/auth/AuthCard.tsx`
- Create: `apps/web/src/components/auth/Divider.tsx`
- Create: `apps/web/src/components/auth/PasswordInput.tsx`
- Create: `apps/web/src/components/auth/OAuthButtons.tsx`
- Create: `apps/web/src/components/auth/index.ts`

**Step 1: 创建 AuthHeader**

```tsx
// apps/web/src/components/auth/AuthHeader.tsx
// ABOUTME: Auth page header component
// ABOUTME: Contains logo and back to home link

import { Link } from 'react-router'
import { Button } from '@heroui/react'
import { useTranslation } from '@/locales'

export function AuthHeader() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </div>
          <span className="text-xl font-medium tracking-tight text-white">Bingo</span>
        </Link>

        <Button
          as={Link}
          to="/"
          variant="bordered"
          radius="full"
          className="border-white/10 text-white hover:bg-white/5"
          startContent={<span className="material-symbols-outlined text-[18px]">arrow_back</span>}
        >
          {t('auth.common.backToHome')}
        </Button>
      </div>
    </header>
  )
}
```

**Step 2: 创建 AuthFooter**

```tsx
// apps/web/src/components/auth/AuthFooter.tsx
// ABOUTME: Auth page footer component
// ABOUTME: Contains copyright and legal links

import { Link } from 'react-router'
import { useTranslation } from '@/locales'

export function AuthFooter() {
  const { t } = useTranslation()

  return (
    <footer className="mt-12 flex flex-col items-center gap-4 text-xs text-slate-500">
      <div className="flex gap-6">
        <Link to="/terms" className="transition-colors hover:text-primary">
          {t('auth.register.termsOfService')}
        </Link>
        <Link to="/privacy" className="transition-colors hover:text-primary">
          {t('auth.register.privacyPolicy')}
        </Link>
      </div>
      <p>{t('auth.common.copyright')}</p>
    </footer>
  )
}
```

**Step 3: 创建 AuthCard**

```tsx
// apps/web/src/components/auth/AuthCard.tsx
// ABOUTME: Auth form card container
// ABOUTME: Provides consistent styling for login/register forms

import { Card, CardBody } from '@heroui/react'
import type { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-[440px] border border-white/5 bg-[#1e162e] shadow-2xl" radius="lg">
      <CardBody className="p-8">{children}</CardBody>
    </Card>
  )
}
```

**Step 4: 创建 Divider**

```tsx
// apps/web/src/components/auth/Divider.tsx
// ABOUTME: Text divider component
// ABOUTME: Used between OAuth buttons and email form

interface DividerProps {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{text}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}
```

**Step 5: 创建 PasswordInput**

```tsx
// apps/web/src/components/auth/PasswordInput.tsx
// ABOUTME: Password input with visibility toggle
// ABOUTME: Wraps HeroUI Input with show/hide functionality

import { useState } from 'react'
import { Input, type InputProps } from '@heroui/react'

type PasswordInputProps = Omit<InputProps, 'type' | 'endContent'>

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      endContent={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-slate-400 transition-colors hover:text-white focus:outline-none"
        >
          <span className="material-symbols-outlined text-[20px]">{isVisible ? 'visibility_off' : 'visibility'}</span>
        </button>
      }
    />
  )
}
```

**Step 6: 创建 OAuthButtons**

```tsx
// apps/web/src/components/auth/OAuthButtons.tsx
// ABOUTME: OAuth login buttons (Google, GitHub)
// ABOUTME: Placeholder for future OAuth implementation

import { Button } from '@heroui/react'
import { useTranslation } from '@/locales'

export function OAuthButtons() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="bordered"
        radius="full"
        className="h-12 border-white/10 bg-[#2f2348] text-white hover:bg-[#3a2c58]"
        startContent={
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
      >
        {t('auth.login.continueWithGoogle')}
      </Button>

      <Button
        variant="bordered"
        radius="full"
        className="h-12 border-white/10 bg-[#2f2348] text-white hover:bg-[#3a2c58]"
        startContent={
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        }
      >
        {t('auth.login.continueWithGithub')}
      </Button>
    </div>
  )
}
```

**Step 7: 创建 index 导出**

```typescript
// apps/web/src/components/auth/index.ts
// ABOUTME: Auth components exports
// ABOUTME: Re-exports all auth-related components

export { AuthHeader } from './AuthHeader'
export { AuthFooter } from './AuthFooter'
export { AuthCard } from './AuthCard'
export { Divider } from './Divider'
export { PasswordInput } from './PasswordInput'
export { OAuthButtons } from './OAuthButtons'
```

**Step 8: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web/apps/web && npx tsc --noEmit
```

**Step 9: Commit**

```bash
git add apps/web/src/components/auth/
git commit -m "feat(web): add shared auth components"
```

---

## Task 8: 创建登录页面

**Files:**

- Create: `apps/web/src/pages/Login.tsx`
- Modify: `apps/web/src/pages/index.ts`

**Step 1: 创建 Login 页面**

```tsx
// apps/web/src/pages/Login.tsx
// ABOUTME: User login page
// ABOUTME: Email/password login with OAuth options

import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox, addToast } from '@heroui/react'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { loginSchema, type LoginFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, Divider, PasswordInput, OAuthButtons } from '@/components/auth'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const { login, isAuthenticated, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, navigate, redirect])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      addToast({ type: 'success', title: t('auth.login.success') })
      navigate(redirect, { replace: true })
    } catch {
      addToast({ type: 'error', title: t('auth.login.error') })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#161022]">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-[440px]">
          <AuthCard>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white">{t('auth.login.title')}</h1>
              <p className="text-sm text-slate-400">{t('auth.login.subtitle')}</p>
            </div>

            {/* OAuth */}
            <OAuthButtons />

            <Divider text={t('auth.login.orContinueWith')} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                {...register('email')}
                type="email"
                label={t('auth.login.email')}
                placeholder={t('auth.login.emailPlaceholder')}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                startContent={<span className="material-symbols-outlined text-[20px] text-slate-400">mail</span>}
                classNames={{
                  input: 'bg-[#100c18] text-white',
                  inputWrapper: 'bg-[#100c18] border-white/10 hover:border-primary',
                }}
              />

              <PasswordInput
                {...register('password')}
                label={t('auth.login.password')}
                placeholder={t('auth.login.passwordPlaceholder')}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                startContent={<span className="material-symbols-outlined text-[20px] text-slate-400">lock</span>}
                classNames={{
                  input: 'bg-[#100c18] text-white',
                  inputWrapper: 'bg-[#100c18] border-white/10 hover:border-primary',
                }}
              />

              <div className="flex items-center justify-between px-1">
                <Checkbox {...register('rememberMe')} size="sm" classNames={{ label: 'text-sm text-slate-400' }}>
                  {t('auth.login.rememberMe')}
                </Checkbox>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                radius="full"
                className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold"
                isLoading={isLoading}
              >
                {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
              </Button>
            </form>
          </AuthCard>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="font-bold text-white hover:text-primary">
              {t('auth.login.signUp')}
            </Link>
          </p>

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
```

**Step 2: 导出 LoginPage**

在 `apps/web/src/pages/index.ts` 添加:

```typescript
export { LoginPage } from './Login'
```

**Step 3: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web/apps/web && npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add apps/web/src/pages/Login.tsx apps/web/src/pages/index.ts
git commit -m "feat(web): add login page"
```

---

## Task 9: 创建注册页面

**Files:**

- Create: `apps/web/src/pages/Register.tsx`
- Modify: `apps/web/src/pages/index.ts`

**Step 1: 创建 Register 页面**

```tsx
// apps/web/src/pages/Register.tsx
// ABOUTME: User registration page
// ABOUTME: Email/password registration with terms agreement

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox, addToast } from '@heroui/react'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { registerSchema, type RegisterFormData } from '@/schemas'
import { AuthHeader, AuthFooter, AuthCard, Divider, PasswordInput, OAuthButtons } from '@/components/auth'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { register: registerUser, isAuthenticated, isLoading } = useAuthStore()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password)
      addToast({ type: 'success', title: t('auth.register.success') })
      navigate('/login', { replace: true })
    } catch {
      addToast({ type: 'error', title: t('auth.register.error') })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#161022]">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-[440px]">
          <AuthCard>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white">{t('auth.register.title')}</h1>
              <p className="text-sm text-slate-400">{t('auth.register.subtitle')}</p>
            </div>

            {/* OAuth */}
            <OAuthButtons />

            <Divider text={t('auth.login.orContinueWith')} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                {...register('email')}
                type="email"
                label={t('auth.login.email')}
                placeholder={t('auth.login.emailPlaceholder')}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                startContent={<span className="material-symbols-outlined text-[20px] text-slate-400">mail</span>}
                classNames={{
                  input: 'bg-[#100c18] text-white',
                  inputWrapper: 'bg-[#100c18] border-white/10 hover:border-primary',
                }}
              />

              <PasswordInput
                {...register('password')}
                label={t('auth.login.password')}
                placeholder={t('auth.login.passwordPlaceholder')}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                startContent={<span className="material-symbols-outlined text-[20px] text-slate-400">lock</span>}
                classNames={{
                  input: 'bg-[#100c18] text-white',
                  inputWrapper: 'bg-[#100c18] border-white/10 hover:border-primary',
                }}
              />

              <PasswordInput
                {...register('confirmPassword')}
                label={t('auth.register.confirmPassword')}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                startContent={<span className="material-symbols-outlined text-[20px] text-slate-400">lock_reset</span>}
                classNames={{
                  input: 'bg-[#100c18] text-white',
                  inputWrapper: 'bg-[#100c18] border-white/10 hover:border-primary',
                }}
              />

              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <div className="px-1">
                    <Checkbox
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      size="sm"
                      isInvalid={!!errors.agreeTerms}
                      classNames={{ label: 'text-xs text-slate-400' }}
                    >
                      {t('auth.register.agreeTerms')}{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        {t('auth.register.termsOfService')}
                      </Link>{' '}
                      {t('auth.register.and')}{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        {t('auth.register.privacyPolicy')}
                      </Link>
                    </Checkbox>
                    {errors.agreeTerms && <p className="mt-1 text-xs text-danger">{errors.agreeTerms.message}</p>}
                  </div>
                )}
              />

              <Button
                type="submit"
                color="primary"
                radius="full"
                className="mt-2 h-12 bg-gradient-to-r from-primary to-blue-600 text-base font-bold"
                isLoading={isLoading}
              >
                {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
              </Button>
            </form>
          </AuthCard>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="font-bold text-white hover:text-primary">
              {t('auth.register.signIn')}
            </Link>
          </p>

          <AuthFooter />
        </div>
      </main>
    </div>
  )
}
```

**Step 2: 导出 RegisterPage**

在 `apps/web/src/pages/index.ts` 添加:

```typescript
export { RegisterPage } from './Register'
```

**Step 3: Commit**

```bash
git add apps/web/src/pages/Register.tsx apps/web/src/pages/index.ts
git commit -m "feat(web): add register page"
```

---

## Task 10: 更新路由配置

**Files:**

- Modify: `apps/web/src/routes/index.tsx`

**Step 1: 添加登录和注册路由**

```tsx
// apps/web/src/routes/index.tsx
// ABOUTME: Application router configuration
// ABOUTME: Defines all routes using React Router 7

import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts'
import { HomePage, AboutPage, LoginPage, RegisterPage } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
])
```

**Step 2: 验证 TypeScript 编译**

```bash
cd /root/workspace/code/bingo-project/bingo-web/apps/web && npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add apps/web/src/routes/index.tsx
git commit -m "feat(web): add login and register routes"
```

---

## Task 11: 验证完整功能

**Step 1: 启动开发服务器**

```bash
cd /root/workspace/code/bingo-project/bingo-web && pnpm --filter @bingo/web dev
```

**Step 2: 验证页面**

- 访问 http://localhost:5173/login - 登录页面应正常渲染
- 访问 http://localhost:5173/register - 注册页面应正常渲染
- 验证表单验证是否工作
- 验证 i18n 翻译是否正确
- 验证页面间跳转是否正常

**Step 3: 最终 Commit**

```bash
git add -A
git commit -m "feat(web): complete auth pages implementation"
```

---

## Summary

| Task | Description                     |
| ---- | ------------------------------- |
| 1    | 安装依赖 (react-hook-form, zod) |
| 2    | 创建 API 类型和接口             |
| 3    | 创建表单验证 Schema             |
| 4    | 创建 Auth Store                 |
| 5    | 更新 Request 拦截器             |
| 6    | 添加 i18n 翻译文件              |
| 7    | 创建共享 Auth 组件              |
| 8    | 创建登录页面                    |
| 9    | 创建注册页面                    |
| 10   | 更新路由配置                    |
| 11   | 验证完整功能                    |
