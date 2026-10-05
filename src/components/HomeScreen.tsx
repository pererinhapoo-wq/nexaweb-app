import React from 'react';
import { ViewTab, ProjectRecommendation } from '../types';
import {
  Layers,
  Briefcase,
  Sparkles,
  ArrowRight,
  Zap,
  Smartphone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HomeScreenProps {
  onNavigate: (tab: ViewTab) => void;
  recommendation: ProjectRecommendation | null;
  onOpenRecommendation: () => void;
  onOpenOnboarding: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  recommendation,
  onOpenRecommendation,
  onOpenOnboarding,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 p-5 shadow-xl shadow-indigo-950/30">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {t.home.badge}
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t.home.title}
          </h1>
          <p className="text-base font-semibold text-cyan-400 mt-0.5">
            {t.home.slogan}
          </p>
          <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
            {t.home.description}
          </p>

          {/* Destaques rápidos */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-300 font-semibold block">{t.home.speedTitle}</span>
              <span className="text-[10px] text-slate-500 block truncate">{t.home.speedSubtitle}</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
              <Smartphone className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-300 font-semibold block">{t.home.mobileTitle}</span>
              <span className="text-[10px] text-slate-500 block truncate">{t.home.mobileSubtitle}</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
              <MessageCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-300 font-semibold block">{t.home.conversionTitle}</span>
              <span className="text-[10px] text-slate-500 block truncate">{t.home.conversionSubtitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Recomendação Personalizada (quando disponível) */}
      {recommendation && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/35 p-4 shadow-md space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {t.home.recommendationBannerTitle}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {recommendation.planName} • {recommendation.segmentLabel}
                </p>
              </div>
            </div>

            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              Personalizado
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenRecommendation}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-950/50 hover:from-indigo-500 hover:to-cyan-400 transition-all"
            >
              <span>{t.home.viewRecommendationBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenOnboarding}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              title={t.home.redoQuestionsBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.home.redoQuestionsBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3 Botões de Ação Principais da NexaWeb */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          {t.home.browseTitle}
        </h2>

        {/* 1. Conhecer os Serviços */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="min-h-[52px] w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all duration-150 shadow-sm active:scale-[0.985]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                  {t.home.servicesCardTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.home.servicesCardBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.home.servicesCardDesc}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 2. Ver o Portfólio */}
        <button
          type="button"
          onClick={() => onNavigate('portfolio')}
          className="min-h-[52px] w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all duration-150 shadow-sm active:scale-[0.985]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  {t.home.portfolioCardTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {t.home.portfolioCardBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.home.portfolioCardDesc}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 3. Iniciar um Projeto */}
        <button
          type="button"
          onClick={() => onNavigate('project')}
          className="min-h-[52px] w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 hover:from-indigo-900/50 hover:to-slate-850 border border-indigo-500/40 hover:border-indigo-400 transition-all duration-150 shadow-lg shadow-indigo-950/20 active:scale-[0.985]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center group-hover:scale-105 shadow-md shadow-indigo-600/30 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  {t.home.projectCardTitle}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {t.home.projectCardBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.home.projectCardDesc}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Informações da NexaWeb Card */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.home.qualityTitle}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.home.qualityDesc}
        </p>
        <div className="pt-1 flex items-center justify-between">
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{t.home.accessSite}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
