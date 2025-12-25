Design a payment failed page for a SaaS web application.

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

- "Try again" button (primary CTA)
- "Use different payment method" button (secondary)
- "Contact support" link

Footer:

- Copyright text

**States:**

- Default: Failure message with solutions
- Loading: Retry button shows spinner
- Retry failed: Update error message

**Style:**

- Centered card layout
- Failure icon in red/orange
- Constructive tone, not overly negative
- Clear path to resolution
- Dark mode support

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- Responsive design
- Accessible
