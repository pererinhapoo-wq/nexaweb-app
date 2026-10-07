import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimationMode } from '../types';
import {
  getSavedAnimationMode,
  saveAnimationMode,
} from '../utils/storage';
import { StatusBar, Style } from '@capacitor/status-bar';

interface ThemeContextType {
  resolvedTheme: 'dark' | 'light';
  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Detecta o tema inicial diretamente do sistema (Android / Browser)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Padrão seguro para fallback
  });
  const [animationMode, setAnimationModeState] = useState<AnimationMode>('enabled');

  // Tema resolvido acompanha 100% o sistema Android
  const resolvedTheme: 'dark' | 'light' = isDark ? 'dark' : 'light';

  // Monitora alterações dinâmicas do tema do sistema em tempo real
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateThemeFromSystem = (e?: MediaQueryListEvent) => {
      if (e && typeof e.matches === 'boolean') {
        setIsDark(e.matches);
      } else {
        setIsDark(mediaQuery.matches);
      }
    };

    // Sincroniza estado inicial exato
    setIsDark(mediaQuery.matches);

    // Suporte moderno e fallback para WebViews Android
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateThemeFromSystem);
      return () => mediaQuery.removeEventListener('change', updateThemeFromSystem);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(updateThemeFromSystem);
      return () => (mediaQuery as any).removeListener(updateThemeFromSystem);
    }
  }, []);

  // Carrega preferências salvas de animação na inicialização
  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedAnim = await getSavedAnimationMode();
        setAnimationModeState(savedAnim);
      } catch {
        // Fallback seguro
      }
    }

    loadPreferences();
  }, []);

  // Aplica o tema na árvore do DOM e sincroniza StatusBar nativa
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', resolvedTheme);
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Remove classes de personalizações manuais legadas
    root.classList.remove('theme-pitch-black', 'theme-official');

    // Sincroniza StatusBar nativa do Android via Capacitor
    async function updateStatusBar() {
      try {
        if (resolvedTheme === 'dark') {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' });
        } else {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#f8fafc' });
        }
      } catch {
        // Ignorado em ambiente web preview
      }
    }

    updateStatusBar();
  }, [resolvedTheme]);

  // Aplica a classe de animações reduzidas
  useEffect(() => {
    const root = document.documentElement;
    if (animationMode === 'reduced') {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [animationMode]);

  const setAnimationMode = async (mode: AnimationMode) => {
    setAnimationModeState(mode);
    try {
      await saveAnimationMode(mode);
    } catch {
      // Ignora falha de armazenamento
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        resolvedTheme,
        animationMode,
        setAnimationMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
