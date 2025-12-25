# Register

## Purpose

用户注册页面，支持邮箱注册和第三方 OAuth 登录。简洁的注册流程，降低用户注册门槛。

## Navigation

- **From:** Home（Get Started）、Login（注册链接）
- **To:** Email Verification Pending（邮箱注册）、Profile（OAuth 登录成功）

## Elements

### Header

- Logo（点击回到首页）
- 返回首页链接

### 注册表单卡片

- 标题："Create your account"
- 副标题："Start your journey with us"

#### OAuth 登录区域

- Google 登录按钮（带图标）
- GitHub 登录按钮（带图标）

#### 分隔线

- "or continue with email" 文字分隔

#### 邮箱注册表单

- 邮箱输入框（带邮箱图标）
- 密码输入框（带锁图标、显示/隐藏切换）
- 确认密码输入框
- 服务条款勾选框："I agree to the Terms of Service and Privacy Policy"
- 注册按钮（主 CTA）

#### 底部链接

- "Already have an account? Sign in"

### Footer

- 简化版：版权信息 + 服务条款/隐私政策链接

## States

- **Default:** 空表单，等待用户输入
- **Loading:** 提交后按钮显示加载状态，表单禁用
- **Empty:** N/A
- **Error:**
  - 邮箱格式错误：输入框下方红色提示
  - 密码不匹配：确认密码框下方红色提示
  - 邮箱已注册：Toast 提示 + "直接登录"链接
  - 网络错误：Toast 提示

## Design Style

- 居中卡片布局
- 简洁、无干扰的注册体验
- 使用 HeroUI Input、Button、Checkbox 组件
- 支持亮/暗主题
