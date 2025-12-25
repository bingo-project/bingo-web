Design a payment failed page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Danger color: `#EF4444` (red)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode

**Context:**

A page shown when Stripe checkout fails, explaining what went wrong and providing options to resolve the issue.

**Elements:**

Header:

- Logo (clickable, returns to home)

Failed Card (centered):

- Failure icon (red X or warning icon)
- Title: "Payment failed"
- Description: Reason (e.g., "Your card was declined")

Solutions Section:

- "Common reasons" list:
  - Insufficient funds
  - Incorrect card details
  - Bank declined the transaction
- Suggested actions

Action Area:

- "Try again" button (primary gradient, full radius)
- "Use different payment method" button (outlined, full radius)
- "Contact support" link

Footer:

- Copyright text

**States:**

- Default: Failure message with solutions
- Loading: Retry button shows spinner
- Retry failed: Update error message

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- Constructive tone, not overly negative
- Clear path to resolution
- Responsive design
- Accessible
- i18n: All text via translation keys
