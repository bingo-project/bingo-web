Design a pricing page for a SaaS web application.

**Context:**
A dedicated pricing page that displays all subscription plans with detailed feature comparisons. Goal is to help users choose the right plan and convert them to paid subscribers.

**Elements:**

Header (App-level navigation):

- Logo
- Navigation menu
- Theme toggle
- Language switcher
- Login button or user menu

Page Title Section:

- Headline: "Choose your plan"
- Subheadline: "Start free, upgrade when you're ready"
- Billing toggle: Monthly / Yearly with "Save 20%" badge on yearly

Pricing Cards (3 side by side):

Free Plan Card:

- Plan name: "Free"
- Price: "$0" with "forever" label
- Feature list with checkmark icons (5-6 items)
- CTA button: "Get started" (secondary style)

Pro Plan Card (highlighted):

- "Most Popular" badge at top
- Plan name: "Pro"
- Price: "$19/mo" or "$15/mo billed yearly" (updates with toggle)
- Feature list with checkmark icons (all Free features + more)
- CTA button: "Subscribe" (primary style, prominent)

Enterprise Plan Card:

- Plan name: "Enterprise"
- Price: "Custom"
- Feature list with checkmark icons
- CTA button: "Contact sales" (secondary style)

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

**Style:**

- Cards in a row, recommended plan visually prominent (larger, border, badge)
- Smooth price transition when toggling billing cycle
- Clean comparison table with alternating row colors
- Dark mode support

**Constraints:**

- Use HeroUI components (Card, Button, Switch, Table, Accordion)
- TailwindCSS for styling
- Responsive: Stack cards vertically on mobile
- Accessible: Proper heading hierarchy, keyboard navigation
