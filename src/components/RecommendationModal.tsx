import React, { useEffect } from 'react';
import { ProjectRecommendation } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  X,
  ExternalLink,
  Layers,
  Eye,
  Check,
  Briefcase,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  recommendation: ProjectRecommendation | null;
  onClose: () => void;
  onStartProject: (rec: ProjectRecommendation) => void;
  onExplorePlan: (planId: string) => void;
  onNavigateToPortfolio: () => void;
  onRedo: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  recommendation,
  onClose,
  onStartProject,
  onExplorePlan,
  onNavigateToPortfolio,
  onRedo,
}) => {
  const { t } = useTranslation();

  // Scroll lock e Android back button
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.history.pushState({ recommendationOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !recommendation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85dvh] sm:max-h-[85vh] flex flex-col overflow-hidden pb-3 safe-area-pb animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle discreto */}
        <div className="pt-2 pb-0.5 flex justify-center sm:hidden shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-sm shadow-indigo-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t.recommendation.badge}
              </span>
              <h2 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-snug mt-0.5">
                {t.recommendation.idealProject}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors -mr-0.5 active:scale-95"
            aria-label="Fechar"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content com Hierarquia Responsiva */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Subtítulo amigável */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.recommendation.subtitle}
          </p>

          {/* Resumo compacto de escolhas */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {t.recommendation.summaryTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                🎯 {recommendation.segmentLabel}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                💡 {recommendation.objectiveLabel}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-900/40 font-medium">
                🌐 {recommendation.websiteLanguageLabel}
              </span>
            </div>
          </div>

          {/* 1. Card do Plano Recomendado com 'Por que recomendamos este plano?' */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/40 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                {t.recommendation.recommendedPlanTitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NexaWeb
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-black text-white">
                {recommendation.planName}
              </h3>
              <span className="text-xs text-slate-300 font-medium truncate">
                • {recommendation.planTagline}
              </span>
            </div>

            {/* Motivos inteligentes: "Por que recomendamos este plano?" */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.recommendation.whyRecommendedTitle}</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {recommendation.reasonsList.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos-chave */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300 block">
                {t.recommendation.includedFeaturesTitle}
              </span>
              {recommendation.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Botão de ação inteligente: Conhecer este plano */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onExplorePlan(recommendation.planId)}
                className="min-h-[44px] w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{t.recommendation.exploreServicesBtn}</span>
              </button>
            </div>
          </div>

          {/* 2. Outra opção que pode combinar com você (Alternativa Inteligente) */}
          {recommendation.alternativePlan && (
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/90 p-3.5 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                {t.recommendation.alternativePlanTitle}
              </span>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {recommendation.alternativePlan.nome}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {recommendation.alternativePlan.motivo}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExplorePlan(recommendation.alternativePlan!.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>Ver</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* 3. Projetos que combinam com sua necessidade */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.recommendation.relatedProjectsTitle}</span>
              </div>
              <button
                type="button"
                onClick={onNavigateToPortfolio}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {t.recommendation.viewSimilarProjectsBtn}
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendation.matchedProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm"
                >
                  <div className={`p-3 bg-gradient-to-r ${project.corDestaque} text-white flex items-center justify-between`}>
                    <div className="min-w-0 pr-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider opacity-85 block">
                        Demonstração
                      </span>
                      <h4 className="text-sm font-bold truncate mt-0.5">
                        {project.titulo}
                      </h4>
                    </div>
                    <a
                      href={project.linkDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors shrink-0"
                      title={t.portfolio.openDirect}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {project.descricaoCurta}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={project.linkDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.recommendation.viewDemoBtn}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs com Ações Claras */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/95 space-y-2.5 shrink-0">
          {/* CTA Principal: Iniciar meu projeto */}
          <button
            type="button"
            onClick={() => onStartProject(recommendation)}
            className="min-h-[46px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/60 transition-all active:scale-[0.98]"
          >
            <span>{t.recommendation.startProjectBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* CTA Secundário: Continuar no site oficial */}
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all active:scale-[0.98]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{t.recommendation.continueOnSiteBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Ações auxiliares */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={onRedo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.recommendation.redoQuestionsBtn}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {t.recommendation.exploreFreelyBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
