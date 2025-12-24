# bingo-web 技术选型

> C 端前端（PC Web + H5）

## 核心技术栈

| 类别 | 选型 | 版本 | 理由 |
|------|------|------|------|
| **语言** | TypeScript | 5.x | 类型安全 |
| **框架** | React | 19.x | Uniswap 等主流 DeFi 已采用，Web3 生态已兼容 |
| **构建工具** | Vite | 6.x | 构建速度提升 3.5x，2025 主流标准 |
| **包管理** | pnpm | 9.x | 磁盘效率高，Monorepo 支持好 |
| **Monorepo** | pnpm workspace | - | 简单够用 |
| **状态管理** | Zustand | 5.x | 轻量、简洁、TypeScript 友好 |
| **路由** | React Router | 7.x | 更好的 TypeScript 支持，包体积减少 15% |
| **HTTP 请求** | Axios | 1.x | 生态成熟 |
| **Hooks 工具** | ahooks | 3.x | 阿里出品，丰富的 React hooks |
| **样式** | TailwindCSS | 4.x | CSS-in-CSS 配置，性能更优 |
| **UI 组件库** | HeroUI | 2.x | 基于 React Aria，RSC/i18n/暗黑模式开箱即用 |
| **Markdown** | MDX | 3.x | 支持在 Markdown 中嵌入 React 组件 |
| **K 线图表** | TradingView Lightweight Charts | 4.x | 免费、轻量、专业 |
| **表单** | React Hook Form + Zod | 7.x | 性能好，类型安全 |
| **国际化** | react-i18next | 14.x | 社区标准 |
| **Web3** | wagmi + viem | 2.x | 钱包连接、合约交互 |
| **钱包 UI** | RainbowKit | 2.x | 开箱即用的钱包连接 UI |
| **测试** | Vitest + React Testing Library | 3.x / 16.x | Vite 6 生态配套 |
| **代码规范** | ESLint + Prettier | 9.x / 3.x | 标准组合（ESLint 使用 flat config） |
| **Git Hooks** | Husky + lint-staged | 9.x | 提交前检查 |
| **API 生成** | @hey-api/openapi-ts | latest | 从 Swagger 生成（openapi-typescript-codegen 已废弃） |

---

## Monorepo 结构

```
bingo-web/
├── apps/
│   ├── web/                       # PC 端
│   │   ├── src/
│   │   │   ├── pages/             # 页面
│   │   │   ├── components/        # PC 专属组件
│   │   │   ├── layouts/           # 布局
│   │   │   └── routes/            # 路由配置
│   │   └── vite.config.ts
│   │
│   └── h5/                        # H5 端
│       ├── src/
│       │   ├── pages/             # 页面（移动端交互）
│       │   ├── components/        # H5 专属组件
│       │   └── routes/
│       └── vite.config.ts
│
├── packages/
│   ├── core/                      # 业务核心
│   │   ├── api/                   # API 请求（OpenAPI 生成）
│   │   ├── stores/                # Zustand stores
│   │   ├── hooks/                 # 共享 hooks
│   │   └── types/                 # 类型定义
│   ├── ui/                        # 共享 UI 组件
│   ├── utils/                     # 工具函数
│   ├── request/                   # 请求封装
│   └── locales/                   # 国际化
│
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

---

## Web/H5 分离策略

| 方案 | 选择 | 理由 |
|------|------|------|
| **两套 UI + 共享 core** | ✅ 采用 | 交互差异大，体验优先 |
| 一套代码响应式 | ❌ | 交易所场景复杂，响应式难做好 |

**共享层（packages/core）**：API、WebSocket、状态管理、类型定义（约占代码量 40-50%）

**独立层（apps/web, apps/h5）**：页面、组件、布局、路由

### H5 移动端方案

> **待定**：H5 专用组件方案后续讨论，可选方向：
> - 自研 `packages/ui-mobile`（基于 HeroUI + @use-gesture/react）
> - 引入成熟移动端库（Vant React / Ant Design Mobile）

---

## WebSocket 实时数据

### 数据流向

```
┌─────────────┐    WebSocket    ┌─────────────┐
│   Client    │◄───────────────►│   Server    │
│   (React)   │                 │ (bingo-apiserver)
└─────────────┘                 └─────────────┘
      │
      ▼
┌─────────────┐
│   Zustand   │  ← 实时更新状态
│   Store     │
└─────────────┘
      │
      ▼
┌─────────────┐
│  Components │  ← 响应式渲染
└─────────────┘
```

### React WebSocket 集成

```typescript
// hooks/useMarketSocket.ts
import { useEffect, useRef, useCallback } from 'react'
import { useMarketStore } from '@/stores/market'

export function useMarketSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const { updateTicker, updateKline, updateDepth } = useMarketStore()

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/ws')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      switch (msg.type) {
        case 'ticker':
          updateTicker(msg.symbol, msg.data)
          break
        case 'kline':
          updateKline(msg.symbol, msg.data)
          break
        case 'depth':
          updateDepth(msg.symbol, msg.data)
          break
      }
    }

    ws.onclose = () => {
      // 自动重连逻辑
      setTimeout(() => {
        // reconnect
      }, 1000)
    }

    return () => ws.close()
  }, [updateTicker, updateKline, updateDepth])

  const subscribe = useCallback((channel: string) => {
    wsRef.current?.send(JSON.stringify({ action: 'subscribe', channel }))
  }, [])

  return { subscribe }
}
```

### 数据类型与优化策略

| 数据类型 | 推送频率 | 存储 | 渲染优化 |
|---------|---------|------|---------|
| Ticker（价格） | 100ms | Zustand | 节流 100ms |
| K 线 | 1s | Zustand + IndexedDB 缓存 | 增量更新 |
| 深度（订单簿） | 100ms | Zustand | 虚拟滚动 |
| 成交记录 | 实时 | Zustand (保留最近 100 条) | 虚拟列表 |

---

## API 对接

### OpenAPI 代码生成

```bash
npx @hey-api/openapi-ts \
  -i http://localhost:8080/swagger/doc.json \
  -o ./packages/core/api/generated \
  -c axios
```

### 生成产物示例

```typescript
// 自动生成，无需手写
export interface User {
  id: number
  username: string
  email: string
}

export const UserApi = {
  getUser: (id: number) => request.get<User>(`/users/${id}`),
  createUser: (data: CreateUserRequest) => request.post<User>('/users', data),
}
```

---

## 部署

| 项目 | 部署方式 | 域名 |
|------|---------|------|
| **Web (PC)** | OSS + CDN | web.xxx.com |
| **H5** | OSS + CDN | h5.xxx.com |

---

## 参考资料

- [React 官方文档](https://react.dev/)
- [HeroUI 官方文档](https://www.heroui.com/)
- [wagmi 官方文档](https://wagmi.sh/)
- [viem 官方文档](https://viem.sh/)
- [RainbowKit 官方文档](https://www.rainbowkit.com/)
- [Zustand 官方文档](https://zustand-demo.pmnd.rs/)
- [TailwindCSS 官方文档](https://tailwindcss.com/)
- [MDX 官方文档](https://mdxjs.com/)
- [TradingView Lightweight Charts](https://github.com/nickelchen/Lightweight-Charts-docs-cn)
