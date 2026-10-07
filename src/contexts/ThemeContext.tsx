import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimationMode, ThemeMode } from '../types';
import {
  getSavedAnimationMode,
  saveAnimationMode,
  getSavedTheme,
  saveTheme,
} from '../utils/storage';
import { StatusBar, Style } from '@capacitor/status-bar';

export type ThemeOption = 'original' | 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeOption;
  setThemeMode: (mode: ThemeOption) => Promise<void>;
  resolvedTheme: ThemeOption;
  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Modo de tema configurado pelo usuário: exatamente 3 temas independentes
  const [themeMode, setThemeModeState] = useState<ThemeOption>('original');
  const [animationMode, setAnimationModeState] = useState<AnimationMode>('enabled');

  // Tema resolvido é diretamente a escolha do usuário ('original' | 'light' | 'dark')
  const resolvedTheme: ThemeOption = themeMode;

  // Carrega preferências salvas de tema e animação na inicialização
  useEffect(() => {
    async function loadPreferences() {
      try {
        const [savedAnim, savedTheme] = await Promise.all([
          getSavedAnimationMode(),
          getSavedTheme(),
        ]);
        setAnimationModeState(savedAnim);
        if (savedTheme === 'original' || savedTheme === 'light' || savedTheme === 'dark') {
          setThemeModeState(savedTheme as ThemeOption);
        } else {
          setThemeModeState('original');
        }
      } catch {
        // Fallback seguro para o tema Original
        setThemeModeState('original');
      }
    }

    loadPreferences();
  }, []);

  // Aplica o tema na árvore do DOM e sincroniza StatusBar nativa
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', resolvedTheme);

    // Remove todas as classes de temas para garantir que não haja herança residual de estilos
    root.classList.remove('original', 'light', 'dark', 'theme-pitch-black', 'theme-official');

    if (resolvedTheme === 'light') {
      root.classList.add('light');
    } else if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('original');
    }

    // Sincroniza StatusBar nativa do Android via Capacitor
    async function updateStatusBar() {
      try {
        if (resolvedTheme === 'light') {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#f8fafc' });
        } else if (resolvedTheme === 'dark') {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
        } else {
          // Original: Slate 950 oficial NexaWeb
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' });
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
