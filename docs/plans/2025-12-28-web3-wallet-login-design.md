# Web3 钱包登录设计

## 概述

为 Bingo 脚手架项目添加 Web3 钱包登录支持，采用 SIWE (Sign-In with Ethereum) 标准，与现有 OAuth 登录并列展示。

## 目标用户

- 脚手架项目，需同时支持 Web2 和 Web3 场景
- Web3 登录作为可选功能，可通过后端配置启用/禁用

## 技术选型

| 技术       | 选择                                | 理由                                 |
| ---------- | ----------------------------------- | ------------------------------------ |
| 钱包连接库 | wagmi v2 + viem                     | React 生态主流，hooks 风格，功能完善 |
| 签名标准   | SIWE (EIP-4361)                     | 行业最佳实践，安全性高，用户体验好   |
| 支持钱包   | MetaMask + WalletConnect + Coinbase | 覆盖主流场景                         |
| UI 方案    | HeroUI 自定义实现                   | 与现有 UI 风格一致，轻量             |

## 登录流程

```
1. 用户点击「钱包登录」按钮
   ↓
2. 弹出 Modal：选择钱包类型（MetaMask / WalletConnect / Coinbase）
   ↓
3. 用户选择钱包，钱包弹窗请求连接
   ↓
4. 连接成功，获取用户地址
   ↓
5. 前端调用 GET /v1/auth/nonce?address={address}
   ↓
6. 后端返回 SIWE 格式的 message 和 nonce
   ↓
7. 前端调用钱包签名 message
   ↓
8. 前端调用 POST /v1/auth/login/address
   ↓
9. 后端验证签名，返回 accessToken
   ↓
10. 登录成功，跳转目标页面
```

## 按需加载设计

Web3 功能作为可选模块，未启用时不加载相关代码：

```typescript
// OAuthButtons.tsx
const providers = await authApi.getProviders()
const hasWallet = providers.some((p) => p.name === 'wallet')

if (hasWallet) {
  const { WalletLoginButton } = await import('@/features/web3')
  // 渲染钱包按钮
}
```

## 文件结构

```
packages/core/src/
├── api/auth.ts              # 新增 getNonce, walletLogin 方法

apps/web/src/
├── components/auth/
│   ├── OAuthButtons.tsx     # 修改：检测到 wallet provider 时动态加载
│   └── oauth-icons.tsx      # 新增钱包图标
├── features/web3/           # 新增：Web3 功能模块（独立 chunk）
│   ├── index.ts             # 导出入口
│   ├── config.ts            # wagmi 配置（chains, connectors, transports）
│   ├── WagmiProvider.tsx    # provider 组件
│   ├── WalletLoginButton.tsx
│   ├── WalletSelectModal.tsx
│   └── hooks/
│       └── useWalletLogin.ts
```

## API 设计

### 前端 API 层

```typescript
// packages/core/src/api/auth.ts

export interface NonceResponse {
  message: string // 完整的 SIWE 消息
  nonce: string // 用于后端验证时匹配
}

export interface WalletLoginRequest {
  message: string
  signature: string
}

export const authApi = {
  // ... 现有方法

  // Web3 登录
  getNonce: (address: string) => request.get<NonceResponse>('/v1/auth/nonce', { params: { address } }),

  walletLogin: (data: WalletLoginRequest) => request.post<LoginResponse>('/v1/auth/login/address', data),
}
```

### SIWE 消息格式

```
bingo.example.com wants you to sign in with your Ethereum account:
0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

Sign in to Bingo

URI: https://bingo.example.com
Version: 1
Chain ID: 1
Nonce: 8s2k3j4h5g6f7d8s
Issued At: 2025-12-28T10:30:00.000Z
Expiration Time: 2025-12-28T10:35:00.000Z
```

## 错误处理

| 场景           | 处理                           |
| -------------- | ------------------------------ |
| 用户拒绝连接   | Toast 提示，关闭 Modal         |
| 用户拒绝签名   | Toast 提示，保持连接状态可重试 |
| Nonce 获取失败 | Toast 提示，可重试             |
| 登录验证失败   | Toast 提示签名验证失败         |

## 设置页钱包绑定

在「设置 > 安全」页面新增钱包绑定区块：

- 未绑定：显示「绑定钱包」按钮
- 已绑定：显示钱包地址（截断如 `0xAb58...eC9B`）+ 「解绑」按钮

绑定流程与登录流程类似，调用 `POST /v1/auth/bindings/wallet`。

## 国际化

```typescript
// zh-CN/auth.json
{
  "walletLogin": "钱包登录",
  "selectWallet": "选择钱包",
  "connectingWallet": "正在连接...",
  "signingMessage": "请在钱包中签名...",
  "walletLoginFailed": "钱包登录失败",
  "userRejectedConnection": "已取消连接",
  "userRejectedSign": "已取消签名",
  "bindWallet": "绑定钱包",
  "unbindWallet": "解绑钱包",
  "walletAddress": "钱包地址",
  "unbindWalletConfirm": "确定解绑该钱包地址吗？"
}

// en-US/auth.json
{
  "walletLogin": "Wallet Login",
  "selectWallet": "Select Wallet",
  "connectingWallet": "Connecting...",
  "signingMessage": "Please sign in your wallet...",
  "walletLoginFailed": "Wallet login failed",
  "userRejectedConnection": "Connection cancelled",
  "userRejectedSign": "Signature cancelled",
  "bindWallet": "Link Wallet",
  "unbindWallet": "Unlink",
  "walletAddress": "Wallet Address",
  "unbindWalletConfirm": "Are you sure you want to unlink this wallet?"
}
```

## 前端配置

WalletConnect 需要 projectId（从 [WalletConnect Cloud](https://cloud.walletconnect.com/) 免费申请）：

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 依赖

```json
{
  "wagmi": "^2.x",
  "viem": "^2.x",
  "@tanstack/react-query": "^5.x"
}
```

---

# 后端修改计划

## 1. 修改 `GET /v1/auth/nonce` 接口

**现有返回：**

```json
{ "nonce": "xxx" }
```

**建议返回：**

```json
{
  "message": "完整的 SIWE 消息",
  "nonce": "8s2k3j4h5g6f7d8s"
}
```

后端构造 SIWE 消息需要：

- domain: 从配置或请求 header 获取
- address: 请求参数
- statement: 可配置，如 "Sign in to Bingo"
- uri: 从配置获取
- version: 固定为 "1"
- chainId: 可配置，默认 1 (Ethereum mainnet)
- nonce: 随机生成，存储用于验证
- issuedAt: 当前时间
- expirationTime: 当前时间 + 5分钟

## 2. 修改 `POST /v1/auth/login/address` 接口

**现有参数：** `address`, `sign` (query params)

**建议参数：** (request body)

```json
{
  "message": "完整的 SIWE 消息",
  "signature": "签名结果"
}
```

**验证逻辑：**

1. 解析 message 提取 nonce、address、expirationTime
2. 验证 nonce 有效且未使用
3. 验证消息未过期
4. 使用 SIWE 库验证签名
5. 创建或查找用户，返回 accessToken

## 3. 在 providers 中支持 wallet 类型

`GET /v1/auth/providers` 返回中可包含：

```json
{ "name": "wallet", "isDefault": 0, "authUrl": "", "redirectUrl": "" }
```

后端通过配置控制是否启用钱包登录。

## 4. 钱包绑定接口

确保以下接口支持 `wallet` 类型：

- `GET /v1/auth/bindings` - 返回已绑定钱包地址
- `POST /v1/auth/bindings/wallet` - 绑定钱包（参数同登录）
- `DELETE /v1/auth/bindings/wallet` - 解绑钱包

## 推荐的 Go SIWE 库

- [spruceid/siwe-go](https://github.com/spruceid/siwe-go) - 官方实现
