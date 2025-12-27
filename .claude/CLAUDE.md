# Bingo Web 项目指南

## 执行偏好

- 使用 Subagent-Driven 方式执行计划
- 不需要每个 task 都 review，仅在每个阶段（如 API 层、UI 层、路由层）完成后 review

## 必读文档

开发前必须阅读 [docs/guides/CONVENTIONS.md](../docs/guides/CONVENTIONS.md)，了解：

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

## 后端 API

API 文档地址：`http://localhost:8080/api/docs/doc.json`
