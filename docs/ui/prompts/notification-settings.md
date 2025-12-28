Design a notification settings page for Bingo Web Scaffold.

**Product:**

Bingo Web Scaffold - an out-of-the-box Web2+Web3 frontend scaffold that lets developers focus on business logic instead of infrastructure. Target users are frontend developers and small teams who need to quickly start Web2 or Web3 projects.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Background: Light `#FFFFFF` / Dark `#0A0A0A` (neutral gray, NOT purple)
- Surface/Cards: Light `#F9FAFB` / Dark `#18181B` (zinc-900)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode

**Context:**

A notification preferences page at `/settings/notifications` where users can control which types of notifications they receive and through which channels (in-app, email). Part of the settings section alongside Profile and Security pages.

**Layout:**

Uses the existing SettingsLayout with sidebar navigation:

- Profile
- Security
- Notifications (active)

**Elements:**

Page Header (hidden on mobile, shown in sidebar tabs):

- Icon: `Bell` (Lucide) in primary color
- Title: "Notification Settings"
- No description needed

Preference Cards (one card per category):

Each card structure:

- Left side:
  - Icon in colored circle (48px)
  - Category title (bold)
  - Category description (muted, small)
- Right side:
  - Two switches stacked vertically

Card 1 - System Notifications:

- Icon: `Megaphone` in blue circle (`bg-blue-500/10`, `text-blue-500`)
- Title: "System Notifications"
- Description: "Platform updates, maintenance notices, and announcements"
- Switches:
  - "In-app notifications" [Switch]
  - "Email notifications" [Switch]

Card 2 - Security Alerts:

- Icon: `Shield` in red circle (`bg-red-500/10`, `text-red-500`)
- Title: "Security Alerts"
- Description: "Login alerts, password changes, and security events"
- Switches:
  - "In-app notifications" [Switch]
  - "Email notifications" [Switch]

Card 3 - Transaction Notifications:

- Icon: `CreditCard` in green circle (`bg-green-500/10`, `text-green-500`)
- Title: "Transaction Notifications"
- Description: "Deposits, withdrawals, and payment confirmations"
- Switches:
  - "In-app notifications" [Switch]
  - "Email notifications" [Switch]

Card 4 - Social Activity:

- Icon: `Users` in purple circle (`bg-purple-500/10`, `text-purple-500`)
- Title: "Social Activity"
- Description: "Comments, replies, follows, and mentions"
- Switches:
  - "In-app notifications" [Switch]
  - "Email notifications" [Switch]

**Card Layout Details:**

- Cards stacked vertically with 24px gap
- Card padding: 24px
- Border: 1px solid divider color
- Background: content1 (slightly elevated from page background)
- On mobile: Stack icon/title above switches

**States:**

- Loading: Skeleton cards (4 items) with shimmer animation
- Default: Switches reflect current preferences
- Saving: Switch shows loading state briefly
- Error: Toast notification on save failure, switch reverts
- Success: No explicit feedback (optimistic update)

**Interactions:**

- Toggle switch → Immediately save to API (optimistic update)
- If save fails → Revert switch, show error toast
- Page load → Fetch current preferences

**Constraints:**

- Use HeroUI components (Card, Switch)
- Match Security page styling exactly
- Lucide icons
- TailwindCSS for styling
- Responsive: Cards full width, switches stack on mobile
- Accessible: Switch labels, keyboard navigation
- i18n: All text via translation keys
- No submit button - changes save immediately on toggle
