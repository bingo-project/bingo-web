Design a subscription management page for Bingo Web Scaffold.

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

A page within user settings where users can view their current subscription, manage billing, view invoice history, and cancel if needed.

**Elements:**

Header (App-level navigation):

- Shared with Profile page

Sidebar Navigation:

- Shared with Profile page, Subscription item active

Main Content:

Current Subscription Card:

- Plan name with status badge (Active/Canceled/Past Due)
- Current billing cycle (Monthly/Yearly)
- Next billing date and amount
- "Manage subscription" button (outlined, full radius) - opens Stripe Customer Portal
- "Change plan" button (primary gradient, full radius) - navigates to Pricing

Usage Statistics Card (if applicable):

- Progress bar showing current usage vs limit
- Usage breakdown details

Billing History Card:

- Table with columns: Date, Description, Amount, Status, Actions
- Status badges: Paid (green), Pending (yellow), Failed (red)
- "Download invoice" link for each row
- Pagination if many invoices

Cancel Subscription Section:

- Warning-styled card at bottom
- "Cancel subscription" button (danger, full radius)
- Brief explanation of what happens on cancellation

Cancellation Confirmation Modal:

- Title: "Cancel subscription?"
- Impact explanation (e.g., "You'll lose access to Pro features on [date]")
- Optional retention offer
- "Keep subscription" button (primary gradient, full radius)
- "Cancel anyway" button (outlined danger, full radius)

**States:**

- Default: Current subscription info displayed
- Loading: Skeleton placeholders
- No subscription: Show Free plan info with upgrade CTA
- Canceled: Show reactivation option
- Past Due: Show payment update prompt
- Error: Toast for failed operations

**Constraints:**

- Use HeroUI components (Card, Button, Table, Modal, Progress, Badge)
- TailwindCSS for styling
- Responsive: Table scrolls horizontally on mobile
- Accessible
- i18n: All text via translation keys
