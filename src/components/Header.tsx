import React, { useState } from 'react';
import { ViewTab } from '../types';
import { ArrowLeft, ExternalLink, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageModal } from './LanguageModal';

interface HeaderProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenOnboarding,
}) => {
  const { currentLanguageOption, t } = useTranslation();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {currentTab !== 'home' ? (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium shrink-0"
                title={t.header.back}
                aria-label={t.header.back}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0 text-left"
                aria-label="Home"
              >
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  NexaWeb
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {t.header.official}
                  </span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-none mt-0.5 truncate">
                {t.header.slogan}
              </p>
            </div>
          </div>

          {/* Right side: Personalizar + Language Selector + Official link */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botão Personalizar Experiência */}
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold transition-colors"
              title={t.header.customizeExp}
              aria-label={t.header.customizeExp}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t.header.customizeExp}</span>
            </button>

            {/* Seletor discreto de idioma com bandeira + código */}
            <button
              type="button"
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 bg-slate-950/80 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 text-xs font-bold transition-all shadow-inner"
              title={t.header.changeLanguage}
              aria-label={t.header.changeLanguage}
            >
              <span className="text-sm leading-none" role="img" aria-label={currentLanguageOption.name}>
                {currentLanguageOption.flag}
              </span>
              <span className="text-[11px] font-bold text-white">
                {currentLanguageOption.short}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Link para site oficial */}
            <a
              href="https://nexaweeb.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition-colors"
              title={t.header.visitWebsite}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white">nexaweeb</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Modal de seleção de idioma */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </>
  );
};
