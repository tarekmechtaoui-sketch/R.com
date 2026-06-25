import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { translations } from '../utils/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem('r_com_lang') || 'en'
  )

  // Apply dir + lang to document root (RTL for Arabic)
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  // On mount: fetch active language from Supabase to keep all visitors in sync
  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'language')
      .single()
      .then(({ data }) => {
        if (data?.value) {
          setLanguageState(data.value)
          localStorage.setItem('r_com_lang', data.value)
        }
      })
  }, [])

  // Admin-called: persist language to Supabase + update all open tabs via localStorage
  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang)
    localStorage.setItem('r_com_lang', lang)
    await supabase
      .from('site_settings')
      .upsert({ key: 'language', value: lang, updated_at: new Date().toISOString() })
  }, [])

  // Translation function — falls back to English, then to the key itself
  const t = useCallback(
    (key, params = {}) => {
      const dict = translations[language] || translations.en
      let str = dict[key] ?? translations.en[key] ?? key
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v))
      })
      return str
    },
    [language]
  )

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
