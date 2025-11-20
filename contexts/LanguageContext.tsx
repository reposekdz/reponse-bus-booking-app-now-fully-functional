
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../translations'; // Used for fallback types/languages list

export type LanguageCode = 'RW' | 'EN' | 'FR';

export type Language = {
    code: LanguageCode;
    name: string;
    flag: string;
}

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, options?: any) => string;
  languages: Language[];
}

const supportedLanguages: Language[] = [
    { code: 'RW', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
];

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  // Default to Kinyarwanda
  const [language, setLanguageState] = useState<LanguageCode>('RW');

  // Sync local state with i18n state
  useEffect(() => {
      const current = i18n.language?.toUpperCase().substring(0, 2) as LanguageCode;
      if (current && ['RW', 'EN', 'FR'].includes(current)) {
          setLanguageState(current);
      } else {
          // Enforce RW if detection fails or returns something else
          setLanguageState('RW');
          i18n.changeLanguage('rw');
      }
  }, [i18n.language]);

  const setLanguage = (code: LanguageCode) => {
      const map = { 'RW': 'rw', 'EN': 'en', 'FR': 'fr' };
      i18n.changeLanguage(map[code]);
      setLanguageState(code);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
