import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  generateOfflineBriefingProtocol,
} from '../utils/briefingService';
import {
  getBriefingDraftSync,
  getBriefingDraft,
  saveBriefingDraft,
  clearBriefingDraft,
} from '../utils/storage';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export const PREMIUM_SEGMENTS: { id: string; label: string; icon: string }[] = [
  { id: 'fitness-saude', label: 'Fitness & Saúde', icon: '🏋️' },
  { id: 'academia', label: 'Academia', icon: '💪' },
  { id: 'barbearia', label: 'Barbearia', icon: '💈' },
  { id: 'beleza-estilo', label: 'Beleza & Estilo', icon: '💅' },
  { id: 'restaurante', label: 'Restaurante', icon: '🍽️' },
  { id: 'alimentos-bebidas', label: 'Alimentos & Bebidas', icon: '🍷' },
  { id: 'imobiliaria', label: 'Imobiliária', icon: '🏢' },
  { id: 'mercado-imobiliario', label: 'Mercado Imobiliário', icon: '🏙️' },
  { id: 'oficina', label: 'Oficina', icon: '🔧' },
  { id: 'mecanica-auto', label: 'Mecânica & Auto', icon: '🚗' },
  { id: 'hotel', label: 'Hotel', icon: '🏨' },
  { id: 'hospitalidade-turismo', label: 'Hospitalidade & Turismo', icon: '✈️' },
  { id: 'loja', label: 'Loja', icon: '🛍️' },
  { id: 'comercio-eletronico', label: 'Comércio Eletrônico', icon: '🛒' },
  { id: 'educacao', label: 'Educação', icon: '🎓' },
  { id: 'ensino-treinamentos', label: 'Ensino & Treinamentos', icon: '📚' },
  { id: 'fotografia', label: 'Fotografia', icon: '📷' },
  { id: 'artes-visuais', label: 'Artes Visuais', icon: '🎨' },
  { id: 'eventos', label: 'Eventos', icon: '🎉' },
  { id: 'producao-eventos', label: 'Produção de Eventos', icon: '🎪' },
  { id: 'engenharia', label: 'Engenharia', icon: '📐' },
  { id: 'arquitetura-projetos', label: 'Arquitetura & Projetos', icon: '🏛️' },
  { id: 'criador-conteudo', label: 'Criador de Conteúdo', icon: '📱' },
  { id: 'criadores-midia', label: 'Criadores & Mídia', icon: '🎬' },
  { id: 'prestador-servico', label: 'Prestador de Serviço', icon: '💼' },
  { id: 'servicos-especializados', label: 'Serviços Especializados', icon: '⚙️' },
  { id: 'clinica-medica', label: 'Clínica Médica', icon: '🩺' },
  { id: 'saude-cuidados', label: 'Saúde & Cuidados', icon: '❤️' },
  { id: 'pet-shop', label: 'Pet Shop', icon: '🐾' },
  { id: 'mundo-pet', label: 'Mundo Pet', icon: '🐶' },
  { id: 'advocacia', label: 'Advocacia', icon: '⚖️' },
  { id: 'juridico-consultoria', label: 'Jurídico & Consultoria', icon: '📜' },
  { id: 'contabilidade', label: 'Contabilidade', icon: '📊' },
  { id: 'gestao-financeira', label: 'Gestão Financeira', icon: '💰' },
  { id: 'empresa-b2b', label: 'Empresa B2B', icon: '🤝' },
  { id: 'corporativo', label: 'Corporativo', icon: '🏢' },
];

const getDynamicPremiumPages = (seg: string): { title: string; note: string }[] => {
  const isGym = seg === 'academia' || seg === 'fitness-saude' || seg === 'fitness';
  if (isGym) {
    return [
      { title: 'Home / destaque', note: 'Incluso' },
      { title: 'Sobre / metodologia', note: 'Incluso' },
      { title: 'Modalidades / aulas', note: 'Incluso' },
      { title: 'Professores / equipe', note: 'Incluso' },
      { title: 'Horários', note: 'Incluso' },
      { title: 'Planos / mensalidades', note: 'Incluso' },
      { title: 'Galeria', note: 'Incluso' },
      { title: 'Depoimentos', note: 'Incluso' },
      { title: 'FAQ', note: 'Incluso' },
      { title: 'Localização / mapas', note: 'Incluso' },
      { title: 'Contato / matrícula', note: 'Incluso' },
    ];
  }
  if (seg === 'clinica-medica' || seg === 'saude-cuidados' || seg === 'clinic') {
    return [
      { title: 'Home / destaque', note: 'Incluso' },
      { title: 'Sobre / corpo clínico', note: 'Incluso' },
      { title: 'Especialidades / exames', note: 'Incluso' },
      { title: 'Equipe médica', note: 'Incluso' },
      { title: 'Horários / atendimento', note: 'Incluso' },
      { title: 'Planos / convênios', note: 'Incluso' },
      { title: 'Galeria / estrutura', note: 'Incluso' },
      { title: 'Depoimentos de pacientes', note: 'Incluso' },
      { title: 'FAQ médica', note: 'Incluso' },
      { title: 'Localização / mapas', note: 'Incluso' },
      { title: 'Contato / agendamento', note: 'Incluso' },
    ];
  }
  if (seg === 'imobiliaria' || seg === 'mercado-imobiliario' || seg === 'realEstate') {
    return [
      { title: 'Home / destaque', note: 'Incluso' },
      { title: 'Sobre / imobiliária', note: 'Incluso' },
      { title: 'Empreendimentos / catálogo', note: 'Incluso' },
      { title: 'Corretores / equipe', note: 'Incluso' },
      { title: 'Horários / plantão', note: 'Incluso' },
      { title: 'Condições / financiamento', note: 'Incluso' },
      { title: 'Galeria de fotos', note: 'Incluso' },
      { title: 'Depoimentos de clientes', note: 'Incluso' },
      { title: 'FAQ imobiliária', note: 'Incluso' },
      { title: 'Localização / mapas', note: 'Incluso' },
      { title: 'Contato / visitas', note: 'Incluso' },
    ];
  }
  if (seg === 'restaurante' || seg === 'alimentos-bebidas' || seg === 'food') {
    return [
      { title: 'Home / destaque', note: 'Incluso' },
      { title: 'Sobre / história', note: 'Incluso' },
      { title: 'Cardápio / pratos', note: 'Incluso' },
      { title: 'Chef / equipe', note: 'Incluso' },
      { title: 'Horários de funcionamento', note: 'Incluso' },
      { title: 'Reservas / eventos', note: 'Incluso' },
      { title: 'Galeria gastronômica', note: 'Incluso' },
      { title: 'Avaliações de clientes', note: 'Incluso' },
      { title: 'FAQ restaurante', note: 'Incluso' },
      { title: 'Localização / mapas', note: 'Incluso' },
      { title: 'Contato / reservas', note: 'Incluso' },
    ];
  }
  return [
    { title: 'Home / destaque', note: 'Incluso' },
    { title: 'Sobre / apresentação', note: 'Incluso' },
    { title: 'Serviços / especialidades', note: 'Incluso' },
    { title: 'Profissionais / equipe', note: 'Incluso' },
    { title: 'Horários / atendimento', note: 'Incluso' },
    { title: 'Planos / propostas', note: 'Incluso' },
    { title: 'Galeria institucional', note: 'Incluso' },
    { title: 'Depoimentos de clientes', note: 'Incluso' },
    { title: 'FAQ', note: 'Incluso' },
    { title: 'Localização / mapas', note: 'Incluso' },
    { title: 'Contato comercial', note: 'Incluso' },
  ];
};

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
    if (initialPlan === 'premium') return 'academia';
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

  // Personalizado
  const [visualStyle, setVisualStyle] = useState<string>('minimalist');
  const [customSections, setCustomSections] = useState<string[]>([
    'Sobre Nós / História',
    'Serviços / Especialidades',
    'Contato / Localização',
  ]);
  const [customColorMode, setCustomColorMode] = useState<'suggest' | 'custom'>('suggest');
  const [customColors, setCustomColors] = useState('');
  const [freeVision, setFreeVision] = useState('');

  // Profissional / Premium (Perfis de Acesso & Módulos)
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [accessProfiles, setAccessProfiles] = useState<string[]>(['Cliente', 'Administrador']);
  const [referenceLink, setReferenceLink] = useState('');
  const [strategicVision, setStrategicVision] = useState('');

  // Premium
  const [premiumColorMode, setPremiumColorMode] = useState<'suggest' | 'brand' | 'custom'>('suggest');
  const [premiumCustomColors, setPremiumCustomColors] = useState('');

  // Contato
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  // Anexos (até 6 imagens, máx 10 MB)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- ETAPA 4: Envio & Feedback ---
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    projectId: string;
    message: string;
    isOfflineFallback?: boolean;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Validação amigável e controle do comparador de planos
  const [stepError, setStepError] = useState<string | null>(null);
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false);

  // Controle de autosave com debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Recuperação e restauração unificada do rascunho persistido (localStorage + Capacitor Preferences)
  useEffect(() => {
    let isCancelled = false;

    const restoreDraft = async () => {
      const draft = getBriefingDraftSync(selectedPlan) || (await getBriefingDraft(selectedPlan));
      if (!draft || isCancelled) return;

      // Recupera a etapa quando o usuário não iniciou por uma ação externa explícita
      if (!initialModel && draft.step && draft.step >= 1 && draft.step <= 4) {
        setCurrentStep(draft.step);
      }

      if (draft.businessName) setBusinessName((prev) => prev || draft.businessName || '');
      if (draft.selectedSegment && !initialModel) setSelectedSegment(draft.selectedSegment);
      if (draft.contactName) setContactName((prev) => prev || draft.contactName || '');
      if (draft.contactPhone) setContactPhone((prev) => prev || draft.contactPhone || '');
      if (draft.contactEmail) setContactEmail((prev) => prev || draft.contactEmail || '');
      if (draft.specificNotes) setSpecificNotes((prev) => prev || draft.specificNotes || '');
      if (draft.siteLanguage) setSiteLanguage((prev) => prev || draft.siteLanguage || 'pt-BR');

      // Essencial
      if (draft.essentialServices) setEssentialServices((prev) => prev || draft.essentialServices || '');
      if (draft.essentialColorMode) setEssentialColorMode(draft.essentialColorMode);
      if (draft.essentialCustomColors) setEssentialCustomColors((prev) => prev || draft.essentialCustomColors || '');

      // Personalizado
      if (draft.visualStyle) setVisualStyle(draft.visualStyle);
      if (draft.customSections && draft.customSections.length > 0) setCustomSections(draft.customSections);
      if (draft.customColorMode) setCustomColorMode(draft.customColorMode);
      if (draft.customColors) setCustomColors((prev) => prev || draft.customColors || '');
      if (draft.freeVision) setFreeVision((prev) => prev || draft.freeVision || '');

      // Profissional / Premium
      if (draft.selectedFeatureIds && draft.selectedFeatureIds.length > 0) {
        setSelectedFeatureIds(draft.selectedFeatureIds);
      }
      if (draft.accessProfiles && draft.accessProfiles.length > 0) {
        setAccessProfiles(draft.accessProfiles);
      }
      if (draft.referenceLink) setReferenceLink((prev) => prev || draft.referenceLink || '');
      if (draft.strategicVision) setStrategicVision((prev) => prev || draft.strategicVision || '');

      // Premium
      if (draft.premiumColorMode) setPremiumColorMode(draft.premiumColorMode);
      if (draft.premiumCustomColors) setPremiumCustomColors((prev) => prev || draft.premiumCustomColors || '');
    };

    restoreDraft();

    return () => {
      isCancelled = true;
    };
  }, [selectedPlan, initialModel]);

  // Autosave com debounce seguro (350ms) para evitar gravações excessivas em digitação
  useEffect(() => {
    // Se já foi enviado com sucesso, não salva rascunho
    if (submissionSuccess) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveBriefingDraft(selectedPlan, {
        step: currentStep,
        selectedPlan,
        selectedSegment,
        selectedModel,
        modelApproach,
        startType,
        businessName,
        siteLanguage,
        contactName,
        contactPhone,
        contactEmail,
        specificNotes,
        essentialServices,
        essentialColorMode,
        essentialCustomColors,
        visualStyle,
        customSections,
        customColorMode,
        customColors,
        freeVision,
        selectedFeatureIds,
        accessProfiles,
        referenceLink,
        strategicVision,
        premiumColorMode,
        premiumCustomColors,
      });
    }, 350);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    selectedPlan,
    currentStep,
    selectedSegment,
    selectedModel,
    modelApproach,
    startType,
    businessName,
    siteLanguage,
    contactName,
    contactPhone,
    contactEmail,
    specificNotes,
    essentialServices,
    essentialColorMode,
    essentialCustomColors,
    visualStyle,
    customSections,
    customColorMode,
    customColors,
    freeVision,
    selectedFeatureIds,
    accessProfiles,
    referenceLink,
    strategicVision,
    premiumColorMode,
    premiumCustomColors,
    submissionSuccess,
  ]);

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

  // Notifica o container pai (App.tsx / botão Voltar do Android) sobre a etapa atual e callback de recuo
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep, currentStep > 1, () => {
        setStepError(null);
        setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }, [currentStep, onStepChange]);

  // Avança de etapa com validação dos campos obrigatórios
  const handleNextStep = () => {
    setStepError(null);
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 2) {
      if ((selectedPlan === 'essencial' || selectedPlan === 'premium') && !businessName.trim()) {
        setStepError('Por favor, informe o Nome do negócio/projeto para continuar.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep === 3) {
      if (selectedPlan === 'essencial' || selectedPlan === 'premium') {
        if (!contactName.trim() || !contactPhone.trim()) {
          setStepError('Por favor, preencha o Nome ou Nome da Empresa e o WhatsApp com DDD para continuar.');
          return;
        }
      } else {
        if (!contactName.trim() || !contactPhone.trim()) {
          setStepError('Por favor, preencha seu nome e telefone/WhatsApp de contato para continuar.');
          return;
        }
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
      if ((selectedPlan === 'essencial' || selectedPlan === 'premium') && !businessName.trim()) {
        setStepError('Por favor, informe o Nome do negócio/projeto para continuar.');
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
    if (currentStep === 1) return (selectedPlan === 'essencial' || selectedPlan === 'premium') ? 'Iniciar Briefing' : 'Avançar Etapa';
    if (currentStep === 2) return 'Avançar para Contato';
    if (currentStep === 3) return (selectedPlan === 'essencial' || selectedPlan === 'premium') ? 'Ver Resumo' : 'Revisar Proposta';
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

  const currentSegmentLabel = useMemo(() => {
    if (selectedPlan === 'premium') {
      const found = PREMIUM_SEGMENTS.find((s) => s.id === selectedSegment);
      if (found) return found.label;
    }
    return (
      segmentsOptions.find((s) => s.id === selectedSegment)?.label ||
      PREMIUM_SEGMENTS.find((s) => s.id === selectedSegment)?.label ||
      selectedSegment
    );
  }, [selectedPlan, selectedSegment, segmentsOptions]);

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
      lines.push('💰 *Investimento:* R$ 1.000');
      lines.push('⏱️ *Prazo:* 3–5 dias');
      lines.push('🎯 *Modelo de referência:* Influenciador Digital (Criador de Conteúdo)');
      lines.push(`🏢 *Nome do Negócio ou Projeto:* ${businessName || contactName || 'A definir'}`);
      lines.push(`🏷️ *Segmento:* ${currentSegmentLabel}`);
      if (essentialServices) lines.push(`📋 *Serviços/produtos que deseja apresentar:* ${essentialServices}`);
      lines.push(
        essentialColorMode === 'suggest'
          ? '🎨 *Cores:* Sugestão NexaWeb'
          : essentialColorMode === 'brand'
          ? `🎨 *Cores:* Minhas cores de marca (${essentialCustomColors || 'Identidade existente'})`
          : `🎨 *Cores:* Tons específicos (${essentialCustomColors || 'A definir'})`
      );
      lines.push(`👤 *Nome ou Empresa:* ${contactName || businessName || 'Não informado'}`);
      lines.push(`📱 *WhatsApp com DDD:* ${contactPhone || 'Não informado'}`);
      if (contactEmail) lines.push(`✉️ *E-mail:* ${contactEmail}`);
      if (attachedFiles.length > 0) lines.push(`📎 *Uploads:* ${attachedFiles.length}/6 foto(s)/logo`);
      if (specificNotes) lines.push(`💬 *Observações:* ${specificNotes}`);
      lines.push('');
      lines.push('Aguardando retorno da equipe NexaWeb!');
      return lines.join('\n');
    }

    if (selectedPlan === 'premium') {
      lines.push('🌟 *BRIEFING OFICIAL — PLANO PREMIUM*');
      lines.push('━━━━━━━━━━━━━━━━━━━━');
      lines.push('💼 *Plano Selecionado:* Plano Premium');
      lines.push(`💰 *Investimento Estimado:* ${budget.formattedTotalPrice}`);
      lines.push('⏱️ *Prazo:* Definido conforme o escopo, com acompanhamento prioritário.');
      lines.push('🎯 *Modelo de referência:* Academia Premium (Academia/Fitness)');
      lines.push(`🏢 *Nome do negócio/projeto:* ${businessName || contactName || 'A definir'}`);
      lines.push(`🏷️ *Segmento:* ${currentSegmentLabel}`);
      lines.push('✨ *Estilo/Experiência:* Experiência Máxima de Alto Padrão');
      lines.push(
        premiumColorMode === 'suggest'
          ? '🎨 *Cores:* Sugestão NexaWeb (Harmonia visual de alto padrão)'
          : premiumColorMode === 'brand'
          ? `🎨 *Cores:* Minhas cores de marca (${premiumCustomColors || 'Identidade existente'})`
          : `🎨 *Cores:* Tons específicos (${premiumCustomColors || 'A definir'})`
      );
      if (budget.selectedFeatures.length > 0) {
        lines.push(`⚡ *Recursos Adicionais:* ${budget.selectedFeatures.map((f) => `${f.nome} (${f.formattedPreco})`).join(', ')}`);
      } else {
        lines.push('⚡ *Recursos Adicionais:* Nenhum adicional selecionado (Estrutura base)');
      }
      if (accessProfiles.length > 0) {
        lines.push(`👥 *Níveis de Acesso:* ${accessProfiles.join(', ')}`);
      }
      if (referenceLink) lines.push(`🔗 *Link de referência/inspiração:* ${referenceLink}`);
      if (strategicVision) lines.push(`📝 *Visão Estratégica:* ${strategicVision}`);
      lines.push(`👤 *Nome ou Nome da Empresa:* ${contactName || businessName || 'Não informado'}`);
      lines.push(`📱 *WhatsApp com DDD:* ${contactPhone || 'Não informado'}`);
      if (contactEmail) lines.push(`✉️ *E-mail:* ${contactEmail}`);
      if (attachedFiles.length > 0) lines.push(`📎 *Uploads:* ${attachedFiles.length}/6 foto(s)/logo`);
      if (specificNotes) lines.push(`💬 *Observações:* ${specificNotes}`);
      lines.push('');
      lines.push('Aguardando retorno prioritário da equipe NexaWeb!');
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

  // Envio definitivo ao backend oficial com proteção rigorosa contra duplicidade
  const handleSubmitProject = async () => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
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
          try {
            await uploadBriefingImages(res.projectId, attachedFiles);
          } catch (uploadErr) {
            console.warn('[NexaWeb Diagnostic] Falha ao enviar anexos:', uploadErr);
          }
        }

        const message = res.isOfflineFallback
          ? 'Código de referência gerado (modo offline). Para concluir, entre em contato com a NexaWeb pelo e-mail ou Instagram oficial.'
          : selectedPlan === 'essencial'
          ? 'Seu briefing do Plano Essencial foi recebido com sucesso pela equipe NexaWeb!'
          : selectedPlan === 'premium'
          ? 'Seu briefing do Plano Premium foi recebido com prioridade pela equipe NexaWeb!'
          : 'Seu projeto foi enviado com sucesso para a equipe NexaWeb!';

        // Limpa rascunho persistido para evitar restauração indevida de briefing já enviado
        await clearBriefingDraft(selectedPlan);

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

  // Fallback para geração direta de protocolo offline quando conexão de rede estiver indisponível
  const handleGenerateOfflineProtocol = async () => {
    if (isSubmittingRef.current || isSubmitting) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const res = generateOfflineBriefingProtocol();
      await clearBriefingDraft(selectedPlan);
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
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      {/* 1. Indicador de Progresso do Wizard Mobile (01 a 04) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Etapa {currentStep} de 4
            </span>
            <span className="text-xs font-bold text-white">
              {currentStep === 1 && (selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Apresentação do Plano' : 'Plano & Ponto de Partida')}
              {currentStep === 2 && (selectedPlan === 'essencial' ? 'Personalização · Plano Essencial' : selectedPlan === 'premium' ? 'Personalização · Plano Premium' : 'Personalização do Projeto')}
              {currentStep === 3 && 'Informações de Contato'}
              {currentStep === 4 && (selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Revisão Final' : 'Revisão & Envio Oficial')}
            </span>
          </div>

          <span
            key={budget.formattedTotalPrice}
            className="text-[11px] font-mono text-cyan-400 font-bold inline-block animate-in fade-in zoom-in-95 duration-150"
          >
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
            { step: 1, label: selectedPlan === 'essencial' || selectedPlan === 'premium' ? '01 Apresentação' : '01 Plano' },
            { step: 2, label: selectedPlan === 'essencial' || selectedPlan === 'premium' ? '02 Personalização' : '02 Briefing' },
            { step: 3, label: '03 Contato' },
            { step: 4, label: selectedPlan === 'essencial' || selectedPlan === 'premium' ? '04 Revisão' : '04 Resumo' },
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
        <div className="space-y-4 animate-in fade-in slide-in-from-right-1 duration-150 ease-out">
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
                    'Layout responsivo',
                    'SEO básico com título, descrição e meta',
                    'Hospedagem em nuvem + SSL',
                    'Aprovação antes da publicação',
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
                    'Investimento acessível',
                    'Estrutura limpa',
                    'Navegação simples',
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

          {/* Apresentação Oficial do Plano Premium */}
          {selectedPlan === 'premium' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
              {/* Cabeçalho do Plano */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    Plano Selecionado
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-white">Plano Premium</h2>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-mono font-black text-cyan-300">A partir de R$ 4.500</span>
                  <span className="text-[10px] text-slate-500 block">Investimento de alto padrão</span>
                </div>
              </div>

              {/* Informações Oficiais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Modelo de referência:</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs">
                    Academia Premium (Academia/Fitness)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Investimento:</span>
                  <span className="font-bold text-cyan-300 font-mono text-[11px] sm:text-xs">A partir de R$ 4.500</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Prazo:</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs">Definido conforme o escopo, com acompanhamento prioritário.</span>
                </div>
              </div>

              {/* Descrição Oficial */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  DESCRIÇÃO:
                </span>
                <p className="text-xs text-amber-200/90 font-medium italic leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                  “Experiência máxima de sofisticação visual, tecnologia e exclusividade.”
                </p>
              </div>

              {/* Visão do Plano */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  VISÃO:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/70">
                  Uma experiência de alto padrão para marcas que buscam impacto visual, tecnologia, exclusividade e posicionamento premium.
                </p>
              </div>

              {/* Ideal para */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-1.5">
                <span className="font-bold text-cyan-300 block mb-0.5">IDEAL PARA:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
                  <div>• Marcas de alto padrão</div>
                  <div>• Clínicas estéticas</div>
                  <div>• Imobiliárias de luxo</div>
                  <div>• Engenharia de prestígio</div>
                  <div>• Restaurantes refinados</div>
                  <div>• Academias boutique</div>
                </div>
              </div>

              {/* Incluído */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  INCLUÍDO:
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {[
                    'Direção de arte exclusiva',
                    'Microinterações e transições refinadas',
                    'Apresentação de alto impacto',
                    'Copywriting e hierarquia visual',
                    'Carregamento otimizado e máxima fidelidade estética',
                    'Integração com canal VIP',
                    'Revisão responsiva',
                    'Atendimento prioritário',
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
                    'Impacto visual memorável',
                    'Posicionamento de alto nível',
                    'Atenção aos detalhes de design',
                    'Acompanhamento prioritário',
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

          {/* Se veio com modelo de referência (para outros planos) */}
          {selectedModel && selectedPlan !== 'essencial' && selectedPlan !== 'premium' && (
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

          {/* Alternar de plano no Plano Essencial ou Premium */}
          {(selectedPlan === 'essencial' || selectedPlan === 'premium') && (
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
          {(selectedPlan !== 'essencial' && selectedPlan !== 'premium' || showPlanSwitcher) && (
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
        <div className="space-y-4 animate-in fade-in slide-in-from-right-1 duration-150 ease-out">
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
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
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
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
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
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
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
                <ImageUploadField
                  files={attachedFiles}
                  onChange={setAttachedFiles}
                  label="Fotos/Logo opcional"
                  showShortCounter={true}
                  helperText="Formatos: PNG, JPG ou WEBP · até 10 MB por arquivo"
                  formatsHint="PNG, JPG ou WEBP (até 10 MB por arquivo)"
                />
              </div>

              {/* ESTIMATIVA */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">ESTIMATIVA:</span>
                <span className="font-mono font-bold text-cyan-300">R$ 1.000</span>
              </div>
              <p className="text-[10px] text-slate-500 text-center">
                O plano Essencial possui preço fixo nesta etapa.
              </p>
            </div>
          ) : selectedPlan === 'premium' ? (
            /* --- CASO 2: PLANO PREMIUM --- */
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    Personalização · Plano Premium
                  </span>
                  <h3 className="text-sm font-bold text-white">Experiência Máxima de Alto Padrão</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-cyan-300">{budget.formattedTotalPrice}</span>
                  <span className="text-[10px] text-slate-500 block">Plano Premium</span>
                </div>
              </div>

              {/* Descrição oficial */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/70">
                “Design sob medida de alto prestígio, interfaces sob demanda, suporte a múltiplos perfis e alta conversão.”
              </p>

              {/* 1. Nome do negócio/projeto * */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nome do negócio/projeto *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  placeholder="Ex: Apex Fitness Club, Lumina Estética, Mansões Prime..."
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 2. Segmento (36 opções oficiais) */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Segmento
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {PREMIUM_SEGMENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Estrutura Dinâmica de Páginas */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ESTRUTURA DINÂMICA DE PÁGINAS ({currentSegmentLabel}):
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                    Inclusas no escopo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  {getDynamicPremiumPages(selectedSegment).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800/60">
                      <span>• {p.title}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{p.note}</span>
                    </div>
                  ))}
                </div>

                {/* Página Adicional +R$150 */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => toggleFeature('pagina_adicional')}
                    className={`w-full min-h-[44px] p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                      selectedFeatureIds.includes('pagina_adicional')
                        ? 'bg-indigo-950/50 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        selectedFeatureIds.includes('pagina_adicional') ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                      }`}>
                        {selectedFeatureIds.includes('pagina_adicional') && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>Página adicional sob medida</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-300">+ R$ 150</span>
                  </button>
                </div>
              </div>

              {/* 4. Recursos Comerciais */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Recursos Comerciais
                </span>

                {/* Incluídos */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    INCLUÍDOS NO PLANO:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    {[
                      'Botão fixo de WhatsApp',
                      'Formulário comercial direto',
                      'Horários/turnos',
                      'Tabela de planos/mensalidades',
                      'Mapas',
                      'Depoimentos',
                      'Integração com redes sociais',
                      'Matrícula/checkout direto',
                      'FAQ',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 py-0.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opcionais */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    OPCIONAIS:
                  </span>
                  {[
                    { id: 'galeria_fotos', nome: 'Galeria', preco: 150 },
                    { id: 'galeria_videos', nome: 'Vídeos', preco: 150 },
                    { id: 'formulario_personalizado', nome: 'Formulário personalizado', preco: 200 },
                  ].map((feat) => {
                    const isSelected = selectedFeatureIds.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`w-full min-h-[44px] p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>{feat.nome}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-300">+ R$ {feat.preco}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Recursos Avançados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                    Recursos Avançados
                  </span>
                  <span className="text-[10px] text-slate-500">+ R$ 300 cada</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { id: 'area_aluno', nome: 'Área do aluno/cliente' },
                    { id: 'historico_treinos', nome: 'Histórico de treinos' },
                    { id: 'estatisticas_progresso', nome: 'Estatísticas de progresso' },
                    { id: 'area_treinador', nome: 'Área do treinador' },
                    { id: 'painel_administrativo', nome: 'Painel administrativo' },
                    { id: 'personalizacao_avancada', nome: 'Personalização avançada' },
                  ].map((feat) => {
                    const isSelected = selectedFeatureIds.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="truncate">{feat.nome}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-300 shrink-0">+ R$ 300</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Realtime */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Realtime (Opcionais Avançados)
                  </span>
                  <span className="text-[10px] text-slate-500">+ R$ 300 cada</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { id: 'realtime_ocupacao_academia', nome: 'Ocupação da academia' },
                    { id: 'realtime_equipamentos', nome: 'Disponibilidade de equipamentos' },
                  ].map((feat) => {
                    const isSelected = selectedFeatureIds.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-amber-500 text-white font-semibold ring-1 ring-amber-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="truncate">{feat.nome}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-amber-300 shrink-0">+ R$ 300</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Níveis de Acesso */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  Níveis de Acesso (Mostrar quando aplicável):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['CLIENTE/ALUNO', 'PROFISSIONAL', 'ADMINISTRADOR'].map((role) => {
                    const isSelected = accessProfiles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleProfile(role)}
                        className={`min-h-[44px] p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] font-bold block">{role}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">{isSelected ? 'Habilitado' : 'Opcional'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8. Métricas de Demonstração (Para Academia/Fitness) */}
              {(selectedSegment === 'academia' || selectedSegment === 'fitness-saude') && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">
                      Métricas de Demonstração (Academia/Fitness):
                    </span>
                    <span className="text-[9px] text-amber-400/90 uppercase font-mono tracking-wider">
                      Exemplo Visual
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Frequência semanal', sample: '4x / semana' },
                      { label: 'Volume mensal', sample: '18 treinos' },
                      { label: 'Consistência', sample: '92%' },
                      { label: 'Próxima aula', sample: 'Hoje, 19h' },
                    ].map((metric, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block leading-tight">{metric.label}</span>
                        <span className="text-xs font-bold text-cyan-300 block font-mono mt-0.5">{metric.sample}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * Exemplos visuais demonstrativos da interface do sistema, configurados sob medida para o projeto.
                  </p>
                </div>
              )}

              {/* 9. Paleta de Cores */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Paleta de Cores:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPremiumColorMode('suggest')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
                      premiumColorMode === 'suggest'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Sugestão NexaWeb</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Alto padrão refinado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPremiumColorMode('brand')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
                      premiumColorMode === 'brand'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Minhas cores de marca</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Identidade atual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPremiumColorMode('custom')}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
                      premiumColorMode === 'custom'
                        ? 'bg-purple-950/40 border-purple-500 text-white font-bold ring-1 ring-purple-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold">Tons específicos</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Digitar paleta</span>
                  </button>
                </div>

                {(premiumColorMode === 'custom' || premiumColorMode === 'brand') && (
                  <input
                    type="text"
                    value={premiumCustomColors}
                    onChange={(e) => setPremiumCustomColors(e.target.value)}
                    placeholder="Ex: Dourado nobre, preto fosco e off-white..."
                    className="w-full min-h-[44px] mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>

              {/* 10. Referência/Inspiração */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Link de referência/inspiração (opcional)
                </label>
                <input
                  type="url"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  placeholder="Ex: https://meuexemplo.com ou perfil de referência..."
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 11. Visão Estratégica */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Visão Estratégica do Projeto (opcional)
                </label>
                <textarea
                  value={strategicVision}
                  onChange={(e) => setStrategicVision(e.target.value)}
                  rows={3}
                  placeholder="Explique como imagina o projeto, o objetivo do site, a experiência desejada e necessidades específicas..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* 12. Uploads */}
              <div className="pt-2 border-t border-slate-800/80">
                <ImageUploadField
                  files={attachedFiles}
                  onChange={setAttachedFiles}
                  label="Fotos/Logo — opcional"
                  showShortCounter={true}
                  helperText="Formatos: PNG, JPG ou WEBP · até 10 MB por arquivo"
                  formatsHint="PNG, JPG ou WEBP (até 10 MB por arquivo)"
                />
              </div>

              {/* 13. Estimativa */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Preço inicial: A partir de R$ 4.500</span>
                  <span className="font-bold text-white">ESTIMATIVA ATUALIZADA:</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-cyan-300 text-sm">{budget.formattedTotalPrice}</span>
                  {budget.extrasTotal > 0 && (
                    <span className="text-[10px] text-slate-500 block">inclui {budget.formattedExtrasTotal} em adicionais</span>
                  )}
                </div>
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
                      className={`p-2 rounded-xl border text-left transition-all active:scale-[0.98] ${
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
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all active:scale-[0.98] ${
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
                      className={`p-2 rounded-xl border text-left text-[11px] flex items-center justify-between transition-all active:scale-[0.98] ${
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
                    className={`p-2 rounded-xl border text-xs text-left transition-all active:scale-[0.98] ${
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
                    className={`p-2 rounded-xl border text-xs text-left transition-all active:scale-[0.98] ${
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

          {/* --- CASO 3: PLANO PROFISSIONAL --- */}
          {selectedPlan === 'profissional' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Estrutura Avançada (Plano Profissional)
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
                      className={`p-2 rounded-xl border text-left transition-all active:scale-[0.98] ${
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
                  {OFFICIAL_EXTRA_FEATURES.filter((f) => !f.isRealtime).slice(0, 8).map((feat) => {
                    const isSelected = selectedFeatureIds.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all active:scale-[0.98] ${
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
        <div className="space-y-4 animate-in fade-in slide-in-from-right-1 duration-150 ease-out">
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
                {selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Nome ou Nome da Empresa *' : 'Seu Nome ou Nome do Responsável *'}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (stepError) setStepError(null);
                }}
                placeholder={selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Ex: Carlos Silva ou Minha Empresa' : 'Ex: Carlos Silva, Juliana Mendes...'}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'WhatsApp com DDD *' : 'Telefone / Celular de Contato com DDD *'}
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
                {selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'E-mail — opcional' : 'E-mail de Contato (Opcional):'}
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
                {selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Observações' : 'Observações ou Detalhes Específicos:'}
              </label>
              <textarea
                value={specificNotes}
                onChange={(e) => setSpecificNotes(e.target.value)}
                rows={3}
                placeholder={selectedPlan === 'essencial' || selectedPlan === 'premium' ? 'Detalhes ou preferências adicionais...' : 'Ex: Gostaria de prazos curtos, integração com sistema legado, etc.'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Canais Oficiais de Atendimento NexaWeb (apenas para outros planos) */}
          {selectedPlan !== 'essencial' && selectedPlan !== 'premium' && (
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
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 4: RESUMO & ENVIO DEFINITIVO                             */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-1 duration-150 ease-out">
          {/* Card Resumo Completo com Edição Rápida */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {selectedPlan === 'essencial' ? 'Revisão Final' : 'Resumo da Proposta Oficial'}
              </span>
              <span
                key={budget.formattedTotalPrice}
                className="text-xs font-mono font-extrabold text-white inline-block animate-in fade-in zoom-in-95 duration-150"
              >
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
                  <span className="font-semibold text-cyan-300 text-right">Influenciador Digital</span>
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
            ) : selectedPlan === 'premium' ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Plano:</span>
                  <span className="font-bold text-white">Premium</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Estimativa:</span>
                  <span className="font-mono font-bold text-cyan-300">{budget.formattedTotalPrice}</span>
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
                  <span className="text-slate-400">Estilo/experiência:</span>
                  <span className="font-semibold text-cyan-300 text-right">Experiência Máxima de Alto Padrão</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cores:</span>
                  <span className="text-white text-right">
                    {premiumColorMode === 'suggest'
                      ? 'Sugestão NexaWeb'
                      : premiumColorMode === 'brand'
                      ? (premiumCustomColors || 'Minhas cores de marca')
                      : (premiumCustomColors || 'A definir')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Modelo base:</span>
                  <span className="font-semibold text-white text-right">Academia Premium (Academia/Fitness)</span>
                </div>

                {/* Opções selecionadas */}
                <div className="py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 block mb-1">Opções selecionadas:</span>
                  {budget.selectedFeatures.length > 0 ? (
                    <div className="space-y-1">
                      {budget.selectedFeatures.map((f) => (
                        <div key={f.id} className="flex items-center justify-between text-[11px] bg-slate-950 p-1.5 rounded-lg border border-slate-800/80">
                          <span className="text-slate-200">{f.nome}</span>
                          <span className="font-mono text-cyan-400 font-bold">{f.formattedPreco}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">Nenhum adicional selecionado (Estrutura base completa)</span>
                  )}
                </div>

                {accessProfiles.length > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Níveis de acesso:</span>
                    <span className="text-slate-200 text-right text-[11px]">{accessProfiles.join(', ')}</span>
                  </div>
                )}

                {referenceLink && (
                  <div className="py-1 border-b border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Link de referência/inspiração:</span>
                    <span className="text-cyan-300 block text-[11px] truncate">{referenceLink}</span>
                  </div>
                )}

                {strategicVision && (
                  <div className="py-1 border-b border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Visão estratégica:</span>
                    <span className="text-slate-200 block text-[11px]">{strategicVision}</span>
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
                onClick={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Editar personalização</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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

          {/* Feedback de Erro com Retry e Fallback Offline */}
          {submissionError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex flex-col gap-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium leading-snug">{submissionError}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-900/40">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitProject}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-rose-950/50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>Tentar novamente</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGenerateOfflineProtocol}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>Gerar código offline</span>
                </button>
              </div>
            </div>
          )}

          {/* Botões Finais de Ação */}
          <div className="space-y-2">
            {!submissionSuccess ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitProject}
                className="min-h-[50px] w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white font-extrabold text-xs shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Enviando briefing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Enviar Briefing para NexaWeb</span>
                  </>
                )}
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
              {submissionSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Briefing Enviado</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando briefing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Concluir & Enviar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
