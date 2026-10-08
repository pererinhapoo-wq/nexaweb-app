import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
import { useTheme, ThemeOption } from '../contexts/ThemeContext';
import { Language, AnimationMode } from '../types';
import {
  Globe,
  Zap,
  Instagram,
  Mail,
  ExternalLink,
  Check,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { BackButton } from './BackButton';

interface SettingsScreenProps {
  onOpenLanguageModal?: () => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
}) => {
  const { language, setLanguage, t, languages } = useTranslation();
  const { themeMode, setThemeMode, animationMode, setAnimationMode } = useTheme();

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

  const handleThemeChange = async (mode: ThemeOption) => {
    if (mode === themeMode) return;
    await setThemeMode(mode);
    const toast =
      mode === 'light'
        ? language === 'en'
          ? 'Light theme applied!'
          : language === 'es'
          ? '¡Tema claro aplicado!'
          : language === 'fr'
          ? 'Thème clair appliqué !'
          : 'Tema claro aplicado!'
        : mode === 'dark'
        ? language === 'en'
          ? 'AMOLED Dark theme applied!'
          : language === 'es'
          ? '¡Tema oscuro AMOLED aplicado!'
          : language === 'fr'
          ? 'Thème sombre AMOLED appliqué !'
          : 'Tema escuro AMOLED aplicado!'
        : language === 'en'
        ? 'Original theme applied!'
        : language === 'es'
        ? '¡Tema original aplicado!'
        : language === 'fr'
        ? 'Thème original appliqué !'
        : 'Tema original aplicado!';
    showToast(toast);
  };

  const handleAnimationChange = async (mode: AnimationMode) => {
    if (mode === animationMode) return;
    await setAnimationMode(mode);
  };

  const themeTexts = useMemo(() => {
    if (language === 'en') {
      return {
        title: 'App Theme',
        desc: 'Choose between the 3 independent official visual themes.',
        options: [
          { id: 'original' as ThemeOption, label: 'Original', badge: 'Brand Slate', icon: Sparkles, iconColor: 'text-indigo-400' },
          { id: 'light' as ThemeOption, label: 'Light', badge: 'Day mode', icon: Sun, iconColor: 'text-amber-400' },
          { id: 'dark' as ThemeOption, label: 'Dark', badge: 'AMOLED Black', icon: Moon, iconColor: 'text-cyan-400' },
        ],
      };
    }
    if (language === 'es') {
      return {
        title: 'Tema de la Aplicación',
        desc: 'Elige entre los 3 temas visuales independientes oficiales.',
        options: [
          { id: 'original' as ThemeOption, label: 'Original', badge: 'Identidad Nexa', icon: Sparkles, iconColor: 'text-indigo-400' },
          { id: 'light' as ThemeOption, label: 'Claro', badge: 'Modo día', icon: Sun, iconColor: 'text-amber-400' },
          { id: 'dark' as ThemeOption, label: 'Oscuro', badge: 'AMOLED Black', icon: Moon, iconColor: 'text-cyan-400' },
        ],
      };
    }
    if (language === 'fr') {
      return {
        title: "Thème de l'Application",
        desc: 'Choisissez parmi les 3 thèmes visuels officiels et indépendants.',
        options: [
          { id: 'original' as ThemeOption, label: 'Original', badge: 'Identité Nexa', icon: Sparkles, iconColor: 'text-indigo-400' },
          { id: 'light' as ThemeOption, label: 'Clair', badge: 'Mode jour', icon: Sun, iconColor: 'text-amber-400' },
          { id: 'dark' as ThemeOption, label: 'Sombre', badge: 'AMOLED Black', icon: Moon, iconColor: 'text-cyan-400' },
        ],
      };
    }
    return {
      title: 'Tema da Interface',
      desc: 'Alterne livremente entre os 3 temas oficiais e independentes da aplicação.',
      options: [
        { id: 'original' as ThemeOption, label: 'Original', badge: 'Identidade Nexa', icon: Sparkles, iconColor: 'text-indigo-400' },
        { id: 'light' as ThemeOption, label: 'Claro', badge: 'Modo dia', icon: Sun, iconColor: 'text-amber-400' },
        { id: 'dark' as ThemeOption, label: 'Escuro', badge: 'AMOLED Black', icon: Moon, iconColor: 'text-cyan-400' },
      ],
    };
  }, [language]);

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

      {/* Cabeçalho da Tela: Título Oficial */}
      <div className="pt-0.5 pb-0.5">
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
            {t.settings.title}
          </h1>
          <p className="text-[11px] text-slate-400 truncate">
            {t.settings.subtitle || 'Preferências e informações'}
          </p>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 1: IDIOMA
          ========================================================================= */}
      <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
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
          SEÇÃO 2: TEMA DA INTERFACE (SISTEMA, CLARO, ESCURO)
          ========================================================================= */}
      <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
          {themeMode === 'light' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : themeMode === 'dark' ? (
            <Moon className="w-4 h-4 text-cyan-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400" />
          )}
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
            {themeTexts.title}
          </h2>
        </div>

        <p className="text-[11.5px] text-slate-400">
          {themeTexts.desc}
        </p>

        {/* Seletor Compacto Moderno: Sistema / Claro / Escuro */}
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={themeTexts.title}>
          {themeTexts.options.map((opt) => {
            const isSelected = themeMode === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleThemeChange(opt.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 min-h-[58px] active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-1 transition-colors ${
                    isSelected ? opt.iconColor : 'text-slate-400'
                  }`}
                />
                <span className={`text-xs font-semibold ${isSelected ? 'text-cyan-200 font-bold' : 'text-slate-300'}`}>
                  {opt.label}
                </span>
                <span className="text-[9.5px] text-slate-400 mt-0.5 line-clamp-1">
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 3: ANIMAÇÕES
          ========================================================================= */}
      <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
            {t.settings.animations}
          </h2>
        </div>

        <p className="text-[11px] text-slate-400">
          {t.settings.animationsDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={t.settings.animations}>
          {/* Opção 1: Ativadas (Recomendado) */}
          <button
            type="button"
            role="radio"
            aria-checked={animationMode === 'enabled'}
            onClick={() => handleAnimationChange('enabled')}
            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 min-h-[44px] active:scale-[0.98] cursor-pointer ${
              animationMode === 'enabled'
                ? 'bg-indigo-600/20 border-cyan-400/80 text-white shadow-sm ring-1 ring-cyan-400/40'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
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
              <div className="w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-cyan-400/40">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
            )}
          </button>

          {/* Opção 2: Reduzidas (Acessibilidade) */}
          <button
            type="button"
            role="radio"
            aria-checked={animationMode === 'reduced'}
            onClick={() => handleAnimationChange('reduced')}
            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 min-h-[44px] active:scale-[0.98] cursor-pointer ${
              animationMode === 'reduced'
                ? 'bg-indigo-600/20 border-cyan-400/80 text-white shadow-sm ring-1 ring-cyan-400/40'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
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
              <div className="w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shrink-0 shadow-sm shadow-cyan-400/40">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
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
      <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white">
              {t.settings.nexawebSection}
            </h2>
          </div>
          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
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
