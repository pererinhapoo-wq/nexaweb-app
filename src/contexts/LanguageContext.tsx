import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { ptBR, Translations } from '../locales/pt-BR';
import { Preferences } from '@capacitor/preferences';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  short: string;
  available: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', name: 'Português (Brasil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', short: 'BR', available: true },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const STORAGE_KEY = 'nexaweb_app_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // O aplicativo opera exclusivamente em Português Brasileiro (pt-BR)
  const language: Language = 'pt-BR';

  // Migração segura: qualquer preferência salva anteriormente é convertida imediatamente para pt-BR
  useEffect(() => {
    async function migrateSavedLanguage() {
      try {
        if (typeof window !== 'undefined') {
          const localVal = localStorage.getItem(STORAGE_KEY);
          if (localVal && localVal !== 'pt-BR') {
            localStorage.setItem(STORAGE_KEY, 'pt-BR');
          }
        }
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value && value !== 'pt-BR') {
          await Preferences.set({ key: STORAGE_KEY, value: 'pt-BR' });
        }
      } catch {}
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'pt-BR';
    }

    migrateSavedLanguage();
  }, []);

  const setLanguage = async (_newLang: Language) => {
    // Garante que o idioma permaneça estritamente pt-BR
    try {
      localStorage.setItem(STORAGE_KEY, 'pt-BR');
      await Preferences.set({ key: STORAGE_KEY, value: 'pt-BR' });
    } catch {}
  };

  const t: Translations = ptBR;
  const currentLanguageOption: LanguageOption = SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
      }}
    >
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

