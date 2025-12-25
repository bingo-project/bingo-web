Design an error page for a SaaS web application.

**Design System:**

- Style: Modern tech aesthetic - clean, minimal, gradient accents
- Primary color: Purple-blue gradient (`#7C3AED` → `#2563EB`)
- Buttons: Full radius (pill shape) for all buttons
- Cards: 16px border radius, subtle shadow
- Theme: Support both light and dark mode

**Context:**

A general error page handling 404, 500, and application crash scenarios. Should be friendly and guide users back to a working state.

**Elements:**

Header:

- Logo (clickable, returns to home)

Error Display (centered):

For 404:

- Large "404" text or illustration
- Title: "Page not found"
- Description: "The page you're looking for doesn't exist or has been moved"

For 500:

- Server error illustration
- Title: "Something went wrong"
- Description: "We're working on fixing this. Please try again later"

For App Crash:

- Error illustration
- Title: "Oops! Something broke"
- Description: "An unexpected error occurred"
- Expandable error details (dev environment only)

Action Area:

- "Go home" button (primary gradient, full radius)
- "Go back" button (outlined, full radius)
- "Refresh page" button (outlined, full radius) - for 500/crash
- "Report issue" link (optional)

Footer:

- Copyright text

**States:**

- 404: Not found content
- 500: Server error content
- Crash: Application error content with optional stack trace

**Constraints:**

- Use HeroUI components (Button)
- TailwindCSS for styling
- SVG illustrations or icons
- Friendly, non-scary visual style
- Helpful, slightly humorous copy
- Clear recovery paths
- Error boundary integration for crash state
- Responsive design
- Accessible
- i18n: All text via translation keys
