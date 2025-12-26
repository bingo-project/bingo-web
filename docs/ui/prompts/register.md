Design a registration page for Bingo Web Scaffold.

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

A clean registration page that supports email sign-up and OAuth (Google, GitHub). The goal is to minimize friction and get users signed up quickly.

**Elements:**

Header:

- Logo (clickable, returns to home)
- "Back to home" link

Registration Card (centered):

- Title: "Create your account"
- Subtitle: "Start your journey with us"

OAuth Section:

- "Continue with Google" button with Google icon (outlined, full radius)
- "Continue with GitHub" button with GitHub icon (outlined, full radius)

Divider:

- Horizontal line with "or continue with email" text in center

Email Registration Form:

- Email input field with email icon
- Password input field with lock icon and show/hide toggle
- Confirm password input field
- Checkbox: "I agree to the Terms of Service and Privacy Policy" with links
- "Create account" button (primary gradient, full width, full radius)

Bottom Link:

- "Already have an account? Sign in" with link to login page

Footer:

- Copyright text
- Terms of Service and Privacy Policy links

**States:**

- Default: Empty form ready for input
- Loading: Button shows spinner, form inputs disabled
- Error - Invalid email: Red border on email input, error message below
- Error - Password mismatch: Red border on confirm password, error message below
- Error - Email exists: Toast notification with "Sign in instead" link

**Constraints:**

- Use HeroUI components (Input, Button, Checkbox, Card)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive: Works on all screen sizes
- Accessible: Proper labels, focus states, error announcements
- i18n: All text via translation keys
