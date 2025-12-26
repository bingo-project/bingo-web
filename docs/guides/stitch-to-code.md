# Stitch AI → 代码集成工作流

> **必读前置**
>
> 在开始转换前，请先阅读 [HeroUI 开发指南](./heroui/README.md)，了解样式规范和已知问题。

## 概述

本文档描述如何将 Stitch AI 生成的 UI 设计转换为项目可用的 React 代码。

**重要提示**：Stitch AI 目前只导出 HTML + Tailwind CSS，不是 React 组件。需要手动转换。

## 工作流总览

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              Stitch AI → 代码集成流程                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐       │
│  │ Step 1 │──▶│ Step 2 │──▶│ Step 3 │──▶│ Step 4 │──▶│ Step 5 │──▶│ Step 6 │       │
│  │  准备   │   │  生成   │   │  导出   │   │HTML→JSX│   │ HeroUI │   │  i18n  │       │
│  │ Prompt │   │   UI   │   │  HTML  │   │  转换   │   │  组件   │   │  集成  │       │
│  └────────┘   └────────┘   └────────┘   └────────┘   └────────┘   └────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: 准备 Prompt

### 1.1 选择对应的 Prompt 文件

从 `docs/ui/prompts/` 目录选择需要生成的页面：

| 页面         | Prompt 文件   |
| ------------ | ------------- |
| Landing Page | `home.md`     |
| 登录页       | `login.md`    |
| 注册页       | `register.md` |
| 定价页       | `pricing.md`  |
| 个人中心     | `profile.md`  |
| ...          | ...           |

### 1.2 复制 Prompt 内容

直接复制整个 `.md` 文件内容。每个 Prompt 已包含：

- Design System（颜色、圆角、按钮样式）
- 页面元素描述
- 状态说明
- 约束条件

---

## Step 2: 在 Stitch AI 生成 UI

### 2.1 访问 Stitch AI

地址：https://stitch.withgoogle.com/

### 2.2 输入 Prompt

1. 粘贴 Step 1 复制的 Prompt 内容
2. 点击生成
3. 预览效果，不满意可微调 Prompt 重新生成

### 2.3 调整设计（可选）

- 在 Stitch 编辑器中微调布局
- 调整颜色、间距
- 添加/删除元素

---

## Step 3: 导出 HTML 代码

### 3.1 导出

1. 点击 **"Export Code"** 或 **"Download"** 按钮
2. Stitch 导出的是 **HTML + Tailwind CSS**（不是 React）

### 3.2 导出内容

```html
<!DOCTYPE html>
<html class="dark" lang="en">
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        /* ... */
      }
    </script>
  </head>
  <body>
    <header class="flex items-center justify-between px-6 py-4">
      <!-- ... -->
    </header>
  </body>
</html>
```

---

## Step 4: HTML → JSX 转换

### 4.1 基础转换规则

| HTML                    | JSX                        |
| ----------------------- | -------------------------- |
| `class="..."`           | `className="..."`          |
| `for="..."`             | `htmlFor="..."`            |
| `onclick="..."`         | `onClick={...}`            |
| `style="color: red"`    | `style={{ color: 'red' }}` |
| `<!-- comment -->`      | `{/* comment */}`          |
| `<img ... />`（自闭合） | 保持不变                   |
| `<br>`                  | `<br />`                   |

### 4.2 提取 body 内容

只复制 `<body>` 标签内的 HTML，忽略 `<head>` 中的 Tailwind CDN 配置。

### 4.3 创建 React 组件

```tsx
// ABOUTME: Landing page component
// ABOUTME: Displays hero, features, pricing, and footer sections

export function HomePage() {
  return <div className="min-h-screen">{/* 粘贴转换后的 JSX */}</div>
}
```

### 4.4 快速转换技巧

使用编辑器的查找替换：

1. `class=` → `className=`
2. `for=` → `htmlFor=`
3. 手动检查 `style` 属性和事件处理器

---

## Step 5: 替换为 HeroUI 组件

### 5.1 组件映射表

| Stitch HTML 元素          | HeroUI 组件   | 示例                                     |
| ------------------------- | ------------- | ---------------------------------------- |
| `<button>`                | `<Button>`    | `<Button color="primary" radius="full">` |
| `<input>`                 | `<Input>`     | `<Input type="email" />`                 |
| `<a>` (导航链接)          | `<Link>`      | `<Link href="/pricing">`                 |
| `<div>` (卡片容器)        | `<Card>`      | `<Card isHoverable>`                     |
| `<select>`                | `<Select>`    | `<Select>`                               |
| `<input type="checkbox">` | `<Checkbox>`  | `<Checkbox>`                             |
| `<button>` (开关)         | `<Switch>`    | `<Switch>`                               |
| `<img>` (头像)            | `<Avatar>`    | `<Avatar src="..." />`                   |
| `<details>`               | `<Accordion>` | `<Accordion>`                            |
| `<span>` (标签)           | `<Chip>`      | `<Chip color="primary">`                 |

### 5.2 改造示例

**Before (Stitch HTML)**:

```html
<button class="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white font-bold">
  Get Started
</button>
```

**After (HeroUI)**:

```tsx
import { Button } from '@heroui/react'
;<Button color="primary" size="lg" radius="full">
  Get Started
</Button>
```

### 5.3 样式处理原则

- **保留**：Tailwind 布局类（`flex`, `grid`, `px-4`, `gap-6` 等）
- **移除**：组件样式类（`bg-purple-600`, `rounded-full`, `text-white` 等）
- **原因**：HeroUI 组件自带样式，通过 props 控制

---

## Step 6: 集成 i18n

### 6.1 提取文案

将所有 hardcoded 文字提取到翻译文件。

**Before**:

```tsx
<h1>Ship Web3 Fast with Bingo</h1>
<p>A comprehensive frontend scaffold</p>
```

**After**:

```tsx
import { useTranslation } from '@/locales'

const { t } = useTranslation()

<h1>{t('home.hero.title')}</h1>
<p>{t('home.hero.subtitle')}</p>
```

### 6.2 更新翻译文件

`apps/web/src/locales/langs/en-US/page.json`:

```json
{
  "home": {
    "hero": {
      "title": "Ship Web3 Fast with Bingo",
      "subtitle": "A comprehensive frontend scaffold"
    }
  }
}
```

`apps/web/src/locales/langs/zh-CN/page.json`:

```json
{
  "home": {
    "hero": {
      "title": "使用 Bingo 快速构建 Web3",
      "subtitle": "一站式前端脚手架"
    }
  }
}
```

### 6.3 i18n Key 命名规范

```
{page}.{section}.{element}

例如：
- home.hero.title
- home.hero.subtitle
- home.features.monorepo.title
- login.form.email.placeholder
```

---

## Step 7: 放入项目

### 7.1 文件位置

```
apps/web/src/
├── pages/
│   └── Home.tsx          # 页面组件
├── components/
│   └── landing/          # 拆分的子组件（可选）
│       ├── Hero.tsx
│       ├── Features.tsx
│       └── Pricing.tsx
└── locales/
    └── langs/
        ├── en-US/page.json
        └── zh-CN/page.json
```

### 7.2 添加文件头注释

```tsx
// ABOUTME: Landing page component
// ABOUTME: Displays hero, features, pricing, and footer sections
```

### 7.3 验证

```bash
pnpm dev
```

访问页面检查：

- [ ] 布局正确
- [ ] 响应式正常（Desktop / Tablet / Mobile）
- [ ] 暗色模式切换正常
- [ ] 按钮交互正常
- [ ] 中英文切换正常
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告

---

## Checklist

每次集成完成后确认：

- [ ] 文件头部有 ABOUTME 注释
- [ ] `class` 全部改为 `className`
- [ ] 所有 HTML 元素替换为 HeroUI 组件
- [ ] 所有文案提取到 i18n
- [ ] 按钮使用 `radius="full"`
- [ ] 颜色使用设计系统定义的值
- [ ] 响应式布局正常
- [ ] 暗色模式正常

---

## 附录：改造时间估算

| 页面复杂度 | 示例           | 估计时间   |
| ---------- | -------------- | ---------- |
| 简单       | 登录、注册     | 30-45 分钟 |
| 中等       | 定价、个人中心 | 1-1.5 小时 |
| 复杂       | Landing Page   | 1.5-2 小时 |
