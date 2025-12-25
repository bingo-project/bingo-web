Design an error page for a SaaS web application.

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

- "Go home" button (primary CTA)
- "Go back" button (secondary)
- "Refresh page" button (for 500/crash)
- "Report issue" link (optional)

Footer:

- Copyright text

**States:**

- 404: Not found content
- 500: Server error content
- Crash: Application error content with optional stack trace

**Style:**

- Centered layout
- Friendly, non-scary illustrations
- Helpful, slightly humorous copy
- Clear recovery paths
- Dark mode support

**Constraints:**

- Use HeroUI components (Button)
- TailwindCSS for styling
- SVG illustrations or icons
- Error boundary integration for crash state
- Responsive design
- Accessible
