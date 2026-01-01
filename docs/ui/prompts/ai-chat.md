Design an AI Chat Interface for a web application.

**Context:**
Bingo Web Scaffold - Out-of-the-box Web2+Web3 frontend scaffold
Target Users: Frontend developers and small teams who need to quickly launch Web2 or Web3 projects
This page: The core conversation interface where users interact with a specific AI role.

**Elements:**
- **Header:**
  - Role Avatar and Name
  - Actions: Clear Context, Delete Session, View Role Details
- **Message List:**
  - **AI Message:** Left-aligned, gray/muted background, avatar, markdown content support (code blocks, tables)
  - **User Message:** Right-aligned, primary gradient background, white text
  - **Typing Indicator:** Animated dots when AI is thinking
  - **Message Actions:** Copy, Regenerate, Rate (Thumbs up/down) appearing on hover
- **Input Area (Fixed Bottom):**
  - Auto-resizing textarea
  - Send button (changes to Stop icon while streaming)
  - "AI may display inaccurate info" disclaimer

**States:**
- Streaming: Real-time text appearance (typewriter effect) with auto-scroll
- Empty: Welcome message from the Role with 3-4 suggested prompts chips
- Error: Red validation message or toast on failed send

**Style:**
- Visual style: Modern Tech (Clean, gradient accents, glassmorphism)
- Primary color: Purple-Blue Gradient (`#7C3AED` -> `#2563EB`)
- Border radius: Pill (buttons), 16px (cards), 8px (inputs)
- Theme: Support light/dark theme following the established pattern from landing page

**Constraints:**
- Use HeroUI (@heroui/react) components
- Use Lucide (lucide-react) icons (SVG format)
- Layout: Flex column, scrollable message area, fixed headers/footers
- Code Blocks: Must support syntax highlighting styles
