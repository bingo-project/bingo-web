# Bingo Web

Bingo 前端脚手架，基于 pnpm workspace 的 Monorepo 架构。

## 技术栈

- **框架**: React 19.x + TypeScript 5.x
- **构建**: Vite 6.x
- **样式**: TailwindCSS 4.x
- **UI 组件**: HeroUI 2.x
- **路由**: React Router 7.x
- **状态管理**: Zustand 5.x

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

## 项目结构

```
bingo-web/
├── apps/
│   └── web/              # Web 应用
├── packages/
│   ├── ui/               # 共享 UI 组件
│   ├── core/             # 业务逻辑 (hooks, stores)
│   ├── utils/            # 工具函数
│   └── tsconfig/         # 共享 TypeScript 配置
├── pnpm-workspace.yaml
└── package.json
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Web 开发服务器 |
| `pnpm build` | 构建 Web 应用 |
| `pnpm build:all` | 构建所有应用 |
| `pnpm lint` | 运行代码检查 |
| `pnpm clean` | 清理构建产物和依赖 |

## 环境要求

- Node.js >= 20.0.0
- pnpm >= 9.0.0
