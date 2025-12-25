# Email Verification Pending

## Purpose

邮箱验证等待页面，提示用户查收验证邮件。提供重新发送邮件的功能。

## Navigation

- **From:** Register（邮箱注册成功后）
- **To:** Profile（点击邮件中的验证链接后自动跳转）、Login（手动跳转）

## Elements

### Header

- Logo（点击回到首页）

### 验证提示卡片（居中）

- 邮件图标（大号，动画效果）
- 标题："Check your email"
- 描述："We've sent a verification link to [user@email.com]"
- 提示文字："Click the link in the email to verify your account"

### 操作区域

- "Resend email" 按钮（次要样式）
- 倒计时提示："Resend available in 60s"（点击后）
- "Use a different email" 链接（返回注册页）

### 帮助信息

- "Didn't receive the email?"
- 检查垃圾邮件提示
- 联系支持链接

### Footer

- 简化版：版权信息

## States

- **Default:** 显示验证等待信息
- **Loading:** 重新发送按钮显示加载状态
- **Empty:** N/A
- **Error:**
  - 发送失败：Toast 提示网络错误
  - 发送频率限制：显示剩余等待时间

## Design Style

- 居中卡片布局
- 邮件图标使用轻微动画（如浮动效果）
- 简洁、引导性强的设计
- 使用 HeroUI Button 组件
- 支持亮/暗主题
