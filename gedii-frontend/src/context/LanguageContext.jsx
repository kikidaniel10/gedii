import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const getPreferredLanguage = () => {
  const storedLanguage = localStorage.getItem('gedii_language');

  if (storedLanguage === 'fr' || storedLanguage === 'en') {
    return storedLanguage;
  }

  return 'fr';
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getPreferredLanguage);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((currentLanguage) => (currentLanguage === 'fr' ? 'en' : 'fr')),
    }),
    [language],
  );

  useMemo(() => {
    localStorage.setItem('gedii_language', language);
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
