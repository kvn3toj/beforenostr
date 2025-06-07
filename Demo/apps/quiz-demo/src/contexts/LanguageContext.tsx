'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';

type LanguageContextType = {
  language: Locale;
  setLanguage: (lang: Locale) => void;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
});

// Helper hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('es');
  const pathname = usePathname();
  const router = useRouter();

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Locale | null;

    if (storedLanguage && locales.includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0] as Locale;
      const defaultLang = locales.includes(browserLang) ? browserLang : 'es';
      setLanguageState(defaultLang);
      localStorage.setItem('language', defaultLang);
    }
  }, []);

  // Function to change language
  const setLanguage = (lang: Locale) => {
    if (locales.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);

      // Redirect to the same path with the new locale
      // This would need to be adjusted if using internationalized routing
      // For now, we're just storing the preference
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
