# 样式决策树

## 决策流程

```
需要修改样式？
    │
    ├─► 颜色/尺寸/圆角/变体？
    │       └─► 使用组件 props（color/size/radius/variant）
    │
    ├─► 组件内部元素样式？
    │       └─► 使用 classNames prop
    │
    ├─► 布局/间距/定位？
    │       └─► 使用 Tailwind 类（flex/gap/px-4）
    │
    └─► 全局主题变量？
            └─► 修改 hero.ts 或 @theme 块
```

---

## 规则速查

| 需求       | ✅ 正确做法                           | ❌ 错误做法                          |
| ---------- | ------------------------------------- | ------------------------------------ |
| 按钮颜色   | `<Button color="primary">`            | `<Button className="bg-purple-600">` |
| 输入框圆角 | `<Input radius="full">`               | `<Input className="rounded-full">`   |
| 卡片内边距 | `<Card classNames={{ body: "p-6" }}>` | 直接改 Card 的 className             |
| 布局间距   | `<div className="flex gap-4">`        | ✅ 这是正确的                        |
| 文字颜色   | `<span className="text-default-500">` | `<span className="text-gray-500">`   |

---

## 图标规范

### 统一使用 Lucide React

```tsx
// ✅ 正确
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react'

;<Button endContent={<ArrowRight size={16} />}>下一步</Button>
```

### 禁止使用 Material Symbols

```tsx
// ❌ 禁止
import { Visibility } from '@mui/icons-material'

// ❌ 禁止
<span className="material-symbols-outlined">visibility</span>

// ❌ 禁止在 index.html 中引入
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
```

### 原因

- Lucide 是 tree-shakable，按需加载
- 与 HeroUI 风格一致
- Material Symbols 需要额外字体加载，增加首屏时间约 100KB+

---

## 新页面必须继承

创建新页面时，必须包含以下特性：

### 1. Dark/Light 模式支持

使用语义化颜色类，自动适配两种模式：

```tsx
// ✅ 正确 - 自动适配 dark/light
<div className="bg-background text-foreground">

// ❌ 错误 - 只在 light 模式下正常
<div className="bg-white text-black">
```

### 2. 语义化颜色参考

| 用途       | 类名                 | 说明                |
| ---------- | -------------------- | ------------------- |
| 页面背景   | `bg-background`      | 自动适配 dark/light |
| 主要文字   | `text-foreground`    | 自动适配 dark/light |
| 次要文字   | `text-default-500`   | HeroUI 灰色系       |
| 更浅文字   | `text-default-400`   | 占位符、辅助文字    |
| 主题色文字 | `text-primary`       | 来自 hero.ts 配置   |
| 主题色背景 | `bg-primary`         | 来自 hero.ts 配置   |
| 边框       | `border-default-200` | 浅色边框            |

### 3. 响应式布局

至少支持 mobile 和 desktop：

```tsx
<div className="px-4 md:px-8 lg:px-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* 内容 */}</div>
</div>
```

### 4. 国际化（i18n）

所有用户可见文案使用 `t()` 函数：

```tsx
import { useTranslation } from '@/locales'

export function NewPage() {
  const { t } = useTranslation()

  return <h1>{t('page.title')}</h1>
}
```

---

## 新页面模板

```tsx
// ABOUTME: [页面描述]
// ABOUTME: [功能说明]

import { useTranslation } from '@/locales'

export function NewPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">{t('page.title')}</h1>
        {/* 页面内容 */}
      </div>
    </div>
  )
}
```

---

## classNames Prop 用法

当需要自定义组件内部样式时，使用 `classNames` prop：

```tsx
// Input 的内部元素
<Input
  classNames={{
    base: "max-w-xs",
    label: "text-default-500",
    input: "text-sm",
    inputWrapper: "border-default-200",
  }}
/>

// Card 的内部元素
<Card
  classNames={{
    base: "bg-default-50",
    header: "pb-0",
    body: "py-4",
    footer: "pt-0",
  }}
/>

// Checkbox 的内部元素
<Checkbox
  classNames={{
    label: "text-sm text-default-500",
    wrapper: "mr-2",
  }}
/>
```

每个组件支持的 classNames 键不同，参考 [HeroUI 文档](https://heroui.com/docs)。
