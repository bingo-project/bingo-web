# AI 角色广场 (AI Square)

## Purpose
AI 功能的入口页面。展示所有可用的 AI 角色（如翻译助手、代码专家等），允许用户选择角色开启新对话，或查看侧边栏的历史会话。

## Navigation
- **From:** 侧边栏导航 (AI Chat), 首页快捷入口
- **To:** AI 对话页 (`/ai/chat/:sessionId`)

## Elements
- **全局布局:**
  - **侧边栏 (Sidebar):**
    - "新建对话" 按钮
    - 历史会话列表 (分组: 今天, 昨天, 更早)
    - 底部: 用户设置, 收起按钮
  - **主内容区 (Main Content):** 角色广场

- **角色广场 (Main Content):**
  - **Header:**
    - 标题: "选择 AI 助手"
    - 搜索框: "搜索角色..."
    - 分类标签: 全部, 编程, 写作, 助手, 娱乐
  - **角色列表 (Grid):**
    - **角色卡片 (Card):**
      - 头像 (Avatar)
      - 名称 (Name)
      - 简短描述 (Description)
      - "开始对话" 按钮 (Start Button)
    - 悬停效果: 卡片轻微上浮，边框高亮

## States
- **Default:** 展示所有推荐角色，侧边栏显示最近会话。
- **Loading:** 骨架屏展示角色卡片列表。
- **Empty:** "暂无可用角色" (极少出现)，或搜索无结果。
- **Error:** "加载失败，请重试" (网络错误)。

## Design Style
遵循 Modern Tech 风格。
- 卡片使用 Glassmorphism 效果。
- 选中状态使用 Primary Gradient。
- 侧边栏背景色需与主内容区区分 (轻微深色/浅色)。
