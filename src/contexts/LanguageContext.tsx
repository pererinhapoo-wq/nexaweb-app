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
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', short: 'EN', available: true },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', short: 'ES', available: true },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', short: 'FR', available: true },
  { code: 'pt-PT', name: 'Português (Portugal)', nativeName: 'Português (Portugal)', flag: '🇵🇹', short: 'PT', available: true },
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
  const clean = val.trim().toLowerCase();
  if (clean === 'pt' || clean === 'pt-br' || clean === 'pt_br') return 'pt-BR';
  if (clean === 'pt-pt' || clean === 'pt_pt') return 'pt-PT';
  if (clean === 'en' || clean === 'en-us' || clean === 'en_us' || clean.startsWith('en')) return 'en';
  if (clean === 'es' || clean === 'es-es' || clean === 'es_es' || clean.startsWith('es')) return 'es';
  if (clean === 'fr' || clean === 'fr-fr' || clean === 'fr_fr' || clean.startsWith('fr')) return 'fr';
  if (['pt-BR', 'pt-PT', 'en', 'es', 'fr'].includes(val)) {
    return val as Language;
  }
  return 'pt-BR';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa o estado de forma síncrona com o valor previamente salvo no dispositivo
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const localVal = localStorage.getItem(STORAGE_KEY);
        if (localVal) {
          return normalizeLoadedLanguage(localVal);
        }
      } catch {}
    }
    return 'pt-BR';
  });

  // Carrega idioma salvo de Preferences na inicialização (Capacitor nativo)
  useEffect(() => {
    async function loadSavedLanguage() {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          const resolved = normalizeLoadedLanguage(value);
          setLanguageState(resolved);
          if (typeof document !== 'undefined') {
            document.documentElement.lang = resolved;
          }
        }
      } catch {}
    }

    loadSavedLanguage();
  }, []);

  // Garante sincronia do atributo lang no HTML
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = async (newLang: Language) => {
    // Apenas idiomas disponíveis podem ser ativados
    const opt = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
    if (!opt?.available) return;

    // Atualização imediata do estado React global
    setLanguageState(newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }

    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}

    try {
      await Preferences.set({ key: STORAGE_KEY, value: newLang });
    } catch {}
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
