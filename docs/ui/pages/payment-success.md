# Payment Success

## Purpose

支付成功确认页面，向用户确认订阅已生效，引导下一步操作。

## Navigation

- **From:** Stripe Checkout（支付成功回调）
- **To:** Profile、Home、Dashboard

## Elements

### Header

- Logo（点击回到首页）

### 成功确认卡片（居中）

- 成功图标（绿色勾选，带动画）
- 标题："Payment successful!"
- 副标题："Thank you for subscribing to [Plan Name]"

### 订阅详情卡片

- 订阅计划名称
- 计费周期（Monthly/Yearly）
- 下次扣款日期
- 金额

### 操作区域

- "Go to Dashboard" 按钮（主 CTA）
- "View subscription details" 链接

### 附加信息

- 确认邮件提示："A confirmation email has been sent to [email]"
- 帮助链接："Need help? Contact support"

### Footer

- 简化版：版权信息

## States

- **Default:** 显示成功信息和订阅详情
- **Loading:** 验证支付状态时显示加载
- **Empty:** N/A
- **Error:**
  - 支付验证失败：显示错误信息，提供重试或联系支持

## Design Style

- 居中卡片布局
- 成功图标使用绿色，带 confetti 或 check 动画
- 积极、庆祝的视觉风格
- 使用 HeroUI Card、Button 组件
- 支持亮/暗主题
