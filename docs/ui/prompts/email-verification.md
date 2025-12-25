Design an email verification pending page for a SaaS web application.

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

- "Resend email" button (secondary style)
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

**Style:**

- Centered card on subtle background
- Large, friendly email icon with gentle animation
- Clear call-to-action for next steps
- Reassuring, helpful tone
- Dark mode support

**Constraints:**

- Use HeroUI components (Button, Card)
- TailwindCSS for styling
- Icon animation with CSS or Framer Motion
- Responsive design
- Accessible
