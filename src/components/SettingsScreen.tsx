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
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Info,
  Smartphone,
  Gauge,
  Palette,
  Target,
  X,
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenLanguageModal?: () => void;
  onOpenContact?: () => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenLanguageModal,
  onOpenContact,
  onBack,
}) => {
  const { language, setLanguage, t, languages } = useTranslation();
  const { themeMode, setThemeMode, animationMode, setAnimationMode } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false);

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
    }, 2200);
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
    const toast =
      mode === 'reduced'
        ? language === 'en'
          ? 'Reduced motion enabled!'
          : 'Animações reduzidas ativadas!'
        : language === 'en'
        ? 'Smooth animations enabled!'
        : 'Animações ativadas!';
    showToast(toast);
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

  // Idiomas principais em destaque
  const primaryLanguages = useMemo(() => {
    return languages.filter((l) => l.code === 'pt-BR' || l.code === 'en');
  }, [languages]);

  // Outros idiomas disponíveis
  const otherLanguages = useMemo(() => {
    return languages.filter((l) => l.code !== 'pt-BR' && l.code !== 'en');
  }, [languages]);

  // Idioma ativo atual
  const currentLangObj = useMemo(() => {
    return languages.find((l) => l.code === language) || languages[0];
  }, [languages, language]);

  return (
    <div className="space-y-4 pb-8 transition-colors duration-200 overflow-x-hidden">
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

      {/* Cabeçalho da Tela: Título e Subtítulo Oficial */}
      <div className="pt-1 pb-1">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
            {t.settings.title}
          </h1>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {t.settings.subtitle || 'Personalize suas preferências e conheça os canais oficiais da NexaWeb.'}
          </p>
        </div>
      </div>

      {/* =========================================================================
          GRUPO 1: PREFERÊNCIAS (IDIOMA, TEMA, ANIMAÇÕES)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            {t.settings.preferencesSection || 'Preferências'}
          </span>
          <div className="flex-1 h-px bg-slate-800/80" />
        </div>

        {/* 1.1 Idioma */}
        <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-[13px] font-bold text-white">
                {t.settings.appLanguage}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-xs select-none">{currentLangObj.flag}</span>
              <span className="font-semibold text-cyan-300">{currentLangObj.short}</span>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            {t.settings.appLanguageDesc}
          </p>

          {/* Cards dos 2 Idiomas Principais: Português (Brasil) e English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={t.settings.appLanguage}>
            {primaryLanguages.map((item: LanguageOption) => {
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
                    <span className="text-2xl shrink-0 select-none" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-200 font-bold' : 'text-slate-200'}`}>
                        {item.nativeName || item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {t.settings.activeBadge || 'Ativo'}
                      </span>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Opção para abrir todos os idiomas ou selecionar outros */}
          {onOpenLanguageModal && (
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/70 text-slate-300 hover:text-white transition-all text-xs min-h-[44px] cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  {language === 'en'
                    ? 'Explore all languages (Español, Français, Português PT...)'
                    : 'Ver todos os idiomas disponíveis (Español, Français, Português PT...)'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}
        </section>

        {/* 1.2 Tema da Interface */}
        <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                {themeMode === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : themeMode === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <h2 className="text-xs sm:text-[13px] font-bold text-white">
                {themeTexts.title}
              </h2>
            </div>
            <span className="text-[10px] font-medium text-slate-400 capitalize px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
              {themeMode === 'original' ? 'Original' : themeMode === 'light' ? 'Claro' : 'Escuro'}
            </span>
          </div>

          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            {themeTexts.desc}
          </p>

          {/* Grid dos 3 temas independentes */}
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
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 min-h-[64px] active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/25 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 transition-colors ${
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

        {/* 1.3 Animações & Transições */}
        <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-[13px] font-bold text-white">
                {t.settings.animations}
              </h2>
            </div>
            <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
              {animationMode === 'enabled' ? t.settings.animationsEnabled : t.settings.animationsReduced}
            </span>
          </div>

          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            {t.settings.animationsDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={t.settings.animations}>
            {/* Opção 1: Ativadas */}
            <button
              type="button"
              role="radio"
              aria-checked={animationMode === 'enabled'}
              onClick={() => handleAnimationChange('enabled')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.98] cursor-pointer ${
                animationMode === 'enabled'
                  ? 'bg-indigo-600/20 border-cyan-400/80 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <p className={`text-xs font-bold ${animationMode === 'enabled' ? 'text-cyan-200' : 'text-white'}`}>
                  {t.settings.animationsEnabled}
                </p>
                <p className="text-[10px] text-indigo-300 font-medium mt-0.5">
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

            {/* Opção 2: Reduzidas */}
            <button
              type="button"
              role="radio"
              aria-checked={animationMode === 'reduced'}
              onClick={() => handleAnimationChange('reduced')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.98] cursor-pointer ${
                animationMode === 'reduced'
                  ? 'bg-indigo-600/20 border-cyan-400/80 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <p className={`text-xs font-bold ${animationMode === 'reduced' ? 'text-cyan-200' : 'text-white'}`}>
                  {t.settings.animationsReduced}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
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
                  ? 'Smooth transitions and fluid visual navigation.'
                  : 'Transições suaves ativadas para navegação visual rica e fluida.')}
          </p>
        </section>
      </div>

      {/* =========================================================================
          GRUPO 2: CANAIS OFICIAIS & SUPORTE NEXAWEB
          ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            {t.settings.nexawebSection || 'NexaWeb Oficial'}
          </span>
          <div className="flex-1 h-px bg-slate-800/80" />
        </div>

        <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-[13px] font-bold text-white">
                {language === 'en' ? 'Official Channels & Support' : 'Canais Oficiais & Suporte'}
              </h2>
            </div>
            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {t.settings.appVersionVal}
            </span>
          </div>

          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'Connect directly with the NexaWeb team through our verified channels:'
              : 'Entre em contato diretamente com a equipe da NexaWeb através dos canais oficiais:'}
          </p>

          <div className="space-y-2">
            {/* Opção Falar com a Equipe (abre ContactModal se disponível) */}
            {onOpenContact && (
              <button
                type="button"
                onClick={onOpenContact}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group min-h-[48px] cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[10.5px] text-slate-400 font-medium">
                      {language === 'en' ? 'Direct Consultation' : 'Atendimento Imediato'}
                    </p>
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {language === 'en' ? 'Talk to NexaWeb Team' : 'Falar com a NexaWeb'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            )}

            {/* 1. Instagram Oficial */}
            <a
              href="https://www.instagram.com/nexaw1/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group min-h-[48px]"
              aria-label="Instagram @nexaw1"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shrink-0">
                  <div className="w-full h-full bg-slate-950/60 rounded-[6px] flex items-center justify-center">
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] text-slate-400 font-medium">Instagram Oficial</p>
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
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group min-h-[48px]"
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
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group min-h-[48px]"
              aria-label="Site oficial nexaweeb.vercel.app"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] text-slate-400 font-medium">Site Oficial</p>
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                    {t.settings.websiteUrl}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
            </a>
          </div>
        </section>
      </div>

      {/* =========================================================================
          GRUPO 3: SOBRE A NEXAWEB & INFORMAÇÕES DO APP
          ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            {language === 'en' ? 'About & Information' : 'Sobre & Informações'}
          </span>
          <div className="flex-1 h-px bg-slate-800/80" />
        </div>

        <section className="rounded-xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800/80 shadow-sm space-y-3">
          {/* Card Expansível: Sobre a NexaWeb */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setIsAboutExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-850/60 transition-colors min-h-[48px] cursor-pointer"
              aria-expanded={isAboutExpanded}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">
                    {t.settings.aboutNexaWeb}
                  </p>
                  <p className="text-[10.5px] text-slate-400 truncate">
                    {t.settings.aboutNexaWebDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2 text-slate-400">
                <span className="text-[11px] hidden sm:inline text-cyan-400">
                  {isAboutExpanded
                    ? (language === 'en' ? 'Hide' : 'Ocultar')
                    : (language === 'en' ? 'View' : 'Ver')}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isAboutExpanded ? 'rotate-180 text-cyan-400' : 'text-slate-500'
                  }`}
                />
              </div>
            </button>

            {/* Conteúdo Expansível: Quem Somos e 4 Pilares de Qualidade */}
            {isAboutExpanded && (
              <div className="px-3.5 pb-4 pt-1 space-y-3 border-t border-slate-800/70 animate-in fade-in slide-in-from-top-1 duration-150">
                <div>
                  <h3 className="text-xs font-bold text-cyan-300 mb-1">
                    {t.settings.aboutWhoWeAreTitle}
                  </h3>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    {t.settings.aboutWhoWeAreText}
                  </p>
                </div>

                <div className="pt-1">
                  <h3 className="text-xs font-bold text-white mb-2">
                    {t.settings.aboutPillarsTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Pilar 1: Performance */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold">
                        <Gauge className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.settings.pillarSpeedTitle}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        {t.settings.pillarSpeedDesc}
                      </p>
                    </div>

                    {/* Pilar 2: Design */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
                        <Palette className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.settings.pillarDesignTitle}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        {t.settings.pillarDesignDesc}
                      </p>
                    </div>

                    {/* Pilar 3: Mobile First */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                        <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.settings.pillarMobileTitle}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        {t.settings.pillarMobileDesc}
                      </p>
                    </div>

                    {/* Pilar 4: Conversão */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                        <Target className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.settings.pillarConversionTitle}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal">
                        {t.settings.pillarConversionDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé Compacto com Versão e Direitos */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-slate-400">
            <span>{t.settings.copyright}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400">
                {t.settings.appVersion}: {t.settings.appVersionVal}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
