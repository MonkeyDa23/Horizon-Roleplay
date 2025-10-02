
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../lib/translations';
import type { Language, LocalizationContextType } from '../types';

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' : 'ltr' as 'rtl' | 'ltr',
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
