# Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a simple landing page with Hero section, Features grid, dark mode toggle, and i18n support.

**Architecture:** Modify existing RootLayout for navbar updates, rewrite HomePage with Hero + Features + Footer sections. Create a useTheme hook for dark mode with localStorage persistence.

**Tech Stack:** React 19, HeroUI (Chip, Card, Button), TailwindCSS, react-i18next

---

## Task 1: Update i18n translations

**Files:**

- Modify: `packages/locales/src/langs/zh-CN/common.json`
- Modify: `packages/locales/src/langs/en-US/common.json`

**Step 1: Update zh-CN translations**

Replace `packages/locales/src/langs/zh-CN/common.json`:

```json
{
  "nav": {
    "home": "首页",
    "about": "关于"
  },
  "home": {
    "title": "Bingo Web",
    "welcome": "欢迎来到 Bingo Web",
    "getStarted": "开始使用"
  },
  "about": {
    "title": "关于",
    "description": "关于 Bingo Web"
  },
  "hero": {
    "title": "Bingo Web",
    "subtitle": "现代化前端开发脚手架",
    "getStarted": "快速开始"
  },
  "features": {
    "monorepo": {
      "title": "Monorepo 架构",
      "desc": "pnpm workspace 多包管理，代码复用更简单"
    },
    "api": {
      "title": "API 请求封装",
      "desc": "Axios 封装，请求/响应拦截器开箱即用"
    },
    "i18n": {
      "title": "国际化支持",
      "desc": "内置 i18n，轻松支持多语言"
    },
    "darkMode": {
      "title": "暗黑模式",
      "desc": "一键切换明暗主题，自动持久化"
    },
    "typescript": {
      "title": "类型安全",
      "desc": "全量 TypeScript，类型推导更智能"
    },
    "lint": {
      "title": "代码规范",
      "desc": "ESLint + Prettier + Husky 一站式配置"
    }
  },
  "footer": {
    "copyright": "© 2025 Bingo Web"
  }
}
```

**Step 2: Update en-US translations**

Replace `packages/locales/src/langs/en-US/common.json`:

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "title": "Bingo Web",
    "welcome": "Welcome to Bingo Web",
    "getStarted": "Get Started"
  },
  "about": {
    "title": "About",
    "description": "About Bingo Web"
  },
  "hero": {
    "title": "Bingo Web",
    "subtitle": "Modern Frontend Development Scaffold",
    "getStarted": "Get Started"
  },
  "features": {
    "monorepo": {
      "title": "Monorepo Architecture",
      "desc": "pnpm workspace for multi-package management"
    },
    "api": {
      "title": "API Request",
      "desc": "Axios with request/response interceptors out of the box"
    },
    "i18n": {
      "title": "i18n Support",
      "desc": "Built-in internationalization, easy multi-language support"
    },
    "darkMode": {
      "title": "Dark Mode",
      "desc": "One-click theme switch with auto persistence"
    },
    "typescript": {
      "title": "Type Safety",
      "desc": "Full TypeScript with smart type inference"
    },
    "lint": {
      "title": "Code Standards",
      "desc": "ESLint + Prettier + Husky all-in-one setup"
    }
  },
  "footer": {
    "copyright": "© 2025 Bingo Web"
  }
}
```

**Step 3: Verify dev server runs**

Run: `pnpm dev`
Expected: Dev server starts without errors

**Step 4: Commit**

```bash
git add packages/locales/src/langs/
git commit -m "feat(i18n): add landing page translations"
```

---

## Task 2: Create useTheme hook

**Files:**

- Create: `apps/web/src/hooks/useTheme.ts`

**Step 1: Create hooks directory if needed**

Run: `mkdir -p apps/web/src/hooks`

**Step 2: Create useTheme hook**

Create `apps/web/src/hooks/useTheme.ts`:

```typescript
// ABOUTME: Theme management hook for dark mode
// ABOUTME: Persists theme preference to localStorage

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const THEME_KEY = 'bingo-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
```

**Step 3: Create barrel export**

Create `apps/web/src/hooks/index.ts`:

```typescript
// ABOUTME: Barrel export for hooks
// ABOUTME: Re-exports all custom hooks

export { useTheme } from './useTheme'
```

**Step 4: Verify TypeScript compiles**

Run: `pnpm build`
Expected: Build completes without type errors

**Step 5: Commit**

```bash
git add apps/web/src/hooks/
git commit -m "feat: add useTheme hook for dark mode"
```

---

## Task 3: Update RootLayout navbar

**Files:**

- Modify: `apps/web/src/layouts/RootLayout.tsx`

**Step 1: Update RootLayout with new navbar buttons**

Replace `apps/web/src/layouts/RootLayout.tsx`:

```tsx
// ABOUTME: Root layout component with navigation
// ABOUTME: Provides consistent header/footer across all pages

import { Outlet, Link } from 'react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'
import { useTranslation, i18n, changeLanguage } from '@/locales'
import { useTheme } from '@/hooks'

export function RootLayout() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const handleToggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN'
    changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar maxWidth="xl">
        <NavbarBrand>
          <Link to="/" className="text-xl font-bold">
            Bingo Web
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to="/">{t('nav.home')}</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/about">{t('nav.about')}</Link>
          </NavbarItem>
          <NavbarItem>
            <Button
              as="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              isIconOnly
              variant="light"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button isIconOnly variant="light" onPress={handleToggleLanguage} aria-label="Toggle language">
              <span className="text-sm font-medium">{i18n.language === 'zh-CN' ? 'EN' : '中'}</span>
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button isIconOnly variant="light" onPress={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

**Step 2: Verify dev server and test navbar**

Run: `pnpm dev`
Expected: Navbar shows GitHub icon, language toggle (EN/中), and theme toggle (sun/moon)

**Step 3: Commit**

```bash
git add apps/web/src/layouts/RootLayout.tsx
git commit -m "feat(navbar): add GitHub, language, and theme toggle buttons"
```

---

## Task 4: Rewrite HomePage with Hero + Features + Footer

**Files:**

- Modify: `apps/web/src/pages/Home.tsx`

**Step 1: Rewrite HomePage component**

Replace `apps/web/src/pages/Home.tsx`:

```tsx
// ABOUTME: Home page component
// ABOUTME: Displays landing page with Hero, Features, and Footer

import { Button, Chip, Card, CardBody } from '@heroui/react'
import { useTranslation } from '@/locales'

const TECH_STACK = [
  { name: 'React 19', color: 'primary' as const },
  { name: 'Vite', color: 'secondary' as const },
  { name: 'TypeScript', color: 'primary' as const },
  { name: 'HeroUI', color: 'default' as const },
]

const FEATURES = [
  { key: 'monorepo', icon: '📦' },
  { key: 'api', icon: '🔌' },
  { key: 'i18n', icon: '🌐' },
  { key: 'darkMode', icon: '🌙' },
  { key: 'typescript', icon: '🛡️' },
  { key: 'lint', icon: '✨' },
] as const

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-center text-4xl font-bold md:text-5xl lg:text-6xl">{t('hero.title')}</h1>
        <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400 md:text-xl">{t('hero.subtitle')}</p>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <Chip key={tech.name} color={tech.color} variant="flat">
              {tech.name}
            </Chip>
          ))}
        </div>
        <Button color="primary" size="lg">
          {t('hero.getStarted')}
        </Button>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.key} className="p-2">
              <CardBody className="text-center">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t(`features.${feature.key}.desc`)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">{t('footer.copyright')}</footer>
    </div>
  )
}
```

**Step 2: Verify dev server and test page**

Run: `pnpm dev`
Expected:

- Hero section with title, subtitle, tech badges, and CTA button
- Features grid with 6 cards (3 columns on desktop)
- Footer with copyright
- Dark mode toggle works
- Language switch works

**Step 3: Commit**

```bash
git add apps/web/src/pages/Home.tsx
git commit -m "feat(home): add Hero, Features, and Footer sections"
```

---

## Task 5: Final verification and cleanup

**Step 1: Run lint check**

Run: `pnpm lint`
Expected: No errors

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds without errors

**Step 3: Test in browser**

Run: `pnpm dev`
Manual test checklist:

- [ ] Page loads with Hero section centered
- [ ] Tech stack chips display correctly
- [ ] Features grid shows 6 cards
- [ ] Footer shows copyright
- [ ] Click theme toggle: switches between light/dark
- [ ] Refresh page: theme preference persists
- [ ] Click language toggle: switches EN/中文
- [ ] All text updates when language changes
- [ ] GitHub icon button opens new tab
- [ ] Responsive: cards stack on mobile

**Step 4: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix: address any issues from final verification"
```
