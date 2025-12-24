# bingo-web 基础设施配置计划

## 目标

为 bingo-web PC 端配齐以下基础设施：

1. ESLint + Prettier - 代码规范
2. Husky + lint-staged - Git 提交检查
3. React Router 7 - 路由系统
4. react-i18next - 国际化
5. 基础 API 请求封装 - axios 封装 + 示例

## 当前状态

- ✅ Monorepo 结构已就绪
- ✅ `react-router@7.6.0` 已安装，但未配置
- ✅ `axios@1.7.9` 已在 `@bingo/core` 中，但未封装
- ❌ 无 ESLint/Prettier 配置
- ❌ 无 Husky/lint-staged
- ❌ 无 i18n 配置

---

## 任务分解

### 阶段 1: ESLint + Prettier

#### 1.1 安装依赖

```bash
pnpm add -Dw eslint@^9.x prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint @eslint/js globals
```

#### 1.2 创建根目录 ESLint 配置

创建 `eslint.config.js` (ESLint 9 flat config):

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['**/dist', '**/node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
)
```

#### 1.3 创建 Prettier 配置

创建 `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

创建 `.prettierignore`:

```
dist
node_modules
pnpm-lock.yaml
```

#### 1.4 更新根 package.json scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### 1.5 验证

- [ ] `pnpm lint` 无报错或只有可修复的警告
- [ ] `pnpm format:check` 检查格式
- [ ] `pnpm format` 格式化代码

---

### 阶段 2: Husky + lint-staged

#### 2.1 安装依赖

```bash
pnpm add -Dw husky lint-staged
```

#### 2.2 初始化 Husky

```bash
pnpm exec husky init
```

#### 2.3 配置 lint-staged

在根 `package.json` 添加:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

#### 2.4 配置 pre-commit hook

编辑 `.husky/pre-commit`:

```bash
pnpm exec lint-staged
```

#### 2.5 验证

- [ ] 修改一个文件，故意引入 lint 错误
- [ ] `git commit` 被阻止
- [ ] 修复错误后 commit 成功

---

### 阶段 3: React Router 7

#### 3.1 创建路由配置

创建 `apps/web/src/routes/index.tsx`:

```tsx
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/Home'
import { AboutPage } from '@/pages/About'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])
```

#### 3.2 创建布局组件

创建 `apps/web/src/layouts/RootLayout.tsx`:

```tsx
import { Outlet, Link } from 'react-router'

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <nav className="border-b p-4">
        <Link to="/" className="mr-4">
          Home
        </Link>
        <Link to="/about">About</Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
```

#### 3.3 创建示例页面

创建 `apps/web/src/pages/Home.tsx`:

```tsx
export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Home</h1>
      <p>Welcome to Bingo Web</p>
    </div>
  )
}
```

创建 `apps/web/src/pages/About.tsx`:

```tsx
export function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">About</h1>
      <p>About Bingo Web</p>
    </div>
  )
}
```

#### 3.4 更新 main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { HeroUIProvider } from '@heroui/react'
import { router } from './routes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </React.StrictMode>
)
```

#### 3.5 验证

- [ ] 访问 `/` 显示 Home 页面
- [ ] 访问 `/about` 显示 About 页面
- [ ] 导航链接切换正常

---

### 阶段 4: react-i18next

#### 4.1 安装依赖

```bash
pnpm add -w react-i18next i18next
```

#### 4.2 创建 locales 包

创建 `packages/locales/package.json`:

```json
{
  "name": "@bingo/locales",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "i18next": "^24.2.3",
    "react-i18next": "^15.4.1"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*"
  }
}
```

#### 4.3 创建语言文件

创建 `packages/locales/src/zh-CN/common.json`:

```json
{
  "nav": {
    "home": "首页",
    "about": "关于"
  },
  "home": {
    "title": "首页",
    "welcome": "欢迎来到 Bingo Web"
  },
  "about": {
    "title": "关于",
    "description": "关于 Bingo Web"
  }
}
```

创建 `packages/locales/src/en-US/common.json`:

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "title": "Home",
    "welcome": "Welcome to Bingo Web"
  },
  "about": {
    "title": "About",
    "description": "About Bingo Web"
  }
}
```

#### 4.4 创建 i18n 配置

创建 `packages/locales/src/index.ts`:

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './zh-CN/common.json'
import enUS from './en-US/common.json'

const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
export { useTranslation } from 'react-i18next'
```

#### 4.5 集成到 apps/web

更新 `apps/web/package.json` 添加依赖:

```json
{
  "dependencies": {
    "@bingo/locales": "workspace:*"
  }
}
```

更新 `apps/web/src/main.tsx`:

```tsx
import '@bingo/locales'
// ... 其他 imports
```

#### 4.6 更新页面使用 i18n

更新 `apps/web/src/layouts/RootLayout.tsx`:

```tsx
import { Outlet, Link } from 'react-router'
import { useTranslation } from '@bingo/locales'
import { Button } from '@heroui/react'

export function RootLayout() {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between border-b p-4">
        <div>
          <Link to="/" className="mr-4">
            {t('nav.home')}
          </Link>
          <Link to="/about">{t('nav.about')}</Link>
        </div>
        <Button size="sm" onPress={toggleLang}>
          {i18n.language === 'zh-CN' ? 'EN' : '中文'}
        </Button>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
```

#### 4.7 验证

- [ ] 页面默认显示中文
- [ ] 点击语言切换按钮可切换中/英文
- [ ] 导航和页面文案随语言变化

---

### 阶段 5: API 请求封装

#### 5.1 创建请求封装

创建 `packages/core/src/api/request.ts`:

```typescript
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

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

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可在此添加 token 等
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    if (data.code !== 0) {
      return Promise.reject(new Error(data.message || 'Request failed'))
    }
    return response
  },
  (error) => Promise.reject(error)
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

#### 5.2 创建示例 API

创建 `packages/core/src/api/example.ts`:

```typescript
import { request } from './request'

export interface User {
  id: number
  name: string
  email: string
}

export const userApi = {
  getUser: (id: number) => request.get<User>(`/users/${id}`),
  getUsers: () => request.get<User[]>('/users'),
}
```

#### 5.3 导出 API

更新 `packages/core/src/api/index.ts`:

```typescript
export { request } from './request'
export * from './example'
```

更新 `packages/core/src/index.ts`:

```typescript
export * from './stores'
export * from './hooks'
export * from './api'
```

#### 5.4 验证

- [ ] `@bingo/core` 导出 `request` 和 `userApi`
- [ ] TypeScript 类型正确

---

## 执行顺序总结

| 阶段 | 任务                | 预计文件变更                    |
| ---- | ------------------- | ------------------------------- |
| 1    | ESLint + Prettier   | 新增 3 文件, 修改 1 文件        |
| 2    | Husky + lint-staged | 新增 1 目录, 修改 1 文件        |
| 3    | React Router 7      | 新增 4 文件, 修改 2 文件        |
| 4    | react-i18next       | 新增 1 包 (5 文件), 修改 3 文件 |
| 5    | API 封装            | 新增 3 文件, 修改 1 文件        |

## 验收清单

- [ ] `pnpm lint` 无错误
- [ ] `pnpm format:check` 通过
- [ ] Git commit 触发 lint-staged 检查
- [ ] 路由切换正常 (/, /about)
- [ ] 中英文切换正常
- [ ] `@bingo/core` API 封装可用
