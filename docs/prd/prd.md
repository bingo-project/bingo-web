# Bingo Web Scaffold PRD

## Product Overview

- **One-liner:** 开箱即用的 Web2+Web3 前端脚手架，让开发者专注业务而非基础设施
- **Target Users:** 前端开发者/小团队，需要快速启动 Web2 或 Web3 项目
- **Core Value:** 统一技术规范、消除重复配置、提供生产级最佳实践

## User Stories

### Primary Scenario

As a 前端开发者, I want to 克隆脚手架后只需配置环境变量就能开始写业务代码 so that 我不用每次都从零搭建项目基础设施.

### Secondary Scenarios

- As a 独立开发者, I want to 快速搭建一个带用户系统和支付的 SaaS Landing Page so that 我能专注于产品核心功能.
- As a 团队 Tech Lead, I want to 让团队使用统一的技术规范和代码结构 so that 项目交接和维护更高效.
- As a Web3 开发者, I want to 在已有 Web2 基础上快速集成钱包连接和链交互 so that 我不用重复造轮子.

## Feature Requirements

### Phase 1: Validation (MVP)

#### 1.1 Landing Page 组件库

| Feature              | Description                              | Validation Method | Success Criteria            |
| -------------------- | ---------------------------------------- | ----------------- | --------------------------- |
| Hero Section         | 多种布局变体、动画效果、视频背景支持     | UI 走查           | 至少 3 种布局可选，动画流畅 |
| Features Section     | 图标+标题+描述网格、多列布局             | UI 走查           | 响应式布局正确              |
| Social Proof Section | 客户 Logo 墙、用户评价轮播、数据统计展示 | UI 走查           | 展示效果专业                |
| Pricing Section      | 定价卡片、功能对比表、年/月切换          | UI 走查           | 交互流畅，信息清晰          |
| FAQ Section          | 手风琴展开/收起、分类筛选                | UI 走查           | 交互流畅                    |
| CTA Section          | 行动召唤区块、多种样式                   | UI 走查           | 视觉突出，点击率可追踪      |
| Testimonials         | 用户评价卡片、轮播展示                   | UI 走查           | 展示效果真实可信            |

#### 1.2 开发体验

| Feature          | Description                          | Validation Method | Success Criteria            |
| ---------------- | ------------------------------------ | ----------------- | --------------------------- |
| Toast 通知封装   | 基于 HeroUI Toast 的统一调用 API     | 代码审查          | 调用简洁，支持 Promise 状态 |
| Loading 状态管理 | 全局/局部 Loading 状态、骨架屏       | 代码审查          | 统一管理，避免闪烁          |
| Error Boundary   | 全局错误捕获、友好错误页面、错误上报 | 手动触发错误测试  | 错误被捕获，不白屏          |
| 环境变量管理     | .env.example 模板、启动时校验必填项  | 启动测试          | 缺失必填变量时明确报错      |
| 表单处理封装     | react-hook-form + zod 验证集成       | 代码审查          | 类型安全，验证统一          |

#### 1.3 用户认证系统

| Feature       | Description                       | Validation Method | Success Criteria               |
| ------------- | --------------------------------- | ----------------- | ------------------------------ |
| 邮箱注册/登录 | 支持邮箱+密码注册、登录、邮箱验证 | 内部项目实际使用  | 完整流程可用，无明显 bug       |
| OAuth 登录    | 支持 Google、GitHub 第三方登录    | 内部项目实际使用  | 一键授权登录成功               |
| 忘记密码      | 邮箱重置密码流程                  | 手动测试          | 邮件发送成功，重置流程完整     |
| Token 管理    | JWT access/refresh token 自动刷新 | 自动化测试        | Token 过期自动刷新，用户无感知 |

#### 1.4 个人中心

| Feature      | Description                    | Validation Method | Success Criteria         |
| ------------ | ------------------------------ | ----------------- | ------------------------ |
| 个人信息展示 | 头像、昵称、邮箱等基本信息展示 | UI 走查           | 信息展示正确，布局美观   |
| 修改密码     | 输入旧密码+新密码修改          | 手动测试          | 密码修改成功，需重新登录 |
| 头像上传     | 支持图片上传和裁剪             | 手动测试          | 上传成功，预览正确       |
| 账号设置     | 通知偏好、语言设置等           | 手动测试          | 设置保存成功，即时生效   |

### Phase 2: Refinement

#### 2.1 订阅与支付

| Feature      | Description                         | Priority |
| ------------ | ----------------------------------- | -------- |
| Stripe 集成  | Checkout Session 创建和支付回调处理 | High     |
| 订阅计划展示 | Pricing 页面展示不同订阅等级        | High     |
| 订阅状态管理 | 用户订阅状态查询、展示、到期提醒    | High     |
| 订阅管理     | 升级、降级、取消订阅                | High     |

#### 2.2 Web3 能力

| Feature       | Description                              | Priority |
| ------------- | ---------------------------------------- | -------- |
| Web3 钱包连接 | wagmi + RainbowKit/ConnectKit 集成       | High     |
| SIWE 登录     | Sign In With Ethereum，Web3 作为登录方式 | High     |
| 加密货币支付  | 支持 USDC/USDT 等稳定币支付订阅          | Medium   |
| 链交互封装    | 读写合约、事件监听的 hooks 封装          | Medium   |
| 多链支持      | Ethereum、Polygon、Arbitrum 等主流链     | Medium   |

#### 2.3 其他功能

| Feature      | Description                         | Priority |
| ------------ | ----------------------------------- | -------- |
| SEO 优化     | Meta tags 管理、结构化数据、Sitemap | Medium   |
| 邮件模板系统 | 验证邮件、密码重置等邮件模板        | Medium   |
| 管理后台基础 | 用户管理、订阅数据查看              | Low      |

### Phase 3: Expansion (Optional)

| Feature      | Description                        |
| ------------ | ---------------------------------- |
| CLI 工具     | `create-bingo-app` 命令行创建项目  |
| 模板市场     | 多种预设模板（SaaS、NFT、DeFi 等） |
| 插件系统     | 可插拔的功能模块                   |
| SSR/SSG 支持 | Next.js 版本或 Vite SSR            |
| 文档站点     | 完整的使用文档和 API 文档          |
| 社区生态     | 开源后的社区贡献机制               |

## Non-Functional Requirements

### Performance

- 首屏加载时间 < 3s（Lighthouse Performance > 80）
- 代码分割，按路由懒加载
- 图片懒加载和优化

### Security

- XSS/CSRF 防护
- API 请求签名（可选）
- 敏感信息加密存储
- 安全的 Token 存储策略

### Accessibility

- 遵循 WCAG 2.1 AA 标准
- 键盘导航支持
- 屏幕阅读器兼容

### Developer Experience

- 完整的 TypeScript 类型定义
- 清晰的目录结构和命名规范
- 充分的代码注释和内联文档
- 一键启动开发环境

## Constraints

### Technical

- 前端框架锁定 React 19 + Vite
- UI 组件库锁定 HeroUI
- 需要后端 API 支持（不在本脚手架范围内）

### Resources

- 先内部使用打磨，再开源
- 优先保证核心功能稳定，不追求功能全面

## Success Metrics

### Validation (Phase 1)

- 内部至少 2 个项目使用此脚手架启动
- 新项目从克隆到开始写业务代码 < 30 分钟
- 无重大阻塞性 bug

### Growth (Phase 2+)

- 开源后 GitHub Stars > 500（6 个月内）
- 社区贡献者 > 10 人
- 被至少 5 个外部项目采用
