// ABOUTME: App-level i18n configuration
// ABOUTME: Loads app-specific translations and merges with core locales

import { setupI18n, loadLocaleMessages, type SupportedLanguage } from '@bingo/locales'

// Dynamically import app-level locale files
const modules = import.meta.glob('./langs/**/*.json')

/**
 * Load app-level messages for a language
 */
async function loadAppMessages(lang: SupportedLanguage): Promise<Record<string, unknown>> {
  let messages: Record<string, unknown> = {}

  for (const [path, importFn] of Object.entries(modules)) {
    // Match pattern: ./langs/zh-CN/landing.json -> lang=zh-CN
    const match = path.match(/\.\/langs\/([^/]+)\/(.*)\.json$/)
    if (match && match[1] === lang) {
      const module = (await importFn()) as { default: Record<string, unknown> }
      // Spread content directly (no namespace prefix)
      messages = { ...messages, ...module.default }
    }
  }

  return messages
}

/**
 * Initialize i18n with app-level messages
 */
export async function initI18n() {
  await setupI18n({
    defaultLocale: 'zh-CN',
    loadMessages: loadAppMessages,
  })
}

/**
 * Change language and load corresponding app messages
 */
export async function changeLanguage(lang: SupportedLanguage) {
  await loadLocaleMessages(lang, loadAppMessages)
}

export { useTranslation, i18n, type SupportedLanguage } from '@bingo/locales'
