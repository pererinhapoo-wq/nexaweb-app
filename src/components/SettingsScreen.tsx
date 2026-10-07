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
  Smartphone,
  Gauge,
  Palette,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenLanguageModal?: () => void;
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenLanguageModal,
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
    }, 2200);
  };

  const handleLanguageChange = async (newLang: Language) => {
    const opt = languages.find((l) => l.code === newLang);
    if (!opt?.available) return;
    if (newLang === language) return;

    await setLanguage(newLang);
    showToast(t.settings.languageChangedToast || 'Idioma atualizado com sucesso!');
  };

  const handleAnimationChange = async (mode: AnimationMode) => {
    if (mode === animationMode) return;
    await setAnimationMode(mode);
  };

  return (
    <div className="space-y-5 pb-4 transition-colors duration-200 overflow-x-hidden">
      {/* Toast flutuante de confirmação */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <Check className="w-3.5 h-3.5 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho da Tela: Estrutura Solicitada com Botão Voltar ← */}
      <header className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] -ml-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
              aria-label="←"
              title="←"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase truncate">
              Configurações
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 truncate">
              Preferências e informações da NexaWeb.
            </p>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SEÇÃO 1: IDIOMA
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            Idioma
          </h2>
        </div>

        <p className="text-[11px] text-slate-400">
          Selecione o idioma de exibição do aplicativo:
        </p>

        {/* Lista de Idiomas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {languages.map((item: LanguageOption) => {
            const isSelected = language === item.code;
            const isAvailable = item.available;

            if (!isAvailable) {
              // Idiomas em breve: NÃO parecem selecionáveis
              return (
                <div
                  key={item.code}
                  aria-disabled="true"
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-60 cursor-not-allowed select-none min-h-[46px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0 grayscale" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <span className="text-xs font-medium text-slate-400 truncate">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                    Em breve
                  </span>
                </div>
              );
            }

            // Idiomas disponíveis: funcionais com seleção clara
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleLanguageChange(item.code)}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 min-h-[46px] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-indigo-600/20 border-cyan-500/80 text-white shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0" role="img" aria-label={item.name}>
                    {item.flag}
                  </span>
                  <div className="truncate">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                      {item.name}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 2: ANIMAÇÕES
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            Animações
          </h2>
        </div>

        <p className="text-[11px] text-slate-400">
          Controle as transições e efeitos de movimento de tela:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Opção 1: Ativadas (Recomendado) */}
          <button
            type="button"
            onClick={() => handleAnimationChange('enabled')}
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[50px] active:scale-[0.98] ${
              animationMode === 'enabled'
                ? 'bg-indigo-600/20 border-cyan-500/80 text-white shadow-sm ring-1 ring-cyan-500/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
            }`}
            aria-pressed={animationMode === 'enabled'}
          >
            <div>
              <p className={`text-xs font-bold ${animationMode === 'enabled' ? 'text-cyan-200' : 'text-white'}`}>
                Ativadas
              </p>
              <p className="text-[10px] text-indigo-400 font-medium">
                Recomendado
              </p>
            </div>

            {animationMode === 'enabled' && (
              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Opção 2: Reduzidas (Acessibilidade) */}
          <button
            type="button"
            onClick={() => handleAnimationChange('reduced')}
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 min-h-[50px] active:scale-[0.98] ${
              animationMode === 'reduced'
                ? 'bg-indigo-600/20 border-cyan-500/80 text-white shadow-sm ring-1 ring-cyan-500/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
            }`}
            aria-pressed={animationMode === 'reduced'}
          >
            <div>
              <p className={`text-xs font-bold ${animationMode === 'reduced' ? 'text-cyan-200' : 'text-white'}`}>
                Reduzidas
              </p>
              <p className="text-[10px] text-slate-400">
                Acessibilidade
              </p>
            </div>

            {animationMode === 'reduced' && (
              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
          {animationMode === 'reduced'
            ? 'Modo acessível ativo: transições imediatas sem movimentos desnecessários.'
            : 'Transições suaves ativadas para navegação visual rica.'}
        </p>
      </section>

      {/* =========================================================================
          SEÇÃO 3: NEXAWEB OFICIAL
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            NexaWeb Oficial
          </h2>
        </div>

        <p className="text-[11px] text-slate-400">
          Canais de contato oficiais existentes:
        </p>

        <div className="space-y-2">
          {/* 1. Instagram clicável */}
          <a
            href="https://www.instagram.com/nexaw1/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shrink-0">
                <div className="w-full h-full bg-slate-950/50 rounded-[6px] flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">Instagram</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  @nexaw1
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>

          {/* 2. Email clicável */}
          <a
            href="mailto:nexaweeb@gmail.com"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">Email</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  nexaweeb@gmail.com
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>

          {/* 3. Site clicável (sem botão "Ver site") */}
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-colors group min-h-[48px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">Site</p>
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono truncate">
                  https://nexaweeb.vercel.app/
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SEÇÃO 4: SOBRE A NEXAWEB
          ========================================================================= */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-base" role="img" aria-hidden="true">🏢</span>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Sobre a NexaWeb
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            {t.settings.appVersionVal}
          </span>
        </div>

        {/* Quem Somos (texto oficial existente no app) */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
            Quem Somos
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {t.settings.aboutWhoWeAreText}
          </p>
        </div>

        {/* Pilares de Qualidade */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
            Pilares de Qualidade
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-0.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Performance Extrema</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-tight">
                Carregamento ultra-rápido otimizado para celulares.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-0.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Design Sob Medida</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-tight">
                Identidade visual moderna com máxima autoridade.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-0.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile First</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-tight">
                Experiência perfeita em qualquer smartphone ou tela.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-0.5">
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Foco em Conversão</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-tight">
                Gatilhos estratégicos para gerar novos clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé com Versão e Direitos */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-slate-500">
          <span>{t.settings.copyright}</span>
          <span className="font-mono text-slate-400">Versão: {t.settings.appVersionVal}</span>
        </div>
      </section>
    </div>
  );
};
