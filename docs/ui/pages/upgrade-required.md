# Upgrade Required

## Purpose

权限不足页面，当用户尝试访问其订阅等级不支持的功能时显示，引导升级。

## Navigation

- **From:** 任何需要更高订阅等级的功能页面
- **To:** Pricing（升级）、返回上一页

## Elements

### Header（应用级导航栏）

- 标准应用导航

### 升级提示区域（居中）

- 锁定图标或皇冠图标
- 标题："Upgrade to unlock this feature"
- 描述：说明该功能需要的订阅等级

### 功能预览卡片

- 被锁定功能的简要说明
- 该功能的好处/价值

### 套餐对比卡片

- 当前套餐 vs 目标套餐
- 功能差异对比
- 价格差异

### 操作区域

- "Upgrade now" 按钮（主 CTA）
- "View all plans" 链接
- "Go back" 链接

## States

- **Default:** 显示升级提示和功能说明
- **Loading:** 跳转升级时显示加载
- **Empty:** N/A
- **Error:**
  - 无法获取套餐信息：Toast 提示

## Design Style

- 居中内容布局
- 锁定图标视觉突出
- 强调升级价值而非限制
- 使用 HeroUI Card、Button 组件
- 支持亮/暗主题
