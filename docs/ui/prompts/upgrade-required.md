Design an upgrade required page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode

**Context:**

A page shown when users try to access features beyond their current subscription tier. Goal is to encourage upgrade rather than frustrate users.

**Elements:**

Header (App-level navigation):

- Standard app navigation bar

Upgrade Prompt (centered):

- Lock or crown icon
- Title: "Upgrade to unlock this feature"
- Description: "This feature is available on [Plan Name] and above"

Feature Preview Card:

- Name of locked feature
- Brief description of what it does
- Benefits/value of having access

Plan Comparison Card:

- Current plan vs required plan
- Side-by-side feature comparison
- Price difference highlighted

Action Area:

- "Upgrade now" button (primary gradient, full radius)
- "View all plans" link (to Pricing page)
- "Go back" link

**States:**

- Default: Upgrade prompt with feature info
- Loading: Spinner when fetching plan info
- Error: Toast if plan data fails to load

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- Emphasize value gained, not restriction
- Positive, encouraging tone
- Responsive design
- Accessible
- i18n: All text via translation keys
