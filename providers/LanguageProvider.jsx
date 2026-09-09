'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import translations from '@/lib/translations';
import { api, isAuthenticated } from '@/lib/api';
const LanguageContext = createContext({ language: 'ar', setLanguage: () => {}, t: (key) => key });
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('ar');
  useEffect(() => {
    const stored = localStorage.getItem('adgenie_lang');
    setLanguageState(stored === 'en' ? 'en' : 'ar');
  }, []);
  const apply = useCallback((lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);
  const setLanguage = useCallback((lang) => {
    const safe = lang === 'en' ? 'en' : 'ar';
    setLanguageState(safe);
    localStorage.setItem('adgenie_lang', safe);
    apply(safe);
    if (isAuthenticated()) api.updatePreferences({ language: safe }).catch(() => {});
  }, [apply]);
  useEffect(() => { apply(language); }, [language, apply]);
  const t = useCallback((key) => translations[language]?.[key] || translations.ar?.[key] || key, [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
