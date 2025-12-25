# User Flow

## Primary Flow: 新用户注册并订阅

```
[Landing Page] → [注册] → [邮箱验证] → [个人中心] → [选择订阅] → [支付] → [开始使用]
```

### Step 1: 访问 Landing Page

- **Screen:** Home Page
- **User action:** 浏览产品介绍，点击 "Get Started" CTA
- **System response:** 跳转到注册页面
- **Next:** 注册流程

### Step 2: 用户注册

- **Screen:** Register Page
- **User action:** 选择注册方式：
  - 邮箱注册：输入邮箱、密码
  - OAuth：点击 Google/GitHub 图标
- **System response:**
  - 邮箱注册：发送验证邮件，提示用户查收
  - OAuth：跳转第三方授权，成功后自动创建账户
- **Next:** 邮箱验证 / 直接进入个人中心

### Step 3: 邮箱验证

- **Screen:** Email Verification Pending Page
- **User action:** 打开邮箱，点击验证链接
- **System response:** 验证成功，自动登录，跳转个人中心
- **Next:** 个人中心

### Step 4: 个人中心

- **Screen:** Profile Page
- **User action:** 查看账户信息，完善个人资料
- **System response:** 展示当前订阅状态（Free），引导升级
- **Next:** 选择订阅计划

### Step 5: 选择订阅计划

- **Screen:** Pricing Page
- **User action:** 对比各套餐功能，选择合适的计划，点击 "Subscribe"
- **System response:** 创建 Stripe Checkout Session，跳转支付页面
- **Next:** 支付

### Step 6: 完成支付

- **Screen:** Stripe Checkout Page → Success Page
- **User action:** 输入支付信息，完成支付
- **System response:**
  - 支付成功：更新用户订阅状态，展示成功页面
  - 支付失败：展示错误信息，提供重试选项
- **Next:** 开始使用产品

---

## Secondary Flows

### 用户登录

```
[Landing Page] → [登录] → [个人中心/Dashboard]
```

#### Step 1: 点击登录

- **Screen:** Login Page
- **User action:** 选择登录方式：
  - 邮箱登录：输入邮箱、密码
  - OAuth：点击 Google/GitHub 图标
- **System response:** 验证凭证，成功后 redirect 到目标页面
- **Next:** 个人中心或之前访问的页面

### 忘记密码

```
[登录页] → [忘记密码] → [输入邮箱] → [收取邮件] → [重置密码] → [登录]
```

#### Step 1: 发起重置请求

- **Screen:** Forgot Password Page
- **User action:** 输入注册邮箱
- **System response:** 发送重置密码邮件
- **Next:** 等待邮件

#### Step 2: 重置密码

- **Screen:** Reset Password Page（邮件链接打开）
- **User action:** 输入新密码并确认
- **System response:** 密码更新成功，提示重新登录
- **Next:** 登录页

### 修改密码

```
[个人中心] → [安全设置] → [修改密码] → [确认成功]
```

#### Step 1: 修改密码

- **Screen:** Profile > Security Settings
- **User action:** 输入当前密码、新密码
- **System response:** 验证当前密码，更新为新密码，强制重新登录
- **Next:** 登录页

### 管理订阅

```
[个人中心] → [订阅管理] → [升级/降级/取消] → [确认操作]
```

#### Step 1: 查看订阅状态

- **Screen:** Profile > Subscription
- **User action:** 查看当前订阅计划、到期时间、历史账单
- **System response:** 展示订阅详情
- **Next:** 管理操作

#### Step 2: 变更订阅

- **Screen:** Profile > Subscription > Change Plan
- **User action:** 选择新的订阅计划或取消订阅
- **System response:**
  - 升级：立即生效，按比例计费
  - 降级：下个账单周期生效
  - 取消：当前周期结束后失效
- **Next:** 确认页面

---

## Error Flows

### 邮箱已注册

- **Trigger:** 用户尝试用已存在的邮箱注册
- **Screen:** Register Page with error message
- **Recovery:**
  - 提示"该邮箱已注册"
  - 提供"直接登录"和"忘记密码"链接

### 登录失败

- **Trigger:** 密码错误或账户不存在
- **Screen:** Login Page with error message
- **Recovery:**
  - 显示通用错误"邮箱或密码错误"（安全考虑不区分）
  - 提供"忘记密码"链接
  - 连续失败 5 次后限制登录尝试

### 支付失败

- **Trigger:** 支付被拒绝或取消
- **Screen:** Payment Failed Page
- **Recovery:**
  - 显示失败原因（卡片余额不足、信息错误等）
  - 提供"重试支付"按钮
  - 提供"选择其他支付方式"选项

### Token 过期

- **Trigger:** Access Token 过期且 Refresh Token 刷新失败
- **Screen:** 当前页面 with modal
- **Recovery:**
  - 弹窗提示"登录已过期"
  - 自动跳转登录页
  - 登录成功后返回之前页面

### 网络错误

- **Trigger:** API 请求失败（网络问题）
- **Screen:** 当前页面 with toast notification
- **Recovery:**
  - Toast 提示"网络连接失败，请检查网络"
  - 提供"重试"按钮
  - 部分关键操作自动重试

### 未授权访问

- **Trigger:** 未登录用户访问需要认证的页面
- **Screen:** Redirect to Login Page
- **Recovery:**
  - 保存目标 URL
  - 登录成功后自动跳转回目标页面

### 权限不足

- **Trigger:** 用户访问超出其订阅等级的功能
- **Screen:** Upgrade Required Page
- **Recovery:**
  - 展示功能所需的订阅等级
  - 提供"升级订阅"CTA
  - 提供"返回"按钮
