import React, { useState, useEffect, useMemo } from 'react';
import { ViewTab, WebsiteLanguage } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import {
  OFFICIAL_EXTRA_FEATURES,
  OFFICIAL_PLANS_COMMERCIAL,
  ExtraFeature,
} from '../data/commercialRules';
import {
  calculateBudget,
  getSuggestedFeaturesForSegment,
} from '../utils/pricingEngine';
import {
  createBriefing,
  uploadBriefingImages,
} from '../utils/briefingService';
import { ImageUploadField } from './ImageUploadField';
import {
  Sparkles,
  Check,
  Copy,
  Layout,
  Store,
  Lightbulb,
  Mail,
  Instagram,
  Globe,
  Globe2,
  DollarSign,
  AlertCircle,
  Plus,
  Zap,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ProjectScreenProps {
  initialPlan?: string;
  initialModel?: string;
  initialWebsiteLanguage?: WebsiteLanguage;
  onNavigate: (tab: ViewTab) => void;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  initialPlan,
  initialModel,
  initialWebsiteLanguage,
  onNavigate,
}) => {
  const { language, t } = useTranslation();

  const plans = getNexawebPlans(language);
  const portfolioProjects = getPortfolioProjects(language);

  // Mapeamento de modelo do portfólio para segmento correspondente
  const getSegmentByModelTitle = (modelTitle: string): string => {
    const proj = portfolioProjects.find((p) => p.titulo === modelTitle);
    if (!proj) return 'services';
    if (proj.id.includes('barbearia')) return 'barber';
    if (proj.id.includes('salao')) return 'beauty';
    if (proj.id.includes('academia')) return 'fitness';
    if (proj.id.includes('imobiliaria')) return 'realEstate';
    if (proj.id.includes('clinica')) return 'clinic';
    if (proj.id.includes('restaurante')) return 'food';
    return 'services';
  };

  const [startType, setStartType] = useState<'modelo' | 'segmento' | 'propria'>('modelo');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || portfolioProjects[0]?.titulo || '');
  const [selectedSegment, setSelectedSegment] = useState<string>(() => {
    if (initialModel) return getSegmentByModelTitle(initialModel);
    return 'services';
  });
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'profissional');
  const [siteLanguage, setSiteLanguage] = useState<WebsiteLanguage>(
    initialWebsiteLanguage || (language === 'pt-PT' ? 'pt-PT' : language === 'en' ? 'en' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'pt-BR')
  );

  // Recursos extras selecionados
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Informações do negócio & Contato
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Imagens anexadas (Regra: máx 6 imagens, máx 10 MB cada)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Estados de envio
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    projectId: string;
    message: string;
    isOfflineFallback?: boolean;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Sincroniza props se alteradas externamente
  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    if (initialModel) {
      setStartType('modelo');
      setSelectedModel(initialModel);
      setSelectedSegment(getSegmentByModelTitle(initialModel));
    }
  }, [initialModel]);

  useEffect(() => {
    if (initialWebsiteLanguage) {
      setSiteLanguage(initialWebsiteLanguage);
    }
  }, [initialWebsiteLanguage]);

  const segmentsOptions: { id: string; label: string }[] = [
    { id: 'beauty', label: t.segments.beauty },
    { id: 'barber', label: t.segments.barber },
    { id: 'fitness', label: t.segments.fitness },
    { id: 'realEstate', label: t.segments.realEstate },
    { id: 'clinic', label: t.segments.clinic },
    { id: 'food', label: t.segments.food },
    { id: 'services', label: t.segments.services },
    { id: 'retail', label: t.segments.retail },
    { id: 'other', label: t.segments.other },
  ];

  const planObj = plans.find((p) => p.id === selectedPlan) || plans[1];
  const currentSegmentLabel = segmentsOptions.find((s) => s.id === selectedSegment)?.label || selectedSegment;

  // Sugestões contextuais pelo segmento (Apenas recomendação, NÃO gratuitas)
  const suggestedFeatures = useMemo(() => {
    return getSuggestedFeaturesForSegment(selectedSegment);
  }, [selectedSegment]);

  // Cálculo de orçamento oficial em tempo real
  const budget = useMemo(() => {
    return calculateBudget(selectedPlan, selectedFeatureIds, selectedSegment);
  }, [selectedPlan, selectedFeatureIds, selectedSegment]);

  // Handler para alternar seleção de recursos
  const handleToggleFeature = (feature: ExtraFeature) => {
    // Se for plano essencial (fechado)
    if (selectedPlan === 'essencial') {
      return;
    }

    // Se for realtime e o plano não permitir (Profissional)
    if (feature.isRealtime && selectedPlan === 'profissional') {
      return;
    }

    setSelectedFeatureIds((prev) => {
      if (prev.includes(feature.id)) {
        return prev.filter((id) => id !== feature.id);
      }
      return [...prev, feature.id];
    });
  };

  const getSiteLanguageLabel = (langCode: WebsiteLanguage): string => {
    switch (langCode) {
      case 'pt-BR':
        return t.project.langPtBr;
      case 'pt-PT':
        return t.project.langPtPt;
      case 'en':
        return t.project.langEn;
      case 'es':
        return t.project.langEs;
      case 'fr':
        return t.project.langFr;
      case 'pt-en':
        return t.project.langPtEn;
      case 'other':
        return t.project.langOther;
    }
  };

  const getOriginText = (): string => {
    if (startType === 'modelo') return `Baseado na demo: ${selectedModel}`;
    if (startType === 'segmento') return `Segmento: ${currentSegmentLabel}`;
    return 'Ideia própria / Projeto sob medida do zero';
  };

  // Mensagem pré-formatada para Área de Transferência e E-mail
  const generateBriefingMessage = (): string => {
    const origin = getOriginText();
    const extrasList = budget.selectedFeatures.length > 0
      ? budget.selectedFeatures.map((f) => `  • ${f.nome} (${f.formattedPreco})`).join('\n')
      : '  • Nenhum recurso extra';

    return `Olá NexaWeb! Gostaria de solicitar uma proposta de site profissional:
- *Empresa/Negócio:* ${businessName || 'Ainda a definir'}
- *Responsável:* ${contactName || 'Não informado'}
- *Telefone / Contato:* ${contactPhone || 'Não informado'}
- *Ponto de Partida:* ${origin}
- *Plano Escolhido:* Plano ${planObj.nome} (${planObj.preco} • ${planObj.tagline})
- *Recursos Extras Selecionados:*
${extrasList}
- *Orçamento Estimado:* ${budget.formattedTotalPrice}
- *Idioma do Futuro Site:* ${getSiteLanguageLabel(siteLanguage)}
- *Imagens/Anexos:* ${attachedFiles.length} foto(s) anexada(s)
- *O que preciso / Necessidades:* ${description || 'Quero mais informações e orientação da equipe NexaWeb'}`;
  };

  const handleCopyBriefing = async () => {
    const text = generateBriefingMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Envio integrado ao backend oficial da NexaWeb
  const handleSubmitProject = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    const briefingText = generateBriefingMessage();

    const payload = {
      clientName: contactName.trim() || 'Não informado',
      businessName: businessName.trim() || 'A definir',
      empresa: businessName.trim() || 'A definir',
      responsavel: contactName.trim() || 'Não informado',
      clientEmail: '',
      clientPhone: contactPhone.trim(),
      phone: contactPhone.trim(),
      segmento: currentSegmentLabel,
      plano: selectedPlan,
      plan: selectedPlan,
      idiomaSite: siteLanguage,
      clientNotes: description.trim() || 'Proposta via NexaWeb App',
      necessidades: description.trim() || 'Proposta via NexaWeb App',
      recursosSelecionados: selectedFeatureIds,
      orcamentoEstimado: budget.formattedTotalPrice,
      valorNumerico: budget.totalPrice,
      origem: getOriginText(),
      briefingSummary: briefingText,
    };

    try {
      // 1. Cria o briefing no backend
      const res = await createBriefing(payload);
      if (res.success && res.projectId) {
        // 2. Se houver imagens anexadas, envia para o backend
        if (attachedFiles.length > 0) {
          await uploadBriefingImages(res.projectId, attachedFiles);
        }

        const message = res.isOfflineFallback
          ? 'Código de referência gerado (modo offline). Para concluir, entre em contato com a NexaWeb pelo e-mail ou Instagram abaixo.'
          : 'Seu projeto foi enviado com sucesso para a equipe NexaWeb!';

        setSubmissionSuccess({
          projectId: res.projectId,
          message,
          isOfflineFallback: Boolean(res.isOfflineFallback),
        });
      } else {
        setSubmissionError(res.error || 'Não foi possível concluir o envio automático. Entre em contato por e-mail ou Instagram.');
      }
    } catch (err: any) {
      setSubmissionError('Falha temporária de conexão com o servidor. Entre em contato por e-mail ou Instagram.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {t.project.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Briefing & Orçamento
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Personalize as preferências, selecione recursos oficiais e calcule o orçamento do seu site profissional.
        </p>
      </div>

      {/* Step 1: Como prefere começar & Segmento */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
            1
          </div>
          <h2 className="text-sm font-bold text-white">
            {t.project.step1Title}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Opção Modelo */}
          <button
            type="button"
            onClick={() => setStartType('modelo')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'modelo'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Layout className={`w-4 h-4 mb-2 ${startType === 'modelo' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optModelTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optModelSub}</span>
            </div>
          </button>

          {/* Opção Segmento */}
          <button
            type="button"
            onClick={() => setStartType('segmento')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'segmento'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Store className={`w-4 h-4 mb-2 ${startType === 'segmento' ? 'text-amber-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optSegmentTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optSegmentSub}</span>
            </div>
          </button>

          {/* Opção Ideia Própria */}
          <button
            type="button"
            onClick={() => setStartType('propria')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'propria'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Lightbulb className={`w-4 h-4 mb-2 ${startType === 'propria' ? 'text-purple-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optCustomTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optCustomSub}</span>
            </div>
          </button>
        </div>

        {/* Detalhes da escolha */}
        {startType === 'modelo' && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {t.project.selectModelLabel}
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedSegment(getSegmentByModelTitle(e.target.value));
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {portfolioProjects.map((p) => (
                <option key={p.id} value={p.titulo}>
                  {p.titulo} ({p.categoria})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
            Segmento de Atuação da Empresa:
          </label>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {segmentsOptions.map((seg) => (
              <option key={seg.id} value={seg.id}>
                {seg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 2: Escolha do Plano (Valores Oficiais) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
              2
            </div>
            <h2 className="text-sm font-bold text-white">
              {t.project.step2Title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t.project.viewPlansLink}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? plan.corIdentidade === 'azul'
                      ? 'bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500/40'
                      : plan.corIdentidade === 'roxo'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-amber-950/40 border-amber-500 text-white ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">{plan.nome}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{plan.preco}</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{plan.prazo}</span>
              </button>
            );
          })}
        </div>

        {selectedPlan === 'essencial' && (
          <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[11px] text-blue-300 leading-relaxed">
            💡 O plano <strong>Essencial (R$ 1.000)</strong> possui escopo fechado e enxuto. Caso deseje adicionar recursos extras, selecione o plano <strong>Profissional</strong> ou <strong>Personalizado</strong>.
          </div>
        )}
      </div>

      {/* Step 3: Recursos Extras e Recomendações do Segmento */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
              3
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Recursos Extras & Recomendações
              </h2>
            </div>
          </div>

          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            {selectedFeatureIds.length} selecionado(s)
          </span>
        </div>

        {/* 1. Sugestões de Recursos pelo Segmento Escolhido (Regra: apenas recomendação, seguem preço oficial) */}
        {suggestedFeatures.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sugeridos para {currentSegmentLabel}:</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Recursos recomendados para o seu nicho. Ao selecionar, o valor oficial do item é adicionado ao orçamento.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {suggestedFeatures.map((feat) => {
                const isSelected = selectedFeatureIds.includes(feat.id);
                const isRealtimeBlocked = feat.isRealtime && !budget.allowExtras;

                return (
                  <button
                    key={feat.id}
                    type="button"
                    disabled={selectedPlan === 'essencial'}
                    onClick={() => handleToggleFeature(feat)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/40'
                        : selectedPlan === 'essencial'
                        ? 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{feat.nome}</span>
                        {feat.isRealtime && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                            Realtime
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{feat.descricao}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-cyan-400">
                        + R$ {feat.preco}
                      </span>
                      <div className="mt-1 flex justify-end">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-amber-500 border-amber-400 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Catálogo Geral de Recursos Extras */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <span>Ver todos os recursos disponíveis (+R$150, +R$200, +R$300)</span>
            {showAllFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAllFeatures && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {OFFICIAL_EXTRA_FEATURES.map((feat) => {
                const isSelected = selectedFeatureIds.includes(feat.id);
                const isRealtime = feat.isRealtime;
                const isRealtimeRestricted = isRealtime && (selectedPlan === 'essencial' || selectedPlan === 'profissional');

                return (
                  <button
                    key={feat.id}
                    type="button"
                    disabled={selectedPlan === 'essencial' || isRealtimeRestricted}
                    onClick={() => handleToggleFeature(feat)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : isRealtimeRestricted || selectedPlan === 'essencial'
                        ? 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-60 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{feat.nome}</span>
                        {isRealtime && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                            Realtime
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{feat.descricao}</p>
                      {isRealtimeRestricted && (
                        <span className="text-[9px] text-amber-400/90 block mt-0.5">
                          Requer Personalizado ou Premium
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-cyan-400">
                        + R$ {feat.preco}
                      </span>
                      <div className="mt-1 flex justify-end">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. CARD DE ORÇAMENTO ESTIMADO EM TEMPO REAL */}
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-slate-950 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Plano Base ({budget.planName}):</span>
            <span className="font-mono font-bold text-white">{budget.formattedBasePrice}</span>
          </div>

          {budget.extrasTotal > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Extras Selecionados ({budget.selectedFeatures.length}):</span>
              <span className="font-mono font-bold text-cyan-400">{budget.formattedExtrasTotal}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Orçamento Estimado:
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-cyan-300">
              {budget.formattedTotalPrice}
            </span>
          </div>

          {budget.warnings.length > 0 && (
            <div className="pt-1 text-[10px] text-amber-400 space-y-0.5">
              {budget.warnings.map((w, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Idioma do Site (Separado do Idioma do App) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
              4
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">
                {t.project.step3Title}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          {t.project.langNote}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'pt-BR', label: t.project.langPtBr },
            { id: 'pt-PT', label: t.project.langPtPt },
            { id: 'en', label: t.project.langEn },
            { id: 'es', label: t.project.langEs },
            { id: 'fr', label: t.project.langFr },
            { id: 'pt-en', label: t.project.langPtEn },
            { id: 'other', label: t.project.langOther },
          ].map((item) => {
            const isSelected = siteLanguage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSiteLanguage(item.id as WebsiteLanguage)}
                className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all truncate ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
                title={item.label}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 5: Informações do Negócio & Upload de Imagens */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
            5
          </div>
          <h2 className="text-sm font-bold text-white">
            {t.project.step4Title}
          </h2>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {t.project.businessNameLabel}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.project.businessNamePlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {t.project.needsLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.project.needsPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Upload de Imagens Conforme Regras Comerciais (máx 6 imagens, máx 10 MB) */}
          <div className="pt-2 border-t border-slate-800/80">
            <ImageUploadField
              files={attachedFiles}
              onChange={setAttachedFiles}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {t.project.yourNameLabel}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t.project.yourNamePlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {t.project.phoneLabel}
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder={t.project.phonePlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 6: Preview, Resumo e Envio */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">
            {t.project.step5Title}
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.project.step5Desc}
        </p>

        {/* Resumo do Orçamento e Projeto */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1">
          <div className="text-cyan-400 font-semibold text-[10px] uppercase">{t.project.summaryTitle}</div>
          <div>• Empresa: {businessName || 'A definir'}</div>
          <div>• Segmento: {currentSegmentLabel}</div>
          <div>• Ponto de Partida: {startType === 'modelo' ? selectedModel : startType === 'segmento' ? currentSegmentLabel : 'Ideia própria sob medida'}</div>
          <div>• Plano: {planObj.nome} ({planObj.preco} • {planObj.prazo})</div>
          <div>• Recursos Extras: {budget.selectedFeatures.length > 0 ? budget.selectedFeatures.map((f) => f.nome).join(', ') : 'Nenhum'}</div>
          <div className="text-cyan-300 font-bold">• Orçamento Estimado: {budget.formattedTotalPrice}</div>
          <div>• Idioma do Site: {getSiteLanguageLabel(siteLanguage)}</div>
          <div>• Anexos: {attachedFiles.length} imagem(ns)</div>
          <div>• Responsável: {contactName || 'Não informado'} {contactPhone ? `• ${contactPhone}` : ''}</div>
        </div>

        {/* Feedback de envio ou contingência offline */}
        {submissionSuccess && (
          <div
            className={`p-3 rounded-xl border text-xs space-y-1 animate-in fade-in ${
              submissionSuccess.isOfflineFallback
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold ${
                submissionSuccess.isOfflineFallback ? 'text-amber-200' : 'text-emerald-200'
              }`}
            >
              {submissionSuccess.isOfflineFallback ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{submissionSuccess.message}</span>
            </div>
            <p
              className={`text-[11px] font-mono ${
                submissionSuccess.isOfflineFallback ? 'text-amber-300/90' : 'text-emerald-300/90'
              }`}
            >
              Código de Referência: <strong>{submissionSuccess.projectId}</strong>
            </p>
          </div>
        )}

        {/* Feedback de erro */}
        {submissionError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          {/* Botão de Envio Integrado ao Backend do NexaWeb Site */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitProject}
            className="min-h-[48px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Registrando Projeto...' : 'Enviar Briefing para NexaWeb'}</span>
          </button>

          {/* Botão Copiar Resumo */}
          <button
            type="button"
            onClick={handleCopyBriefing}
            className={`min-h-[44px] w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
              copied
                ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-cyan-400" />
                <span>{t.project.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.project.copySummaryBtn}</span>
              </>
            )}
          </button>

          {/* Contatos Oficiais NexaWeb */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Contatos Oficiais NexaWeb:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="mailto:nexaweeb@gmail.com"
                className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-center"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold truncate">E-mail</span>
              </a>

              <a
                href="https://www.instagram.com/nexaw1/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-slate-300 hover:text-white transition-all text-center"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="text-xs font-semibold truncate">Instagram</span>
              </a>

              <a
                href="https://nexaweeb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-center"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold truncate">Site</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
