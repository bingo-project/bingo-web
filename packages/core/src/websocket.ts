// ABOUTME: WebSocket event handlers and initialization
// ABOUTME: Sets up session.kicked handler for forced logout

import { wsClient } from '@bingo/websocket'
import { $t } from '@bingo/locales'
import { toast } from 'sonner'
import { useAuthStore } from './stores/authStore'

let initialized = false

export function initWebSocketHandlers(onLogout?: () => void): void {
  if (initialized || !wsClient.isEnabled) return
  initialized = true

  wsClient.on('session.kicked', () => {
    toast.warning($t('auth.websocket.sessionKicked'))
    useAuthStore.getState().logout()
    onLogout?.()
  })
}
