Design a login page for Bingo Web Scaffold.

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

A clean login page that supports email/password login and OAuth (Google, GitHub). Should match the registration page style for consistency.

**Elements:**

Header:

- Logo (clickable, returns to home)
- "Back to home" link

Login Card (centered):

- Title: "Welcome back"
- Subtitle: "Sign in to your account"

OAuth Section:

- "Continue with Google" button with Google icon (outlined, full radius)
- "Continue with GitHub" button with GitHub icon (outlined, full radius)

Divider:

- Horizontal line with "or continue with email" text in center

Email Login Form:

- Email input field with email icon
- Password input field with lock icon and show/hide toggle
- Row with "Remember me" checkbox on left, "Forgot password?" link on right
- "Sign in" button (primary gradient, full width, full radius)

Bottom Link:

- "Don't have an account? Sign up" with link to registration page

Footer:

- Copyright text
- Terms of Service and Privacy Policy links

**States:**

- Default: Empty form ready for input
- Loading: Button shows spinner, form inputs disabled
- Error - Invalid credentials: Toast notification "Invalid email or password"
- Error - Unverified account: Toast with "Resend verification email" link
- Error - Too many attempts: Toast with retry countdown
- Error - Network: Toast notification for connection issues

**Constraints:**

- Use HeroUI components (Input, Button, Checkbox, Card)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive design
- Accessible: Proper labels, focus states
- i18n: All text via translation keys
