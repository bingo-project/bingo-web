Design an upgrade required page for a SaaS web application.

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

- "Upgrade now" button (primary CTA)
- "View all plans" link (to Pricing page)
- "Go back" link

**States:**

- Default: Upgrade prompt with feature info
- Loading: Spinner when fetching plan info
- Error: Toast if plan data fails to load

**Style:**

- Centered content layout
- Prominent lock/upgrade icon
- Emphasize value gained, not restriction
- Positive, encouraging tone
- Dark mode support

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- Responsive design
- Accessible
