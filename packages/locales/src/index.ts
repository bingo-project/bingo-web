// ABOUTME: Internationalization configuration and exports
// ABOUTME: Provides i18n setup using react-i18next

import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import zhCN from './langs/zh-CN/common.json'
import enUS from './langs/en-US/common.json'

export type SupportedLanguage = 'zh-CN' | 'en-US'

const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n, useTranslation }
export default i18n
