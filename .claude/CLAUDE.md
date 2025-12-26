# Bingo Web 项目指南

## 必读文档

开发前必须阅读 [docs/guides/CONVENTIONS.md](docs/guides/CONVENTIONS.md)，了解：

- HeroUI 优先原则
- 文件规范（ABOUTME 注释、目录结构）
- 组件规范（HeroUI 组件、props 用法）
- 样式规范（语义化颜色、dark mode）
- 国际化规范
- 生成代码检查清单

## 技术栈

- React + TypeScript + Vite
- HeroUI（组件库）
- Tailwind CSS v4
- React Router
- React Hook Form + Zod
- i18next

## 快速参考

```tsx
// 文件头（必须）
// ABOUTME: [组件描述]
// ABOUTME: [功能说明]

// HeroUI 组件
import { Button, Input, Card } from '@heroui/react'

// 图标
import { Mail, Lock } from 'lucide-react'

// 国际化
import { useTranslation } from '@/locales'
const { t } = useTranslation()

// 语义化颜色
<div className="bg-background text-foreground">
```
