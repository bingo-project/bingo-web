Design a payment success page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Success color: `#10B981` (green)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode

**Context:**

A confirmation page shown after successful Stripe checkout. Celebrates the purchase and guides user to next steps.

**Elements:**

Header:

- Logo (clickable, returns to home)

Success Card (centered):

- Large success icon (green checkmark with celebration animation)
- Title: "Payment successful!"
- Subtitle: "Thank you for subscribing to [Plan Name]"

Subscription Details Card:

- Plan name
- Billing cycle (Monthly/Yearly)
- Next billing date
- Amount charged

Action Area:

- "Go to Dashboard" button (primary gradient, full radius)
- "View subscription details" link (secondary)

Additional Info:

- Email confirmation notice: "A confirmation email has been sent to [email]"
- Help link: "Need help? Contact support"

Footer:

- Copyright text

**States:**

- Default: Success message with subscription details
- Loading: Verifying payment status with spinner
- Error: Payment verification failed, show error with retry/support options

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- CSS animation for success icon (confetti or pulse)
- Responsive design
- Accessible
- i18n: All text via translation keys
