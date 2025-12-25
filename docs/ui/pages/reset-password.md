# Reset Password

## Purpose

重置密码页面，用户通过邮件链接访问，设置新密码。

## Navigation

- **From:** 邮件中的重置链接
- **To:** Login（重置成功后）

## Elements

### Header

- Logo（点击回到首页）

### 重置密码卡片（居中）

- 标题："Set new password"
- 描述："Your new password must be different from previous passwords"

### 表单

- 新密码输入框（带密码强度指示器）
- 确认密码输入框
- "Reset password" 按钮（主 CTA）

### 密码要求提示

- 至少 8 个字符
- 包含大小写字母
- 包含数字

### Footer

- 简化版：版权信息

## States

- **Default:** 空表单，等待用户输入
- **Loading:** 提交后按钮显示加载状态
- **Success:** 显示成功提示，自动跳转登录页
- **Error:**
  - 密码不符合要求：输入框下方红色提示
  - 密码不匹配：确认密码框下方红色提示
  - 链接已过期：显示过期提示，提供重新发送链接
  - 链接无效：显示错误提示
  - 网络错误：Toast 提示

## Design Style

- 居中卡片布局
- 与登录/注册页风格一致
- 密码强度使用颜色指示（红/黄/绿）
- 使用 HeroUI Input、Button 组件
- 支持亮/暗主题
