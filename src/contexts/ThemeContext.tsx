import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, AnimationMode } from '../types';
import {
  getSavedTheme,
  saveTheme,
  getSavedAnimationMode,
  saveAnimationMode,
} from '../utils/storage';
import { StatusBar, Style } from '@capacitor/status-bar';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('official');
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [animationMode, setAnimationModeState] = useState<AnimationMode>('enabled');

  // Determina o tema resolvido
  const resolvedTheme: 'dark' | 'light' =
    themeMode === 'auto'
      ? (systemDark ? 'dark' : 'light')
      : (themeMode === 'light' ? 'light' : 'dark');

  // Carrega preferências salvas na inicialização
  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedTheme = await getSavedTheme();
        setThemeModeState(savedTheme);

        const savedAnim = await getSavedAnimationMode();
        setAnimationModeState(savedAnim);
      } catch {
        // Fallback seguro para o tema padrão escuro
      }
    }

    loadPreferences();
  }, []);

  // Monitora alterações do tema do sistema se estiver em modo auto
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplica o tema na árvore do DOM e sincroniza StatusBar
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

    if (themeMode === 'dark') {
      root.classList.add('theme-pitch-black');
      root.classList.remove('theme-official');
    } else if (themeMode === 'official') {
      root.classList.add('theme-official');
      root.classList.remove('theme-pitch-black');
    } else {
      root.classList.remove('theme-pitch-black', 'theme-official');
    }

    // Aplica status bar nativa
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
        // Ignorado em ambiente web
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

  const setThemeMode = async (mode: ThemeMode) => {
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
        resolvedTheme,
        setThemeMode,
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
