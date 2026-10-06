import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface IntroSplashProps {
  onFinish: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Animação rápida e elegante (total ~1.1s)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 850);

    const finishTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('nexaweb_intro_shown', 'true');
      } catch {
        // Fallback
      }
      onFinish();
    }, 1150);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    skipTimerRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem('nexaweb_intro_shown', 'true');
      } catch {
        // Fallback
      }
      onFinish();
    }, 150);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 px-6 transition-all duration-300 select-none cursor-pointer ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="banner"
      aria-label="NexaWeb Splash"
    >
      {/* Glow de fundo elegante */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-600/35 via-cyan-500/25 to-transparent blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-90 duration-300">
        {/* Ícone NexaWeb */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/50">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin-slow" />
          </div>
        </div>

        {/* Badge e Marca */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>NexaWeb Oficial</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            NexaWeb
          </h1>

          <p className="text-xs sm:text-sm font-medium text-cyan-300 max-w-xs leading-relaxed">
            {t.intro?.slogan || 'Criação de Sites Profissionais'}
          </p>
        </div>

        {/* Barra de carregamento rápido discreta */}
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
