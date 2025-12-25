Design a pricing page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow, hover lift effect
- Theme: Support both light and dark mode

**Context:**

A dedicated pricing page that displays all subscription plans with detailed feature comparisons. Goal is to help users choose the right plan and convert them to paid subscribers.

**Elements:**

Header (App-level navigation):

- Logo
- Navigation menu
- Theme toggle (sun/moon icon)
- Language switcher
- Login button (outlined, full radius) or user menu

Page Title Section:

- Headline: "Choose your plan"
- Subheadline: "Start free, upgrade when you're ready"
- Billing toggle: Monthly / Yearly with "Save 20%" badge on yearly

Pricing Cards (3 side by side):

Free Plan Card:

- Plan name: "Free"
- Price: "$0" with "forever" label
- Feature list with checkmark icons (5-6 items)
- CTA button: "Get started" (outlined, full radius)

Pro Plan Card (highlighted):

- "Most Popular" badge at top
- Plan name: "Pro"
- Price: "$19/mo" or "$15/mo billed yearly" (updates with toggle)
- Feature list with checkmark icons (all Free features + more)
- CTA button: "Subscribe" (primary gradient, full radius)

Enterprise Plan Card:

- Plan name: "Enterprise"
- Price: "Custom"
- Feature list with checkmark icons
- CTA button: "Contact sales" (outlined, full radius)

Feature Comparison Table:

- Collapsible/expandable detailed comparison
- Rows: Individual features
- Columns: Free / Pro / Enterprise
- Cells: Checkmarks, X marks, or specific values

FAQ Section:

- Accordion with common questions:
  - Can I cancel anytime?
  - What payment methods are accepted?
  - How does upgrading/downgrading work?

Footer:

- Standard app footer

**States:**

- Default: All plans displayed, toggle on monthly
- Loading: Skeleton cards while fetching user's current plan
- Logged in: Current plan highlighted, upgrade/downgrade CTAs shown
- Error: Toast for failed operations

**Constraints:**

- Use HeroUI components (Card, Button, Switch, Table, Accordion)
- TailwindCSS for styling
- Responsive: Stack cards vertically on mobile
- Accessible: Proper heading hierarchy, keyboard navigation
- i18n: All text via translation keys
