import React, { useState, useEffect, useMemo } from 'react';
import { ViewTab, WebsiteLanguage, PortfolioProject } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import {
  OFFICIAL_EXTRA_FEATURES,
  ExtraFeature,
  SEGMENT_PRESETS,
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
  Mail,
  Instagram,
  Globe,
  AlertCircle,
  Plus,
  Zap,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Palette,
  Users,
  Layers,
  FileText,
  Clock,
  Phone,
  Edit2,
  Lock,
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

  // Mapeamento de modelo para segmento
  const getSegmentByModelTitle = (modelTitle: string): string => {
    const proj = portfolioProjects.find((p) => p.titulo === modelTitle);
    if (!proj) return 'services';
    if (proj.categoria === 'beleza-estetica') {
      return proj.id.includes('barbearia') ? 'barber' : 'beauty';
    }
    if (proj.categoria === 'saude-fitness') {
      return proj.id.includes('clinica') ? 'clinic' : 'fitness';
    }
    if (proj.categoria === 'imobiliario') return 'realEstate';
    if (proj.categoria === 'gastronomia') return 'food';
    if (proj.categoria === 'comercio') return 'retail';
    if (proj.categoria === 'arquitetura') return 'realEstate';
    if (proj.id.includes('clinica')) return 'clinic';
    return 'services';
  };

  // Etapa atual do Wizard Mobile: 1 = Plano/Apresentação | 2 = Personalização | 3 = Contato | 4 = Resumo
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // --- ETAPA 1: Ponto de partida & Plano ---
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || '');
  const [modelApproach, setModelApproach] = useState<'exact' | 'inspiration'>(
    initialModelApproach || 'exact'
  );
  const [startType, setStartType] = useState<'modelo' | 'propria' | 'plano'>(
    initialModel ? 'modelo' : 'propria'
  );
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'profissional');
  const [selectedSegment, setSelectedSegment] = useState<string>(() => {
    if (initialModel) return getSegmentByModelTitle(initialModel);
    return 'services';
  });

  // --- ETAPA 2: Personalização ---
  const [businessName, setBusinessName] = useState('');
  const [siteLanguage, setSiteLanguage] = useState<WebsiteLanguage>(
    initialWebsiteLanguage || (language === 'pt-PT' ? 'pt-PT' : language === 'en' ? 'en' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'pt-BR')
  );

  // Essencial
  const [essentialServices, setEssentialServices] = useState('');
  const [essentialColorMode, setEssentialColorMode] = useState<'suggest' | 'brand' | 'custom'>('suggest');
  const [essentialCustomColors, setEssentialCustomColors] = useState('');

  // Contato
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  // Persistência / Autosave específico para o Plano Essencial
  useEffect(() => {
    if (selectedPlan === 'essencial') {
      try {
        const raw = sessionStorage.getItem('nexaweb_briefing_draft_essencial');
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft.businessName && !businessName) setBusinessName(draft.businessName);
          if (draft.selectedSegment) setSelectedSegment(draft.selectedSegment);
          if (draft.essentialServices && !essentialServices) setEssentialServices(draft.essentialServices);
          if (draft.essentialColorMode) setEssentialColorMode(draft.essentialColorMode);
          if (draft.essentialCustomColors && !essentialCustomColors) setEssentialCustomColors(draft.essentialCustomColors);
          if (draft.contactName && !contactName) setContactName(draft.contactName);
          if (draft.contactPhone && !contactPhone) setContactPhone(draft.contactPhone);
          if (draft.contactEmail && !contactEmail) setContactEmail(draft.contactEmail);
          if (draft.specificNotes && !specificNotes) setSpecificNotes(draft.specificNotes);
        }
      } catch {
        // Ignora erro de JSON
      }
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedPlan === 'essencial') {
      try {
        const draft = {
          businessName,
          selectedSegment,
          essentialServices,
          essentialColorMode,
          essentialCustomColors,
          contactName,
          contactPhone,
          contactEmail,
          specificNotes,
        };
        sessionStorage.setItem('nexaweb_briefing_draft_essencial', JSON.stringify(draft));
      } catch {
        // Ignora erro de quota
      }
    }
  }, [
    selectedPlan,
    businessName,
    selectedSegment,
    essentialServices,
    essentialColorMode,
    essentialCustomColors,
    contactName,
    contactPhone,
    contactEmail,
    specificNotes,
  ]);

  // Personalizado
  const [visualStyle, setVisualStyle] = useState<string>('minimalist');
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [customSections, setCustomSections] = useState<string[]>([
    'Sobre Nós / História',
    'Serviços / Especialidades',
    'Contato / Localização',
  ]);
  const [customColorMode, setCustomColorMode] = useState<'suggest' | 'custom'>('suggest');
  const [customColors, setCustomColors] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [freeVision, setFreeVision] = useState('');

  // Profissional / Premium (Perfis de Acesso & Módulos)
  const [accessProfiles, setAccessProfiles] = useState<string[]>(['Cliente', 'Administrador']);
  const [strategicVision, setStrategicVision] = useState('');

  // Anexos (até 6 imagens, máx 10 MB)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- ETAPA 4: Envio & Feedback ---
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    projectId: string;
    message: string;
    isOfflineFallback?: boolean;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Validação amigável e controle do comparador de planos
  const [stepError, setStepError] = useState<string | null>(null);
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);

  // Sincroniza se vier de fora
  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    if (initialModel) {
      setSelectedModel(initialModel);
      setStartType('modelo');
      setSelectedSegment(getSegmentByModelTitle(initialModel));
    }
    if (initialModelApproach) {
      setModelApproach(initialModelApproach);
    }
  }, [initialModel, initialModelApproach]);

  // Avança de etapa com validação dos campos obrigatórios
  const handleNextStep = () => {
    setStepError(null);
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 2) {
      if (selectedPlan === 'essencial' && !businessName.trim()) {
        setStepError('Por favor, informe o nome do negócio ou projeto para continuar.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 3) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setStepError('Por favor, preencha seu nome e telefone/WhatsApp de contato para continuar.');
        return;
      }
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  // Clique direto nas abas com validação ao pular para a frente
  const handleStepClick = (targetStep: 1 | 2 | 3 | 4) => {
    setStepError(null);
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 1 && targetStep > 1) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 2 && targetStep > 2) {
      if (selectedPlan === 'essencial' && !businessName.trim()) {
        setStepError('Por favor, informe o nome do negócio ou projeto para continuar.');
        return;
      }
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 3 && targetStep > 3) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setStepError('Por favor, preencha seu nome e telefone/WhatsApp de contato.');
        return;
      }
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 1) return selectedPlan === 'essencial' ? 'Iniciar Briefing' : 'Avançar Etapa';
    if (currentStep === 2) return 'Avançar para Contato';
    if (currentStep === 3) return selectedPlan === 'essencial' ? 'Ver Resumo' : 'Revisar Proposta';
    return 'Concluir & Enviar';
  };

  // Notifica o gerenciador de navegação sobre a etapa atual para suporte unificado ao Voltar
  useEffect(() => {
    if (onStepChange) {
      onStepChange(
        currentStep,
        currentStep > 1,
        () => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as any : 1))
      );
    }
  }, [currentStep, onStepChange]);

  const planObj = plans.find((p) => p.id === selectedPlan) || plans[1];

  const segmentsOptions: { id: string; label: string; icon: string }[] = [
    { id: 'barber', label: 'Barbearia & Masculino', icon: '💈' },
    { id: 'beauty', label: 'Beleza & Estética', icon: '💅' },
    { id: 'fitness', label: 'Academia & Fitness', icon: '🏋️' },
    { id: 'realEstate', label: 'Imobiliária & Construtora', icon: '🏢' },
    { id: 'clinic', label: 'Clínica & Saúde', icon: '🩺' },
    { id: 'food', label: 'Restaurante & Gastronomia', icon: '🍽️' },
    { id: 'services', label: 'Prestador de Serviços', icon: '💼' },
    { id: 'retail', label: 'Comércio & Varejo', icon: '🛍️' },
    { id: 'creator', label: 'Criador de Conteúdo / Influenciador', icon: '📱' },
    { id: 'other', label: 'Outro Segmento', icon: '🌐' },
  ];

  const currentSegmentLabel =
    segmentsOptions.find((s) => s.id === selectedSegment)?.label || selectedSegment;

  // Cálculo de orçamento oficial
  const budget = useMemo(() => {
    return calculateBudget(selectedPlan, selectedFeatureIds, selectedSegment);
  }, [selectedPlan, selectedFeatureIds, selectedSegment]);

  const toggleFeature = (featId: string) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featId) ? prev.filter((id) => id !== featId) : [...prev, featId]
    );
  };

  const toggleProfile = (profile: string) => {
    setAccessProfiles((prev) =>
      prev.includes(profile) ? prev.filter((p) => p !== profile) : [...prev, profile]
    );
  };

  const toggleCustomSection = (sec: string) => {
    setCustomSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const getSiteLanguageLabel = (langCode: WebsiteLanguage): string => {
    switch (langCode) {
      case 'pt-BR':
        return 'Português (Brasil)';
      case 'pt-PT':
        return 'Português (Portugal)';
      case 'en':
        return 'Inglês (English)';
      case 'es':
        return 'Espanhol (Español)';
      case 'fr':
        return 'Francês (Français)';
      case 'pt-en':
        return 'Bilíngue (Português + Inglês)';
      default:
        return 'Outro idioma';
    }
  };

  // Gerador canônico do resumo em texto formatado
  const generateBriefingMessage = (): string => {
    const lines: string[] = [];

    if (selectedPlan === 'essencial') {
      lines.push('🌟 *BRIEFING OFICIAL — PLANO ESSENCIAL*');
      lines.push('━━━━━━━━━━━━━━━━━━━━');
      lines.push('💼 *Plano Selecionado:* Plano Essencial');
      lines.push('💰 *Investimento Estimado:* R$ 1.000 (Preço Fixo)');
      lines.push('⏱️ *Prazo Previsto:* 3–5 dias');
      lines.push(`🎯 *Modelo Base:* ${selectedModel || 'Influenciador Digital (Criador de Conteúdo)'}`);
      lines.push(`🏢 *Nome do Negócio / Empresa:* ${businessName || contactName || 'A definir'}`);
      lines.push(`🏷️ *Segmento:* ${currentSegmentLabel}`);
      if (essentialServices) lines.push(`📋 *Serviços/Produtos a Apresentar:* ${essentialServices}`);
      lines.push(
        essentialColorMode === 'suggest'
          ? '🎨 *Cores:* Sugestão NexaWeb'
          : essentialColorMode === 'brand'
          ? `🎨 *Cores:* Minhas cores de marca (${essentialCustomColors || 'Identidade existente'})`
          : `🎨 *Cores:* Tons específicos (${essentialCustomColors || 'A definir'})`
      );
      lines.push(`👤 *Nome/Empresa:* ${contactName || businessName || 'Não informado'}`);
      lines.push(`📱 *WhatsApp:* ${contactPhone || 'Não informado'}`);
      if (contactEmail) lines.push(`✉️ *E-mail:* ${contactEmail}`);
      if (attachedFiles.length > 0) lines.push(`📎 *Uploads:* ${attachedFiles.length} foto(s)/logo`);
      if (specificNotes) lines.push(`💬 *Observações:* ${specificNotes}`);
      lines.push('');
      lines.push('Aguardando retorno da equipe NexaWeb!');
      return lines.join('\n');
    }

    lines.push('🌟 *BRIEFING OFICIAL — NEXAWEB*');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`💼 *Plano Escolhido:* Plano ${planObj.nome} (${planObj.preco} • ${planObj.tagline})`);
    lines.push(`💰 *Investimento Estimado:* ${budget.formattedTotalPrice}`);
    lines.push(`⏱️ *Prazo Previsto:* ${planObj.prazo}`);

    if (startType === 'modelo' && selectedModel) {
      lines.push(`🎯 *Modelo de Referência:* ${selectedModel}`);
      lines.push(
        modelApproach === 'exact'
          ? '📌 *Abordagem:* Quero exatamente este formato'
          : '📌 *Abordagem:* Usar como inspiração para personalizar'
      );
    } else {
      lines.push(`🎯 *Ponto de Partida:* ${startType === 'propria' ? 'Ideia própria sob medida' : 'Escolha direta de plano'}`);
    }

    lines.push(`🏢 *Nome do Negócio:* ${businessName || 'A definir'}`);
    lines.push(`🏷️ *Segmento:* ${currentSegmentLabel}`);
    lines.push(`🌐 *Idioma do Futuro Site:* ${getSiteLanguageLabel(siteLanguage)}`);
    lines.push(`👤 *Responsável:* ${contactName || 'Não informado'}`);
    lines.push(`📱 *Telefone / Contato:* ${contactPhone || 'Não informado'}`);
    if (contactEmail) lines.push(`✉️ *E-mail:* ${contactEmail}`);

    lines.push('');
    if (selectedPlan === 'essencial') {
      if (essentialServices) lines.push(`📋 *Serviços Principais:* ${essentialServices}`);
      lines.push(
        essentialColorMode === 'suggest'
          ? '🎨 *Cores:* Sugerida pela NexaWeb (Harmonia visual)'
          : `🎨 *Cores da Marca:* ${essentialCustomColors || 'Tons específicos indicados'}`
      );
    } else if (selectedPlan === 'personalizado') {
      lines.push(`🎨 *Estilo Visual:* ${visualStyle}`);
      if (customSections.length > 0) lines.push(`📑 *Seções:* ${customSections.join(', ')}`);
      if (budget.selectedFeatures.length > 0) {
        lines.push(`⚡ *Recursos Extras:* ${budget.selectedFeatures.map((f) => f.nome).join(', ')}`);
      }
      lines.push(
        customColorMode === 'suggest'
          ? '🎨 *Cores:* Sugerida pela NexaWeb'
          : `🎨 *Cores Escolhidas:* ${customColors || 'Tons indicados'}`
      );
      if (referenceLink) lines.push(`🔗 *Inspiração Visual:* ${referenceLink}`);
      if (freeVision) lines.push(`📝 *Visão Livre:* ${freeVision}`);
    } else {
      // Profissional & Premium
      if (budget.selectedFeatures.length > 0) {
        lines.push(`✨ *Módulos e Recursos Selecionados:* ${budget.selectedFeatures.map((f) => f.nome).join(', ')}`);
      }
      if (accessProfiles.length > 0) {
        lines.push(`👥 *Níveis de Acesso:* ${accessProfiles.join(', ')}`);
      }
      if (referenceLink) lines.push(`🔗 *Inspiração Visual:* ${referenceLink}`);
      if (strategicVision) lines.push(`📝 *Visão do Projeto / Diferenciais:* ${strategicVision}`);
    }

    if (attachedFiles.length > 0) {
      lines.push(`📎 *Arquivos Selecionados:* ${attachedFiles.length} foto(s)/logo`);
    }
    if (specificNotes) {
      lines.push(`💬 *Observações:* ${specificNotes}`);
    }

    lines.push('');
    lines.push('Aguardando retorno da equipe NexaWeb!');
    return lines.join('\n');
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

  // Envio definitivo ao backend oficial
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
      clientEmail: contactEmail.trim(),
      clientPhone: contactPhone.trim(),
      phone: contactPhone.trim(),
      segmento: currentSegmentLabel,
      plano: selectedPlan,
      plan: selectedPlan,
      idiomaSite: siteLanguage,
      clientNotes: specificNotes.trim() || freeVision.trim() || strategicVision.trim() || 'Proposta via NexaWeb App',
      necessidades: specificNotes.trim() || freeVision.trim() || strategicVision.trim() || 'Proposta via NexaWeb App',
      recursosSelecionados: selectedFeatureIds,
      orcamentoEstimado: budget.formattedTotalPrice,
      valorNumerico: budget.totalPrice,
      origem: selectedModel ? `Baseado na demo: ${selectedModel}` : 'Ideia sob medida',
      briefingSummary: briefingText,
    };

    try {
      const res = await createBriefing(payload);
      if (res.success && res.projectId) {
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
    } catch {
      setSubmissionError('Falha temporária de conexão com o servidor. Entre em contato por e-mail ou Instagram.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      {/* 1. Indicador de Progresso do Wizard Mobile (01 a 04) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Etapa {currentStep} de 4
            </span>
            <span className="text-xs font-bold text-white">
              {currentStep === 1 && (selectedPlan === 'essencial' ? 'Apresentação do Plano' : 'Plano & Ponto de Partida')}
              {currentStep === 2 && (selectedPlan === 'essencial' ? 'Personalização · Plano Essencial' : 'Personalização do Projeto')}
              {currentStep === 3 && 'Informações de Contato'}
              {currentStep === 4 && (selectedPlan === 'essencial' ? 'Revisão Final' : 'Revisão & Envio Oficial')}
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            {budget.formattedTotalPrice}
          </span>
        </div>

        {/* Barra de Progresso Suave */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Abas Superiores Interativas */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
          {[
            { step: 1, label: selectedPlan === 'essencial' ? '01 Apresentação' : '01 Plano' },
            { step: 2, label: selectedPlan === 'essencial' ? '02 Personalização' : '02 Briefing' },
            { step: 3, label: '03 Contato' },
            { step: 4, label: selectedPlan === 'essencial' ? '04 Revisão' : '04 Resumo' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => handleStepClick(item.step as any)}
              className={`min-h-[38px] flex items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[10.5px] font-bold transition-all active:scale-95 ${
                currentStep === item.step
                  ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/40 shadow-sm'
                  : currentStep > item.step
                  ? 'text-emerald-400 hover:text-white bg-emerald-950/20 border border-emerald-900/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Validação de Etapa */}
      {stepError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 1: PLANO / APRESENTAÇÃO & PONTO DE PARTIDA                */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Apresentação Oficial do Plano Essencial */}
          {selectedPlan === 'essencial' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
              {/* Cabeçalho do Plano */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                    Plano Selecionado
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-white">Plano Essencial</h2>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-mono font-black text-cyan-300">R$ 1.000</span>
                  <span className="text-[10px] text-slate-500 block">Investimento fixo</span>
                </div>
              </div>

              {/* Informações Oficiais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Modelo de referência:</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs">
                    {selectedModel || 'Influenciador Digital (Criador de Conteúdo)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Investimento:</span>
                  <span className="font-bold text-cyan-300 font-mono text-[11px] sm:text-xs">R$ 1.000</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Prazo:</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs">3–5 dias</span>
                </div>
              </div>

              {/* Visão do Plano */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Visão:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/70">
                  Um site moderno, rápido e direto, pensado para colocar o negócio na internet com profissionalismo e bom custo-benefício.
                </p>
              </div>

              {/* Ideal para */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
                <span className="font-bold text-cyan-300 block mb-0.5">Ideal para:</span>
                <span className="text-slate-300">
                  Autônomos, profissionais de serviços, pequenos negócios e criadores.
                </span>
              </div>

              {/* Incluído */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  INCLUÍDO:
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {[
                    'Apresentação completa do negócio, serviços e diferenciais',
                    'Estrutura Home, Sobre, Serviços, Informações e Contato',
                    'Botão fixo de WhatsApp e links para redes sociais',
                    'Layout profissional, responsivo e de carregamento rápido',
                    'Otimização para Google (SEO básico)',
                    'Formulário de contato integrado',
                    'Publicação e configuração do domínio',
                    'Suporte na entrega',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diferenciais */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  DIFERENCIAIS:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                  {[
                    'Entrega rápida de 3–5 dias',
                    'Excelente custo-benefício',
                    'Estrutura limpa e objetiva',
                    'Totalmente adaptado para celular (mobile-first)',
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="text-[11px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Se veio com modelo de referência */}
          {selectedModel && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/35 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Layout className="w-4 h-4 text-cyan-400" />
                  Modelo de Referência Selecionado
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Destaque</span>
              </div>
              <p className="text-sm font-extrabold text-white">{selectedModel}</p>

              {/* Escolha da abordagem correspondente do site */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Como deseja utilizar este modelo?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModelApproach('exact')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      modelApproach === 'exact'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>Quero exatamente este formato</span>
                    {modelApproach === 'exact' && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModelApproach('inspiration')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      modelApproach === 'inspiration'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>Usar como inspiração sob medida</span>
                    {modelApproach === 'inspiration' && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alternar de plano no Plano Essencial */}
          {selectedPlan === 'essencial' && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowPlanSwitcher((prev) => !prev)}
                className="text-xs text-slate-400 hover:text-cyan-400 font-medium underline underline-offset-4 transition-colors"
              >
                {showPlanSwitcher ? 'Ocultar outros planos' : 'Deseja ver ou comparar com outro plano?'}
              </button>
            </div>
          )}

          {/* Seleção de ponto de partida e outros planos (visível em outros planos ou se acionado) */}
          {(selectedPlan !== 'essencial' || showPlanSwitcher) && (
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              {/* Seleção do Ponto de Partida se não veio com modelo */}
              {!selectedModel && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Como você deseja começar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStartType('propria')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        startType === 'propria'
                          ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 mb-1.5" />
                      <div>
                        <span className="text-xs font-bold block">Ideia Própria</span>
                        <span className="text-[10px] text-slate-500 block">Do zero sob medida</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('portfolio')}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 text-left flex flex-col justify-between transition-all"
                    >
                      <Layout className="w-4 h-4 text-amber-400 mb-1.5" />
                      <div>
                        <span className="text-xs font-bold block text-slate-200">A Partir de Amostra</span>
                        <span className="text-[10px] text-slate-500 block">Ver 22 demos no ar</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Comparativo Oficial dos 4 Planos */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Selecione o Plano da NexaWeb:
                  </label>
                  <span className="text-[10px] text-slate-500">4 opções disponíveis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plans.map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                              Plano {p.nome}
                            </span>
                            <span className="text-xs font-bold text-cyan-400 font-mono">
                              {p.preco}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-snug mb-2">
                            {p.tagline}
                          </p>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>Prazo: {p.prazo}</span>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-[10px] text-slate-500 line-clamp-1">{p.descricao}</span>
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
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 2: PERSONALIZAÇÃO DINÂMICA (Conforme Plano e Segmento)   */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* --- CASO 1: PLANO ESSENCIAL --- */}
          {selectedPlan === 'essencial' ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                    Personalização · Plano Essencial
                  </span>
                  <h3 className="text-sm font-bold text-white">Dados do seu Site</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-cyan-300">R$ 1.000</span>
                  <span className="text-[10px] text-slate-500 block">Plano Essencial</span>
                </div>
              </div>

              {/* 1. Nome do Negócio ou Projeto * */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  1. Nome do Negócio ou Projeto *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  placeholder="Ex: Carlos Criador, Studio Bella, Barbearia Imperial..."
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 2. Segmento */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  2. Segmento
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {segmentsOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Serviços/produtos que deseja apresentar */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  3. Serviços/produtos que deseja apresentar
                </label>
                <textarea
                  value={essentialServices}
                  onChange={(e) => setEssentialServices(e.target.value)}
                  rows={3}
                  placeholder="Ex: Consultorias, cortes e barbas, criação de conteúdo, pacotes mensais, atendimento presencial ou online..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* ESTRUTURA INCLUÍDA */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ESTRUTURA INCLUÍDA:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <div>• Home / Destaque</div>
                  <div>• Sobre / Equipe</div>
                  <div>• Serviços / Preços</div>
                  <div>• Contato + botão fixo de WhatsApp</div>
                </div>
              </div>

              {/* CORES */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  CORES:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEssentialColorMode('suggest')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                      essentialColorMode === 'suggest'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Sugestão NexaWeb</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Harmonia visual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEssentialColorMode('brand')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                      essentialColorMode === 'brand'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Minhas cores de marca</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Identidade atual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEssentialColorMode('custom')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                      essentialColorMode === 'custom'
                        ? 'bg-purple-950/40 border-purple-500 text-white font-bold ring-1 ring-purple-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Tons específicos</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Digitar cores</span>
                  </button>
                </div>

                {(essentialColorMode === 'custom' || essentialColorMode === 'brand') && (
                  <input
                    type="text"
                    value={essentialCustomColors}
                    onChange={(e) => setEssentialCustomColors(e.target.value)}
                    placeholder="Ex: Preto fosco e dourado, azul escuro e branco, etc."
                    className="w-full min-h-[44px] mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>

              {/* UPLOADS */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Fotos / Logo (Opcional)
                </span>
                <ImageUploadField
                  files={attachedFiles}
                  onChange={setAttachedFiles}
                />
              </div>

              {/* ESTIMATIVA */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">ESTIMATIVA:</span>
                <span className="font-mono font-bold text-cyan-300">R$ 1.000 (Preço Fixo)</span>
              </div>
            </div>
          ) : (
            <>
              {/* Informações Básicas: Nome do Negócio & Idioma do Futuro Site */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Identificação do Futuro Site
                </h3>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nome da Empresa, Negócio ou Projeto *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ex: Barbearia Imperial, Studio Bella, Lumina Estética..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Idioma do Futuro Site — Mapeado exatamente no Briefing */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Idioma do Futuro Site do Cliente:
                  </label>
                  <select
                    value={siteLanguage}
                    onChange={(e) => setSiteLanguage(e.target.value as WebsiteLanguage)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="pt-BR">🇧🇷 Português (Brasil) - Padrão</option>
                    <option value="pt-PT">🇵🇹 Português (Portugal)</option>
                    <option value="en">🇺🇸 Inglês (English)</option>
                    <option value="es">🇪🇸 Espanhol (Español)</option>
                    <option value="fr">🇫🇷 Francês (Français)</option>
                    <option value="pt-en">🌎 Bilíngue (Português + English)</option>
                    <option value="other">🌐 Outro idioma</option>
                  </select>
                </div>
              </div>

          {/* --- CASO 2: PLANO PERSONALIZADO --- */}
          {selectedPlan === 'personalizado' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Configurações do Projeto Sob Medida
              </span>

              {/* Segmento */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  1. Segmento de Atuação do Projeto:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {segmentsOptions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSegment(s.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        selectedSegment === s.id
                          ? 'bg-amber-950/40 border-amber-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] block leading-tight">{s.icon} {s.label.split('&')[0].trim()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo Visual */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  2. Escolha o Estilo Visual do Site:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'minimalist', label: 'Minimalista & Elegante' },
                    { id: 'corporate', label: 'Corporativo Moderno' },
                    { id: 'luxury', label: 'Sofisticado / Luxo' },
                    { id: 'creative', label: 'Criativo & Vibrante' },
                    { id: 'tech', label: 'Tecnológico / Dark Mode' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setVisualStyle(st.label)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        visualStyle === st.label
                          ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seções Desejadas */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  3. Seções Desejadas no Site:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Sobre Nós / História',
                    'Serviços / Especialidades',
                    'Projetos / Portfólio',
                    'Depoimentos de Clientes',
                    'Perguntas Frequentes (FAQ)',
                    'Contato / Localização',
                    'Página Adicional (+R$ 150)',
                  ].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleCustomSection(sec)}
                      className={`p-2 rounded-xl border text-left text-[11px] flex items-center justify-between ${
                        customSections.includes(sec)
                          ? 'bg-indigo-950/40 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="truncate">{sec}</span>
                      {customSections.includes(sec) && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paleta de Cores */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  4. Paleta de Cores:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomColorMode('suggest')}
                    className={`p-2 rounded-xl border text-xs text-left ${
                      customColorMode === 'suggest'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    NexaWeb sugere paleta ideal
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomColorMode('custom')}
                    className={`p-2 rounded-xl border text-xs text-left ${
                      customColorMode === 'custom'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Quero indicar as cores
                  </button>
                </div>
                {customColorMode === 'custom' && (
                  <input
                    type="text"
                    value={customColors}
                    onChange={(e) => setCustomColors(e.target.value)}
                    placeholder="Ex: Preto, dourado e off-white..."
                    className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>

              {/* Visão Livre */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Como você imagina seu site? (Visão livre)
                </label>
                <textarea
                  value={freeVision}
                  onChange={(e) => setFreeVision(e.target.value)}
                  rows={3}
                  placeholder="Conte livremente sobre a identidade que deseja transmitir, público-alvo e referências..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* --- CASO 3: PLANOS PROFISSIONAL E PREMIUM --- */}
          {(selectedPlan === 'profissional' || selectedPlan === 'premium') && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Estrutura Avançada ({selectedPlan === 'premium' ? 'Plano Premium' : 'Plano Profissional'})
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20">
                  Modular
                </span>
              </div>

              {/* Segmento */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  1. Selecione o Segmento de Atuação:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {segmentsOptions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSegment(s.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        selectedSegment === s.id
                          ? 'bg-indigo-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] block leading-tight">{s.icon} {s.label.split('&')[0].trim()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recursos Extras Oficiais da NexaWeb com Preço em Tempo Real */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  2. Recursos & Funcionalidades Extras (Opcional):
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {OFFICIAL_EXTRA_FEATURES.filter(f => selectedPlan === 'premium' || !f.isRealtime).slice(0, 8).map((feat) => {
                    const isSelected = selectedFeatureIds.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="block truncate text-white">{feat.nome}</span>
                          <span className="block text-[10px] text-slate-500 truncate">{feat.descricao}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-300 shrink-0">
                          + R$ {feat.preco}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Perfis de Acesso e Contas Necessárias (RBAC) */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  3. Níveis de Acesso e Contas Necessárias:
                </label>
                <p className="text-[10px] text-slate-500">
                  Indique quais perfis farão login no sistema do seu projeto:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'Cliente', desc: 'Agendamentos e perfil' },
                    { id: 'Administrador', desc: 'Gestão completa' },
                    { id: 'Atendimento / Recepcionista', desc: 'Controle de agendas' },
                    { id: 'Especialista / Profissional', desc: 'Prestador de serviço' },
                  ].map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => toggleProfile(prof.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        accessProfiles.includes(prof.id)
                          ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs block text-white">{prof.id}</span>
                      <span className="text-[10px] block text-slate-500 mt-0.5">{prof.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visão Estratégica do Projeto */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Detalhes Estratégicos ou Visão do Projeto:
                </label>
                <textarea
                  value={strategicVision}
                  onChange={(e) => setStrategicVision(e.target.value)}
                  rows={3}
                  placeholder="Descreva particularidades do seu modelo de negócio, objetivos comerciais e diferenciais..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Anexos: Fotos e Logotipo (Até 6 imagens, máx 10 MB) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Fotos do Espaço, Equipe ou Logotipo (Opcional):
            </span>
            <ImageUploadField
              files={attachedFiles}
              onChange={setAttachedFiles}
            />
          </div>
            </>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 3: CONTATO DO RESPONSÁVEL                                */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Contato Oficial
              </span>
              <h3 className="text-sm font-bold text-white">
                Informe seus dados para contato da NexaWeb
              </h3>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {selectedPlan === 'essencial' ? 'Nome ou Empresa *' : 'Seu Nome ou Nome do Responsável *'}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder={selectedPlan === 'essencial' ? 'Ex: Carlos Silva ou Minha Empresa' : 'Ex: Carlos Silva, Juliana Mendes...'}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {selectedPlan === 'essencial' ? 'WhatsApp com DDD *' : 'Telefone / Celular de Contato com DDD *'}
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder="Ex: (11) 99999-9999"
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {selectedPlan === 'essencial' ? 'E-mail — opcional' : 'E-mail de Contato (Opcional):'}
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Ex: contato@minhaempresa.com.br"
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {selectedPlan === 'essencial' ? 'Observações' : 'Observações ou Detalhes Específicos:'}
              </label>
              <textarea
                value={specificNotes}
                onChange={(e) => setSpecificNotes(e.target.value)}
                rows={3}
                placeholder={selectedPlan === 'essencial' ? 'Detalhes ou preferências adicionais...' : 'Ex: Gostaria de prazos curtos, integração com sistema legado, etc.'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Canais Oficiais de Atendimento NexaWeb (Sem WhatsApp) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">
              Canais Oficiais de Atendimento NexaWeb:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <a
                href="mailto:nexaweeb@gmail.com"
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>E-mail</span>
              </a>

              <a
                href="https://www.instagram.com/nexaw1/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </a>

              <a
                href="https://nexaweeb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Site Oficial</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 4: RESUMO & ENVIO DEFINITIVO                             */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Card Resumo Completo com Edição Rápida */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {selectedPlan === 'essencial' ? 'Revisão Final' : 'Resumo da Proposta Oficial'}
              </span>
              <span className="text-xs font-mono font-extrabold text-white">
                {budget.formattedTotalPrice}
              </span>
            </div>

            {selectedPlan === 'essencial' ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Plano selecionado:</span>
                  <span className="font-bold text-white">Essencial</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Estimativa:</span>
                  <span className="font-mono font-bold text-cyan-300">R$ 1.000</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Nome/Empresa:</span>
                  <span className="font-semibold text-white text-right">{businessName || contactName || 'Não informado'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">WhatsApp:</span>
                  <span className="font-mono text-white text-right">{contactPhone || 'Não informado'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">E-mail:</span>
                  <span className="text-white text-right">{contactEmail || 'Não informado'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Segmento:</span>
                  <span className="text-white text-right">{currentSegmentLabel}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cores:</span>
                  <span className="text-white text-right">
                    {essentialColorMode === 'suggest'
                      ? 'Sugestão NexaWeb'
                      : essentialColorMode === 'brand'
                      ? (essentialCustomColors || 'Minhas cores de marca')
                      : (essentialCustomColors || 'A definir')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Modelo base:</span>
                  <span className="font-semibold text-cyan-300 text-right">{selectedModel || 'Influenciador Digital'}</span>
                </div>

                {essentialServices && (
                  <div className="py-1 border-b border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Serviços/produtos:</span>
                    <span className="text-slate-200 block text-[11px]">{essentialServices}</span>
                  </div>
                )}

                {attachedFiles.length > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fotos/Logo:</span>
                    <span className="font-mono text-cyan-300">{attachedFiles.length} de 6 arquivo(s)</span>
                  </div>
                )}

                {specificNotes && (
                  <div className="py-1">
                    <span className="text-slate-400 block mb-0.5">Observações:</span>
                    <span className="text-slate-200 block text-[11px]">{specificNotes}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-300 font-mono">
                <div>• <strong>Plano:</strong> {planObj.nome} ({planObj.preco} · {planObj.prazo})</div>
                <div>• <strong>Empresa / Projeto:</strong> {businessName || 'A definir'}</div>
                <div>• <strong>Segmento:</strong> {currentSegmentLabel}</div>
                <div>• <strong>Idioma do Site:</strong> {getSiteLanguageLabel(siteLanguage)}</div>

                {selectedModel && (
                  <div>• <strong>Modelo de Referência:</strong> {selectedModel} ({modelApproach === 'exact' ? 'Formato exato' : 'Inspiração sob medida'})</div>
                )}

                {selectedPlan === 'personalizado' && (
                  <div>• <strong>Estilo:</strong> {visualStyle}</div>
                )}

                {budget.selectedFeatures.length > 0 && (
                  <div>• <strong>Recursos Selecionados:</strong> {budget.selectedFeatures.map((f) => f.nome).join(', ')}</div>
                )}

                {accessProfiles.length > 0 && (
                  <div>• <strong>Perfis de Acesso:</strong> {accessProfiles.join(', ')}</div>
                )}

                <div>• <strong>Responsável:</strong> {contactName || 'Não informado'}</div>
                <div>• <strong>Contato:</strong> {contactPhone || 'Não informado'}</div>
                {contactEmail && <div>• <strong>E-mail:</strong> {contactEmail}</div>}
                <div>• <strong>Anexos:</strong> {attachedFiles.length} foto(s)/logo</div>
                {specificNotes && <div>• <strong>Observações:</strong> {specificNotes}</div>}
              </div>
            )}

            {/* Ações de Edição Rápida de Etapas */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Editar personalização</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Editar contato</span>
              </button>
            </div>
          </div>

          {/* Feedback de Sucesso Real ou Fallback Offline */}
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
                    ? 'Código gerado em modo de segurança'
                    : 'Briefing recebido com sucesso pela equipe NexaWeb!'}
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

          {/* Feedback de Erro */}
          {submissionError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Botões Finais de Ação */}
          <div className="space-y-2">
            {!submissionSuccess ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitProject}
                className="min-h-[50px] w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registrando Projeto...' : 'Enviar Briefing para NexaWeb'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Voltar ao Início do Aplicativo</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyBriefing}
              className={`min-h-[44px] w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                copied
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
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
                  <span>Copiar Resumo em Texto</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BARRA DE NAVEGAÇÃO ENTRE ETAPAS FIXA NO RODAPÉ MOBILE           */}
      {/* ============================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Botão Voltar Etapa */}
          <button
            type="button"
            onClick={() => {
              setStepError(null);
              if (currentStep > 1) {
                setCurrentStep((prev) => (prev - 1) as any);
              } else {
                if (onBack) {
                  onBack();
                } else {
                  onNavigate('home');
                }
              }
            }}
            className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {/* Botão Avançar Etapa ou Enviar */}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[44px] flex-1 max-w-[210px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950/50 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonText()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || Boolean(submissionSuccess)}
              onClick={handleSubmitProject}
              className="min-h-[44px] flex-1 max-w-[220px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {submissionSuccess
                  ? 'Briefing Enviado'
                  : isSubmitting
                  ? 'Enviando...'
                  : 'Concluir & Enviar'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
