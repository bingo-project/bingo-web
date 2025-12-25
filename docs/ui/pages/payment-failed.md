# Payment Failed

## Purpose

支付失败页面，告知用户支付未成功，提供重试和其他解决方案。

## Navigation

- **From:** Stripe Checkout（支付失败回调）
- **To:** Pricing（重新选择）、Stripe Checkout（重试）、支持页面

## Elements

### Header

- Logo（点击回到首页）

### 失败提示卡片（居中）

- 失败图标（红色叉号或警告图标）
- 标题："Payment failed"
- 描述：失败原因（如 "Your card was declined" 或 "Payment could not be processed"）

### 解决方案区域

- 常见原因列表：
  - 卡片余额不足
  - 卡片信息错误
  - 银行拒绝交易
- 建议操作

### 操作区域

- "Try again" 按钮（主 CTA，重新发起支付）
- "Use different payment method" 按钮（次要）
- "Contact support" 链接

### Footer

- 简化版：版权信息

## States

- **Default:** 显示失败信息和解决方案
- **Loading:** 重试时按钮显示加载状态
- **Empty:** N/A
- **Error:**
  - 重试仍失败：更新错误信息

## Design Style

- 居中卡片布局
- 失败图标使用红色/橙色
- 不过于负面，提供建设性的解决方案
- 使用 HeroUI Card、Button 组件
- 支持亮/暗主题
