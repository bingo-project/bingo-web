// ABOUTME: API error handling utilities
// ABOUTME: Provides showApiError function for displaying translated error messages

import { toast } from 'sonner'
import { ApiError } from '@bingo/core'
import { $t } from '@bingo/locales'

/**
 * Display API error message with i18n translation
 * Only handles business errors with reason field.
 * HTTP-level errors are handled by request interceptor.
 * @param error - The caught error object
 * @param fallbackMessage - Message to show when no translation is found
 */
export function showApiError(error: unknown, fallbackMessage?: string): void {
  if (error instanceof ApiError && error.reason) {
    const errorKey = `errors.${error.reason}`
    const translated = $t(errorKey)

    // If translation exists (not equal to key itself), use it
    if (translated !== errorKey) {
      toast.error(translated)
      return
    }
  }

  // Fallback to provided message or default
  toast.error(fallbackMessage || $t('errors.default'))
}
