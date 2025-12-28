# WebSocket 客户端设计

## 概述

为 bingo-web 脚手架添加 WebSocket 客户端基础设施，支持 JSON-RPC 2.0 协议，提供开箱即用的实时通信能力。

## 目标

- 提供可配置的 WebSocket 功能（通过环境变量开关）
- 实现 JSON-RPC 2.0 协议客户端
- 支持自动重连、心跳保活
- 支持主题订阅/取消订阅
- 与现有认证流程无缝集成
- 复用现有 UI 展示连接状态

## 包结构

```
packages/
└── websocket/           # 新增包
    └── src/
        ├── client.ts    # WebSocket 客户端（连接、重连、心跳）
        ├── jsonrpc.ts   # JSON-RPC 2.0 协议实现
        ├── types.ts     # 类型定义
        └── index.ts     # 导出
```

## 配置

```bash
# .env
VITE_WEBSOCKET_ENABLED=true
VITE_WEBSOCKET_URL=ws://localhost:8081/ws
```

## API 设计

```typescript
import { wsClient, useWebSocketStatus } from '@bingo/websocket'

// 连接并认证（登录成功后调用）
await wsClient.connect(token)

// 发送请求（Promise 形式，等待响应）
const userInfo = await wsClient.call('auth.user-info')

// 订阅主题
await wsClient.subscribe(['order.new', 'notification'])
await wsClient.unsubscribe(['order.new'])

// 监听推送消息
wsClient.on('session.kicked', (data) => {
  // 处理被踢下线
})

// 断开连接（登出时调用）
wsClient.disconnect()

// React Hook：获取连接状态
const status = useWebSocketStatus()
```

## 连接状态

```typescript
type ConnectionState =
  | 'disconnected' // 未连接
  | 'connecting' // 连接中
  | 'connected' // 已连接（未认证）
  | 'authenticated' // 已认证
  | 'reconnecting' // 重连中
```

### 生命周期流程

```
用户登录成功
    ↓
connect(token) → connecting → connected
    ↓
自动发送 auth.login → authenticated
    ↓
正常通信（call、subscribe、接收推送）
    ↓
连接断开（网络问题/服务端关闭）
    ↓
自动重连 → reconnecting → connected → 重新认证
```

### 重连策略

- 指数退避：1s → 2s → 4s → 8s → 最大 30s
- 重连时自动使用上次的 token 重新认证
- 重连成功后自动恢复之前的订阅

### 主动断开场景（不触发重连）

- 用户登出调用 `disconnect()`
- 收到 `session.kicked` 推送
- Token 过期/无效（认证失败）

## 与现有代码集成

### 登录流程

```typescript
// packages/core/src/stores/auth.ts
const login = async (credentials) => {
  const { token } = await loginApi.login(credentials)
  setToken(token)

  if (import.meta.env.VITE_WEBSOCKET_ENABLED === 'true') {
    await wsClient.connect(token)
  }
}

const logout = () => {
  wsClient.disconnect()
  clearToken()
}
```

### 被踢下线处理

```typescript
// packages/core/src/bootstrap.ts
if (import.meta.env.VITE_WEBSOCKET_ENABLED === 'true') {
  wsClient.on('session.kicked', (data) => {
    toast.warning($t('auth.sessionKicked'))
    logout()
    navigate('/login')
  })
}
```

### 应用初始化

```typescript
const initAuth = async () => {
  const token = getToken()
  if (token) {
    await fetchUserInfo()

    if (import.meta.env.VITE_WEBSOCKET_ENABLED === 'true') {
      await wsClient.connect(token)
    }
  }
}
```

## 连接状态指示器

复用 Header 中头像右下角的状态圆点，根据 WebSocket 连接状态显示不同颜色：

| 状态                          | 颜色                    | 说明           |
| ----------------------------- | ----------------------- | -------------- |
| `authenticated`               | 绿色 (`bg-green-500`)   | 已连接且已认证 |
| `connecting` / `reconnecting` | 黄色 (`bg-yellow-500`)  | 连接中/重连中  |
| `disconnected`                | 灰色 (`bg-default-400`) | 未连接         |

### 实现

```tsx
// Header.tsx
import { useWebSocketStatus } from '@bingo/websocket'

const wsStatus = useWebSocketStatus()

const statusColor = wsStatus ? {
  authenticated: 'bg-green-500',
  connected: 'bg-yellow-500',
  connecting: 'bg-yellow-500',
  reconnecting: 'bg-yellow-500',
  disconnected: 'bg-default-400',
}[wsStatus] : 'bg-green-500'

<span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background ${statusColor}`} />
```

WebSocket 禁用时（`VITE_WEBSOCKET_ENABLED=false`），`useWebSocketStatus()` 返回 `null`，状态圆点保持绿色。

## 不包含的内容（YAGNI）

- 通知中心 UI 组件
- 消息队列/离线消息缓存
- 后端 notification 表和 API
- 多标签页连接共享（SharedWorker）

## 实现范围

- [x] `@bingo/websocket` 包（客户端、JSON-RPC、类型）
- [x] 环境变量开关
- [x] 登录/登出时自动连接/断开
- [x] 心跳保活
- [x] 自动重连
- [x] 订阅/取消订阅
- [x] 被踢下线处理（toast + 跳转登录页）
- [x] 连接状态指示器（复用头像状态圆点）
- [x] 国际化文案

## 后端依赖

后端 WebSocket 服务需启用：

```yaml
# bingo-apiserver.yaml
websocket:
  enabled: true
  addr: :8081
```

已实现的 JSON-RPC 方法：

- `heartbeat` - 心跳
- `auth.login` - 认证（支持 token）
- `auth.user-info` - 获取用户信息
- `subscribe` - 订阅主题
- `unsubscribe` - 取消订阅
