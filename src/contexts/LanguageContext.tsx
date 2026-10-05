import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { pt, Translations } from '../locales/pt';
import { en } from '../locales/en';
import { Preferences } from '@capacitor/preferences';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const STORAGE_KEY = 'nexaweb_app_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  // Carrega idioma salvo na inicialização (Preferences nativo ou localStorage)
  useEffect(() => {
    async function loadSavedLanguage() {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value === 'en' || value === 'pt') {
          setLanguageState(value);
          document.documentElement.lang = value === 'pt' ? 'pt-BR' : 'en-US';
          return;
        }
      } catch {
        // Fallback para localStorage web
      }

      try {
        const localVal = localStorage.getItem(STORAGE_KEY);
        if (localVal === 'en' || localVal === 'pt') {
          setLanguageState(localVal);
          document.documentElement.lang = localVal === 'pt' ? 'pt-BR' : 'en-US';
          return;
        }
      } catch {
        // Padrão 'pt' mantido
      }

      document.documentElement.lang = 'pt-BR';
    }

    loadSavedLanguage();
  }, []);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    document.documentElement.lang = newLang === 'pt' ? 'pt-BR' : 'en-US';

    try {
      await Preferences.set({ key: STORAGE_KEY, value: newLang });
    } catch {
      // Fallback
    }

    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Fallback
    }
  };

  const t: Translations = language === 'en' ? en : pt;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
