Design a payment success page for a SaaS web application.

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

- "Go to Dashboard" button (primary CTA)
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

**Style:**

- Centered card layout
- Green success icon with subtle animation (confetti or pulse)
- Celebratory, positive visual tone
- Clear next steps
- Dark mode support

**Constraints:**

- Use HeroUI components (Card, Button)
- TailwindCSS for styling
- CSS animation for success icon
- Responsive design
- Accessible
