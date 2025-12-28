Design a notification dropdown component for the Header of Bingo Web Scaffold.

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

A notification dropdown that appears when users click the bell icon in the Header. Shows recent notifications with unread indicator, allows marking as read, and links to the full notification center.

**Elements:**

Trigger Button:

- Bell icon (Lucide `Bell`)
- Unread badge: red dot or number badge when unread > 0
- Badge position: top-right of the bell icon
- Hover state: subtle background highlight

Dropdown Panel:

- Width: 360px (desktop), full width on mobile
- Max height: 400px with scroll
- Position: anchored below bell icon, right-aligned
- Shadow: medium elevation
- Border radius: 16px

Header Section:

- Title: "Notifications" (left aligned)
- "Mark all read" button (text button, right aligned)
- Divider line below

Notification List:

- 5 most recent notifications
- Each item:
  - Left: Category icon in colored circle (24px)
    - System: `Megaphone` (blue)
    - Security: `Shield` (red)
    - Transaction: `CreditCard` (green)
    - Social: `Users` (purple)
  - Center:
    - Title (one line, truncate with ellipsis)
    - Content preview (one line, muted color, truncate)
    - Relative time (e.g., "2 minutes ago", muted, small)
  - Right: Unread indicator (blue dot, 8px) if unread
- Hover state: subtle background highlight
- Click: navigates to actionUrl if present

Empty State:

- Centered bell icon (muted, large)
- Text: "No notifications yet"

Footer Section:

- Divider line above
- "View all notifications" link (centered, primary color)
- Links to `/notifications`

**States:**

- Default: Shows recent notifications
- Loading: Skeleton placeholders (3 items)
- Empty: Empty state illustration
- Unread: Blue dot on individual items, red badge on bell
- Hover item: Background highlight
- Click item: Marks as read, navigates if actionUrl exists

**Interactions:**

- Click bell → Open dropdown, fetch recent notifications
- Click notification → Mark as read + navigate to actionUrl
- Click "Mark all read" → API call, update all items
- Click "View all" → Navigate to /notifications
- Click outside → Close dropdown
- Escape key → Close dropdown

**Constraints:**

- Use HeroUI Popover/Dropdown component
- Lucide icons
- TailwindCSS for styling
- Responsive: Full width on mobile (< 640px)
- Accessible: Keyboard navigation, ARIA labels
- i18n: All text via translation keys
- Real-time: WebSocket updates for new notifications
