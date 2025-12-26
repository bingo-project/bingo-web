Design an email verification pending page for Bingo Web Scaffold.

**Product:**

Bingo Web Scaffold - an out-of-the-box Web2+Web3 frontend scaffold that lets developers focus on business logic instead of infrastructure. Target users are frontend developers and small teams who need to quickly start Web2 or Web3 projects.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Background: Light `#FFFFFF` / Dark `#0A0A0A` (neutral gray, NOT purple)
- Surface/Cards: Light `#F9FAFB` / Dark `#18181B` (zinc-900)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode (follow system preference, manual toggle available)

**Context:**

A simple page shown after email registration, prompting users to check their inbox and click the verification link. Provides option to resend the email.

**Elements:**

Header:

- Logo (clickable, returns to home)

Verification Card (centered):

- Large email/envelope icon with subtle floating animation
- Title: "Check your email"
- Description: "We've sent a verification link to [user@email.com]"
- Helper text: "Click the link in the email to verify your account"

Action Area:

- "Resend email" button (outlined, full radius)
- Countdown text after clicking: "Resend available in 60s"
- "Use a different email" link

Help Section:

- "Didn't receive the email?" heading
- Bullet points: Check spam folder, wait a few minutes
- "Contact support" link

Footer:

- Copyright text

**States:**

- Default: Waiting message with resend button enabled
- Loading: Resend button shows spinner while sending
- Cooldown: Resend button disabled with countdown timer
- Error: Toast notification for network errors

**Constraints:**

- Use HeroUI components (Button, Card)
- TailwindCSS for styling
- Icon animation with CSS or Framer Motion
- Responsive design
- Accessible
- i18n: All text via translation keys
