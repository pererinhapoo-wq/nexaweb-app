import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewTab, WebsiteLanguage, PortfolioProject } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import { calculateBudget } from '../utils/pricingEngine';
import {
  createBriefing,
  uploadBriefingImages,
  generateOfflineBriefingProtocol,
} from '../utils/briefingService';
import { registerClientProjectFromBriefing } from '../utils/portalService';
import {
  getBriefingDraftSync,
  getBriefingDraft,
  saveBriefingDraft,
  clearBriefingDraft,
} from '../utils/storage';
import {
  CANONICAL_SEGMENTS,
  getSegmentConfig,
  normalizeSegmentKey,
} from '../data/segmentBriefingSchemas';
import { ImageUploadField } from './ImageUploadField';
import {
  Sparkles,
  Check,
  Copy,
  Layout,
  Mail,
  AlertCircle,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ExternalLink,
  Layers,
  Clock,
  Phone,
  Edit2,
  Loader2,
  RefreshCw,
  Lightbulb,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ProjectScreenProps {
  initialPlan?: string;
  initialModel?: string;
  initialModelApproach?: 'exact' | 'inspiration';
  initialWebsiteLanguage?: WebsiteLanguage;
  onNavigate: (tab: ViewTab) => void;
  onBack?: () => void;
  onStepChange?: (step: number, canGoBackStep: boolean, goBackStep: () => void) => void;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  initialPlan,
  initialModel,
  initialModelApproach,
  initialWebsiteLanguage,
  onNavigate,
  onBack,
  onStepChange,
}) => {
  const { language, t } = useTranslation();

  const plans = getNexawebPlans(language);
  const portfolioProjects = getPortfolioProjects(language);

  // Etapa atual: 1 = Ponto de Partida & Plano | 2 = Briefing Dinâmico | 3 = Contato | 4 = Revisão & Envio
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Modo de início da Etapa 1: 'amostra' | 'propria' | 'plano'
  const [startMode, setStartMode] = useState<'amostra' | 'propria' | 'plano'>(() => {
    if (initialModel) return 'amostra';
    return 'amostra';
  });

  // Modelo de referência selecionado
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || '');
  const [modelApproach, setModelApproach] = useState<'exact' | 'inspiration'>(
    initialModelApproach || 'exact'
  );

  // Plano selecionado
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'profissional');

  // Segmento dinâmico selecionado
  const [selectedSegment, setSelectedSegment] = useState<string>(() => {
    if (initialModel) return normalizeSegmentKey(initialModel);
    if (initialPlan === 'essencial') return 'barbearia';
    if (initialPlan === 'premium') return 'academia';
    return 'academia';
  });

  // Filtro de amostras por categoria na Etapa 1
  const [sampleFilter, setSampleFilter] = useState<string>('todos');

  // Configuração ativa do segmento dinâmico
  const segmentConfig = useMemo(() => {
    return getSegmentConfig(selectedSegment);
  }, [selectedSegment]);

  // --- ETAPA 2: DADOS DO BRIEFING ---
  const [businessName, setBusinessName] = useState('');
  const [siteLanguage, setSiteLanguage] = useState<WebsiteLanguage>(
    initialWebsiteLanguage || (language === 'pt-PT' ? 'pt-PT' : language === 'en' ? 'en' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'pt-BR')
  );

  // Campos dinâmicos do segmento
  const [selectedPrimaryOptions, setSelectedPrimaryOptions] = useState<string[]>([]);
  const [selectedSecondaryOptions, setSelectedSecondaryOptions] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [operatingSchedule, setOperatingSchedule] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [freeServicesText, setFreeServicesText] = useState('');
  const [specialCalloutActive, setSpecialCalloutActive] = useState(true);

  // Campos específicos de Ideia Própria / Sob Medida
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [customProjectIdea, setCustomProjectIdea] = useState('');
  const [customObjective, setCustomObjective] = useState('');
  const [customReferenceLink, setCustomReferenceLink] = useState('');

  // Identidade de Cores
  const [colorMode, setColorMode] = useState<'suggest' | 'brand' | 'custom'>('suggest');
  const [customColorDetails, setCustomColorDetails] = useState('');

  // Anexos (até 6 imagens, máx 10 MB)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- ETAPA 3: CONTATO ---
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  // --- ETAPA 4: ENVIO & FEEDBACK ---
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    projectId: string;
    message: string;
    isOfflineFallback?: boolean;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Inicializa opções do segmento ao trocar de segmento
  useEffect(() => {
    const config = getSegmentConfig(selectedSegment);
    // Pré-seleciona as duas primeiras opções como ponto de partida agradável
    setSelectedPrimaryOptions((prev) => (prev.length > 0 ? prev : config.primaryOptions.slice(0, 3)));
    setSelectedSecondaryOptions((prev) => (prev.length > 0 ? prev : config.secondaryOptions.slice(0, 2)));
    setSelectedFeatures((prev) => (prev.length > 0 ? prev : config.features.slice(0, 2)));
  }, [selectedSegment]);

  // Se inicializado com modelo específico, seleciona o segmento automaticamente
  useEffect(() => {
    if (initialModel) {
      setSelectedModel(initialModel);
      const mapped = normalizeSegmentKey(initialModel);
      setSelectedSegment(mapped);
      const proj = portfolioProjects.find((p) => p.titulo === initialModel);
      if (proj?.planoId) {
        setSelectedPlan(proj.planoId);
      }
    }
  }, [initialModel, portfolioProjects]);

  // Carrega rascunho salvo do armazenamento local
  useEffect(() => {
    async function loadDraft() {
      try {
        const draft = getBriefingDraftSync(selectedPlan) || (await getBriefingDraft(selectedPlan));
        if (draft) {
          if (draft.businessName && !businessName) setBusinessName(draft.businessName);
          if (draft.contactName && !contactName) setContactName(draft.contactName);
          if (draft.contactPhone && !contactPhone) setContactPhone(draft.contactPhone);
          if (draft.contactEmail && !contactEmail) setContactEmail(draft.contactEmail);
        }
      } catch {
        // Fallback silencioso
      }
    }
    loadDraft();
  }, [selectedPlan]);

  // Salva rascunho automaticamente a cada alteração
  useEffect(() => {
    const timer = setTimeout(() => {
      saveBriefingDraft(selectedPlan, {
        selectedPlan,
        businessName,
        contactName,
        contactPhone,
        contactEmail,
        specificNotes,
        selectedSegment,
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedPlan, businessName, contactName, contactPhone, contactEmail, specificNotes, selectedSegment]);

  // Sincroniza coordenação de passo com o componente pai (App.tsx / Header / Botão voltar físico)
  useEffect(() => {
    if (onStepChange) {
      const canGoBackStep = currentStep > 1;
      const goBackStep = () => {
        setStepError(null);
        setCurrentStep((prev) => Math.max(1, prev - 1) as any);
      };
      onStepChange(currentStep, canGoBackStep, goBackStep);
    }
  }, [currentStep, onStepChange]);

  // Plano ativo
  const activePlanObj = useMemo(() => {
    return plans.find((p) => p.id === selectedPlan) || plans[1];
  }, [plans, selectedPlan]);

  // Cálculo de orçamento oficial
  const budget = useMemo(() => {
    return calculateBudget(selectedPlan, [], selectedSegment);
  }, [selectedPlan, selectedSegment]);

  // Amostra atualmente selecionada (se houver)
  const selectedProjectObj = useMemo(() => {
    if (!selectedModel) return null;
    return portfolioProjects.find((p) => p.titulo === selectedModel) || null;
  }, [selectedModel, portfolioProjects]);

  // Lista filtrada de demonstrações para a escolha de amostra
  const filteredDemos = useMemo(() => {
    if (sampleFilter === 'todos') return portfolioProjects;
    return portfolioProjects.filter((p) => {
      if (sampleFilter === 'barbearia') return p.id.includes('barbearia');
      if (sampleFilter === 'beleza') return p.categoria === 'beleza-estetica';
      if (sampleFilter === 'fitness') return p.categoria === 'saude-fitness' && (p.id.includes('academia') || p.id.includes('fitness'));
      if (sampleFilter === 'clinica') return p.id.includes('clinica') || p.id.includes('saude');
      if (sampleFilter === 'gastronomia') return p.categoria === 'gastronomia';
      if (sampleFilter === 'imobiliaria') return p.categoria === 'imobiliario';
      if (sampleFilter === 'loja') return p.categoria === 'comercio';
      if (sampleFilter === 'engenharia') return p.categoria === 'engenharia' || p.categoria === 'arquitetura';
      return true;
    });
  }, [portfolioProjects, sampleFilter]);

  // Manipulador de escolha de demonstração
  const handleSelectDemo = (proj: PortfolioProject) => {
    setSelectedModel(proj.titulo);
    if (proj.planoId) {
      setSelectedPlan(proj.planoId);
    }
    const detectedSegment = normalizeSegmentKey(proj.titulo);
    setSelectedSegment(detectedSegment);
    setStepError(null);
  };

  // Alterna chip primário
  const togglePrimaryOption = (opt: string) => {
    setSelectedPrimaryOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  // Alterna chip secundário
  const toggleSecondaryOption = (opt: string) => {
    setSelectedSecondaryOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  // Alterna chip de recursos/diferenciais
  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  // Validação e avanço de etapa
  const handleNextStep = () => {
    setStepError(null);

    if (currentStep === 1) {
      // Se escolheu amostra, precisa ter uma selecionada
      if (startMode === 'amostra' && !selectedModel) {
        setStepError('Por favor, toque em uma das demonstrações abaixo para continuar.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      if (!businessName.trim()) {
        setStepError('Por favor, informe o Nome do seu negócio ou projeto para avançar.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 3) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setStepError('Por favor, preencha o Nome do responsável e o WhatsApp de contato.');
        return;
      }
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  // Retorno de etapa (preserva estritamente todos os dados)
  const handlePrevStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(1, prev - 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onBack) {
        onBack();
      } else {
        onNavigate('home');
      }
    }
  };

  // Texto amigável do botão de avançar
  const getNextButtonLabel = () => {
    if (currentStep === 1) return 'Continuar para o Briefing';
    if (currentStep === 2) return 'Avançar para Contato';
    if (currentStep === 3) return 'Revisar Briefing Completo';
    return 'Enviar Briefing Oficial';
  };

  // Gerador formatado da mensagem canônica do briefing
  const generateBriefingMessage = (): string => {
    const lines: string[] = [];

    lines.push('🌟 *BRIEFING OFICIAL — NEXAWEB APP*');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`💼 *Plano Selecionado:* Plano ${activePlanObj.nome} (${activePlanObj.preco})`);
    lines.push(`⏱️ *Prazo Previsto:* ${activePlanObj.prazo}`);

    if (startMode === 'amostra' && selectedModel) {
      lines.push(`🎯 *Ponto de Partida:* Demonstração "${selectedModel}"`);
      lines.push(
        modelApproach === 'exact'
          ? '📌 *Abordagem:* Quero exatamente este formato'
          : '📌 *Abordagem:* Usar como inspiração sob medida'
      );
    } else if (startMode === 'propria') {
      lines.push('🎯 *Ponto de Partida:* Ideia própria / Projeto sob medida');
      if (customBusinessType) lines.push(`🏷️ *Tipo de Negócio:* ${customBusinessType}`);
      if (customObjective) lines.push(`🎯 *Objetivo Principal:* ${customObjective}`);
    } else {
      lines.push('🎯 *Ponto de Partida:* Escolha direta de plano');
    }

    lines.push(`🏢 *Nome do Negócio:* ${businessName || 'A definir'}`);
    lines.push(`🏷️ *Segmento Identificado:* ${segmentConfig.icon} ${segmentConfig.name}`);
    lines.push(`🌐 *Idioma do Site:* ${siteLanguage}`);

    lines.push('');
    lines.push(`📋 *${segmentConfig.primaryOptionsLabel}:*`);
    if (selectedPrimaryOptions.length > 0) {
      lines.push(selectedPrimaryOptions.map((o) => `  • ${o}`).join('\n'));
    } else {
      lines.push('  • Itens padrão do segmento');
    }

    if (selectedSecondaryOptions.length > 0) {
      lines.push('');
      lines.push(`📋 *${segmentConfig.secondaryOptionsLabel}:*`);
      lines.push(selectedSecondaryOptions.map((o) => `  • ${o}`).join('\n'));
    }

    if (selectedFeatures.length > 0) {
      lines.push('');
      lines.push(`✨ *${segmentConfig.featuresLabel}:*`);
      lines.push(selectedFeatures.map((f) => `  • ${f}`).join('\n'));
    }

    if (operatingSchedule) {
      lines.push(`⏰ *Horários de Funcionamento:* ${operatingSchedule}`);
    }
    if (teamDescription) {
      lines.push(`👥 *Equipe / Profissionais:* ${teamDescription}`);
    }
    if (freeServicesText) {
      lines.push(`📝 *Detalhes dos Serviços:* ${freeServicesText}`);
    }
    if (customProjectIdea) {
      lines.push(`💡 *Ideia do Projeto:* ${customProjectIdea}`);
    }
    if (customReferenceLink) {
      lines.push(`🔗 *Link de Referência:* ${customReferenceLink}`);
    }

    lines.push('');
    lines.push(
      colorMode === 'suggest'
        ? '🎨 *Identidade Visual:* Sugestão NexaWeb (Harmonia visual)'
        : colorMode === 'brand'
        ? `🎨 *Cores da Marca:* ${customColorDetails || 'Cores da identidade visual existente'}`
        : `🎨 *Cores Escolhidas:* ${customColorDetails || 'Tons específicos indicados'}`
    );

    if (attachedFiles.length > 0) {
      lines.push(`📎 *Arquivos Selecionados:* ${attachedFiles.length} foto(s)/logo`);
    }

    lines.push('');
    lines.push('👤 *DADOS DO RESPONSÁVEL:*');
    lines.push(`  • Nome: ${contactName || 'Não informado'}`);
    lines.push(`  • WhatsApp: ${contactPhone || 'Não informado'}`);
    if (contactEmail) lines.push(`  • E-mail: ${contactEmail}`);
    if (specificNotes) lines.push(`  • Observações: ${specificNotes}`);

    lines.push('');
    lines.push('Aguardando contato oficial da equipe NexaWeb!');
    return lines.join('\n');
  };

  const handleCopyBriefing = async () => {
    const text = generateBriefingMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Envio definitivo ao backend oficial NexaWeb com proteção contra duplicidade
  const handleSubmitProject = async () => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const summary = generateBriefingMessage();

      const res = await createBriefing({
        clientName: contactName,
        businessName: businessName,
        clientPhone: contactPhone,
        clientEmail: contactEmail,
        segmento: segmentConfig.name,
        plano: selectedPlan,
        idiomaSite: siteLanguage,
        necessidades: summary,
        clientNotes: specificNotes,
        recursosSelecionados: [...selectedPrimaryOptions, ...selectedSecondaryOptions],
        orcamentoEstimado: activePlanObj.preco,
        briefingSummary: summary,
        origem: 'NexaWeb App · Parte 5',
      });

      if (res.success && res.projectId) {
        if (attachedFiles.length > 0) {
          try {
            await uploadBriefingImages(res.projectId, attachedFiles);
          } catch {
            // Continua mesmo se upload de imagem falhar
          }
        }

        await clearBriefingDraft(selectedPlan);

        // Registra o projeto para acompanhamento instantâneo na Área do Cliente
        try {
          await registerClientProjectFromBriefing(
            res.projectId,
            contactName,
            businessName,
            selectedPlan,
            summary
          );
        } catch {
          // fallback gracioso
        }

        const message = res.message || 'Seu briefing foi registrado com sucesso. Nossa equipe entrará em contato!';
        setSubmissionSuccess({
          projectId: res.projectId,
          message,
          isOfflineFallback: Boolean(res.isOfflineFallback),
        });
      } else {
        setSubmissionError(
          res.error || 'Não foi possível enviar o briefing. Verifique sua conexão e tente novamente.'
        );
      }
    } catch {
      setSubmissionError('Não foi possível enviar o briefing. Verifique sua conexão e tente novamente.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Fallback offline caso a rede esteja indisponível
  const handleGenerateOfflineProtocol = async () => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const res = generateOfflineBriefingProtocol();
      await clearBriefingDraft(selectedPlan);

      // Registra no banco local para acompanhamento na Área do Cliente
      try {
        await registerClientProjectFromBriefing(
          res.projectId!,
          contactName,
          businessName,
          selectedPlan,
          generateBriefingMessage()
        );
      } catch {
        // fallback
      }

      setSubmissionSuccess({
        projectId: res.projectId!,
        message: res.message!,
        isOfflineFallback: true,
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150 overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. INDICADOR DE PROGRESSO CLARO (01 a 04)                      */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Etapa {currentStep} de 4
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {currentStep === 1 && 'Escolha & Ponto de Partida'}
              {currentStep === 2 && `Briefing Dinâmico · ${segmentConfig.name}`}
              {currentStep === 3 && 'Informações de Contato'}
              {currentStep === 4 && 'Revisão & Envio do Projeto'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 font-bold shrink-0">
            {activePlanObj.preco}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Abas Superiores das Etapas */}
        <div className="grid grid-cols-4 gap-1 text-center">
          {[
            { step: 1, label: '01 Escolha' },
            { step: 2, label: '02 Briefing' },
            { step: 3, label: '03 Contato' },
            { step: 4, label: '04 Revisão' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step < currentStep) {
                  setStepError(null);
                  setCurrentStep(item.step as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`min-h-[38px] flex items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                currentStep === item.step
                  ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/40 shadow-sm'
                  : currentStep > item.step
                  ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 cursor-pointer'
                  : 'text-slate-500 cursor-not-allowed'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Validação de Etapa */}
      {stepError && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 1: PONTO DE PARTIDA & PLANO                               */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Cabeçalho da Entrada Solicitada */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Como você deseja começar seu site?
            </h2>
            <p className="text-xs text-slate-300">
              Escolha uma das 3 opções simples para dar início ao seu projeto:
            </p>
          </div>

          {/* 3 Opções de Entrada */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Opção 1: Escolher a partir de uma amostra */}
            <button
              type="button"
              onClick={() => {
                setStartMode('amostra');
                setStepError(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
                startMode === 'amostra'
                  ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-cyan-400">
                  <Layout className="w-4 h-4" />
                </div>
                {startMode === 'amostra' && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  1. A partir de uma amostra
                </span>
                <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
                  Demonstrações reais publicadas
                </span>
              </div>
            </button>

            {/* Opção 2: Tenho uma ideia própria / Projeto sob medida */}
            <button
              type="button"
              onClick={() => {
                setStartMode('propria');
                setSelectedModel('');
                setStepError(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
                startMode === 'propria'
                  ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                </div>
                {startMode === 'propria' && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  2. Ideia própria / Sob medida
                </span>
                <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
                  Projeto criado do seu jeito
                </span>
              </div>
            </button>

            {/* Opção 3: Escolher direto um dos 4 Planos */}
            <button
              type="button"
              onClick={() => {
                setStartMode('plano');
                setSelectedModel('');
                setStepError(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
                startMode === 'plano'
                  ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="w-4 h-4" />
                </div>
                {startMode === 'plano' && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  3. Escolher direto um Plano
                </span>
                <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
                  Conhecer os 4 planos oficiais
                </span>
              </div>
            </button>
          </div>

          {/* ==================================================== */}
          {/* SUB-FLUXO 1: ESCOLHA DE AMOSTRA                     */}
          {/* ==================================================== */}
          {startMode === 'amostra' && (
            <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Demonstrações Reais Publicadas
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    Toque em uma amostra para usá-la como referência do seu site:
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                  {filteredDemos.length} modelos
                </span>
              </div>

              {/* Filtros rápidos por nicho */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'fitness', label: 'Academia' },
                  { id: 'gastronomia', label: 'Restaurante' },
                  { id: 'clinica', label: 'Clínica' },
                  { id: 'imobiliaria', label: 'Imobiliária' },
                  { id: 'loja', label: 'Loja' },
                  { id: 'barbearia', label: 'Barbearia' },
                  { id: 'beleza', label: 'Salão' },
                  { id: 'engenharia', label: 'Engenharia' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSampleFilter(cat.id)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-colors ${
                      sampleFilter === cat.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid de Demonstrações Reais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto no-scrollbar pr-0.5">
                {filteredDemos.map((proj) => {
                  const isSelected = selectedModel === proj.titulo;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectDemo(proj)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-600/20 border-cyan-500 ring-1 ring-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-300">
                            Plano {proj.planoId}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white truncate">
                          {proj.titulo}
                        </h4>
                        <p className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                          {proj.descricaoCurta}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
                        <span className="text-cyan-300 font-medium truncate">
                          {proj.segmentoAlvo.split(',')[0]}
                        </span>
                        <a
                          href={proj.linkDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 shrink-0 ml-1 underline"
                        >
                          <span>Ver demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informações da Amostra Selecionada */}
              {selectedProjectObj && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                        Amostra Selecionada
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold text-white">
                        {selectedProjectObj.titulo}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      Segmento: {segmentConfig.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    {selectedProjectObj.descricaoCompleta}
                  </p>

                  {/* Abordagem desejada */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Como você deseja utilizar este modelo?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModelApproach('exact')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          modelApproach === 'exact'
                            ? 'bg-cyan-950/50 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>Quero exatamente este formato</span>
                        {modelApproach === 'exact' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setModelApproach('inspiration')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          modelApproach === 'inspiration'
                            ? 'bg-indigo-950/50 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>Usar como inspiração sob medida</span>
                        {modelApproach === 'inspiration' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* SUB-FLUXO 2: TENHO UMA IDEIA PRÓPRIA / SOB MEDIDA   */}
          {/* ==================================================== */}
          {startMode === 'propria' && (
            <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
              <div className="border-b border-slate-800/80 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Projeto Sob Medida
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  Estruture sua ideia do zero. Selecione o segmento e informe sua visão:
                </p>
              </div>

              {/* Seletor do Segmento do Negócio */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Qual é o segmento principal do seu negócio?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {Object.values(CANONICAL_SEGMENTS).map((seg) => {
                    const isSelected = selectedSegment === seg.segmentKey;
                    return (
                      <button
                        key={seg.segmentKey}
                        type="button"
                        onClick={() => setSelectedSegment(seg.segmentKey)}
                        className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base leading-none">{seg.icon}</span>
                        <span className="truncate text-[11px]">{seg.name.split('&')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plano Recomendado para Sob Medida */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Plano recomendado para sob medida:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('profissional')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedPlan === 'profissional'
                        ? 'bg-indigo-950/40 border-cyan-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block font-bold">Profissional (R$ 1.700)</span>
                    <span className="block text-[10px] text-slate-500">Completo & Estratégico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('personalizado')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedPlan === 'personalizado'
                        ? 'bg-indigo-950/40 border-cyan-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block font-bold">Personalizado (R$ 2.800+)</span>
                    <span className="block text-[10px] text-slate-500">Arquitetura sob demanda</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SUB-FLUXO 3: ESCOLHER DIRETO UM DOS 4 PLANOS         */}
          {/* ==================================================== */}
          {startMode === 'plano' && (
            <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
              <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Os 4 Planos Oficiais da NexaWeb
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    Selecione o plano ideal para a estrutura que você deseja:
                  </p>
                </div>
              </div>

              {/* Grid dos 4 Planos Oficiais com Preços Preservados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plans.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            Plano {p.nome}
                          </span>
                          <span className="text-xs font-mono font-black text-cyan-300">
                            {p.preco}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-snug mb-2">
                          {p.tagline}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Prazo: {p.prazo}</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-400 line-clamp-1">{p.descricao}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Segmento correspondente ao plano */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Qual é o segmento do seu negócio?
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {Object.values(CANONICAL_SEGMENTS).map((seg) => (
                    <option key={seg.segmentKey} value={seg.segmentKey}>
                      {seg.icon} {seg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Link para o Assistente de Escolha NexaWeb */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Precisa de ajuda para decidir o plano ideal?</span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-2 ml-1"
            >
              Fazer o Quiz do Assistente
            </button>
          </div>

          {/* Botões de Ação da Etapa 1 (Inline, sempre visíveis e confortáveis) */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[48px] min-w-[48px] px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Voltar"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[48px] flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 2: BRIEFING DINÂMICO CONFORME O SEGMENTO                 */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Cabeçalho do Briefing Dinâmico */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Briefing Personalizado
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Plano {activePlanObj.nome}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>{segmentConfig.icon}</span>
              <span>Conteúdo para {segmentConfig.name}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {segmentConfig.tagline}
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            {/* 1. Nome do Negócio ou Projeto * */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                1. Nome do Negócio ou Projeto *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder="Ex: Minha Empresa, Studio Bella, Barbearia Nobre..."
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* 2. Idioma do Futuro Site */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                2. Idioma do Futuro Site
              </label>
              <select
                value={siteLanguage}
                onChange={(e) => setSiteLanguage(e.target.value as any)}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                <option value="pt-PT">🇵🇹 Português (Portugal)</option>
                <option value="en">🇺🇸 Inglês (English)</option>
                <option value="es">🇪🇸 Espanhol (Español)</option>
                <option value="fr">🇫🇷 Francês (Français)</option>
                <option value="pt-en">🌐 Bilíngue (Português + Inglês)</option>
              </select>
            </div>

            {/* 3. OPÇÃO DINÂMICA PRIMÁRIA DO SEGMENTO */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                3. {segmentConfig.primaryOptionsLabel}
              </label>
              <p className="text-[10.5px] text-slate-400">
                Selecione as opções que farão parte do seu site:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {segmentConfig.primaryOptions.map((opt) => {
                  const isChecked = selectedPrimaryOptions.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => togglePrimaryOption(opt)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. OPÇÃO DINÂMICA SECUNDÁRIA DO SEGMENTO */}
            {segmentConfig.secondaryOptions.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  4. {segmentConfig.secondaryOptionsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {segmentConfig.secondaryOptions.map((opt) => {
                    const isChecked = selectedSecondaryOptions.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleSecondaryOption(opt)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. DIFERENCIAIS ESPECÍFICOS DO SEGMENTO */}
            {segmentConfig.features.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  5. {segmentConfig.featuresLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {segmentConfig.features.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-emerald-600 text-white font-bold shadow-sm'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. HORÁRIOS & ATENDIMENTO */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                6. Horários de Funcionamento ou Atendimento
              </label>
              <input
                type="text"
                value={operatingSchedule}
                onChange={(e) => setOperatingSchedule(e.target.value)}
                placeholder={segmentConfig.schedulePlaceholder}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* 7. EQUIPE OU PROFISSIONAIS */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                7. Equipe / Professores / Profissionais
              </label>
              <input
                type="text"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder={segmentConfig.teamPlaceholder}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* 8. SERVIÇOS OU PRODUTOS ESPECÍFICOS */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                8. Detalhes Adicionais dos Serviços ou Produtos
              </label>
              <textarea
                value={freeServicesText}
                onChange={(e) => setFreeServicesText(e.target.value)}
                rows={3}
                placeholder={segmentConfig.defaultServicesPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Se for modo Sob Medida, exibe campos de ideia e objetivos */}
            {startMode === 'propria' && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
                  Visão do Projeto Sob Medida
                </label>
                <div>
                  <span className="text-[10.5px] text-slate-400 block mb-1">Ideia Central do Site:</span>
                  <textarea
                    value={customProjectIdea}
                    onChange={(e) => setCustomProjectIdea(e.target.value)}
                    rows={2}
                    placeholder="Descreva o que não pode faltar no seu projeto sob medida..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-400 block mb-1">Link de Referência / Inspiração (opcional):</span>
                  <input
                    type="url"
                    value={customReferenceLink}
                    onChange={(e) => setCustomReferenceLink(e.target.value)}
                    placeholder="https://exemplo.com.br"
                    className="w-full min-h-[42px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* CORES & IDENTIDADE VISUAL */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
                Cores & Identidade Visual
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setColorMode('suggest')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                    colorMode === 'suggest'
                      ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Sugestão NexaWeb</span>
                  <span className="block text-[10px] text-slate-500">Harmonia para o segmento</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorMode('brand')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                    colorMode === 'brand'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Minhas Cores</span>
                  <span className="block text-[10px] text-slate-500">Identidade existente</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorMode('custom')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                    colorMode === 'custom'
                      ? 'bg-purple-950/40 border-purple-500 text-white font-bold ring-1 ring-purple-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Tons Específicos</span>
                  <span className="block text-[10px] text-slate-500">Sob medida</span>
                </button>
              </div>

              {colorMode !== 'suggest' && (
                <input
                  type="text"
                  value={customColorDetails}
                  onChange={(e) => setCustomColorDetails(e.target.value)}
                  placeholder="Ex: Azul marinho, dourado e branco..."
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 mt-1"
                />
              )}
            </div>

            {/* UPLOAD DE ARQUIVOS / LOGO / FOTOS */}
            <div className="pt-2 border-t border-slate-800/80">
              <ImageUploadField
                files={attachedFiles}
                onChange={setAttachedFiles}
                maxFiles={6}
              />
            </div>
          </div>

          {/* Botões de Ação da Etapa 2 (Inline, sempre visíveis e confortáveis) */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[48px] min-w-[48px] px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Voltar"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[48px] flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 3: INFORMAÇÕES DE CONTATO DO RESPONSÁVEL                 */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Dados do Responsável pelo Projeto
            </h2>
            <p className="text-xs text-slate-300">
              Informe seus dados para contato oficial e alinhamento da proposta:
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                Nome do Responsável *
              </label>
              <input
                type="text"
                autoComplete="name"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder="Ex: Carlos Eduardo"
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                WhatsApp com DDD *
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder="Ex: (11) 99999-9999"
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                E-mail (opcional)
              </label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Ex: contato@suaempresa.com.br"
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                Observações ou Pedidos Especiais
              </label>
              <textarea
                value={specificNotes}
                onChange={(e) => setSpecificNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Desejo colocar meu site no ar com urgência, preciso de suporte com domínio próprio..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Botões de Ação da Etapa 3 (Inline, sempre visíveis e confortáveis) */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[48px] min-w-[48px] px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Voltar"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[48px] flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 4: REVISÃO & ENVIO OFICIAL DO PROJETO                     */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Revisão Final do Briefing
            </h2>
            <p className="text-xs text-slate-300">
              Confira os dados do seu site antes do envio oficial para a equipe NexaWeb:
            </p>
          </div>

          {/* Card Resumo do Projeto */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm text-xs">
            {/* Cabeçalho do Resumo */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Plano Selecionado
                </span>
                <span className="text-sm font-bold text-white">
                  Plano {activePlanObj.nome}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {activePlanObj.preco}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Prazo: {activePlanObj.prazo}
                </span>
              </div>
            </div>

            {/* Linhas de Dados */}
            <div className="space-y-2 divide-y divide-slate-800/60">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Negócio / Empresa:</span>
                <span className="font-bold text-white text-right">{businessName}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Segmento:</span>
                <span className="font-semibold text-cyan-300 text-right">
                  {segmentConfig.icon} {segmentConfig.name}
                </span>
              </div>

              {selectedModel && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Amostra de Referência:</span>
                  <span className="text-white text-right font-medium">{selectedModel}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Idioma do Site:</span>
                <span className="text-white text-right">{siteLanguage}</span>
              </div>

              {selectedPrimaryOptions.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">
                    {segmentConfig.primaryOptionsLabel}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPrimaryOptions.map((opt) => (
                      <span
                        key={opt}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSecondaryOptions.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">
                    {segmentConfig.secondaryOptionsLabel}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedSecondaryOptions.map((opt) => (
                      <span
                        key={opt}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-indigo-300 border border-slate-800"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {operatingSchedule && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Horários:</span>
                  <span className="text-white text-right">{operatingSchedule}</span>
                </div>
              )}

              {teamDescription && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Equipe:</span>
                  <span className="text-white text-right">{teamDescription}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Responsável:</span>
                <span className="font-bold text-white text-right">{contactName}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono text-cyan-300 text-right">{contactPhone}</span>
              </div>

              {contactEmail && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">E-mail:</span>
                  <span className="text-white text-right">{contactEmail}</span>
                </div>
              )}

              {attachedFiles.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Fotos/Logo anexados:</span>
                  <span className="font-mono text-cyan-300">{attachedFiles.length} arquivo(s)</span>
                </div>
              )}
            </div>

            {/* Ações de Edição Rápida */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[44px] p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Editar Briefing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[44px] p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Editar Contato</span>
              </button>
            </div>
          </div>

          {/* Mensagem de Sucesso Real ou Fallback Offline */}
          {submissionSuccess && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                submissionSuccess.isOfflineFallback
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {submissionSuccess.isOfflineFallback ? (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <span>
                  {submissionSuccess.isOfflineFallback
                    ? 'Código gerado em modo offline'
                    : 'Briefing enviado com sucesso para a NexaWeb!'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {submissionSuccess.message}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Código de Referência:</span>
                <span className="font-mono font-bold text-emerald-300 text-xs">
                  {submissionSuccess.projectId}
                </span>
              </div>
            </div>
          )}

          {/* Mensagem de Erro com Retry e Fallback Offline */}
          {submissionError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex flex-col gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium leading-snug">{submissionError}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-900/40">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitProject}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>Tentar novamente</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGenerateOfflineProtocol}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>Gerar código offline</span>
                </button>
              </div>
            </div>
          )}

          {/* Botões Finais de Envio & Cópia */}
          <div className="space-y-2 pt-1">
            {!submissionSuccess ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitProject}
                className="min-h-[50px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white font-extrabold text-xs shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Enviando briefing para a NexaWeb...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Enviar Briefing para NexaWeb</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="min-h-[48px] w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-950/40"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Acompanhar na Área do Cliente</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="min-h-[44px] w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ir para a Página Inicial</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyBriefing}
              className={`min-h-[46px] w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                copied
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Resumo Copiado para a Área de Transferência!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Resumo em Texto (WhatsApp / E-mail)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrevStep}
              className="min-h-[44px] w-full py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Editar Resumo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
