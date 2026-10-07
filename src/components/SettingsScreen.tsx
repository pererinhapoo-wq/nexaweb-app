import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language, AnimationMode } from '../types';
import {
  Globe,
  Zap,
  Instagram,
  Mail,
  ExternalLink,
  Check,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenLanguageModal?: () => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
}) => {
  const { language, setLanguage, t, languages } = useTranslation();
  const { animationMode, setAnimationMode } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleLanguageChange = async (newLang: Language) => {
    const opt = languages.find((l) => l.code === newLang);
    if (!opt?.available) return;
    if (newLang === language) return;

    await setLanguage(newLang);
    const toast =
      newLang === 'en'
        ? 'Language updated successfully!'
        : newLang === 'es'
        ? '¡Idioma actualizado con éxito!'
        : newLang === 'fr'
        ? 'Langue mise à jour avec succès !'
        : 'Idioma atualizado com sucesso!';
    showToast(toast);
  };

  const handleAnimationChange = async (mode: AnimationMode) => {
    if (mode === animationMode) return;
    await setAnimationMode(mode);
  };

  return (
    <div className="space-y-4 pb-6 transition-colors duration-200 overflow-x-hidden">
      {/* Toast flutuante de confirmação com alto contraste */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-950/60 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 border border-indigo-400/40"
        >
          <Check className="w-3.5 h-3.5 text-cyan-300 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho da Tela: Botão Voltar ← (48x48 dp) + Título Oficial */}
      <header className="flex items-center gap-3 pt-0.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] min-w-[48px] rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
            aria-label={t.header?.back || 'Voltar'}
            title={t.header?.back || 'Voltar'}
          >
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
            {t.settings.title}
          </h1>
          <p className="text-xs text-slate-400 truncate">
            {t.settings.subtitle || 'Preferências e informações'}
          </p>
        </div>
      </header>

      {/* =========================================================================
          SEÇÃO 1: IDIOMA
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            {t.settings.appLanguage}
          </h2>
        </div>

        <p className="text-[11.5px] text-slate-400">
          {t.settings.appLanguageDesc}
        </p>

        {/* Lista de Idiomas Suportados (48x48 min touch target, alto contraste) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={t.settings.appLanguage}>
          {languages.map((item: LanguageOption) => {
            const isSelected = language === item.code;

            return (
              <button
                key={item.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleLanguageChange(item.code)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0 select-none" role="img" aria-label={item.name}>
                    {item.flag}
                  </span>
                  <div className="truncate">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-200 font-bold' : 'text-slate-200'}`}>
                      {item.nativeName || item.name}
                    </p>
                    {item.nativeName !== item.name && (
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.name}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: ANIMAÇÕES
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            {t.settings.animations}
          </h2>
        </div>

        <p className="text-[11.5px] text-slate-400">
          {t.settings.animationsDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={t.settings.animations}>
          {/* Opção 1: Ativadas (Recomendado) */}
          <button
            type="button"
            role="radio"
            aria-checked={animationMode === 'enabled'}
            onClick={() => handleAnimationChange('enabled')}
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.98] cursor-pointer ${
              animationMode === 'enabled'
                ? 'bg-indigo-600/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <div>
              <p className={`text-xs font-bold ${animationMode === 'enabled' ? 'text-cyan-200' : 'text-white'}`}>
                {t.settings.animationsEnabled}
              </p>
              <p className="text-[10px] text-indigo-300 font-medium">
                {t.settings.animationsEnabledBadge}
              </p>
            </div>

            {animationMode === 'enabled' ? (
              <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-cyan-400/40">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
            )}
          </button>

          {/* Opção 2: Reduzidas (Acessibilidade) */}
          <button
            type="button"
            role="radio"
            aria-checked={animationMode === 'reduced'}
            onClick={() => handleAnimationChange('reduced')}
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.98] cursor-pointer ${
              animationMode === 'reduced'
                ? 'bg-indigo-600/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <div>
              <p className={`text-xs font-bold ${animationMode === 'reduced' ? 'text-cyan-200' : 'text-white'}`}>
                {t.settings.animationsReduced}
              </p>
              <p className="text-[10px] text-slate-400">
                {language === 'en' ? 'Accessibility' : 'Acessibilidade'}
              </p>
            </div>

            {animationMode === 'reduced' ? (
              <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-cyan-400/40">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="text-[10.5px] text-slate-400 leading-relaxed">
          {animationMode === 'reduced'
            ? t.settings.animationsReducedDesc
            : (language === 'en'
                ? 'Smooth transitions enabled for rich visual navigation.'
                : 'Transições suaves ativadas para navegação visual fluida.')}
        </p>
      </section>

      {/* =========================================================================
          SEÇÃO 3: NEXAWEB (CANAIS OFICIAIS & INFORMAÇÕES DO APP)
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              {t.settings.nexawebSection}
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            {t.settings.appVersionVal}
          </span>
        </div>

        <p className="text-[11.5px] text-slate-400">
          {language === 'en'
            ? 'Official contact channels and platforms:'
            : 'Canais de contato oficiais existentes:'}
        </p>

        <div className="space-y-2">
          {/* 1. Instagram Oficial */}
          <a
            href="https://www.instagram.com/nexaw1/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
            aria-label="Instagram @nexaw1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shrink-0">
                <div className="w-full h-full bg-slate-950/60 rounded-[6px] flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[10.5px] text-slate-400 font-medium">Instagram</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  {t.settings.instagramHandle}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>

          {/* 2. E-mail Oficial */}
          <a
            href="mailto:nexaweeb@gmail.com"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
            aria-label="Email nexaweeb@gmail.com"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10.5px] text-slate-400 font-medium">E-mail</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  {t.settings.emailAddress}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>

          {/* 3. Site Oficial */}
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
            aria-label="Site oficial nexaweeb.vercel.app"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10.5px] text-slate-400 font-medium">Site</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  {t.settings.websiteUrl}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>
        </div>

        {/* Rodapé Compacto com Versão e Direitos */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10.5px] text-slate-400">
          <span>{t.settings.copyright}</span>
          <span className="font-mono text-slate-400">{t.settings.appVersion}: {t.settings.appVersionVal}</span>
        </div>
      </section>
    </div>
  );
};
