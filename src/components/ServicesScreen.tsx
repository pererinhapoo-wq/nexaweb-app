import React, { useState } from 'react';
import { ViewTab, PortfolioProject } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ServicesScreenProps {
  onSelectPlan: (planId: string) => void;
  onNavigate: (tab: ViewTab) => void;
  onBack?: () => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
  onSelectProject?: (project: PortfolioProject) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onSelectPlan,
  onNavigate,
  onBack,
  onSelectProject,
}) => {
  const { language } = useTranslation();
  const plans = getNexawebPlans(language);
  const allProjects = getPortfolioProjects(language);

  // Controle local dos acordeões "Ver o que está incluído" por plano
  // Não recarrega a página, não altera scroll e mantém posição no mobile
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const getThemeStyles = (planId: string) => {
    switch (planId) {
      case 'essencial':
        return {
          cardBorder: 'border-blue-500/30 dark:border-blue-500/40 hover:border-blue-500/60',
          badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30',
          priceColor: 'text-blue-600 dark:text-blue-400',
          iconColor: 'text-blue-500 dark:text-blue-400',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-blue-950/30',
        };
      case 'profissional':
        return {
          cardBorder: 'border-amber-500/40 dark:border-amber-500/50 hover:border-amber-500/80',
          badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40',
          priceColor: 'text-amber-600 dark:text-amber-400',
          iconColor: 'text-amber-500 dark:text-amber-400',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-950/30',
        };
      case 'personalizado':
        return {
          cardBorder: 'border-purple-500/30 dark:border-purple-500/40 hover:border-purple-500/60',
          badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30',
          priceColor: 'text-purple-600 dark:text-purple-300',
          iconColor: 'text-purple-500 dark:text-purple-400',
          btnBg: 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-purple-950/30',
        };
      case 'premium':
      default:
        return {
          cardBorder: 'border-amber-400/40 dark:border-amber-400/60 hover:border-amber-400/80',
          badgeBg: 'bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30',
          priceColor: 'text-amber-600 dark:text-amber-300',
          iconColor: 'text-amber-500 dark:text-amber-400',
          btnBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-amber-950/30',
        };
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150 overflow-x-hidden">
      {/* Header Compacto */}
      <section className="pt-0.5">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Serviços & Planos
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          Conheça as opções oficiais da NexaWeb e inicie a estruturação do seu projeto profissional.
        </p>
      </section>

      {/* Cards dos 4 Planos Oficiais */}
      <div className="space-y-3.5">
        {plans.map((plan) => {
          const theme = getThemeStyles(plan.id);
          const isExpanded = Boolean(expandedPlans[plan.id]);

          // Projetos reais relacionados a este plano
          const relatedProjects = (plan.projetosRelacionados || [])
            .map((pId) => allProjects.find((proj) => proj.id === pId))
            .filter(Boolean);

          // Mostra os primeiros 3 recursos no modo compacto e todos no modo expandido
          const visibleFeatures = isExpanded ? plan.recursos : plan.recursos.slice(0, 3);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-slate-900 border ${theme.cardBorder} p-4 sm:p-5 transition-all duration-150 shadow-md overflow-hidden`}
            >
              {/* Cabeçalho do Card: Nome e Tag */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {plan.nome}
                  </h2>
                  <span
                    className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badgeBg}`}
                  >
                    {plan.id}
                  </span>
                </div>
              </div>

              {/* Preço e Prazo em destaque */}
              <div className="flex items-baseline justify-between gap-2 my-2 py-1.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className={`text-base sm:text-lg font-black font-mono ${theme.priceColor}`}>
                  {plan.preco}
                </span>
                {plan.prazo && (
                  <span className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{plan.prazo}</span>
                  </span>
                )}
              </div>

              {/* Tagline Oficial */}
              <p className="text-xs font-semibold text-slate-200 mt-1">
                “{plan.tagline}”
              </p>

              {/* Posicionamento do Plano (Para quem serve) */}
              <div className="mt-1.5 py-1 px-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                <p className="text-[11px] text-slate-300 leading-snug">
                  <span className="text-slate-400 font-medium">Ideal: </span>
                  <span className="font-semibold text-white">{plan.descricao}</span>
                </p>
              </div>

              {/* Principais Recursos Inclusos */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Principais características:
                </span>
                <div className="space-y-1.5">
                  {visibleFeatures.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className={`w-3 h-3 ${theme.iconColor}`} />
                      </div>
                      <span className="leading-snug break-words">{rec}</span>
                    </div>
                  ))}
                </div>

                {/* Ação: "Ver o que está incluído" (expande sem scroll jump e sem recarregar tela) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePlanExpanded(plan.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all py-1"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Ocultar detalhes' : 'Ver o que está incluído'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Demonstrações / Projetos reais deste plano (exibidos quando expandido) */}
              {isExpanded && relatedProjects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Demonstrações reais deste plano:
                  </span>
                  <div className="space-y-2">
                    {relatedProjects.map((relProj) => (
                      <div
                        key={relProj!.id}
                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1"
                      >
                        <div
                          className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
                          onClick={() => onSelectProject && onSelectProject(relProj!)}
                        >
                          <p className="text-xs font-bold text-white truncate hover:text-cyan-300 transition-colors">
                            {relProj!.titulo}
                          </p>
                          <span className="text-[10px] text-cyan-400 font-semibold truncate shrink-0">
                            {relProj!.categoria}
                          </span>
                        </div>

                        {/* URL real clicável */}
                        <div>
                          <a
                            href={relProj!.linkDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] break-all inline-flex items-center gap-1 transition-colors"
                          >
                            <span>{relProj!.linkDemo}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de Solicitação do Plano (CTA Existente) */}
              <div className="mt-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`min-h-[46px] w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] ${theme.btnBg}`}
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
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Dúvidas sobre qual plano escolher?</span>
        </div>
        <p className="text-[11.5px] text-slate-400 leading-relaxed">
          Nossa equipe analisa as necessidades do seu negócio para sugerir a melhor estrutura técnica e visual para o seu projeto.
        </p>
      </div>
    </div>
  );
};
