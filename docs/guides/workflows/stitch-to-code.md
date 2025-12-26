# Stitch AI → 代码集成工作流

> **前置阅读**
>
> - [CONVENTIONS.md](../CONVENTIONS.md) — 项目规范（必读）
> - [heroui-components.md](../reference/heroui-components.md) — 组件示例

---

## 概述

将 Stitch AI 生成的 UI 设计转换为项目可用的 React 代码。

**注意**：Stitch AI 导出 HTML + Tailwind CSS，不是 React 组件，需要手动转换。

---

## 工作流

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Step 1  │──▶│  Step 2  │──▶│  Step 3  │──▶│  Step 4  │──▶│  Step 5  │
│  准备    │   │  生成    │   │  转换    │   │  集成    │   │  验证    │
│  Prompt  │   │   UI     │   │  代码    │   │  i18n    │   │  检查    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## Step 1: 准备 Prompt

从 `docs/ui/prompts/` 选择对应页面的 Prompt 文件，复制全部内容。

| 页面         | Prompt 文件   |
| ------------ | ------------- |
| Landing Page | `home.md`     |
| 登录页       | `login.md`    |
| 注册页       | `register.md` |
| 定价页       | `pricing.md`  |
| 个人中心     | `profile.md`  |

---

## Step 2: 在 Stitch AI 生成 UI

1. 访问 https://stitch.withgoogle.com/
2. 粘贴 Prompt 内容
3. 生成并预览，不满意可微调

---

## Step 3: 转换代码

### 3.1 HTML → JSX

| HTML               | JSX               |
| ------------------ | ----------------- |
| `class="..."`      | `className="..."` |
| `for="..."`        | `htmlFor="..."`   |
| `onclick="..."`    | `onClick={...}`   |
| `<!-- comment -->` | `{/* comment */}` |

### 3.2 替换为 HeroUI 组件

按 [CONVENTIONS.md](../CONVENTIONS.md#2-组件规范) 中的规范，将 HTML 元素替换为 HeroUI 组件：

```tsx
// Before (Stitch HTML)
<button class="rounded-full bg-purple-600 px-4 py-2 text-white">
  Get Started
</button>

// After (HeroUI)
<Button
  color="primary"
  radius="full"
  className="bg-gradient-to-r from-primary to-blue-600 font-bold text-white"
>
  Get Started
</Button>
```

### 3.3 应用语义化颜色

按 [CONVENTIONS.md](../CONVENTIONS.md#31-dark-mode-支持) 中的规范：

```tsx
// Before
<div class="bg-white text-black">

// After
<div className="bg-background text-foreground">
```

---

## Step 4: 集成 i18n

按 [CONVENTIONS.md](../CONVENTIONS.md#4-国际化规范) 中的规范，提取所有文案：

```tsx
// Before
<h1>Ship Web3 Fast with Bingo</h1>

// After
<h1>{t('home.hero.title')}</h1>
```

更新翻译文件：

```
apps/web/src/locales/langs/
├── en-US/page.json
└── zh-CN/page.json
```

---

## Step 5: 验证检查

### 5.1 添加文件头

```tsx
// ABOUTME: [页面描述]
// ABOUTME: [功能说明]
```

### 5.2 放入正确目录

```
apps/web/src/
├── pages/          # 页面组件
└── components/     # 可复用组件
    └── {feature}/  # 按功能域分组
```

### 5.3 运行检查

```bash
pnpm dev
```

按 [CONVENTIONS.md](../CONVENTIONS.md#6-生成代码检查清单) 逐条确认：

- [ ] 文件头有 ABOUTME 注释
- [ ] 使用 HeroUI 组件
- [ ] 使用语义化颜色
- [ ] 所有文案使用 `t()` 函数
- [ ] 响应式布局正常
- [ ] Dark mode 正常
- [ ] 无 TypeScript 错误
