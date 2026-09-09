import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import translations from './translations';
import { api } from '../api';

const LanguageContext = createContext({
  language: 'ar',
  setLanguage: () => {},
  t: (key) => key
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('adgenie_lang') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const applyDirection = useCallback((lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    applyDirection(lang);
    try {
      localStorage.setItem('adgenie_lang', lang);
    } catch { /* ignore */ }
    // Sync to backend if authenticated
    try {
      api.updatePreferences({ language: lang }).catch(() => {});
    } catch { /* ignore */ }
  }, [applyDirection]);

  // Apply direction on initial mount
  useEffect(() => {
    applyDirection(language);
  }, [language, applyDirection]);

  // Sync from backend on mount if authenticated
  useEffect(() => {
    try {
      api.getPreferences().then((data) => {
        if (data && data.language && data.language !== language) {
          setLanguage(data.language);
        }
      }).catch(() => {});
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['ar']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;