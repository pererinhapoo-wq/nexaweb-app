import React, { useState } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language, ThemeMode, AnimationMode } from '../types';
import {
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Laptop,
  Zap,
  Sparkles,
  Instagram,
  Mail,
  ExternalLink,
  Info,
  Check,
  X,
  ShieldCheck,
  Smartphone,
  Gauge,
  Palette,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenLanguageModal?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onOpenLanguageModal }) => {
  const { language, setLanguage, t, languages, currentLanguageOption } = useTranslation();
  const { themeMode, resolvedTheme, setThemeMode, animationMode, setAnimationMode } = useTheme();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleLanguageChange = async (newLang: Language) => {
    const opt = languages.find((l) => l.code === newLang);
    if (!opt?.available) return;
    if (newLang === language) return;

    await setLanguage(newLang);
    showToast(t.settings.languageChangedToast || 'Idioma atualizado com sucesso!');
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const handleAnimationChange = async (mode: AnimationMode) => {
    await setAnimationMode(mode);
  };

  return (
    <div className="space-y-6 pb-24 transition-colors duration-200">
      {/* Toast de confirmação suave */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header da Tela de Configurações */}
      <section className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2.5">
            <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.settings.badge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.settings.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {t.settings.subtitle}
          </p>
        </div>
      </section>

      {/* SEÇÃO 1: PREFERÊNCIAS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {t.settings.preferencesSection}
          </span>
          <div className="h-px flex-1 bg-slate-800/80" />
        </div>

        {/* 1.1 Idioma do Aplicativo */}
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {t.settings.appLanguage}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {t.settings.appLanguageDesc}
                </p>
              </div>
            </div>

            {/* Botão para abrir modal completo caso o usuário queira ver todos com detalhes */}
            {onOpenLanguageModal && (
              <button
                type="button"
                onClick={onOpenLanguageModal}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                <span>{t.languageModal.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid de idiomas ativos diretamente na tela */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {languages.map((item: LanguageOption) => {
              const isSelected = language === item.code;
              const isAvailable = item.available;

              return (
                <button
                  key={item.code}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleLanguageChange(item.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 min-h-[48px] ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/80 text-white shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                      : isAvailable
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.98]'
                      : 'bg-slate-950/30 border-slate-800/40 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.nativeName}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {!isAvailable && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400 border border-slate-700">
                        {t.onboarding.comingSoonBadge}
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 italic pt-1">
            {t.project.langNote}
          </p>
        </div>

        {/* 1.2 Tema do Aplicativo (Escuro, Claro, Automático) */}
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Palette className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {t.settings.theme}
              </h2>
              <p className="text-[11px] text-slate-400">
                {t.settings.themeDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Tema Escuro (Padrão Oficial) */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 min-h-[58px] ${
                themeMode === 'dark'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.97]'
              }`}
            >
              <Moon className={`w-5 h-5 mb-1 ${themeMode === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold leading-tight">
                {t.settings.themeDark}
              </span>
              <span className="text-[9px] text-indigo-400/90 font-mono mt-0.5">
                {t.settings.themeDarkBadge}
              </span>
            </button>

            {/* Tema Claro */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 min-h-[58px] ${
                themeMode === 'light'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.97]'
              }`}
            >
              <Sun className={`w-5 h-5 mb-1 ${themeMode === 'light' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold leading-tight">
                {t.settings.themeLight}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">
                Light
              </span>
            </button>

            {/* Tema Automático */}
            <button
              type="button"
              onClick={() => handleThemeChange('auto')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 min-h-[58px] ${
                themeMode === 'auto'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.97]'
              }`}
            >
              <Laptop className={`w-5 h-5 mb-1 ${themeMode === 'auto' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold leading-tight">
                {t.settings.themeAuto}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">
                Auto
              </span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            {themeMode === 'auto'
              ? `${t.settings.themeAutoDesc} (${resolvedTheme === 'dark' ? t.settings.themeDark : t.settings.themeLight}).`
              : t.settings.themeDesc}
          </p>
        </div>

        {/* 1.3 Animações (Ativadas, Reduzidas) */}
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {t.settings.animations}
              </h2>
              <p className="text-[11px] text-slate-400">
                {t.settings.animationsDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleAnimationChange('enabled')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 min-h-[48px] ${
                animationMode === 'enabled'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.98]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-white">
                  {t.settings.animationsEnabled}
                </p>
                <p className="text-[10px] text-indigo-400 font-medium">
                  {t.settings.animationsEnabledBadge}
                </p>
              </div>
              {animationMode === 'enabled' && (
                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleAnimationChange('reduced')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 min-h-[48px] ${
                animationMode === 'reduced'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.98]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-white">
                  {t.settings.animationsReduced}
                </p>
                <p className="text-[10px] text-slate-400">
                  Acessibilidade
                </p>
              </div>
              {animationMode === 'reduced' && (
                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            {t.settings.animationsReducedDesc}
          </p>
        </div>
      </section>

      {/* SEÇÃO 2: NEXAWEB OFICIAL */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {t.settings.nexawebSection}
          </span>
          <div className="h-px flex-1 bg-slate-800/80" />
        </div>

        <div className="rounded-2xl divide-y divide-slate-800/80 bg-slate-900/80 border border-slate-800 shadow-md overflow-hidden">
          {/* 2.1 Instagram */}
          <a
            href="https://instagram.com/nexaweb_oficial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-slate-850/80 transition-colors group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shadow-sm shrink-0">
                <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {t.settings.instagram}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t.settings.instagramHandle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <span className="hidden sm:inline">{t.settings.openLink}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          </a>

          {/* 2.2 E-mail de Contato */}
          <a
            href="mailto:contato@nexaweb.com.br"
            className="flex items-center justify-between p-4 hover:bg-slate-850/80 transition-colors group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {t.settings.email}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t.settings.emailAddress}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
              <span className="hidden sm:inline">{t.settings.sendEmail}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </a>

          {/* 2.3 Site da NexaWeb */}
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-slate-850/80 transition-colors group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {t.settings.website}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {t.settings.websiteUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <span className="hidden sm:inline">{t.settings.openLink}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          </a>

          {/* 2.4 Sobre a NexaWeb */}
          <button
            type="button"
            onClick={() => setIsAboutModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-850/80 transition-colors text-left group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Info className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {t.settings.aboutNexaWeb}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t.settings.aboutNexaWebDesc}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </section>

      {/* Footer / Copyright / Versão */}
      <footer className="pt-2 pb-6 text-center space-y-1">
        <p className="text-xs font-semibold text-slate-400">
          NexaWeb App · <span className="font-mono text-indigo-400">{t.settings.appVersionVal}</span>
        </p>
        <p className="text-[10px] text-slate-500">
          {t.settings.copyright}
        </p>
      </footer>

      {/* MODAL: SOBRE A NEXAWEB */}
      {isAboutModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAboutModalOpen(false)}
        >
          <div
            className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto no-scrollbar space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t.settings.aboutModalTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {t.settings.aboutModalSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAboutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label={t.settings.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quem Somos */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {t.settings.aboutWhoWeAreTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {t.settings.aboutWhoWeAreText}
              </p>
            </div>

            {/* Pilares de Qualidade */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {t.settings.aboutPillarsTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.settings.pillarSpeedTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.settings.pillarSpeedDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.settings.pillarDesignTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.settings.pillarDesignDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.settings.pillarMobileTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.settings.pillarMobileDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.settings.pillarConversionTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.settings.pillarConversionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Versão e Contato Rápido */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">
                  {t.settings.appVersion}
                </p>
                <p className="text-[11px] text-indigo-300 font-mono">
                  {t.settings.appVersionVal}
                </p>
              </div>
              <a
                href="https://nexaweeb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>{t.settings.website}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {t.settings.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
