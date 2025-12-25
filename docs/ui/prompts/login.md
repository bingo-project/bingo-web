Design a login page for a SaaS web application.

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

- "Continue with Google" button with Google icon
- "Continue with GitHub" button with GitHub icon

Divider:

- Horizontal line with "or continue with email" text in center

Email Login Form:

- Email input field with email icon
- Password input field with lock icon and show/hide toggle
- Row with "Remember me" checkbox on left, "Forgot password?" link on right
- "Sign in" button (primary, full width)

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

**Style:**

- Centered card layout matching registration page
- Clean, efficient design
- OAuth buttons with brand colors
- Dark mode support

**Constraints:**

- Use HeroUI components (Input, Button, Checkbox, Card)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive design
- Accessible: Proper labels, focus states
