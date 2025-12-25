# Home (Landing Page)

## Purpose

产品首页/落地页，向访客展示产品价值主张，引导用户注册或了解更多。是用户进入产品的第一个页面。

## Navigation

- **From:** 直接访问、外部链接、搜索引擎
- **To:** Register、Login、Pricing

## Elements

### Header (导航栏)

- Logo（点击回到首页）
- 导航菜单：Features、Pricing、FAQ
- 主题切换按钮（亮/暗模式）
- 语言切换下拉框
- CTA 按钮组：Login（次要）、Get Started（主要）

### Hero Section

- 主标题：一句话价值主张
- 副标题：2-3 句产品描述
- 主 CTA 按钮：Get Started
- 次 CTA 按钮：Learn More（滚动到 Features）
- 背景：支持纯色渐变、图片或视频

### Social Proof Section

- 数据统计：用户数、项目数等关键指标（3-4 个）
- 客户 Logo 墙：合作伙伴/客户 Logo（横向滚动或网格）

### Features Section

- 标题：核心功能
- 功能卡片网格（3-4 列）：图标 + 标题 + 描述

### Testimonials Section

- 用户评价卡片轮播
- 每张卡片：头像、姓名、职位、评价内容、评分

### Pricing Section

- 标题：选择适合你的方案
- 年/月计费切换开关
- 定价卡片（2-4 个套餐）：
  - 套餐名称
  - 价格
  - 功能列表（带勾选图标）
  - CTA 按钮

### FAQ Section

- 标题：常见问题
- 手风琴列表（可展开/收起）

### CTA Section

- 行动召唤标题
- 简短描述
- 主 CTA 按钮

### Footer

- Logo + 简短描述
- 链接分组：Product、Company、Legal、Social
- 版权信息
- 社交媒体图标链接

## States

- **Default:** 正常展示所有内容
- **Loading:** 首屏骨架屏，其他内容懒加载
- **Empty:** N/A（静态内容页）
- **Error:** N/A（静态内容页）

## Design Style

- 使用 HeroUI 组件库
- TailwindCSS 样式
- 支持亮/暗两种主题
- 响应式设计：Desktop、Tablet、Mobile
- 动画：滚动渐入效果
