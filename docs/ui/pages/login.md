# Login

## Purpose

用户登录页面，支持邮箱密码登录和第三方 OAuth 登录。简洁高效的登录体验。

## Navigation

- **From:** Home（Login 按钮）、Register（已有账号链接）、任何需要认证的页面（未登录重定向）
- **To:** Profile（登录成功）、Forgot Password（忘记密码）、Register（注册链接）

## Elements

### Header

- Logo（点击回到首页）
- 返回首页链接

### 登录表单卡片（居中）

- 标题："Welcome back"
- 副标题："Sign in to your account"

#### OAuth 登录区域

- Google 登录按钮（带图标）
- GitHub 登录按钮（带图标）

#### 分隔线

- "or continue with email" 文字分隔

#### 邮箱登录表单

- 邮箱输入框（带邮箱图标）
- 密码输入框（带锁图标、显示/隐藏切换）
- "Remember me" 勾选框 + "Forgot password?" 链接（同一行）
- 登录按钮（主 CTA）

#### 底部链接

- "Don't have an account? Sign up"

### Footer

- 简化版：版权信息 + 服务条款/隐私政策链接

## States

- **Default:** 空表单，等待用户输入
- **Loading:** 提交后按钮显示加载状态，表单禁用
- **Empty:** N/A
- **Error:**
  - 邮箱或密码错误：Toast 提示（不区分具体错误）
  - 账户未验证：Toast 提示 + 重新发送验证邮件链接
  - 登录尝试过多：提示稍后重试 + 剩余时间
  - 网络错误：Toast 提示

## Design Style

- 居中卡片布局
- 与注册页风格一致
- 使用 HeroUI Input、Button、Checkbox 组件
- 支持亮/暗主题
