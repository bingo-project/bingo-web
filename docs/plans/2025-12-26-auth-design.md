# 用户认证系统设计

## 概述

实现登录和注册功能，包含邮箱密码登录、OAuth 登录（预留）、表单验证、登录态管理。

## 范围

**本次实现（最小可用）：**

- 登录页 + 注册页 UI
- API 对接
- Token 存储
- 登录态管理

**后续扩展：**

- OAuth 登录 (Google/GitHub)
- 忘记密码
- 邮箱验证
- 路由守卫

## 架构

```
apps/web/src/
├── pages/
│   ├── Login.tsx
│   └── Register.tsx
├── components/
│   └── auth/
│       ├── AuthCard.tsx
│       ├── AuthHeader.tsx
│       ├── AuthFooter.tsx
│       ├── OAuthButtons.tsx
│       ├── Divider.tsx
│       └── PasswordInput.tsx
├── stores/
│   └── authStore.ts
├── api/
│   └── auth.ts
├── schemas/
│   └── auth.ts
└── locales/
    ├── zh-CN/auth.json
    └── en-US/auth.json
```

## 状态管理

**authStore.ts (Zustand)**

```typescript
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
}
```

**Token 持久化：**

- 登录成功 → accessToken 存入 localStorage
- 页面刷新 → 从 localStorage 恢复，调用 /user-info 验证
- 退出登录 → 清除 localStorage 和 store

## 表单验证

**schemas/auth.ts (Zod)**

```typescript
export const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少 6 位').max(18, '密码最多 18 位'),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, '请同意服务条款'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })
```

## API 接口

**api/auth.ts**

```typescript
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

export const authApi = {
  login: (data: LoginRequest) => request.post<LoginResponse>('/v1/auth/login', data),
  register: (data: RegisterRequest) => request.post('/v1/auth/register', data),
  getUserInfo: () => request.get<UserInfo>('/v1/auth/user-info'),
}
```

**前端固定使用 `authType: 'email'`**

## 路由配置

```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])
```

**跳转逻辑：**

- 登录成功 → `/` 或 redirect 参数
- 注册成功 → `/login` + Toast 提示
- 已登录访问 /login → 重定向 `/`

## 错误处理

| 场景       | Toast 类型 | 消息             |
| ---------- | ---------- | ---------------- |
| 登录成功   | success    | 登录成功         |
| 注册成功   | success    | 注册成功，请登录 |
| 密码错误   | error      | 邮箱或密码错误   |
| 邮箱已注册 | error      | 该邮箱已注册     |
| 网络异常   | error      | 网络异常，请重试 |

## UI 设计参考

- 登录页：`docs/ui/generated/bingo_web_scaffold_login_page/`
- 注册页：`docs/ui/generated/bingo_web_scaffold_registration_page/`

## 技术栈

- 表单：react-hook-form + zod
- 状态：Zustand
- UI：HeroUI (Input, Button, Checkbox, Card)
- 请求：Axios
- i18n：react-i18next
