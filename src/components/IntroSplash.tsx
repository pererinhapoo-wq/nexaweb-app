import React, { useEffect, useState } from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface IntroSplashProps {
  onFinish: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<'enter' | 'glow' | 'exit'>('enter');

  useEffect(() => {
    // Se o usuário já tiver visto a intro nesta sessão, conclui quase de imediato
    const alreadyShown = sessionStorage.getItem('nexaweb_intro_shown');
    if (alreadyShown) {
      onFinish();
      return;
    }

    // Cronograma elegante de 1.4s
    const t1 = setTimeout(() => setStage('glow'), 350);
    const t2 = setTimeout(() => setStage('exit'), 1100);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('nexaweb_intro_shown', 'true');
      onFinish();
    }, 1450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  const handleSkip = () => {
    sessionStorage.setItem('nexaweb_intro_shown', 'true');
    onFinish();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-6 transition-opacity duration-300 cursor-pointer select-none ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label={t.intro.tapToContinue}
    >
      {/* Glow pulsante de fundo */}
      <div
        className={`absolute w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-600/30 via-cyan-500/25 to-transparent blur-3xl pointer-events-none transition-transform duration-700 ${
          stage === 'glow' ? 'scale-125 opacity-90' : 'scale-90 opacity-40'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Ícone NexaWeb */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/40 transition-all duration-500 transform ${
            stage === 'enter'
              ? 'scale-75 opacity-0'
              : stage === 'glow'
              ? 'scale-105 opacity-100'
              : 'scale-100 opacity-100'
          }`}
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Badge e Marca */}
        <div
          className={`space-y-1.5 transition-all duration-500 delay-100 transform ${
            stage === 'enter'
              ? 'translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t.intro.badge}
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            NexaWeb
          </h1>

          <p className="text-xs sm:text-sm font-medium text-cyan-300 max-w-xs leading-relaxed">
            {t.intro.slogan}
          </p>
        </div>

        {/* Dica de toque rápido */}
        <span className="text-[10px] text-slate-500 tracking-wider pt-4 animate-pulse">
          {t.intro.tapToContinue}
        </span>
      </div>
    </div>
  );
};
