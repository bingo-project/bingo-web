# Bingo Web Design System

## Product Context

- **Product Name:** Bingo Web Scaffold
- **Tagline:** 开箱即用的 Web2+Web3 前端脚手架
- **Target Users:** 前端开发者、小团队，需要快速启动 Web2 或 Web3 项目
- **Core Value:** 统一技术规范、消除重复配置、提供生产级最佳实践

## Visual Style

**Modern Tech** - 现代科技感

- Clean and minimal layout with generous whitespace
- Gradient accents for visual interest
- Subtle animations (fade-in, slide-up on scroll)
- Glass morphism effects where appropriate
- Sharp, geometric shapes with rounded corners

## Color Palette

### Primary Colors (Purple-Blue Gradient)

| Token              | Light Mode          | Dark Mode           | Usage                         |
| ------------------ | ------------------- | ------------------- | ----------------------------- |
| `primary`          | `#7C3AED`           | `#8B5CF6`           | Primary actions, links        |
| `primary-gradient` | `#7C3AED → #2563EB` | `#8B5CF6 → #3B82F6` | Hero backgrounds, CTA buttons |

### Semantic Colors

| Token     | Light Mode | Dark Mode | Usage                         |
| --------- | ---------- | --------- | ----------------------------- |
| `success` | `#10B981`  | `#34D399` | Success states, confirmations |
| `warning` | `#F59E0B`  | `#FBBF24` | Warning states                |
| `danger`  | `#EF4444`  | `#F87171` | Errors, destructive actions   |
| `info`    | `#3B82F6`  | `#60A5FA` | Informational states          |

### Neutral Colors

| Token        | Light Mode | Dark Mode | Usage             |
| ------------ | ---------- | --------- | ----------------- |
| `background` | `#FFFFFF`  | `#0A0A0A` | Page background   |
| `foreground` | `#171717`  | `#FAFAFA` | Primary text      |
| `muted`      | `#6B7280`  | `#9CA3AF` | Secondary text    |
| `border`     | `#E5E7EB`  | `#27272A` | Borders, dividers |
| `card`       | `#F9FAFB`  | `#18181B` | Card backgrounds  |

## Typography

- **Font Family:** System font stack (Inter recommended for headings)
- **Base Size:** 16px
- **Scale:** 1.25 (Major Third)

| Element | Size            | Weight | Line Height |
| ------- | --------------- | ------ | ----------- |
| H1      | 3rem (48px)     | 700    | 1.2         |
| H2      | 2.25rem (36px)  | 600    | 1.3         |
| H3      | 1.5rem (24px)   | 600    | 1.4         |
| Body    | 1rem (16px)     | 400    | 1.6         |
| Small   | 0.875rem (14px) | 400    | 1.5         |

## Spacing

Use Tailwind's default spacing scale (4px base):

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Border Radius

| Element      | Radius                       |
| ------------ | ---------------------------- |
| Buttons      | `full` (9999px) - pill shape |
| Cards        | `2xl` (16px)                 |
| Inputs       | `lg` (8px)                   |
| Chips/Badges | `full`                       |
| Modals       | `2xl` (16px)                 |

## Components

### Buttons

- **Shape:** Full radius (pill shape) for all buttons
- **Sizes:** `sm`, `md`, `lg`
- **Variants:**
  - Primary: Gradient background (`primary-gradient`)
  - Secondary: Outlined with primary color
  - Ghost: Text only, hover background

### Cards

- Background: `card` color
- Border radius: `2xl`
- Shadow: `md` for default, `lg` on hover
- Hover effect: Subtle lift (`isHoverable`)

### Forms

- Input border radius: `lg`
- Focus ring: Primary color
- Error state: Danger color border + message below
- Labels: Above inputs, medium weight

## Theme Configuration

### Light/Dark Mode

- Default: Follow system preference
- Manual toggle: Available in header
- Transition: Smooth color transition (150ms)

### HeroUI Theme

Configure in `hero.ts`:

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

## Animations

- **Scroll animations:** Fade-in + slide-up (staggered)
- **Hover effects:** Scale (1.02) + shadow increase
- **Transitions:** 150ms ease-out for colors, 200ms for transforms
- **Loading:** Skeleton placeholders, spinner for buttons

## Accessibility

- WCAG 2.1 AA compliant
- Color contrast ratio: 4.5:1 minimum for text
- Focus visible states on all interactive elements
- Keyboard navigation support
- Screen reader compatible (proper ARIA labels)

## Responsive Breakpoints

| Breakpoint | Width  | Usage            |
| ---------- | ------ | ---------------- |
| `sm`       | 640px  | Mobile landscape |
| `md`       | 768px  | Tablet           |
| `lg`       | 1024px | Desktop          |
| `xl`       | 1280px | Large desktop    |
| `2xl`      | 1536px | Extra large      |

## i18n Keys Convention

- Page-specific: `{page}.{section}.{element}`
- Common: `common.{element}`
- Example: `home.hero.title`, `common.button.submit`
