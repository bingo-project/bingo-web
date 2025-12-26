# HeroUI + Tailwind CSS v4 问题排查

> 遇到样式问题时查阅本文档。规范请参考 [CONVENTIONS.md](../CONVENTIONS.md)。

## 背景

HeroUI 官方文档基于 Tailwind v3，v4 有重大变化：

- 配置从 `tailwind.config.js` 迁移到 CSS `@theme` 块
- Plugin 使用 `@plugin` 指令引入
- 变体语法变化（如 dark mode）

本文档记录已踩过的坑和解决方案。

---

## 问题 1：CSS 变量/主题颜色不生效

### 症状

`bg-primary` 显示错误颜色或无颜色，Button 的 `color="primary"` 不生效。

### 原因

v4 需要同时配置 `@theme` 块和 heroui plugin，缺一不可。

### 解决方案

`apps/web/src/index.css`:

```css
@import 'tailwindcss';
@plugin '../hero.ts';
@source '../../../node_modules/@heroui/theme/dist/**/*.js';

@theme {
  --color-primary: #7238f0;
  --color-primary-hover: #5b2cb3;
}
```

`apps/web/hero.ts`:

```typescript
import { heroui } from '@heroui/react'

const plugin = heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#7238f0',
          foreground: '#ffffff',
        },
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#7238f0',
          foreground: '#ffffff',
        },
      },
    },
  },
})

export default plugin
```

---

## 问题 2：组件样式被 Tailwind reset 覆盖

### 症状

- Checkbox 勾选后勾号不显示
- Input 的 border 消失
- Switch 背景色丢失
- 组件看起来"裸"的

### 原因

Tailwind v4 的 preflight 覆盖了 HeroUI 的 `data-*` 选择器样式。HeroUI 使用 `group-data-[selected=true]:opacity-100` 等选择器，v4 中这些不生效。

### 解决方案

在 `index.css` 中手动补充样式：

```css
/* Checkbox: checked state */
[data-selected='true'] [data-slot='icon'] {
  opacity: 1;
}

/* Checkbox wrapper sizing */
[data-slot='wrapper'] {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Input: bordered variant */
[data-variant='bordered'][data-slot='input-wrapper'] {
  border-width: 2px;
  border-style: solid;
  border-color: hsl(var(--heroui-default-200));
}

[data-variant='bordered'][data-slot='input-wrapper'][data-hover='true'] {
  border-color: hsl(var(--heroui-default-400));
}

[data-variant='bordered'][data-slot='input-wrapper'][data-focus='true'] {
  border-color: hsl(var(--heroui-focus));
}

/* Switch: selected state */
[data-slot='wrapper'][data-selected='true'] {
  background-color: hsl(var(--heroui-primary));
}

[data-slot='thumb'] {
  background-color: white;
}
```

---

## 问题 3：hero.ts 配置位置错误

### 症状

主题颜色完全不生效，但控制台无报错。

### 原因

`@plugin` 路径解析相对于 CSS 文件位置，放错位置会导致静默失败。

### 正确配置

```
apps/web/
├── hero.ts              ✅ 正确位置
├── src/
│   ├── index.css        # 使用 @plugin '../hero.ts'
│   └── hero.ts          ❌ 错误（之前的位置）
```

`index.css` 中的引用：

```css
@plugin '../hero.ts'; /* 相对于 src/index.css，指向 apps/web/hero.ts */
```

---

## 问题 4：暗色模式切换失效

### 症状

切换 dark mode 后，HeroUI 组件颜色不变，只有普通 Tailwind 类生效。

### 原因

v4 需要显式定义 dark 变体，默认的 `dark:` 前缀对 HeroUI 组件不生效。

### 解决方案

在 `index.css` 中添加：

```css
@custom-variant dark (&:is(.dark *));
```

确保 HTML 根元素有 `.dark` 类：

```tsx
// RootLayout.tsx 或类似位置
<div className={theme === 'dark' ? 'dark' : 'light'}>
  <HeroUIProvider>{children}</HeroUIProvider>
</div>
```

---

## 完整的 index.css 配置模板

```css
@import 'tailwindcss';
@plugin '../hero.ts';
@source '../../../node_modules/@heroui/theme/dist/**/*.js';
@custom-variant dark (&:is(.dark *));

@theme {
  --color-primary: #7238f0;
  --color-primary-hover: #5b2cb3;
  /* 其他主题变量 */
}

/* HeroUI 组件样式补丁 - Tailwind v4 兼容 */
/* 详见上述各问题的解决方案 */
```

---

## 调试技巧

1. **检查 CSS 变量是否生效**：在浏览器 DevTools 中检查元素，看 `--heroui-*` 变量是否存在

2. **检查 plugin 是否加载**：在 `hero.ts` 中加 `console.log` 看是否执行

3. **检查 dark mode 类**：确认 HTML 根元素有 `.dark` 或 `.light` 类
