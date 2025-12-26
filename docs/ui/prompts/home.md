Design a landing page for Bingo Web Scaffold.

**Product:**

Bingo Web Scaffold - an out-of-the-box Web2+Web3 frontend scaffold that lets developers focus on business logic instead of infrastructure. Target users are frontend developers and small teams who need to quickly start Web2 or Web3 projects.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Background: Light `#FFFFFF` / Dark `#0A0A0A` (neutral gray, NOT purple)
- Surface/Cards: Light `#F9FAFB` / Dark `#18181B` (zinc-900)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow, hover lift effect
- Theme: Support both light and dark mode (follow system preference, manual toggle available)
- Animations: Fade-in + slide-up on scroll, smooth hover transitions
- Hero glow: Subtle, low opacity (10%) purple/blue blur effect

**Elements:**

Header:

- Logo on left (text logo "Bingo" or icon + text)
- Navigation links: Features, Pricing, FAQ (smooth scroll anchors)
- Theme toggle button (sun/moon icon)
- Language switcher dropdown (EN/中文)
- Login button (secondary, outlined, full radius)
- Get Started button (primary, gradient background, full radius)

Hero Section:

- Large headline: Bold, gradient text effect using primary colors
- Subtitle: 2-3 sentences describing the product value
- Tech stack chips: React 19, Vite, TypeScript, HeroUI, Web3 (horizontal row)
- Primary CTA: "Get Started" button (gradient, full radius, large)
- Secondary CTA: "View on GitHub" button (outlined, full radius)
- Background: Subtle gradient mesh or geometric pattern

Social Proof Section:

- 3-4 key metrics displayed as large numbers with labels
- Example metrics: "10K+ Downloads", "500+ Projects", "99.9% Uptime", "50+ Contributors"
- Partner/technology logo bar (6-8 logos): Vercel, Cloudflare, AWS, etc.
- Note: This is a template section - actual scaffold users will replace with their own metrics

Features Section:

- Section title: "Everything you need to ship fast"
- 6 feature cards in 3-column grid (2 rows)
- Each card: Icon (emoji or Lucide icon), title, short description
- Features to highlight:
  - Monorepo structure (pnpm workspace)
  - Type-safe API integration (OpenAPI codegen)
  - Internationalization (i18n ready)
  - Dark mode (system + manual toggle)
  - TypeScript (full type safety)
  - Code quality (ESLint + Prettier + Husky)
- Cards: Rounded corners (16px), hover effect with shadow increase

Testimonials Section:

- Carousel of 3-5 testimonial cards
- Each card: Avatar, name, title/company, quote text, star rating (5 stars)
- Auto-rotate with pause on hover
- Navigation dots below

Pricing Section:

- Section title: "Simple, transparent pricing"
- Billing toggle: Monthly / Yearly with "Save 20%" badge
- 3 pricing cards side by side:
  - Free: $0/forever, basic features, "Get Started" button (outlined)
  - Pro: $19/mo (highlighted with "Most Popular" badge), all features, "Subscribe" button (gradient)
  - Enterprise: Custom pricing, "Contact Sales" button (outlined)
- Each card: Plan name, price, feature list with checkmarks, CTA button (full radius)

FAQ Section:

- Section title: "Frequently asked questions"
- 5-7 accordion items with expand/collapse
- Common questions about the scaffold usage, customization, support

CTA Section:

- Bold headline: "Ready to build something amazing?"
- Supporting text: One line about getting started
- Large CTA button: "Start Building" (gradient, full radius)
- Background: Subtle gradient or pattern

Footer:

- Logo and tagline
- Link groups in columns: Product, Resources, Company, Legal
- Social media icons: GitHub, Twitter/X, Discord
- Copyright text with year
- "Built with Bingo" badge (meta, since this is the scaffold itself)

**States:**

- Default: All content visible, smooth scroll navigation
- Loading: Skeleton placeholders for above-fold content
- Mobile: Hamburger menu, stacked cards, simplified layout

**Responsive Behavior:**

- Desktop (1024px+): Full layout, 3-column grids
- Tablet (768px-1023px): 2-column grids, slightly reduced spacing
- Mobile (<768px): Single column, hamburger menu, stacked pricing cards

**Constraints:**

- Use HeroUI components: Button, Card, Accordion, Switch, Dropdown, Chip, Avatar
- TailwindCSS for styling with custom gradient utilities
- Accessible: WCAG 2.1 AA compliant, proper heading hierarchy, keyboard navigation
- Performance: Lazy load below-fold sections, optimize images
- i18n: All text content via translation keys (e.g., `home.hero.title`)
