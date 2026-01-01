Design an AI Role Selection Square (Landing Page for AI Module) for a web application.

**Context:**
Bingo Web Scaffold - Out-of-the-box Web2+Web3 frontend scaffold
Target Users: Frontend developers and small teams who need to quickly launch Web2 or Web3 projects
This page: The entry point for the AI module. It displays available AI personas (Roles) and allows users to start new chats or access history from the sidebar.

**Elements:**
- **Sidebar (Left):**
  - "New Chat" button (Primary action)
  - History list grouped by date (Today, Yesterday, Older)
  - User settings interaction at bottom
- **Role Grid (Main Content):**
  - Search bar for filtering roles
  - Category tabs (All, Coding, Writing, Assistant, Fun)
  - Grid of Role Cards, each containing:
    - Large Avatar
    - Role Name (Bold)
    - Short Description (Truncated)
    - "Start Chat" button (Visible on hover or always)

**States:**
- Loading: Skeleton loaders for role cards and sidebar items
- Empty: "No roles found" message if search yields no results
- Error: Retry button if fetching roles fails

**Style:**
- Visual style: Modern Tech (Clean, gradient accents, glassmorphism)
- Primary color: Purple-Blue Gradient (`#7C3AED` -> `#2563EB`)
- Border radius: Pill (buttons), 16px (cards), 8px (inputs)
- Theme: Support light/dark theme following the established pattern from landing page

**Constraints:**
- Use HeroUI (@heroui/react) components
- Use Lucide (lucide-react) icons (SVG format)
- Responsive: Sidebar becomes a drawer on mobile; Grid adjusts columns (1 on mobile, 2-3 on tablet, 4 on desktop)
