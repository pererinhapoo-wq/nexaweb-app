import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimationMode, ThemeMode } from '../types';
import {
  getSavedAnimationMode,
  saveAnimationMode,
  getSavedTheme,
  saveTheme,
} from '../utils/storage';
import { StatusBar, Style } from '@capacitor/status-bar';

export type ThemeOption = 'system' | 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeOption;
  setThemeMode: (mode: ThemeOption) => Promise<void>;
  resolvedTheme: 'dark' | 'light';
  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Detecta o tema dinâmico do sistema (Android / Browser)
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Padrão seguro para fallback
  });

  // Modo de tema configurado pelo usuário: 'system' | 'light' | 'dark'
  const [themeMode, setThemeModeState] = useState<ThemeOption>('system');
  const [animationMode, setAnimationModeState] = useState<AnimationMode>('enabled');

  // Tema final resolvido: se 'system', acompanha Android; se 'light' ou 'dark', força a escolha
  const resolvedTheme: 'dark' | 'light' =
    themeMode === 'system'
      ? isSystemDark
        ? 'dark'
        : 'light'
      : themeMode === 'light'
      ? 'light'
      : 'dark';

  // Monitora alterações dinâmicas do tema do sistema em tempo real
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateThemeFromSystem = (e?: MediaQueryListEvent) => {
      if (e && typeof e.matches === 'boolean') {
        setIsSystemDark(e.matches);
      } else {
        setIsSystemDark(mediaQuery.matches);
      }
    };

    // Sincroniza estado inicial exato
    setIsSystemDark(mediaQuery.matches);

    // Suporte moderno e fallback para WebViews Android
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateThemeFromSystem);
      return () => mediaQuery.removeEventListener('change', updateThemeFromSystem);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(updateThemeFromSystem);
      return () => (mediaQuery as any).removeListener(updateThemeFromSystem);
    }
  }, []);

  // Carrega preferências salvas de tema e animação na inicialização
  useEffect(() => {
    async function loadPreferences() {
      try {
        const [savedAnim, savedTheme] = await Promise.all([
          getSavedAnimationMode(),
          getSavedTheme(),
        ]);
        setAnimationModeState(savedAnim);
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeModeState(savedTheme as ThemeOption);
        } else {
          setThemeModeState('system');
        }
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

  const setThemeMode = async (mode: ThemeOption) => {
    setThemeModeState(mode);
    try {
      await saveTheme(mode);
    } catch {
      // Ignora falha de armazenamento
    }
  };

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
        themeMode,
        setThemeMode,
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
