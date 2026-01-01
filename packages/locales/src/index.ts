// ABOUTME: Internationalization core configuration
// ABOUTME: Provides i18n setup that can be extended by apps

import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import zhCNCommon from './langs/zh-CN/common.json'
import enUSCommon from './langs/en-US/common.json'
import zhCNErrors from './langs/zh-CN/errors.json'
import enUSErrors from './langs/en-US/errors.json'
import zhCNAuth from './langs/zh-CN/auth.json'
import enUSAuth from './langs/en-US/auth.json'
import zhCNUI from './langs/zh-CN/ui.json'
import enUSUI from './langs/en-US/ui.json'
import zhCNSettings from './langs/zh-CN/settings.json'
import enUSSettings from './langs/en-US/settings.json'

import zhCNAi from './langs/zh-CN/ai.json'
import enUSAi from './langs/en-US/ai.json'

export type SupportedLanguage = 'zh-CN' | 'en-US'

const LANGUAGE_KEY = 'bingo-language'
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['zh-CN', 'en-US']

function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(LANGUAGE_KEY)
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage
  }
  return null
}

function getBrowserLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) return 'zh-CN'
  if (browserLang.startsWith('en')) return 'en-US'
  return null
}

function saveLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LANGUAGE_KEY, lang)
}

export interface LocaleSetupOptions {
  defaultLocale?: SupportedLanguage
  loadMessages?: (lang: SupportedLanguage) => Promise<Record<string, unknown>>
}

const coreResources = {
  'zh-CN': {
    translation: { ...zhCNCommon, errors: zhCNErrors, auth: zhCNAuth, ui: zhCNUI, settings: zhCNSettings, ai: zhCNAi },
  },
  'en-US': {
    translation: { ...enUSCommon, errors: enUSErrors, auth: enUSAuth, ui: enUSUI, settings: enUSSettings, ai: enUSAi },
  },
}

let isInitialized = false

/**
 * Setup i18n with optional app-level messages
 */
export async function setupI18n(options: LocaleSetupOptions = {}) {
  const { defaultLocale = 'zh-CN', loadMessages } = options
  const initialLocale = getStoredLanguage() ?? getBrowserLanguage() ?? defaultLocale

  if (!isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: coreResources,
      lng: initialLocale,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
    })
    isInitialized = true
  }

  // Load and merge app-level messages
  if (loadMessages) {
    const appMessages = await loadMessages(initialLocale)
    if (appMessages) {
      i18n.addResourceBundle(initialLocale, 'translation', appMessages, true, true)
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
  // Load app messages first (before changing language)
  if (loadMessages) {
    const appMessages = await loadMessages(lang)
    if (appMessages) {
      i18n.addResourceBundle(lang, 'translation', appMessages, true, true)
    }
  }

  // Then change language if needed
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang)
  }

  saveLanguage(lang)
}

// $t for non-component usage (e.g., in interceptors)
const $t = i18n.t.bind(i18n)

export { i18n, useTranslation, $t }
export default i18n
