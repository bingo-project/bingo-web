# HeroUI 样式规范

## 主题配置

在 `apps/web/hero.ts` 中配置主题颜色：

```typescript
heroui({
  themes: {
    light: {
      colors: {
        primary: { DEFAULT: '#7C3AED' },
      },
    },
    dark: {
      colors: {
        primary: { DEFAULT: '#8B5CF6' },
      },
    },
  },
})
```

## 必须遵循

1. **使用组件 props 控制样式** - 如 `radius="full"`、`fullWidth`、`variant="bordered"`
2. **使用 `classNames` prop** - 当需要自定义组件内部样式时
3. **使用 `hero.ts` 配置主题颜色** - 通过 `themes` 配置 primary、secondary 等语义颜色

## 禁止

1. **禁止使用 `layout.radius` 全局配置** - 会影响所有组件（包括 Card），应使用组件 props 精确控制
2. **禁止使用 CSS 选择器 hack** - 如 `button[class*='z-0']`、`[data-slot='xxx']` 等依赖 HeroUI 内部实现的选择器
3. **禁止使用 `!important` 覆盖组件样式** - 这表明配置方式不正确
4. **禁止直接修改 node_modules** - 使用 plugin 配置或 classNames 覆盖

**原因：** HeroUI 内部实现可能随版本变化，hack 样式会导致升级后样式失效。

## 示例

Button 和 Input 使用 full radius：

```tsx
<Button radius="full" color="primary">Submit</Button>
<Input radius="full" variant="bordered" />
```
