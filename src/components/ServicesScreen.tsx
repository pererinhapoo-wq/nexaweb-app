import React from 'react';
import { ViewTab } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import { Check, Sparkles, ArrowRight, Shield, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ServicesScreenProps {
  onSelectPlan: (planId: string) => void;
  onNavigate: (tab: ViewTab) => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onSelectPlan,
  onNavigate,
  onSelectProjectForBriefing,
}) => {
  const { language, t } = useTranslation();
  const plans = getNexawebPlans(language);
  const allProjects = getPortfolioProjects(language);

  const getThemeStyles = (planId: string) => {
    switch (planId) {
      case 'essencial':
        return {
          cardBorder: 'border-blue-500/35 hover:border-blue-500/60',
          badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          priceColor: 'text-blue-400',
          iconColor: 'text-blue-400',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40',
        };
      case 'profissional':
        return {
          cardBorder: 'border-amber-500/50 hover:border-amber-500/80 ring-1 ring-amber-500/30',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          priceColor: 'text-amber-400',
          iconColor: 'text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black shadow-amber-950/40',
        };
      case 'personalizado':
        return {
          cardBorder: 'border-purple-500/35 hover:border-purple-500/60',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          priceColor: 'text-purple-300',
          iconColor: 'text-purple-400',
          btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40',
        };
      case 'premium':
      default:
        return {
          cardBorder: 'border-amber-400/40 hover:border-amber-400/70',
          badgeBg: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
          priceColor: 'text-amber-300',
          iconColor: 'text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black shadow-amber-950/40',
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {t.services.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Oficiais NexaWeb
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {t.services.subtitle}
        </p>
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {plans.map((plan) => {
          const theme = getThemeStyles(plan.id);

          // Projetos reais relacionados a este plano
          const relatedProjects = (plan.projetosRelacionados || [])
            .map((pId) => allProjects.find((proj) => proj.id === pId))
            .filter(Boolean);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-slate-900 border ${theme.cardBorder} p-5 transition-all duration-150 shadow-xl`}
            >
              {/* Highlight badge para o Profissional */}
              {plan.destaque && (
                <div className="absolute -top-3 right-4 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-950">
                  <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
                  <span>Mais Escolhido</span>
                </div>
              )}

              {/* Cabeçalho do Plano com Preço e Prazo */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white tracking-tight">
                      {plan.nome}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badgeBg}`}
                    >
                      {plan.id}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    {plan.tagline}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-base sm:text-lg font-black font-mono ${theme.priceColor}`}>
                    {plan.preco}
                  </div>
                  {plan.prazo && (
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{plan.prazo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                {plan.descricao}
              </p>

              {/* Lista de Recursos Inclusos */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  O que está incluso:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.recursos.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className={`w-3 h-3 ${theme.iconColor}`} />
                      </div>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. PROJETOS RELACIONADOS AO PLANO */}
              {relatedProjects.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    Demonstrações reais deste plano:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {relatedProjects.map((relProj) => (
                      <div
                        key={relProj!.id}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {relProj!.titulo}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {relProj!.segmentoAlvo}
                          </span>
                        </div>

                        <a
                          href={relProj!.linkDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-cyan-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-colors shrink-0"
                          title="Abrir site de demonstração"
                        >
                          <span>Ver site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de Solicitação do Plano */}
              <div className="mt-5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`min-h-[46px] w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] ${theme.btnBg}`}
                >
                  <span>Solicitar Plano {plan.nome}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Caixa de Garantia & Dúvidas */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>{t.services.questionsTitle}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.services.questionsDesc}
        </p>
      </div>
    </div>
  );
};
