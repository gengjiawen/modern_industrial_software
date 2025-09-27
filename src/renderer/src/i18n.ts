import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'

i18n.use(initReactI18next).init({
  resources: {
    'en-US': { translation: enUS },
    'zh-CN': { translation: zhCN }
  },
  fallbackLng: ['en-US', 'en'],
  supportedLngs: ['en-US', 'zh-CN'],
  interpolation: { escapeValue: false }
})

export default i18n
