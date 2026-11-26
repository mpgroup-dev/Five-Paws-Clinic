import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'fivepaws_lang'

export function LanguageProvider({ children }) {
  // Arabic-only site: Arabic is the single, default language.
  const [lang, setLang] = useState('ar')

  const dir = translations[lang].dir

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang, dir])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'))
  }, [])

  // dot-path translation helper, e.g. t('nav.home')
  const t = useCallback(
    (path) => {
      const parts = path.split('.')
      let node = translations[lang]
      for (const p of parts) {
        if (node == null) break
        node = node[p]
      }
      if (node === undefined) {
        // fall back to English
        node = translations.en
        for (const p of parts) {
          if (node == null) break
          node = node[p]
        }
      }
      return node ?? path
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
