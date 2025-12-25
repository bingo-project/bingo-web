# Pricing

## Purpose

独立的定价页面，展示所有订阅计划的详细信息和功能对比，引导用户选择合适的方案并完成订阅。

## Navigation

- **From:** Home（Pricing 导航/CTA）、Profile（升级入口）
- **To:** Stripe Checkout（选择方案后）、Login（未登录用户点击订阅）

## Elements

### Header（应用级导航栏）

- Logo
- 导航菜单
- 主题切换
- 语言切换
- Login/用户菜单

### 页面标题区

- 主标题："Choose your plan"
- 副标题："Start free, upgrade when you're ready"
- 计费周期切换：Monthly / Yearly（带折扣标签 "Save 20%"）

### 定价卡片区

#### Free 套餐卡片

- 套餐名称："Free"
- 价格："$0" / "forever"
- 功能列表（带勾选图标）
- CTA 按钮："Get started"（次要样式）

#### Pro 套餐卡片（推荐）

- "Most Popular" 标签
- 套餐名称："Pro"
- 价格："$19/mo" 或 "$15/mo billed yearly"
- 功能列表（带勾选图标，突出与 Free 的差异）
- CTA 按钮："Subscribe"（主要样式）

#### Enterprise 套餐卡片

- 套餐名称："Enterprise"
- 价格："Custom"
- 功能列表
- CTA 按钮："Contact sales"

### 功能对比表

- 可折叠/展开的详细功能对比表格
- 行：各功能项
- 列：Free / Pro / Enterprise
- 勾选/叉号/数值显示

### FAQ 区域

- 常见订阅问题（手风琴样式）：
  - 可以随时取消吗？
  - 支持哪些支付方式？
  - 升级/降级如何计费？

### Footer

- 标准 Footer

## States

- **Default:** 展示所有套餐信息
- **Loading:** 骨架屏（用户已登录时加载当前订阅状态）
- **Empty:** N/A
- **Error:**
  - 加载订阅状态失败：Toast 提示
  - 创建支付会话失败：Toast 提示

## Design Style

- 卡片并排展示，推荐套餐视觉突出
- 年/月切换时价格平滑过渡
- 使用 HeroUI Card、Button、Switch、Table、Accordion 组件
- 支持亮/暗主题
