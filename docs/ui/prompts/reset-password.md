Design a reset password page for Bingo Web Scaffold.

**Product:**

Bingo Web Scaffold - an out-of-the-box Web2+Web3 frontend scaffold that lets developers focus on business logic instead of infrastructure. Target users are frontend developers and small teams who need to quickly start Web2 or Web3 projects.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Background: Light `#FFFFFF` / Dark `#0A0A0A` (neutral gray, NOT purple)
- Surface/Cards: Light `#F9FAFB` / Dark `#18181B` (zinc-900)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Inputs: 8px border radius
- Theme: Support both light and dark mode (follow system preference, manual toggle available)

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
- "Reset password" button (primary gradient, full width, full radius)

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
- Error - Link expired: Show expiry message with "Request new link" button (outlined, full radius)
- Error - Invalid link: Show error with link to forgot password page
- Error - Network: Toast notification

**Constraints:**

- Use HeroUI components (Input, Button, Card)
- React Hook Form + Zod for validation
- TailwindCSS for styling
- Real-time password strength validation
- Responsive design
- Accessible
- i18n: All text via translation keys
