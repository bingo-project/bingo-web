// ABOUTME: OAuth session storage utilities
// ABOUTME: Manages state, code verifier, and redirect info for OAuth flow

const OAUTH_STATE_KEY = 'oauth_state'
const OAUTH_CODE_VERIFIER_KEY = 'oauth_code_verifier'
const OAUTH_ACTION_KEY = 'oauth_action'
const OAUTH_REDIRECT_KEY = 'oauth_redirect'

export type OAuthAction = 'login' | 'bind'

export interface OAuthSession {
  state: string
  codeVerifier?: string
  action: OAuthAction
  redirect: string
}

export function saveOAuthSession(session: OAuthSession): void {
  sessionStorage.setItem(OAUTH_STATE_KEY, session.state)
  if (session.codeVerifier) {
    sessionStorage.setItem(OAUTH_CODE_VERIFIER_KEY, session.codeVerifier)
  }
  sessionStorage.setItem(OAUTH_ACTION_KEY, session.action)
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, session.redirect)
}

export function getOAuthSession(): OAuthSession | null {
  const state = sessionStorage.getItem(OAUTH_STATE_KEY)
  const codeVerifier = sessionStorage.getItem(OAUTH_CODE_VERIFIER_KEY)
  const action = sessionStorage.getItem(OAUTH_ACTION_KEY) as OAuthAction | null
  const redirect = sessionStorage.getItem(OAUTH_REDIRECT_KEY)

  if (!state || !action) {
    return null
  }

  return { state, codeVerifier: codeVerifier || undefined, action, redirect: redirect || '/' }
}

export function clearOAuthSession(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_CODE_VERIFIER_KEY)
  sessionStorage.removeItem(OAUTH_ACTION_KEY)
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY)
}

export function validateOAuthState(urlState: string): boolean {
  const savedState = sessionStorage.getItem(OAUTH_STATE_KEY)
  return savedState === urlState
}
