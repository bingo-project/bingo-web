# 项目规范

> **本文件是所有代码规范的唯一来源。**
>
> AI 生成代码前必须读取此文件。其他文档（如 component-reference、stitch-to-code）提供示例和流程，但规则以本文件为准。

---

## 核心原则：HeroUI 优先

引入新组件或实现新功能时，**必须优先查阅 HeroUI 官方文档**，使用框架推荐的写法。

```
决策流程：
    │
    ├─► 1. 查阅 HeroUI 官方文档（https://heroui.com/docs）
    │       └─► 有现成组件/方案？→ 直接使用
    │
    ├─► 2. 检查本项目是否有类似实现
    │       └─► 有？→ 复用现有模式
    │
    └─► 3. 仅在以下情况自定义：
            - 官方无对应组件
            - 设计需求与官方默认差异大
            - 自定义前需说明理由
```

**为什么？**

- HeroUI 内置 dark mode、无障碍、动画等支持
- 官方写法经过测试，兼容性有保障
- 自定义代码增加维护成本

---

## 目录

1. [文件规范](#1-文件规范)
2. [组件规范](#2-组件规范)
3. [样式规范](#3-样式规范)
4. [国际化规范](#4-国际化规范)
5. [表单规范](#5-表单规范)
6. [生成代码检查清单](#6-生成代码检查清单)

---

## 1. 文件规范

### 1.1 ABOUTME 注释（必须）

每个 `.tsx` 文件必须以 2 行 ABOUTME 注释开头，描述文件用途。

```tsx
// ❌ 禁止：没有 ABOUTME 注释
export function LoginPage() { ... }

// ❌ 禁止：只有 1 行
// ABOUTME: Login page
export function LoginPage() { ... }

// ✅ 必须：2 行 ABOUTME 注释
// ABOUTME: User login page
// ABOUTME: Email/password login with OAuth options
export function LoginPage() { ... }
```

**注释内容要求**：

- 第 1 行：文件/组件的名称或主要用途
- 第 2 行：具体功能或职责描述
- 使用英文书写

### 1.2 文件位置

```
apps/web/src/
├── pages/           # 页面组件（路由级别）
├── components/      # 可复用组件
│   ├── auth/        # 按功能域分组
│   ├── landing/
│   └── common/      # 通用组件
├── layouts/         # 布局组件
├── hooks/           # 自定义 hooks
├── schemas/         # Zod 验证 schema
├── locales/         # 国际化文件
└── routes/          # 路由配置
```

```tsx
// ❌ 禁止：页面组件放在 components/
components / LoginPage.tsx

// ✅ 必须：页面组件放在 pages/
pages / Login.tsx

// ❌ 禁止：可复用组件放在 pages/
pages / AuthCard.tsx

// ✅ 必须：可复用组件按功能域分组放在 components/
components / auth / AuthCard.tsx
```

### 1.3 命名规范

| 类型     | 规范                                           | 示例                            |
| -------- | ---------------------------------------------- | ------------------------------- |
| 页面组件 | PascalCase + `Page` 后缀（导出），文件名可省略 | `LoginPage` / `Login.tsx`       |
| 通用组件 | PascalCase                                     | `AuthCard` / `AuthCard.tsx`     |
| hooks    | camelCase + `use` 前缀                         | `useAuth` / `useAuth.ts`        |
| schemas  | camelCase + `create` 前缀 + `Schema` 后缀      | `createLoginSchema` / `auth.ts` |

---

## 2. 组件规范

### 2.1 使用 HeroUI 组件

```tsx
// ❌ 禁止：使用原生 HTML 元素
;<button className="rounded-full bg-purple-600 px-4 py-2 text-white">提交</button>

// ✅ 必须：使用 HeroUI 组件
import { Button } from '@heroui/react'
;<Button color="primary" radius="full">
  提交
</Button>
```

**组件映射表**：

| HTML 元素                 | HeroUI 组件                       | 备注              |
| ------------------------- | --------------------------------- | ----------------- |
| `<button>`                | `<Button>`                        |                   |
| `<input>`                 | `<Input>`                         |                   |
| `<input type="checkbox">` | `<Checkbox>`                      |                   |
| `<select>`                | `<Select>`                        |                   |
| `<a>` (导航)              | `<Link>` 或 React Router `<Link>` | 外部链接用 HeroUI |
| `<div>` (卡片)            | `<Card>`                          |                   |

### 2.2 颜色通过 Props

```tsx
// ❌ 禁止：使用 className 设置组件颜色
<Button className="bg-purple-600 text-white">

// ✅ 必须：使用 color prop
<Button color="primary">
<Button color="secondary">
<Button color="danger">
```

**可用颜色值**：`default` | `primary` | `secondary` | `success` | `warning` | `danger`

### 2.3 圆角通过 Props

```tsx
// ❌ 禁止：使用 className 设置圆角
<Button className="rounded-full">
<Input className="rounded-lg">

// ✅ 必须：使用 radius prop
<Button radius="full">
<Input radius="full">
```

**可用圆角值**：`none` | `sm` | `md` | `lg` | `full`

**项目默认值**：

| 组件     | 默认 radius      |
| -------- | ---------------- |
| Button   | `full`           |
| Input    | `full`           |
| Checkbox | `full`           |
| Card     | 保持默认（`lg`） |

### 2.4 图标使用 Lucide React

```tsx
// ❌ 禁止：Material Symbols
import { Visibility } from '@mui/icons-material'
;<span className="material-symbols-outlined">visibility</span>

// ❌ 禁止：其他图标库
import { FaEye } from 'react-icons/fa'

// ✅ 必须：Lucide React
import { Eye, Mail, Lock, ArrowRight } from 'lucide-react'
;<Button endContent={<ArrowRight size={16} />}>下一步</Button>
```

### 2.5 Button 渐变样式

主要 CTA 按钮使用渐变背景：

```tsx
// ✅ 主 CTA 按钮
<Button
  color="primary"
  radius="full"
  className="bg-gradient-to-r from-primary to-blue-600 font-bold text-white"
>
  Get Started
</Button>

// ✅ 次要按钮
<Button variant="bordered" radius="full">
  Learn More
</Button>
```

---

## 3. 样式规范

### 3.1 Dark Mode 支持

所有页面必须支持 dark/light 模式切换。

**实现原理**：根元素（html）添加 `dark` class，配合 Tailwind 的语义化颜色自动切换。

```tsx
// ❌ 禁止：硬编码颜色，不支持 dark mode
<div className="bg-white text-black">

// ✅ 必须：使用语义化颜色（自动适配 dark/light）
<div className="bg-background text-foreground">
<div className="bg-content1 text-foreground">
<p className="text-default-500">
```

**语义化颜色参考**（由 HeroUI 主题提供）：

| 用途       | 类名                          | 说明                 |
| ---------- | ----------------------------- | -------------------- |
| 页面背景   | `bg-background`               | 自动适配 dark/light  |
| 内容区背景 | `bg-content1` ~ `bg-content4` | 层级递进的背景色     |
| 主要文字   | `text-foreground`             | 自动适配 dark/light  |
| 次要文字   | `text-default-500`            | HeroUI 灰色系        |
| 更浅文字   | `text-default-400`            | 占位符、辅助文字     |
| 主题色     | `text-primary` / `bg-primary` | 来自 hero.ts 配置    |
| 边框       | `border-divider`              | 自动适配的分割线颜色 |

**仅在语义化颜色无法满足设计需求时**，使用显式 `dark:` 变体：

```tsx
// ✅ 特殊场景：需要精细控制的自定义颜色
<div className="bg-slate-50 dark:bg-[#161022]">
```

### 3.2 组件内部样式使用 classNames

```tsx
// ❌ 禁止：直接在组件上加 className 覆盖内部样式
<Input className="[&>div]:border-red-500">

// ✅ 必须：使用 classNames prop
<Input
  classNames={{
    input: 'pl-1',
    innerWrapper: 'gap-2',
    inputWrapper: 'h-12',
  }}
/>
```

### 3.3 样式决策树

```
需要修改样式？
    │
    ├─► 颜色/尺寸/圆角/变体？
    │       └─► 使用组件 props（color/size/radius/variant）
    │
    ├─► 组件内部元素？
    │       └─► 使用 classNames prop
    │
    ├─► 布局/间距/定位？
    │       └─► 使用 Tailwind 类
    │
    └─► 全局主题变量？
            └─► 修改 hero.ts 或 index.css @theme
```

### 3.4 禁止的样式 Hack

```tsx
// ❌ 禁止：CSS 选择器 hack
className="[data-slot='xxx']"
className="button[class*='z-0']"

// ❌ 禁止：!important 覆盖
className="!bg-purple-600"

// ❌ 禁止：硬编码主题色（组件上）
<Button className="bg-purple-600">

// ❌ 禁止：在 index.html 引入外部字体
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
```

---

## 4. 国际化规范

### 4.1 分层架构

翻译文件分为**核心层**和**应用层**：

```
packages/locales/src/langs/          # 核心层：跨应用共享
├── en-US/
│   ├── common.json                  # 通用 UI（nav、action、status、placeholder）
│   ├── errors.json                  # 错误消息（HTTP、验证、业务错误）
│   ├── auth.json                    # 认证（login、register、forgotPassword）
│   ├── settings.json                # 设置页面
│   └── ui.json                      # UI 回退页（404、403、500）
└── zh-CN/
    └── ...

apps/web/src/locales/langs/          # 应用层：应用特有内容
├── en-US/
│   └── landing.json                 # Landing page 专用
└── zh-CN/
    └── landing.json
```

**放置原则**：

| 内容类型     | 位置                           | 示例                          |
| ------------ | ------------------------------ | ----------------------------- |
| 通用 UI 元素 | `packages/locales`             | 按钮文案、状态提示、导航项    |
| 错误消息     | `packages/locales/errors.json` | HTTP 错误、表单验证、业务错误 |
| 功能模块     | `packages/locales`             | auth、settings                |
| 应用特有内容 | `apps/web/src/locales`         | landing page、营销文案        |

### 4.2 所有用户可见文案必须国际化

```tsx
// ❌ 禁止：硬编码文案
<h1>Welcome to Bingo</h1>
<Button>Submit</Button>

// ✅ 必须：使用 useTranslation hook
import { useTranslation } from '@/locales'

const { t } = useTranslation()

<h1>{t('hero.title')}</h1>
<Button>{t('action.submit')}</Button>
```

### 4.3 使用方式

**React 组件内**：使用 `useTranslation` hook

```tsx
import { useTranslation } from '@/locales'

function MyComponent() {
  const { t } = useTranslation()
  return <Button>{t('action.submit')}</Button>
}
```

**非组件上下文**（interceptors、工具函数）：使用 `$t`

```tsx
import { $t } from '@bingo/locales'

// 在 axios interceptor 中
toast.error($t('errors.http.unauthorized'))
```

### 4.4 Key 命名规范

```
格式：{domain}.{section}.{element}

核心层 key 结构：
├── nav.*                    # 导航项
├── action.*                 # 操作按钮（submit、cancel、save...）
├── status.*                 # 状态提示（loading、success、error...）
├── placeholder.*            # 输入占位符
├── errors.http.*            # HTTP 错误（unauthorized、forbidden...）
├── errors.validation.*      # 表单验证错误
├── errors.{BusinessCode}    # 业务错误（如 InvalidArgument.UserNotFound）
├── auth.login.*             # 登录页
├── auth.register.*          # 注册页
├── auth.forgotPassword.*    # 忘记密码
├── settings.profile.*       # 个人资料设置
├── settings.security.*      # 安全设置
└── ui.fallback.*            # 错误页（404、403、500）

应用层 key 结构：
├── hero.*                   # 首页 hero 区域
├── features.*               # 功能介绍
├── pricing.*                # 定价
├── faq.*                    # 常见问题
└── footer.*                 # 页脚
```

### 4.5 错误处理

所有 API 错误由 `request.ts` interceptor 统一处理，自动显示 toast 提示。

**处理流程**：

1. 如果后端返回 `reason` 字段，尝试翻译 `errors.{reason}`
2. 翻译不存在时，使用 HTTP 状态码对应的消息（`errors.http.*`）
3. 都没有时使用通用错误消息

**业务代码只需处理成功路径**：

```tsx
try {
  await api.someAction()
  toast.success(t('someAction.success'))
} catch {
  // Error toast handled by request interceptor
}
```

**添加新业务错误**：在 `packages/locales/src/langs/*/errors.json` 添加：

```json
{
  "NewErrorCode": "错误描述"
}
```

---

## 5. 表单规范

### 5.1 使用 React Hook Form + Zod

```tsx
// ✅ 标准表单结构
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLoginSchema, type LoginFormData } from '@/schemas'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(createLoginSchema()),
})
```

### 5.2 Schema 定义

Schema 使用**工厂函数模式**，确保验证消息在表单初始化时获取当前语言的翻译：

```tsx
// schemas/auth.ts
import { z } from 'zod'
import { $t } from '@bingo/locales'

// ✅ 使用工厂函数
export const createLoginSchema = () =>
  z.object({
    account: z.string().min(1, $t('ui.formRules.required', { field: $t('auth.fields.account') })),
    password: z
      .string()
      .min(6, $t('ui.formRules.minLength', { field: $t('auth.fields.password'), min: '6' }))
      .max(18, $t('ui.formRules.maxLength', { field: $t('auth.fields.password'), max: '18' })),
    rememberMe: z.boolean().optional(),
  })

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
```

**验证消息使用参数化翻译**：

| 翻译 Key                 | 说明         | 示例                         |
| ------------------------ | ------------ | ---------------------------- |
| `ui.formRules.required`  | 必填         | "请输入{{field}}"            |
| `ui.formRules.minLength` | 最小长度     | "{{field}}至少{{min}}个字符" |
| `ui.formRules.maxLength` | 最大长度     | "{{field}}最多{{max}}个字符" |
| `ui.formRules.mismatch`  | 不匹配       | "{{field}}不一致"            |
| `auth.fields.*`          | 字段名翻译   | account、password、email...  |
| `settings.fields.*`      | 设置页字段名 | nickname、currentPassword... |

**使用方式**：

```tsx
// ✅ 调用工厂函数创建 schema
const { register, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(createLoginSchema()),
})
```

### 5.3 错误显示

```tsx
<Input {...register('email')} isInvalid={!!errors.email} errorMessage={errors.email?.message} />
```

---

## 6. 页面一致性规则

### 6.1 表单样式统一

项目中所有表单必须保持一致的设计语言：

| 元素           | 规范                  |
| -------------- | --------------------- |
| Input radius   | `full`                |
| Button radius  | `full`                |
| 表单间距       | `gap-5` 或 `gap-6`    |
| labelPlacement | `outside`（Modal 内） |

```tsx
// ✅ 标准 Input
<Input variant="bordered" radius="full" labelPlacement="outside" classNames={{ inputWrapper: 'h-12' }} />
```

### 6.2 Header 使用规范

根据页面类型使用不同的 Header 配置：

| 页面类型     | Header 配置                          |
| ------------ | ------------------------------------ |
| Landing Page | 显示导航链接（功能、定价、常见问题） |
| 功能页面     | 简洁 Header，隐藏 Landing 导航链接   |

```tsx
// Landing Page Header
<Header showNavLinks={true} />

// 功能页面 Header
<Header showNavLinks={false} />
```

### 6.3 卡片 + Modal 模式

需要用户操作的功能项统一使用「卡片 + Modal」模式：

1. **默认显示**：功能卡片，显示状态和操作按钮
2. **点击按钮**：弹出 Modal 进行设置
3. **完成后**：关闭 Modal，刷新状态

```tsx
// ✅ 卡片展示
<Card>
  <div className="flex items-center justify-between">
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <Button onPress={openModal}>{actionText}</Button>
  </div>
</Card>

// ✅ Modal 设置
<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
  <ModalContent>
    <ModalHeader>{title}</ModalHeader>
    <ModalBody>
      <form>...</form>
    </ModalBody>
    <ModalFooter>...</ModalFooter>
  </ModalContent>
</Modal>
```

---

## 7. 生成代码检查清单

**生成任何代码前，必须逐条确认**：

### HeroUI 优先

- [ ] 已查阅 HeroUI 官方文档，确认无现成组件/方案
- [ ] 如需自定义，已说明理由

### 文件规范

- [ ] 文件头有 2 行 ABOUTME 注释
- [ ] 文件放在正确的目录（pages/ vs components/）
- [ ] 命名符合规范（PascalCase）

### 组件规范

- [ ] 使用 HeroUI 组件而非原生 HTML
- [ ] 颜色通过 `color` prop 设置
- [ ] 圆角通过 `radius` prop 设置
- [ ] 图标使用 `lucide-react`
- [ ] Button 使用 `radius="full"`
- [ ] Input 使用 `variant="bordered" radius="full"`

### 样式规范

- [ ] 使用语义化颜色（`bg-background`、`text-foreground` 等）
- [ ] 组件内部样式通过 `classNames` prop
- [ ] 无 CSS 选择器 hack
- [ ] 无 `!important`

### 国际化

- [ ] 所有用户可见文案使用 `t()` 函数
- [ ] i18n key 符合命名规范
- [ ] 翻译条目放在正确位置（核心层 vs 应用层）
- [ ] 业务错误已添加到 `errors.json`

### 表单（如适用）

- [ ] 使用 React Hook Form + Zod
- [ ] Schema 定义在 `schemas/` 目录
- [ ] 错误状态正确显示

---

## 附录：快速参考

### Import 路径

```tsx
// HeroUI 组件
import { Button, Input, Card, Checkbox, Link } from '@heroui/react'

// 图标
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

// 国际化（组件内）
import { useTranslation } from '@/locales'

// 国际化（非组件上下文）
import { $t } from '@bingo/locales'

// 表单
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Toast
import { toast } from 'sonner'

// 路由
import { Link, useNavigate } from 'react-router'
```

### 常用组件配置

```tsx
// 主 CTA 按钮
<Button
  color="primary"
  radius="full"
  className="bg-gradient-to-r from-primary to-blue-600 font-bold text-white"
>
  Get Started
</Button>

// 次要按钮
<Button variant="bordered" radius="full">
  Cancel
</Button>

// 输入框
<Input
  variant="bordered"
  radius="full"
  placeholder="Email"
  startContent={<Mail size={18} className="shrink-0 text-slate-400" />}
  classNames={{
    inputWrapper: 'h-12',
  }}
/>

// 密码框（见 components/auth/PasswordInput.tsx）
<PasswordInput
  variant="bordered"
  radius="full"
  placeholder="Password"
/>
```
