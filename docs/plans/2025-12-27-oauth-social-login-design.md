# OAuth Social Login Design

## Overview

Frontend integration for OAuth social login, supporting dynamic provider rendering based on backend configuration.

## Target Users

- International users (海外用户为主)
- Scaffold project - needs to be flexible for various use cases

## Supported OAuth Platforms

UI layer provides icons and styles for common platforms. Actual display is determined by backend `/v1/auth/providers` response.

| Platform  | Priority | Use Case              |
| --------- | -------- | --------------------- |
| Google    | High     | Broadest coverage     |
| GitHub    | High     | Developer audience    |
| Apple     | Medium   | iOS users             |
| Microsoft | Medium   | Enterprise users      |
| Discord   | Low      | Gaming/community apps |
| Twitter/X | Low      | Social apps           |

## Backend API

### Endpoints

| Endpoint                       | Method | Purpose                      |
| ------------------------------ | ------ | ---------------------------- |
| `/v1/auth/providers`           | GET    | List enabled OAuth providers |
| `/v1/auth/login/{provider}`    | GET    | Get OAuth authorization URL  |
| `/v1/auth/login/{provider}`    | POST   | Exchange auth code for token |
| `/v1/auth/bindings`            | GET    | List bound social accounts   |
| `/v1/auth/bindings/{provider}` | POST   | Bind social account          |
| `/v1/auth/bindings/{provider}` | DELETE | Unbind social account        |

### Data Structures

```typescript
// Provider info from GET /v1/auth/providers
interface AuthProviderBrief {
  name: string // e.g., "google", "github"
  authUrl: string // OAuth authorization URL
  redirectUrl: string // Callback URL (backend-defined)
  isDefault: number // 0 or 1
}

// Response from GET /v1/auth/login/{provider}
interface GetAuthCodeResponse {
  authUrl: string // Full OAuth URL to redirect user
  state: string // CSRF protection state
  codeVerifier: string // PKCE code verifier
}

// Response from POST /v1/auth/login/{provider}
interface LoginResponse {
  accessToken: string
  expiresAt: string
}
```

## Technical Design

### OAuth Flow (Redirect Mode)

```
1. User clicks "Continue with Google"
   ↓
2. Button shows loading state
   ↓
3. Frontend calls GET /v1/auth/login/google
   ↓
4. Backend returns { authUrl, state, codeVerifier }
   ↓
5. Frontend saves to sessionStorage:
   - oauth_state
   - oauth_code_verifier
   - oauth_action ('login' | 'bind')
   - oauth_redirect (target page after login)
   ↓
6. Frontend redirects to authUrl (Google auth page)
   ↓
7. User authorizes, Google redirects to backend's redirectUrl
   ↓
8. Callback page parses URL params (code, state)
   ↓
9. Frontend validates state matches sessionStorage
   ↓
10. Frontend calls POST /v1/auth/login/google
    with code, state, codeVerifier
   ↓
11. Backend returns LoginResponse
   ↓
12. Frontend saves token, redirects to target page
```

### Component Structure

```
components/auth/
├── OAuthButtons.tsx      # Dynamic OAuth button list (refactor existing)
├── OAuthButton.tsx       # Single OAuth button (new)
└── oauth-icons/          # Platform icons (new)
    ├── google.tsx
    ├── github.tsx
    └── ...

pages/
└── auth/
    └── OAuthCallback.tsx  # OAuth callback handler (new)
```

### Route Configuration

Dynamic callback route for all providers:

```typescript
{ path: '/auth/callback/:provider', element: <OAuthCallback /> }
```

### OAuthButtons Component

**Current state**: Hardcoded Google/GitHub buttons with "Coming soon"

**After refactor**:

1. Fetch providers from `GET /v1/auth/providers` on mount
2. Dynamically render button list
3. On click: show loading → call GET API → save state → redirect

### OAuthCallback Component

**Responsibilities**:

1. Parse `code` and `state` from URL
2. Retrieve `codeVerifier` and saved `state` from sessionStorage
3. Validate state matches (CSRF protection)
4. Determine action type ('login' or 'bind')
5. Call appropriate POST API
6. On success: save token → redirect to target page
7. On failure: show error → provide link to login page

### Session Storage Keys

```typescript
// Before redirect
sessionStorage.setItem('oauth_state', state)
sessionStorage.setItem('oauth_code_verifier', codeVerifier)
sessionStorage.setItem('oauth_action', 'login' | 'bind')
sessionStorage.setItem('oauth_redirect', '/dashboard')

// After callback - clear all
```

## Account Binding (Settings Page)

Add "Social Accounts" section to Settings > Security page:

- Display bound accounts with platform icon and status
- Show "Link" button for unbound available platforms
- Show "Unlink" button for bound accounts

Binding flow is identical to login flow, except:

- Uses `POST /v1/auth/bindings/{provider}` instead of login endpoint
- `oauth_action` is set to 'bind'

## Error Handling

| Scenario              | Error Code                     | Handling                                        |
| --------------------- | ------------------------------ | ----------------------------------------------- |
| Get providers failed  | -                              | Hide OAuth buttons, show email login only       |
| Get auth URL failed   | -                              | Toast error, restore button state               |
| Invalid/expired state | `Unauthenticated.InvalidState` | Show "Authorization expired", redirect to login |
| Token exchange failed | Other errors                   | Show error, provide retry/back to login         |
| User cancelled auth   | -                              | Silent redirect to login page                   |

## Internationalization

New translation keys:

```typescript
// Auth
continueWith: 'Continue with {{provider}}'
oauthError: 'Login failed, please try again'
oauthCancelled: 'Authorization cancelled'
invalidState: 'Authorization expired, please try again'

// Binding
bindAccount: 'Link {{provider}}'
unbindAccount: 'Unlink'
unbindConfirm: 'Are you sure you want to unlink {{provider}}?'
alreadyBound: 'Linked'
```

## UI/UX Details

- **Loading state**: Clicked button shows loading spinner, other buttons disabled
- **Dynamic rendering**: Only show buttons for backend-enabled providers
- **Mobile friendly**: Redirect mode works better than popup on mobile

## Implementation Notes

- PKCE (Proof Key for Code Exchange) is supported via `codeVerifier` parameter
- State parameter provides CSRF protection
- All OAuth providers share the same callback component logic
- New providers only require adding icon and backend configuration
