# 通知系统前端设计

## 概述

为 Bingo Web 添加通知功能前端，包括：

- Header 通知下拉面板
- 通知设置页面（偏好设置）
- 通知中心页面（历史列表）

## 功能范围

| 组件                | 路由                      | 描述                                             |
| ------------------- | ------------------------- | ------------------------------------------------ |
| Header 通知下拉面板 | -                         | 铃铛图标 + 未读角标，点击展开最近通知列表        |
| 通知设置页面        | `/settings/notifications` | 通知偏好设置（按大类 + 渠道开关）                |
| 通知中心页面        | `/notifications`          | 完整通知历史列表，支持筛选、分页、标记已读、删除 |

## 数据结构

### 通知类型

```typescript
type NotificationCategory = 'system' | 'security' | 'transaction' | 'social'
type NotificationSource = 'message' | 'announcement'

interface Notification {
  uuid: string
  source: NotificationSource
  category: NotificationCategory
  type: string // 具体类型：login_alert, deposit_success 等
  title: string
  content: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}
```

### 通知偏好

```typescript
interface NotificationPreferences {
  system: { inApp: boolean; email: boolean }
  security: { inApp: boolean; email: boolean }
  transaction: { inApp: boolean; email: boolean }
  social: { inApp: boolean; email: boolean }
}
```

## API 接口

基于后端设计文档，API 层定义：

```typescript
export const notificationApi = {
  // 通知列表
  getList: (params: { category?: string; isRead?: boolean; page?: number; pageSize?: number }) =>
    request.get<{ data: Notification[]; total: number }>('/v1/notifications', { params }),

  // 未读数
  getUnreadCount: () => request.get<{ count: number }>('/v1/notifications/unread-count'),

  // 标记已读
  markAsRead: (uuid: string) => request.put(`/v1/notifications/${uuid}/read`),
  markAllAsRead: () => request.put('/v1/notifications/read-all'),

  // 删除
  delete: (uuid: string) => request.delete(`/v1/notifications/${uuid}`),

  // 偏好设置
  getPreferences: () => request.get<NotificationPreferences>('/v1/notifications/preferences'),
  updatePreferences: (data: NotificationPreferences) => request.put('/v1/notifications/preferences', data),
}
```

### Mock 数据

后端 API 未就绪时，使用环境变量 `VITE_USE_MOCK=true` 控制 fallback 到本地 mock 数据。

## 组件设计

### 1. Header 通知下拉面板

**结构：**

```
NotificationDropdown
├── 触发器：Bell 图标 + 未读角标（红点/数字）
└── 下拉面板：
    ├── 标题栏："通知" + "全部已读"按钮
    ├── 通知列表（最近 5 条）
    │   └── NotificationItem（图标、标题、时间、未读标记）
    ├── 空状态：暂无通知
    └── 底部："查看全部" 链接 → /notifications
```

**交互：**
| 操作 | 行为 |
|------|------|
| 点击铃铛 | 打开下拉面板，加载最近通知 |
| 点击通知项 | 标记已读 + 跳转 `actionUrl`（如有） |
| 点击"全部已读" | 调用 API 标记全部已读，刷新列表 |
| 点击"查看全部" | 跳转到 `/notifications` |

### 2. 通知设置页面

**路由：** `/settings/notifications`

**结构：**

```
NotificationSettingsPage
├── 页面标题：通知设置（Bell 图标）
└── 偏好设置卡片（按大类分组）
    ├── 系统通知 (system)
    │   ├── 站内通知 [Switch]
    │   └── 邮件通知 [Switch]
    ├── 安全提醒 (security)
    │   ├── 站内通知 [Switch]
    │   └── 邮件通知 [Switch]
    ├── 交易通知 (transaction)
    │   ├── 站内通知 [Switch]
    │   └── 邮件通知 [Switch]
    └── 社交互动 (social)
        ├── 站内通知 [Switch]
        └── 邮件通知 [Switch]
```

**交互：**
| 操作 | 行为 |
|------|------|
| 切换开关 | 立即调用 API 保存（乐观更新），失败时回滚并 toast 提示 |
| 页面加载 | 获取当前偏好设置，loading 状态显示骨架屏 |

### 3. 通知中心页面

**路由：** `/notifications`

**结构：**

```
NotificationCenterPage
├── 页面标题：通知中心（Bell 图标）
├── 工具栏
│   ├── 筛选下拉：全部 / 系统 / 安全 / 交易 / 社交
│   ├── 筛选下拉：全部 / 未读 / 已读
│   └── "全部已读" 按钮
└── 通知列表
    ├── NotificationItem（可点击）
    │   ├── 左侧：类型图标 + 未读圆点
    │   ├── 中间：标题、内容摘要、时间
    │   └── 右侧：删除按钮（仅 message 类型）
    ├── 空状态：暂无通知
    └── 分页：无限滚动
```

**交互：**
| 操作 | 行为 |
|------|------|
| 点击通知项 | 标记已读 + 跳转 `actionUrl`（如有） |
| 点击删除 | 确认后删除（公告不可删除） |
| 切换筛选 | 重新加载列表 |
| 滚动到底部 | 加载更多（无限滚动） |

## WebSocket 集成

监听推送消息，实时更新：

```typescript
wsClient.on('ntf.message', (data) => {
  // 更新通知列表、未读数
})

wsClient.on('ntf.announcement', (data) => {
  // 显示公告通知
})

wsClient.on('ntf.unread_count', (data) => {
  // 更新角标数字
})
```

## 文件结构

```
apps/web/src/
├── pages/
│   ├── settings/
│   │   ├── Notifications.tsx    # 通知设置页面
│   │   └── index.ts             # 更新导出
│   └── notifications/
│       └── index.tsx            # 通知中心页面
├── components/
│   └── notification/
│       ├── NotificationDropdown.tsx   # Header 下拉面板
│       ├── NotificationItem.tsx       # 通知列表项
│       └── index.ts
└── routes/
    └── index.tsx                # 添加新路由

packages/core/src/
├── api/
│   └── notification.ts          # API 接口 + mock
└── types/
    └── notification.ts          # 类型定义
```

## 国际化

添加翻译 key：

```
notifications.title
notifications.empty
notifications.markAllRead
notifications.viewAll
notifications.settings.title
notifications.settings.system
notifications.settings.security
notifications.settings.transaction
notifications.settings.social
notifications.settings.inApp
notifications.settings.email
notifications.filter.all
notifications.filter.unread
notifications.filter.read
notifications.delete.confirm
notifications.delete.success
```
