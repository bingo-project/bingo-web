# HeroUI 开发指南

> **必读警告**
>
> 在使用 HeroUI 组件前，必须阅读以下内容，否则会踩坑：
>
> 1. [Tailwind v4 兼容性问题](./tailwind-v4-compat.md) - **10 分钟**
> 2. [样式决策树](./styling-patterns.md) - **5 分钟**

## 快速检查清单（开发前）

- [ ] `hero.ts` 在 `apps/web/` 目录下（不是 `src/` 下）
- [ ] `index.css` 包含 `@plugin '../hero.ts'`
- [ ] `index.css` 包含 `@source '../../../node_modules/@heroui/theme/dist/**/*.js'`
- [ ] `index.css` 包含 `@custom-variant dark (&:is(.dark *))`
- [ ] 图标使用 `lucide-react`，不使用 Material Symbols

## Code Review 检查清单

### 必须拒绝的代码

- [ ] 使用 CSS 选择器 hack（如 `[data-slot='xxx']`、`button[class*='z-0']`）
- [ ] 使用 `!important` 覆盖 HeroUI 样式
- [ ] 在组件上使用 `bg-purple-600` 等硬编码颜色类（应使用 `color="primary"`）
- [ ] 使用 `rounded-full` CSS 类（应使用 `radius="full"` prop）
- [ ] 引入 Material Symbols 图标（应使用 lucide-react）
- [ ] 新页面不支持 dark/light 模式切换

### 必须确认的代码

- [ ] 颜色使用语义化 props（`color="primary/secondary/danger"`）
- [ ] 圆角使用 `radius` prop
- [ ] 自定义样式通过 `classNames` prop 传入
- [ ] 新增 CSS 变量已添加到 `@theme` 块
- [ ] 新页面使用 `bg-background text-foreground` 等语义化颜色
- [ ] 所有文案使用 `t()` 函数

## 文档索引

| 文档                                               | 内容              | 何时阅读       |
| -------------------------------------------------- | ----------------- | -------------- |
| [tailwind-v4-compat.md](./tailwind-v4-compat.md)   | 已知坑和解决方案  | 遇到样式问题时 |
| [styling-patterns.md](./styling-patterns.md)       | 样式决策树 + 规范 | 写样式前       |
| [component-reference.md](./component-reference.md) | 常用组件配置      | 使用组件时     |
| [stitch-to-code.md](../stitch-to-code.md)          | Stitch 转代码流程 | 实现新页面时   |
