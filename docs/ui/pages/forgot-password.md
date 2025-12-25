# Forgot Password

## Purpose

忘记密码页面，用户输入邮箱后发送密码重置链接。

## Navigation

- **From:** Login（Forgot password 链接）
- **To:** Login（返回登录）、Email（查收重置邮件）

## Elements

### Header

- Logo（点击回到首页）
- 返回登录链接

### 重置密码卡片（居中）

- 锁/钥匙图标
- 标题："Forgot your password?"
- 描述："Enter your email and we'll send you a reset link"

### 表单

- 邮箱输入框
- "Send reset link" 按钮（主 CTA）

### 底部链接

- "Back to login" 链接

### Footer

- 简化版：版权信息

## States

- **Default:** 空表单，等待用户输入
- **Loading:** 提交后按钮显示加载状态
- **Success:** 显示成功提示，引导用户查收邮件
- **Error:**
  - 邮箱格式错误：输入框下方红色提示
  - 邮箱不存在：（出于安全考虑，仍显示成功，避免邮箱枚举）
  - 请求过于频繁：提示稍后重试
  - 网络错误：Toast 提示

## Design Style

- 居中卡片布局
- 与登录/注册页风格一致
- 简洁、安全感的设计
- 使用 HeroUI Input、Button 组件
- 支持亮/暗主题
