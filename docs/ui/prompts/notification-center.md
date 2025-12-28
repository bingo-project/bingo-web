Design a notification center page for Bingo Web Scaffold.

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

A full notification center page at `/notifications` where users can view all their notifications, filter by category and read status, mark as read, and delete notifications. This is a standalone page (not within settings layout).

**Layout:**

Uses RootLayout with standard Header. Content is centered with max-width container.

**Elements:**

Page Header:

- Icon: `Bell` (Lucide) in primary color, large (32px)
- Title: "Notification Center" (h1, bold)
- Subtitle: Unread count badge, e.g., "3 unread" (muted text)

Toolbar:

- Left side:
  - Category filter dropdown:
    - "All Categories" (default)
    - "System"
    - "Security"
    - "Transaction"
    - "Social"
  - Status filter dropdown:
    - "All" (default)
    - "Unread"
    - "Read"
- Right side:
  - "Mark all as read" button (outlined, pill shape)
  - Link to "Settings" (icon button or text link) → /settings/notifications

Notification List:

Container:

- Background: content1
- Border: 1px solid divider
- Border radius: 16px
- No padding (items have their own padding)

Each notification item:

- Padding: 16px 20px
- Border bottom: 1px solid divider (except last item)
- Hover: Subtle background highlight
- Cursor: pointer

Item layout (left to right):

- Unread indicator: Blue dot (8px) if unread, or empty space (8px) if read
- Category icon in colored circle (40px):
  - System: `Megaphone` (blue)
  - Security: `Shield` (red)
  - Transaction: `CreditCard` (green)
  - Social: `Users` (purple)
- Content (flex-grow):
  - Title (font-medium, one line, truncate)
  - Content preview (text-sm, muted, two lines max, truncate)
  - Metadata row:
    - Source badge: "Announcement" or nothing for regular messages
    - Relative time: "2 minutes ago" (muted, small)
- Actions (on hover or always on mobile):
  - Delete button (icon only, `Trash2`, danger color) - only for messages, not announcements

Pagination:

- Infinite scroll with "Load more" trigger
- Loading indicator at bottom when fetching
- "No more notifications" text when end reached

Empty State:

- Centered in container
- Large muted bell icon (64px)
- Title: "No notifications"
- Description: "You're all caught up! We'll notify you when something new arrives."

**States:**

- Loading initial: Full page skeleton (6 items)
- Loading more: Spinner at bottom of list
- Empty: Empty state illustration
- Filtered empty: "No notifications match your filters" with clear filters button
- Error: Error message with retry button

**Interactions:**

- Click notification → Mark as read + navigate to actionUrl (if present)
- Click delete → Confirmation modal → Delete notification
- Change filter → Reload list with new params
- Scroll to bottom → Load more notifications
- Click "Mark all as read" → API call, update all visible items

**Responsive Design:**

Desktop (>= 768px):

- Max width: 800px, centered
- Filters in horizontal row
- Delete button appears on hover

Mobile (< 768px):

- Full width with padding
- Filters stack or use compact dropdown
- Delete button always visible (smaller)
- Simplified item layout

**Constraints:**

- Use HeroUI components (Dropdown, Button, Card)
- Lucide icons
- TailwindCSS for styling
- Accessible: Keyboard navigation, screen reader support
- i18n: All text via translation keys
- Performance: Virtual scrolling if list is very long (optional)
- Real-time: WebSocket updates append new notifications to top
