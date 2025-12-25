Design a forgot password page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Inputs: 8px border radius
- Theme: Support both light and dark mode

**Context:**

A simple page where users can request a password reset link by entering their email address.

**Elements:**

Header:

- Logo (clickable, returns to home)
- "Back to login" link

Reset Card (centered):

- Lock or key icon
- Title: "Forgot your password?"
- Description: "Enter your email and we'll send you a reset link"

Form:

- Email input field with email icon
- "Send reset link" button (primary gradient, full width, full radius)

Bottom Link:

- "Back to login" link

Footer:

- Copyright text

**States:**

- Default: Empty form ready for input
- Loading: Button shows spinner while sending
- Success: Show confirmation message "Check your email for reset link"
- Error - Invalid email: Inline error below input
- Error - Rate limited: Toast with retry time
- Error - Network: Toast notification

**Constraints:**

- Use HeroUI components (Input, Button, Card)
- React Hook Form + Zod for validation
- TailwindCSS for styling
- Security: Always show success even if email doesn't exist (prevent enumeration)
- Responsive design
- Accessible
- i18n: All text via translation keys
