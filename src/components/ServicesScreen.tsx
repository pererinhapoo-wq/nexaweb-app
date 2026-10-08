import React, { useState, useMemo, useEffect } from 'react';
import { ViewTab, PortfolioProject } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import {
  getAdvancedFeaturesGroupedBySegment,
  getPlanAdvancedFeaturesLimit,
  AdvancedFeatureItem,
} from '../data/advancedFeaturesData';
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { BackButton } from './BackButton';
import { useTranslation } from '../contexts/LanguageContext';

interface ServicesScreenProps {
  onSelectPlan?: (planId: string) => void;
  onNavigate: (tab: ViewTab) => void;
  onBack?: () => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
  onSelectProject?: (project: PortfolioProject) => void;
  selectedPlan?: string;
  onContinueToBriefing?: (planId: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onSelectPlan,
  onNavigate,
  onBack,
  onSelectProject,
  selectedPlan,
  onContinueToBriefing,
}) => {
  const { language, t } = useTranslation();
  const plans = getNexawebPlans(language);
  const allProjects = getPortfolioProjects(language);

  // Plano ativo selecionado localmente (inicia null para que nenhum plano comece marcado automaticamente)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(selectedPlan || null);

  useEffect(() => {
    setSelectedPlanId(selectedPlan || null);
  }, [selectedPlan]);

  // Controle local dos acordeões "Ver o que está incluído" por plano
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  // Funcionalidades avançadas selecionadas na demonstração interativa
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featureLimitMessage, setFeatureLimitMessage] = useState<string | null>(null);

  // Limite oficial de funcionalidades avançadas do plano atualmente selecionado (0 / 3 / 5 / 8)
  const advancedFeaturesLimit = useMemo(() => {
    if (!selectedPlanId) return 0;
    return getPlanAdvancedFeaturesLimit(selectedPlanId);
  }, [selectedPlanId]);

  // Lista de funcionalidades para exploração do plano ativo
  const availableFeaturesGrouped = useMemo(() => {
    if (!selectedPlanId) return [];
    return getAdvancedFeaturesGroupedBySegment('geral', selectedPlanId);
  }, [selectedPlanId]);

  // Reseta seleção de funcionalidades ao trocar de plano se exceder o novo limite
  useEffect(() => {
    setFeatureLimitMessage(null);
    if (!selectedPlanId || advancedFeaturesLimit === 0) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures((prev) => prev.slice(0, advancedFeaturesLimit));
    }
  }, [selectedPlanId, advancedFeaturesLimit]);

  // Alternar seleção de funcionalidade avançada respeitando os limites oficiais 0/3/5/8
  const handleToggleFeature = (feat: AdvancedFeatureItem) => {
    if (!selectedPlanId) return;
    setFeatureLimitMessage(null);
    const isChecked = selectedFeatures.includes(feat.id);

    if (isChecked) {
      // Sempre permite desmarcar uma opção
      setSelectedFeatures((prev) => prev.filter((id) => id !== feat.id));
      return;
    }

    // Essencial tem limite 0
    if (advancedFeaturesLimit === 0) {
      setFeatureLimitMessage(
        'O Plano Essencial possui escopo fechado (0 funcionalidades avançadas). Para incluir funcionalidades avançadas, selecione o Plano Profissional (até 5), Personalizado (até 3) ou Premium (até 8).'
      );
      return;
    }

    // Bloqueia nova seleção ao atingir o limite
    if (selectedFeatures.length >= advancedFeaturesLimit) {
      const planObj = plans.find((p) => p.id === selectedPlanId);
      setFeatureLimitMessage(
        `Limite de ${advancedFeaturesLimit} funcionalidades avançadas atingido para o Plano ${planObj?.nome || selectedPlanId.toUpperCase()}. Desmarque uma opção para escolher outra.`
      );
      return;
    }

    setSelectedFeatures((prev) => [...prev, feat.id]);
  };

  // Posicionamento claro e oficial de cada plano (Regra 2)
  const getPlanPositioning = (planId: string) => {
    switch (planId) {
      case 'essencial':
        return {
          role: 'Porta de entrada',
          focus: 'Foco em começar profissionalmente',
          limitLabel: '0 avançadas (escopo fechado)',
          limit: 0,
        };
      case 'personalizado':
        return {
          role: 'Projeto sob medida',
          focus: 'Maior liberdade de escopo',
          limitLabel: 'Até 3 funcionalidades avançadas',
          limit: 3,
        };
      case 'profissional':
        return {
          role: 'Crescimento e presença',
          focus: 'Mais recursos e maior autoridade',
          limitLabel: 'Até 5 funcionalidades avançadas',
          limit: 5,
        };
      case 'premium':
      default:
        return {
          role: 'Experiência avançada',
          focus: 'Solução VIP e recursos sofisticados',
          limitLabel: 'Até 8 funcionalidades avançadas',
          limit: 8,
        };
    }
  };

  // Identidade de cores elegante e discreta (Regra 1)
  const getThemeStyles = (planId: string, isSelected: boolean) => {
    switch (planId) {
      case 'essencial':
        return {
          cardBorder: isSelected
            ? 'border-blue-500 ring-2 ring-blue-500/25 bg-slate-900/95'
            : 'border-slate-800/90 hover:border-blue-500/40 bg-slate-900',
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          priceColor: 'text-blue-400',
          iconColor: 'text-blue-400',
          accentBg: 'bg-blue-500',
          btnAction: 'bg-blue-600 hover:bg-blue-500 text-white',
        };
      case 'personalizado':
        return {
          cardBorder: isSelected
            ? 'border-purple-500 ring-2 ring-purple-500/25 bg-slate-900/95'
            : 'border-slate-800/90 hover:border-purple-500/40 bg-slate-900',
          badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          priceColor: 'text-purple-300',
          iconColor: 'text-purple-400',
          accentBg: 'bg-purple-500',
          btnAction: 'bg-purple-600 hover:bg-purple-500 text-white',
        };
      case 'profissional':
        return {
          cardBorder: isSelected
            ? 'border-amber-500 ring-2 ring-amber-500/25 bg-slate-900/95'
            : 'border-slate-800/90 hover:border-amber-500/40 bg-slate-900',
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          priceColor: 'text-amber-400',
          iconColor: 'text-amber-400',
          accentBg: 'bg-amber-500',
          btnAction: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950',
        };
      case 'premium':
      default:
        return {
          cardBorder: isSelected
            ? 'border-yellow-500 ring-2 ring-yellow-500/25 bg-slate-900/95'
            : 'border-slate-800/90 hover:border-yellow-500/40 bg-slate-900',
          badgeBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
          priceColor: 'text-yellow-400',
          iconColor: 'text-yellow-400',
          accentBg: 'bg-yellow-500',
          btnAction: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950',
        };
    }
  };

  // Ação de seleção do plano: atualiza o estado visual sem navegar automaticamente (Regra 4)
  const handleSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  // Ação explícita para iniciar o Briefing com o plano escolhido
  const handleContinue = () => {
    if (!selectedPlanId) return;
    if (onContinueToBriefing) {
      onContinueToBriefing(selectedPlanId);
    } else {
      onNavigate('project');
    }
  };

  const activePlanObj = selectedPlanId
    ? plans.find((p) => p.id === selectedPlanId) || null
    : null;
  const activePlanTheme = selectedPlanId ? getThemeStyles(selectedPlanId, true) : null;

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-150 overflow-x-hidden">
      {/* Header Compacto */}
      <section className="pt-0">
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {t.services.title}
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed truncate">
            {t.services.subtitle}
          </p>
        </div>
      </section>

      {/* Cards dos 4 Planos Oficiais */}
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const theme = getThemeStyles(plan.id, isSelected);
          const positioning = getPlanPositioning(plan.id);
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
              onClick={() => handleSelect(plan.id)}
              className={`relative rounded-xl border ${theme.cardBorder} p-3 sm:p-3.5 transition-all duration-150 shadow-sm overflow-hidden cursor-pointer active:scale-[0.99]`}
            >
              {/* Topo do Card: Nome, Badges de Limite e Estado de Seleção */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                    {plan.nome}
                  </h2>
                  <span
                    className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${theme.badgeBg}`}
                  >
                    {positioning.role}
                  </span>
                </div>

                {/* Indicador de Seleção Visual Limpo */}
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-full shrink-0 animate-in fade-in duration-100">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>{language === 'en' ? 'Selected' : 'Selecionado'}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium shrink-0">
                    {language === 'en' ? 'Tap to select' : 'Toque para selecionar'}
                  </span>
                )}
              </div>

              {/* Preço e Prazo em Destaque */}
              <div className="flex items-baseline justify-between gap-2 my-1.5 py-1.5 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className={`text-base sm:text-lg font-black font-mono ${theme.priceColor}`}>
                  {plan.preco}
                </span>
                {plan.prazo && (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{plan.prazo}</span>
                  </span>
                )}
              </div>

              {/* Posicionamento do Plano (Sem slogans inventados) */}
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {plan.descricao}
              </p>

              {/* Badge de Limite Oficial de Funcionalidades Avançadas */}
              <div className="mt-2 py-1 px-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400 font-medium">{language === 'en' ? 'Scope:' : 'Escopo:'}</span>
                <span className="font-semibold text-slate-200">{positioning.limitLabel}</span>
              </div>

              {/* Principais Recursos Inclusos (Resumo com 3 itens) */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.services.whatsIncluded || (language === 'en' ? "What's included:" : 'Principais características:')}
                </span>
                <div className="space-y-1">
                  {visibleFeatures.map((rec, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className={`w-2.5 h-2.5 ${theme.iconColor}`} />
                      </div>
                      <span className="leading-snug break-words">{rec}</span>
                    </div>
                  ))}
                </div>

                {/* Acordeão "Ver o que está incluído" (Sem recarregar a tela e sem scroll jump) */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePlanExpanded(plan.id);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all py-1"
                    aria-expanded={isExpanded}
                  >
                    <span>
                      {isExpanded
                        ? (language === 'en' ? 'Hide details' : 'Ocultar detalhes')
                        : (language === 'en' ? "View what's included" : 'Ver o que está incluído')}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Demonstrações Reais Deste Plano (Exibidas no acordeão) */}
              {isExpanded && relatedProjects.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5 animate-in fade-in duration-150">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {language === 'en' ? 'Live demos for this plan:' : 'Demonstrações reais deste plano:'}
                  </span>
                  <div className="space-y-1.5">
                    {relatedProjects.map((relProj) => (
                      <div
                        key={relProj!.id}
                        className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1"
                      >
                        <div
                          className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject && onSelectProject(relProj!);
                          }}
                        >
                          <p className="text-xs font-bold text-white truncate hover:text-cyan-300 transition-colors">
                            {relProj!.titulo}
                          </p>
                          <span className="text-[10px] text-cyan-400 font-semibold truncate shrink-0">
                            {relProj!.categoria}
                          </span>
                        </div>

                        <div>
                          <a
                            href={relProj!.linkDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[10.5px] break-all inline-flex items-center gap-1 transition-colors"
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

              {/* Botão no Card: Selecionar ou Indicar Selecionado */}
              <div className="mt-3 pt-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(plan.id);
                  }}
                  className={`min-h-[40px] w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.985] ${
                    isSelected
                      ? 'bg-slate-800 border border-cyan-500/40 text-cyan-300 shadow-sm'
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />
                      <span>{language === 'en' ? 'Plan Selected' : 'Plano Selecionado'}</span>
                    </>
                  ) : (
                    <span>{language === 'en' ? `Select ${plan.nome} Plan` : `Selecionar Plano ${plan.nome}`}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          SEÇÃO DE FUNCIONALIDADES AVANÇADAS & LIMITES OFICIAIS (0 / 3 / 5 / 8)
          ========================================================================= */}
      {activePlanObj && activePlanTheme ? (
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-sm animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-slate-800/80">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{language === 'en' ? 'Advanced Features' : 'Funcionalidades Avançadas'}</span>
              </h3>
              <span className="text-[10.5px] text-slate-400 block mt-0.5">
                {language === 'en' ? `Scope of ${activePlanObj.nome} Plan` : `Escopo do Plano ${activePlanObj.nome}`}
              </span>
            </div>

            {/* Contador Oficial em Tempo Real (Regra 5) */}
            <div className="self-start sm:self-auto">
              <div
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                  advancedFeaturesLimit === 0
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : selectedFeatures.length >= advancedFeaturesLimit
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-cyan-400 border-slate-800'
                }`}
              >
                <span>
                  {advancedFeaturesLimit === 0
                    ? (language === 'en' ? '0 of 0 selected (Fixed Scope)' : '0 de 0 selecionadas (Escopo Fechado)')
                    : (language === 'en' ? `${selectedFeatures.length} of ${advancedFeaturesLimit} selected` : `${selectedFeatures.length} de ${advancedFeaturesLimit} selecionadas`)}
                </span>
              </div>
            </div>
          </div>

          {/* Aviso do Plano Essencial (Limite 0) */}
          {advancedFeaturesLimit === 0 && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-[11px] text-blue-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
                <span>{language === 'en' ? 'Essential Plan · Fixed Scope (0 advanced features)' : 'Plano Essencial · Escopo Fechado (0 funcionalidades avançadas)'}</span>
              </p>
              <p className="text-slate-300 leading-relaxed">
                {language === 'en'
                  ? 'The Essential Plan includes the complete business structure, essential pages, WhatsApp, and basic SEO. To select additional features, choose the Professional (up to 5), Custom (up to 3), or Premium Plan (up to 8).'
                  : 'O Plano Essencial já inclui a estrutura completa do negócio, páginas essenciais, WhatsApp e SEO básico. Para selecionar funcionalidades adicionais, escolha o Plano Profissional (até 5), Personalizado (até 3) ou Premium (até 8).'}
              </p>
            </div>
          )}

          {/* Mensagem Discreta de Limite Atingido (Regra 5) */}
          {featureLimitMessage && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="leading-tight">{featureLimitMessage}</span>
            </div>
          )}

          {/* Grade de Funcionalidades Disponíveis */}
          {advancedFeaturesLimit > 0 && (
            <div className="space-y-2 pt-1">
              {availableFeaturesGrouped.slice(0, 3).map(({ category, items }) => (
                <div key={category} className="space-y-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                    {category}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((feat) => {
                      const isChecked = selectedFeatures.includes(feat.id);
                      const isLimitReached =
                        !isChecked && selectedFeatures.length >= advancedFeaturesLimit;

                      return (
                        <div
                          key={feat.id}
                          onClick={() => handleToggleFeature(feat)}
                          className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex flex-col justify-between ${
                            isChecked
                              ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30 cursor-pointer'
                              : isLimitReached
                              ? 'bg-slate-950/40 border-slate-850 opacity-50 cursor-not-allowed text-slate-400'
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300 cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5 mb-0.5">
                              <span className="text-xs font-bold leading-snug">
                                {feat.nome}
                              </span>
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isChecked
                                    ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                                    : 'border-slate-700'
                                }`}
                              >
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </span>
                            </div>

                            <p className="text-[10.5px] text-slate-400 leading-snug">
                              {feat.descricao}
                            </p>
                          </div>

                          {/* Tag Oficial de Recurso Complexo (Regra 6) */}
                          {feat.isComplex && (
                            <div className="pt-1.5 mt-1 border-t border-slate-800/50 flex items-center justify-between gap-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                                <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                <span>{language === 'en' ? 'Advanced / evaluation' : 'Avançado / avaliação'}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão Explícito de Avanço para o Briefing (Regra 4) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className={`min-h-[44px] w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.985] ${activePlanTheme.btnAction}`}
            >
              <span>{language === 'en' ? `Start Briefing with ${activePlanObj.nome} Plan` : `Iniciar Briefing com Plano ${activePlanObj.nome}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-center space-y-1.5 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-bold text-xs sm:text-sm">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{language === 'en' ? 'Select a plan above' : 'Toque em um dos planos acima'}</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {language === 'en'
              ? 'Choose Essential, Professional, Custom, or Premium to see scope details and start the briefing.'
              : 'Selecione Essencial, Profissional, Personalizado ou Premium para conferir o escopo e iniciar o briefing.'}
          </p>
        </section>
      )}

      {/* Caixa de Garantia & Dúvidas NexaWeb */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 sm:p-4 space-y-1 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{t.services.questionsTitle || (language === 'en' ? 'Need help choosing the right plan?' : 'Dúvidas sobre qual plano escolher?')}</span>
        </div>
        <p className="text-[11.5px] text-slate-400 leading-relaxed">
          {t.services.questionsDesc || (language === 'en' ? 'Our team analyzes your business goals to guide the ideal technical and visual structure.' : 'Nossa equipe analisa as necessidades do seu negócio para sugerir a melhor estrutura técnica e visual para o seu projeto.')}
        </p>
      </div>
    </div>
  );
};
