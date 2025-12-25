# Error Page

## Purpose

通用错误页面，处理 404、500 等错误，以及应用崩溃时的降级显示。

## Navigation

- **From:** 任何页面（路由错误、服务器错误、应用崩溃）
- **To:** Home、上一页、刷新当前页

## Elements

### Header

- Logo（点击回到首页）

### 错误展示区域（居中）

#### 404 页面

- 大号 "404" 数字或插图
- 标题："Page not found"
- 描述："The page you're looking for doesn't exist or has been moved"

#### 500 页面

- 服务器错误插图
- 标题："Something went wrong"
- 描述："We're working on fixing this. Please try again later"

#### 应用崩溃页面

- 错误插图
- 标题："Oops! Something broke"
- 描述："An unexpected error occurred"
- 错误详情（可展开，仅开发环境）

### 操作区域

- "Go home" 按钮（主 CTA）
- "Go back" 按钮
- "Refresh page" 按钮（500/崩溃时）
- "Report issue" 链接（可选）

### Footer

- 简化版：版权信息

## States

- **Default:** 根据错误类型显示对应内容
- **Loading:** N/A
- **Empty:** N/A
- **Error:** N/A

## Design Style

- 居中布局
- 友好、不吓人的错误插图
- 幽默但不轻浮的文案
- 明确的恢复路径
- 使用 HeroUI Button 组件
- 支持亮/暗主题
