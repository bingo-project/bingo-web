# Profile

## Purpose

个人中心页面，用户可以查看和管理个人信息、账号设置、订阅状态。是登录用户的主要管理界面。

## Navigation

- **From:** Login（登录成功）、Header 用户菜单
- **To:** Subscription Management、Home、任意页面

## Elements

### Header（应用级导航栏）

- Logo
- 导航菜单
- 用户头像下拉菜单：
  - 用户名 + 邮箱
  - Profile（当前）
  - Settings
  - Logout

### 侧边栏导航

- Profile（个人信息）- 当前选中
- Security（安全设置）
- Subscription（订阅管理）
- Notifications（通知设置）

### 主内容区 - 个人信息

#### 头像区域

- 当前头像（大号圆形）
- "Change avatar" 按钮
- 上传提示："JPG, PNG. Max 2MB"

#### 基本信息表单

- 昵称输入框
- 邮箱（只读，带验证状态标记）
- 个人简介文本框（可选）
- "Save changes" 按钮

#### 账户信息卡片

- 注册时间
- 最后登录时间
- 账户状态（Active/Inactive）

### 主内容区 - 安全设置（切换后）

#### 修改密码卡片

- 当前密码输入框
- 新密码输入框
- 确认新密码输入框
- "Update password" 按钮

#### 登录设备卡片

- 设备列表（设备名、IP、最后活跃时间）
- "Revoke" 按钮（每个设备）

### 主内容区 - 通知设置（切换后）

#### 通知偏好

- 邮件通知开关
- 产品更新通知开关
- 营销邮件开关

#### 语言设置

- 语言选择下拉框

## States

- **Default:** 显示当前用户信息
- **Loading:** 页面加载骨架屏，保存时按钮 loading
- **Empty:** N/A
- **Error:**
  - 保存失败：Toast 提示
  - 头像上传失败：Toast 提示 + 错误原因
  - 密码修改失败：表单内联错误提示

## Design Style

- 左侧边栏 + 右侧内容的经典管理界面布局
- 卡片分组展示不同设置项
- 使用 HeroUI Input、Button、Switch、Avatar、Card 组件
- 支持亮/暗主题
