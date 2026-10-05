import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { ptBR, Translations } from '../locales/pt-BR';
import { ptPT } from '../locales/pt-PT';
import { en } from '../locales/en';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
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
  { code: 'pt-PT', name: 'Português (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹', short: 'PT', available: true },
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', short: 'EN', available: true },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', short: 'ES', available: true },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', short: 'FR', available: true },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', short: 'DE', available: false },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', short: 'IT', available: false },
  { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵', short: 'JA', available: false },
  { code: 'zh', name: '中文', nativeName: '中文 (简体)', flag: '🇨🇳', short: 'ZH', available: false },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const STORAGE_KEY = 'nexaweb_app_language';

const translationsMap: Record<string, Translations> = {
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  en,
  es,
  fr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function normalizeLoadedLanguage(val: string | null | undefined): Language {
  if (!val) return 'pt-BR';
  if (val === 'pt') return 'pt-BR';
  if (['pt-BR', 'pt-PT', 'en', 'es', 'fr'].includes(val)) {
    return val as Language;
  }
  return 'pt-BR';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR');

  // Carrega idioma salvo na inicialização (Preferences nativo ou localStorage)
  useEffect(() => {
    async function loadSavedLanguage() {
      let resolvedLang: Language = 'pt-BR';

      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          resolvedLang = normalizeLoadedLanguage(value);
        } else {
          const localVal = localStorage.getItem(STORAGE_KEY);
          if (localVal) {
            resolvedLang = normalizeLoadedLanguage(localVal);
          }
        }
      } catch {
        const localVal = localStorage.getItem(STORAGE_KEY);
        if (localVal) {
          resolvedLang = normalizeLoadedLanguage(localVal);
        }
      }

      setLanguageState(resolvedLang);
      document.documentElement.lang = resolvedLang;
    }

    loadSavedLanguage();
  }, []);

  const setLanguage = async (newLang: Language) => {
    // Apenas idiomas disponíveis podem ser ativados
    const opt = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
    if (!opt?.available) return;

    setLanguageState(newLang);
    document.documentElement.lang = newLang;

    try {
      await Preferences.set({ key: STORAGE_KEY, value: newLang });
    } catch {
      // Ignora falhas em testes nativos
    }

    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Fallback
    }
  };

  const t: Translations = translationsMap[language] || ptBR;
  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

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
