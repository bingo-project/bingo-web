Design a subscription management page for a SaaS web application.

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
- "Manage subscription" button (opens Stripe Customer Portal)
- "Change plan" button (navigates to Pricing)

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
- "Cancel subscription" button (danger style)
- Brief explanation of what happens on cancellation

Cancellation Confirmation Modal:

- Title: "Cancel subscription?"
- Impact explanation (e.g., "You'll lose access to Pro features on [date]")
- Optional retention offer
- "Keep subscription" button (primary)
- "Cancel anyway" button (secondary/danger)

**States:**

- Default: Current subscription info displayed
- Loading: Skeleton placeholders
- No subscription: Show Free plan info with upgrade CTA
- Canceled: Show reactivation option
- Past Due: Show payment update prompt
- Error: Toast for failed operations

**Style:**

- Consistent with Profile page layout
- Status badges with semantic colors
- Warning styling for cancel section
- Dark mode support

**Constraints:**

- Use HeroUI components (Card, Button, Table, Modal, Progress, Badge)
- TailwindCSS for styling
- Responsive: Table scrolls horizontally on mobile
- Accessible
