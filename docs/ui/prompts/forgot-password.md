Design a forgot password page for a SaaS web application.

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
- "Send reset link" button (primary, full width)

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

**Style:**

- Centered card layout matching login/register pages
- Clean, reassuring design
- Consistent with auth flow pages
- Dark mode support

**Constraints:**

- Use HeroUI components (Input, Button, Card)
- React Hook Form + Zod for validation
- TailwindCSS for styling
- Security: Always show success even if email doesn't exist (prevent enumeration)
- Responsive design
- Accessible
