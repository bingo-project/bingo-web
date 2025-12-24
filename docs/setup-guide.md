# bingo-web 项目搭建指南

> 基于 React 19 + Vite 6 + HeroUI + pnpm workspace 的 Monorepo 前端脚手架

## 目录结构

```
bingo-web/
├── apps/
│   ├── web/                      # PC 端应用
│   │   ├── src/
│   │   │   ├── pages/            # 页面
│   │   │   ├── components/       # PC 专属组件
│   │   │   ├── layouts/          # 布局
│   │   │   ├── routes/           # 路由配置
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.ts
│   │
│   └── h5/                       # H5 移动端应用
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   ├── ui/                       # 共享 UI 组件（基于 HeroUI 封装）
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── core/                     # 业务核心
│   │   ├── src/
│   │   │   ├── api/              # API 请求（OpenAPI 生成）
│   │   │   ├── stores/           # Zustand stores
│   │   │   ├── hooks/            # 共享 hooks
│   │   │   └── types/            # 类型定义
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                    # 工具函数
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── tsconfig/                 # 共享 TypeScript 配置
│       ├── base.json
│       ├── react.json
│       └── package.json
│
├── .npmrc                        # pnpm 配置
├── .gitignore
├── package.json                  # 根 package.json
├── pnpm-workspace.yaml           # pnpm workspace 配置
├── tsconfig.json                 # 根 TypeScript 配置
└── README.md
```

---

## 搭建步骤

### 1. 初始化 Monorepo

```bash
# 创建项目目录
mkdir bingo-web && cd bingo-web

# 初始化 package.json
pnpm init

# 创建 pnpm workspace 配置
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 创建 .npmrc（HeroUI 需要 hoist）
cat > .npmrc << 'EOF'
shamefully-hoist=true
public-hoist-pattern[]=*@heroui/*
public-hoist-pattern[]=*framer-motion*
EOF

# 创建目录结构
mkdir -p apps/web apps/h5 packages/ui packages/core packages/utils packages/tsconfig
```

### 2. 配置根 package.json

```json
{
  "name": "bingo-web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter @bingo/web dev",
    "dev:h5": "pnpm --filter @bingo/h5 dev",
    "build": "pnpm --filter @bingo/web build",
    "build:h5": "pnpm --filter @bingo/h5 build",
    "build:all": "pnpm -r build",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r clean && rm -rf node_modules"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### 3. 配置共享 TypeScript

**packages/tsconfig/package.json:**

```json
{
  "name": "@bingo/tsconfig",
  "version": "0.0.1",
  "private": true
}
```

**packages/tsconfig/base.json:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

**packages/tsconfig/react.json:**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

### 4. 创建 apps/web（PC 端）

```bash
cd apps/web
pnpm init
```

**apps/web/package.json:**

```json
{
  "name": "@bingo/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "@bingo/ui": "workspace:*",
    "@bingo/core": "workspace:*",
    "@bingo/utils": "workspace:*",
    "@heroui/react": "^2.7.6",
    "framer-motion": "^11.15.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.1.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.6"
  }
}
```

**apps/web/vite.config.ts:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})
```

**apps/web/tailwind.config.ts:**

```typescript
import { heroui } from '@heroui/react'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
}

export default config
```

**apps/web/postcss.config.js:**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**apps/web/tsconfig.json:**

```json
{
  "extends": "@bingo/tsconfig/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**apps/web/index.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bingo Web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**apps/web/src/main.tsx:**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
)
```

**apps/web/src/App.tsx:**

```tsx
import { Button } from '@heroui/react'

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Bingo Web</h1>
        <Button color="primary">Get Started</Button>
      </div>
    </div>
  )
}

export default App
```

**apps/web/src/index.css:**

```css
@import 'tailwindcss';
```

### 5. 创建 packages/ui

**packages/ui/package.json:**

```json
{
  "name": "@bingo/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@heroui/react": "^2.7.6",
    "framer-motion": "^11.15.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2"
  }
}
```

**packages/ui/tsconfig.json:**

```json
{
  "extends": "@bingo/tsconfig/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**packages/ui/src/index.ts:**

```typescript
// Re-export HeroUI components
export * from '@heroui/react'

// Export custom components
// export * from './components/CustomButton'
```

### 6. 创建 packages/core

**packages/core/package.json:**

```json
{
  "name": "@bingo/core",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./stores/*": "./src/stores/*.ts",
    "./hooks/*": "./src/hooks/*.ts",
    "./api/*": "./src/api/*.ts"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "zustand": "^5.0.2"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*",
    "@types/react": "^19.0.2"
  }
}
```

**packages/core/tsconfig.json:**

```json
{
  "extends": "@bingo/tsconfig/react.json",
  "include": ["src"]
}
```

**packages/core/src/index.ts:**

```typescript
export * from './stores'
export * from './hooks'
```

**packages/core/src/stores/index.ts:**

```typescript
// Export stores
```

**packages/core/src/hooks/index.ts:**

```typescript
// Export hooks
```

### 7. 创建 packages/utils

**packages/utils/package.json:**

```json
{
  "name": "@bingo/utils",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "devDependencies": {
    "@bingo/tsconfig": "workspace:*"
  }
}
```

**packages/utils/tsconfig.json:**

```json
{
  "extends": "@bingo/tsconfig/base.json",
  "include": ["src"]
}
```

**packages/utils/src/index.ts:**

```typescript
// Export utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString()
}
```

### 8. 创建 .gitignore

```gitignore
# Dependencies
node_modules
.pnpm-store

# Build
dist
build
.vite

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# Test
coverage
```

### 9. 安装依赖并运行

```bash
# 回到项目根目录
cd /path/to/bingo-web

# 安装所有依赖
pnpm install

# 启动开发服务器
pnpm dev
```

---

## 验证清单

- [ ] `pnpm install` 成功，无报错
- [ ] `pnpm dev` 启动成功，访问 http://localhost:3000
- [ ] 页面显示 "Bingo Web" 和 HeroUI Button
- [ ] HeroUI 暗黑模式切换正常
- [ ] packages 之间依赖正确（`@bingo/ui` 可在 `apps/web` 中使用）

---

## 已完成功能

- [x] ESLint 9 (flat config) + Prettier
- [x] Husky + lint-staged
- [x] React Router 7
- [x] react-i18next 国际化
- [x] API 请求封装 (axios)
- [x] OpenAPI 代码生成工具
- [x] 环境变量配置
- [x] Vitest 单元测试

---

## OpenAPI 代码生成

从后端 Swagger 文档生成类型安全的 API 代码：

```bash
# 使用默认地址 (localhost:8080)
pnpm api:gen

# 指定 Swagger URL
SWAGGER_URL=https://api.example.com/swagger.json pnpm api:gen
```

生成代码位于 `packages/core/src/api/generated/`

---

## 环境变量

| 文件               | 用途                         |
| ------------------ | ---------------------------- |
| `.env`             | 通用配置（应用名、命名空间） |
| `.env.development` | 开发环境（端口、本地 API）   |
| `.env.production`  | 生产环境（API 地址、压缩）   |
| `.env.local`       | 本地覆盖（不提交到 git）     |

支持的环境变量：

- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_NAMESPACE` - 应用命名空间
- `VITE_PORT` - 开发服务器端口
- `VITE_BASE` - 基础路径
- `VITE_API_BASE_URL` - API 地址
- `VITE_DEVTOOLS` - 是否开启 devtools
- `VITE_COMPRESS` - 压缩方式 (none/gzip/brotli)

---

## 单元测试

```bash
pnpm test          # 运行一次
pnpm test:watch    # 监听模式
pnpm test:coverage # 覆盖率报告
```

测试文件命名：`*.test.ts` 或 `*.spec.ts`

---

## 后续步骤

1. 搭建 apps/h5 移动端应用
2. Web3 集成（wagmi + viem + RainbowKit）
3. WebSocket 实时数据封装
