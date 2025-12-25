Design a registration page for a SaaS web application.

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

- "Continue with Google" button with Google icon
- "Continue with GitHub" button with GitHub icon

Divider:

- Horizontal line with "or continue with email" text in center

Email Registration Form:

- Email input field with email icon
- Password input field with lock icon and show/hide toggle
- Confirm password input field
- Checkbox: "I agree to the Terms of Service and Privacy Policy" with links
- "Create account" button (primary, full width)

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

**Style:**

- Centered card layout on subtle background
- Clean, distraction-free design
- OAuth buttons with brand colors
- Form validation with inline error messages
- Dark mode support

**Constraints:**

- Use HeroUI components (Input, Button, Checkbox, Card)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive: Works on all screen sizes
- Accessible: Proper labels, focus states, error announcements
