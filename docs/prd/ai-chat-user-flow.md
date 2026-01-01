# User Flow

## Primary Flow: AI Conversation

```
[Start] (AI Square / New Chat) → [Select Role] → [Chat Interface] → [Send Message] → [Receive Stream] → [End]
```

### Step 1: Enter AI Module
- **Screen:** `/ai` (or Sidebar Entry)
- **User action:** Click "AI Chat" in navigation or "New Chat" button
- **System response:** Show AI Role Square (if no active session) or Last Active Session
- **Next:** Select a role or start typing

### Step 2: Select Role (Optional)
- **Screen:** AI Role list
- **User action:** Click on a Role (e.g., "Translator")
- **System response:** Create a new empty session with this Role ID, navigate to `/ai/chat/:sessionId`
- **Next:** Chat Interface

### Step 3: Send Message
- **Screen:** Chat Interface
- **User action:** Type message + Enter / Click Send
- **System response:** Optimistic UI shows user message immediately. Connection established.
- **Next:** Receiving Stream

### Step 4: Receive Stream
- **Screen:** Chat Interface
- **User action:** Wait / Watch
- **System response:** AI message appears, content updates in real-time (Typewriter effect) via WebSocket/SSE.
- **Next:** Message complete. Ready for next input.

## Secondary Flows

### History Access
- **Trigger:** User clicks on a session in the Sidebar
- **Screen:** Load `/ai/chat/:oldSessionId`
- **Response:** Fetch and render history messages. Scroll to bottom.

### Create New Session
- **Trigger:** Click "+" button in Sidebar
- **Screen:** Reset to Role Selection or Default New Chat
