# Subscription Management

## Purpose

订阅管理页面，用户可以查看当前订阅状态、升级/降级套餐、取消订阅、查看账单历史。

## Navigation

- **From:** Profile 侧边栏（Subscription）
- **To:** Pricing（变更套餐）、Stripe Customer Portal（管理支付方式）

## Elements

### Header（应用级导航栏）

- 与 Profile 页面共享

### 侧边栏导航

- 与 Profile 页面共享，Subscription 选中状态

### 主内容区

#### 当前订阅卡片

- 套餐名称 + 状态标签（Active/Canceled/Past Due）
- 当前计费周期
- 下次扣款日期和金额
- "Manage subscription" 按钮（跳转 Stripe Portal）
- "Change plan" 按钮（跳转 Pricing 页面）

#### 使用量统计卡片（如适用）

- 本月使用量进度条
- 使用量明细

#### 账单历史卡片

- 账单列表表格：
  - 日期
  - 描述
  - 金额
  - 状态（Paid/Pending/Failed）
  - "Download invoice" 链接

#### 取消订阅区域

- 警告样式卡片
- "Cancel subscription" 按钮
- 取消后的影响说明

### 取消确认弹窗

- 标题："Cancel subscription?"
- 取消后影响说明
- 挽留优惠（可选）
- "Keep subscription" 按钮（主要）
- "Cancel anyway" 按钮（次要/危险）

## States

- **Default:** 显示当前订阅信息
- **Loading:** 骨架屏加载
- **Empty:** 无订阅时显示 Free 套餐信息和升级引导
- **Error:**
  - 加载失败：Toast 提示
  - 取消失败：Toast 提示

## Design Style

- 与 Profile 页面布局一致
- 使用卡片分组不同信息
- 状态标签使用不同颜色（Active 绿色、Canceled 灰色、Past Due 红色）
- 使用 HeroUI Card、Button、Table、Modal、Progress 组件
- 支持亮/暗主题
