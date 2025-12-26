Design a profile/settings page for Bingo Web Scaffold.

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

A user profile management page where users can view and edit their personal information, change password, manage notification preferences, and view account details.

**Elements:**

Header (App-level navigation):

- Logo
- Main navigation links
- User avatar dropdown menu:
  - Username and email display
  - Profile link
  - Settings link
  - Logout button

Sidebar Navigation:

- Profile (personal info) - active state
- Security (password, devices)
- Subscription (plan management)
- Notifications (preferences)

Main Content - Profile Section:

Avatar Area:

- Large circular avatar image
- "Change avatar" button (outlined, full radius)
- Helper text: "JPG, PNG. Max 2MB"
- Upload modal/drawer on click

Basic Info Form:

- Nickname input field
- Email field (read-only with verified badge)
- Bio textarea (optional)
- "Save changes" button (primary gradient, full radius)

Account Info Card:

- Registration date
- Last login date/time
- Account status badge (Active)

Main Content - Security Section (when selected):

Change Password Card:

- Current password input
- New password input with strength indicator
- Confirm new password input
- "Update password" button (primary gradient, full radius)

Active Sessions Card:

- List of logged-in devices
- Each row: device name, IP, last active time, "Revoke" button (danger, full radius)

Main Content - Notifications Section (when selected):

Notification Preferences:

- Email notifications toggle switch
- Product updates toggle switch
- Marketing emails toggle switch

Language Settings:

- Language dropdown selector

**States:**

- Default: Display current user information
- Loading: Skeleton placeholders while fetching data
- Saving: Button shows spinner, form disabled
- Error - Save failed: Toast notification
- Error - Upload failed: Toast with error message
- Success: Toast confirmation after save

**Constraints:**

- Use HeroUI components (Input, Button, Switch, Avatar, Card, Dropdown)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive: Sidebar collapses to top nav on mobile
- Accessible
- i18n: All text via translation keys
