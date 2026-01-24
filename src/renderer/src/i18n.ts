import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'

const LANGUAGE_STORAGE_KEY = 'app.language'

function getInitialLanguage(): string | undefined {
  // localStorage is available in Electron renderer; guard for non-browser environments.
  try {
    if (typeof window === 'undefined') return undefined
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === 'en-US' || stored === 'zh-CN') return stored
    return undefined
  } catch {
    return undefined
  }
}

i18n.use(initReactI18next).init({
  resources: {
    'en-US': { translation: enUS },
    'zh-CN': { translation: zhCN }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en-US',
  supportedLngs: ['en-US', 'zh-CN'],
  interpolation: { escapeValue: false }
})

export default i18n
