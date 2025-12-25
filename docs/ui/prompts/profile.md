Design a profile/settings page for a SaaS web application.

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
- "Change avatar" button
- Helper text: "JPG, PNG. Max 2MB"
- Upload modal/drawer on click

Basic Info Form:

- Nickname input field
- Email field (read-only with verified badge)
- Bio textarea (optional)
- "Save changes" button

Account Info Card:

- Registration date
- Last login date/time
- Account status badge (Active)

Main Content - Security Section (when selected):

Change Password Card:

- Current password input
- New password input with strength indicator
- Confirm new password input
- "Update password" button

Active Sessions Card:

- List of logged-in devices
- Each row: device name, IP, last active time, "Revoke" button

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

**Style:**

- Sidebar + content layout (dashboard style)
- Cards to group related settings
- Clean form layouts with proper spacing
- Consistent with overall app design
- Dark mode support

**Constraints:**

- Use HeroUI components (Input, Button, Switch, Avatar, Card, Dropdown)
- React Hook Form + Zod for form validation
- TailwindCSS for styling
- Responsive: Sidebar collapses to top nav on mobile
- Accessible
