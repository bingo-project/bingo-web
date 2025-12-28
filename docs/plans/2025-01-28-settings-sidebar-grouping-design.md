# Settings 侧边栏分组设计

## 背景

通知中心 (`/notifications`) 目前是独立页面，没有侧边栏导航，用户切换到其他功能不方便。需要将其整合到 Settings 布局中，并支持分组导航。

## 设计决策

### URL 结构

| 页面     | 当前路由                  | 新路由                                |
| -------- | ------------------------- | ------------------------------------- |
| 通知中心 | `/notifications`          | `/settings/notifications`             |
| 通知偏好 | `/settings/notifications` | `/settings/notifications/preferences` |
| 个人资料 | `/settings/profile`       | `/settings/profile` (不变)            |
| 安全设置 | `/settings/security`      | `/settings/security` (不变)           |

### 侧边栏分组

```
┌─────────────────────────────────────┐
│  通知                               │
│    ├─ 通知中心                       │
│    └─ 通知偏好                       │
│                                     │
│  账户                               │
│    ├─ 个人资料                       │
│    └─ 安全设置                       │
│                                     │
│  ──────────────────                 │
│  退出登录                            │
└─────────────────────────────────────┘
```

## 实现计划

### Step 1: 重构 SettingsLayout 支持分组

修改 `apps/web/src/layouts/SettingsLayout.tsx`:

- 将 `navItems` 改为分组结构
- 渲染时按组显示，每组有标题
- 移除订阅项（disabled）

```typescript
const navGroups = [
  {
    key: 'notifications',
    items: [
      { key: 'center', path: '/settings/notifications', icon: Bell },
      { key: 'preferences', path: '/settings/notifications/preferences', icon: Settings },
    ],
  },
  {
    key: 'account',
    items: [
      { key: 'profile', path: '/settings/profile', icon: User },
      { key: 'security', path: '/settings/security', icon: Shield },
    ],
  },
]
```

### Step 2: 调整路由配置

修改 `apps/web/src/routes/index.tsx`:

- 移除独立的 `/notifications` 路由
- 添加嵌套路由 `/settings/notifications` 和 `/settings/notifications/preferences`

```typescript
{
  path: '/settings',
  element: <SettingsLayout />,
  children: [
    { index: true, element: <Navigate to="/settings/notifications" replace /> },
    { path: 'notifications', element: <NotificationCenterPage /> },
    { path: 'notifications/preferences', element: <NotificationSettingsPage /> },
    { path: 'profile', element: <ProfileSettingsPage /> },
    { path: 'security', element: <SecuritySettingsPage /> },
  ],
}
```

### Step 3: 调整页面文件

- 移动 `pages/notifications/index.tsx` → `pages/settings/NotificationCenter.tsx`
- 重命名 `pages/settings/Notifications.tsx` → `pages/settings/NotificationPreferences.tsx`
- 更新页面 exports

### Step 4: 更新 NotificationCenterPage

- 移除 `<Header>` 组件（SettingsLayout 已包含）
- 移除外层容器 padding（由 SettingsLayout 控制）
- 更新跳转到通知设置的路径 `/settings/notifications/preferences`

### Step 5: 添加 i18n 翻译

添加分组标题翻译:

```json
{
  "settings": {
    "nav": {
      "groups": {
        "notifications": "通知",
        "account": "账户"
      },
      "center": "通知中心",
      "preferences": "通知偏好"
    }
  }
}
```

### Step 6: 更新相关跳转链接

搜索并更新所有跳转到 `/notifications` 的地方:

- `NotificationDropdown.tsx` 中的 "查看全部" 链接

## 验证清单

- [ ] 侧边栏正确显示分组
- [ ] 所有路由正常工作
- [ ] 通知中心页面样式正确（无重复 Header）
- [ ] 移动端导航正常
- [ ] 所有跳转链接正确
- [ ] i18n 翻译完整（中/英）
