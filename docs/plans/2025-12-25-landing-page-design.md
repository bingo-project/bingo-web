# Landing Page 设计方案

## 概述

为 bingo-web 脚手架搭建一个简洁的 Landing Page，参考 HeroUI 官网风格，支持暗黑模式和国际化切换。

## 页面结构

```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
│  [Logo] Bingo Web          [GitHub] [🌐] [🌙]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Hero Section (首屏)                                │
│  ┌───────────────────────────────────────────────┐  │
│  │         Bingo Web                             │  │
│  │    现代化前端开发脚手架                         │  │
│  │                                               │  │
│  │  [React 19] [Vite] [TypeScript] [HeroUI]      │  │
│  │                                               │  │
│  │        [ 快速开始 ]                            │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Features Section (滚动后)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │Monorepo │  │API 封装 │  │ 国际化  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │暗黑模式 │  │类型安全 │  │代码规范 │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer                                             │
│            © 2025 Bingo Web                        │
└─────────────────────────────────────────────────────┘
```

## 导航栏

修改现有 `RootLayout.tsx` 中的 Navbar。

**右侧按钮组（从左到右）**：

1. **GitHub 按钮**：图标按钮，点击跳转到项目 GitHub 仓库（新窗口打开）
2. **语言切换**：图标按钮，显示当前语言（"EN" 或 "中"），点击切换
3. **主题切换**：图标按钮，亮色模式显示太阳 ☀️，暗色模式显示月亮 🌙，点击切换

**暗黑模式实现**：

- 使用 React state + localStorage 管理主题状态
- 切换时给 `<html>` 添加/移除 `class="dark"`
- 用户偏好持久化到 localStorage

**语言切换**：

- 复用现有 `changeLanguage()` 函数
- 按钮文字：当前是中文显示 "EN"，当前是英文显示 "中"

## Hero Section

**布局**：垂直居中，占据首屏大部分空间

**内容结构**：

1. **主标题**：`Bingo Web`（大字号，粗体）
2. **副标题**：`现代化前端开发脚手架`（中等字号，灰色）
3. **技术栈 Badge**：一行 4 个 chip/badge
   - React 19（蓝色）
   - Vite（紫色）
   - TypeScript（蓝色）
   - HeroUI（品牌色）
4. **CTA 按钮**：`快速开始`（primary 样式）

**响应式**：

- 桌面端：标题 4xl-5xl，badge 一行展示
- 移动端：标题 2xl-3xl，badge 可换行

**暗黑模式适配**：

- 副标题颜色：亮色用 `text-gray-600`，暗色用 `text-gray-400`
- Badge 和按钮使用 HeroUI 组件，自动适配

## Features Section

**布局**：3 列网格，共 6 个特性卡片

**卡片样式**：使用 HeroUI Card 组件

- 图标（顶部）
- 标题（粗体）
- 简短描述（1-2 行）

**6 个特性**：

| 特性          | 图标 | 描述                                    |
| ------------- | ---- | --------------------------------------- |
| Monorepo 架构 | 📦   | pnpm workspace 多包管理，代码复用更简单 |
| API 请求封装  | 🔌   | Axios 封装，请求/响应拦截器开箱即用     |
| 国际化支持    | 🌐   | 内置 i18n，轻松支持多语言               |
| 暗黑模式      | 🌙   | 一键切换明暗主题，自动持久化            |
| 类型安全      | 🛡️   | 全量 TypeScript，类型推导更智能         |
| 代码规范      | ✨   | ESLint + Prettier + Husky 一站式配置    |

**响应式**：

- 桌面：3 列
- 平板：2 列
- 手机：1 列

## Footer

- 简单一行，居中显示
- 内容：`© 2025 Bingo Web`
- 暗黑模式：文字颜色自动适配

## 国际化文案

在 `packages/locales/src/langs/` 添加以下翻译键：

**zh-CN/common.json**：

```json
{
  "hero": {
    "title": "Bingo Web",
    "subtitle": "现代化前端开发脚手架",
    "getStarted": "快速开始"
  },
  "features": {
    "monorepo": {
      "title": "Monorepo 架构",
      "desc": "pnpm workspace 多包管理，代码复用更简单"
    },
    "api": {
      "title": "API 请求封装",
      "desc": "Axios 封装，请求/响应拦截器开箱即用"
    },
    "i18n": {
      "title": "国际化支持",
      "desc": "内置 i18n，轻松支持多语言"
    },
    "darkMode": {
      "title": "暗黑模式",
      "desc": "一键切换明暗主题，自动持久化"
    },
    "typescript": {
      "title": "类型安全",
      "desc": "全量 TypeScript，类型推导更智能"
    },
    "lint": {
      "title": "代码规范",
      "desc": "ESLint + Prettier + Husky 一站式配置"
    }
  },
  "footer": {
    "copyright": "© 2025 Bingo Web"
  }
}
```

**en-US/common.json**：

```json
{
  "hero": {
    "title": "Bingo Web",
    "subtitle": "Modern Frontend Development Scaffold",
    "getStarted": "Get Started"
  },
  "features": {
    "monorepo": {
      "title": "Monorepo Architecture",
      "desc": "pnpm workspace for multi-package management"
    },
    "api": {
      "title": "API Request",
      "desc": "Axios with request/response interceptors out of the box"
    },
    "i18n": {
      "title": "i18n Support",
      "desc": "Built-in internationalization, easy multi-language support"
    },
    "darkMode": {
      "title": "Dark Mode",
      "desc": "One-click theme switch with auto persistence"
    },
    "typescript": {
      "title": "Type Safety",
      "desc": "Full TypeScript with smart type inference"
    },
    "lint": {
      "title": "Code Standards",
      "desc": "ESLint + Prettier + Husky all-in-one setup"
    }
  },
  "footer": {
    "copyright": "© 2025 Bingo Web"
  }
}
```

## 实现文件清单

1. `apps/web/src/layouts/RootLayout.tsx` - 修改导航栏，添加 GitHub/主题切换按钮
2. `apps/web/src/pages/Home.tsx` - 重写为 Hero + Features + Footer
3. `apps/web/src/hooks/useTheme.ts` - 新增主题切换 hook
4. `packages/locales/src/langs/zh-CN/common.json` - 添加新翻译
5. `packages/locales/src/langs/en-US/common.json` - 添加新翻译
