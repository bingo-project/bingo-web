// ABOUTME: Internationalization core configuration
// ABOUTME: Provides i18n setup that can be extended by apps

import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import zhCN from './langs/zh-CN/common.json'
import enUS from './langs/en-US/common.json'

export type SupportedLanguage = 'zh-CN' | 'en-US'

export interface LocaleSetupOptions {
  defaultLocale?: SupportedLanguage
  loadMessages?: (lang: SupportedLanguage) => Promise<Record<string, unknown>>
}

const coreResources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
}

let isInitialized = false

/**
 * Setup i18n with optional app-level messages
 */
export async function setupI18n(options: LocaleSetupOptions = {}) {
  const { defaultLocale = 'zh-CN', loadMessages } = options

  if (!isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: coreResources,
      lng: defaultLocale,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
    })
    isInitialized = true
  }

  // Load and merge app-level messages
  if (loadMessages) {
    const appMessages = await loadMessages(defaultLocale)
    if (appMessages) {
      i18n.addResourceBundle(defaultLocale, 'translation', appMessages, true, true)
    }
  }

  return i18n
}

/**
 * Load app messages for a specific language
 */
export async function loadLocaleMessages(
  lang: SupportedLanguage,
  loadMessages?: (lang: SupportedLanguage) => Promise<Record<string, unknown>>
) {
  if (i18n.language === lang) return

  await i18n.changeLanguage(lang)

  if (loadMessages) {
    const appMessages = await loadMessages(lang)
    if (appMessages) {
      i18n.addResourceBundle(lang, 'translation', appMessages, true, true)
    }
  }
}

export { i18n, useTranslation }
export default i18n
