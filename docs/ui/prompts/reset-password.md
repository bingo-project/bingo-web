Design a reset password page for a SaaS web application.

**Context:**
A page accessed via email reset link where users set their new password.

**Elements:**

Header:

- Logo (clickable, returns to home)

Reset Card (centered):

- Title: "Set new password"
- Description: "Your new password must be different from previous passwords"

Form:

- New password input with show/hide toggle and strength indicator
- Confirm password input
- "Reset password" button (primary, full width)

Password Requirements:

- Checklist of requirements (updates as user types):
  - At least 8 characters
  - Contains uppercase and lowercase
  - Contains a number

Footer:

- Copyright text

**States:**

- Default: Empty form ready for input
- Loading: Button shows spinner while resetting
- Success: Show success message, auto-redirect to login after 3s
- Error - Weak password: Inline requirements not met
- Error - Mismatch: Inline error on confirm password
- Error - Link expired: Show expiry message with "Request new link" button
- Error - Invalid link: Show error with link to forgot password page
- Error - Network: Toast notification

**Style:**

- Centered card layout matching auth pages
- Password strength indicator (red/yellow/green bar)
- Animated checkmarks for password requirements
- Dark mode support

**Constraints:**

- Use HeroUI components (Input, Button, Card)
- React Hook Form + Zod for validation
- TailwindCSS for styling
- Real-time password strength validation
- Responsive design
- Accessible
