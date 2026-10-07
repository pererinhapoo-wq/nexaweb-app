import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import {
  getPlanAdvancedFeaturesLimit,
  getAdvancedFeaturesGroupedBySegment,
  findAdvancedFeatureById,
  AdvancedFeatureItem,
} from '../data/advancedFeaturesData';
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
  ArrowLeft,
  ExternalLink,
  Layers,
  Clock,
  Phone,
  Edit2,
  Loader2,
  RefreshCw,
  Lightbulb,
  Building2,
  MapPin,
  Target,
  Palette,
  FileText,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

// 8 Objetivos Canônicos Oficiais do Site (Regra 7)
export interface SiteObjectiveOption {
  id: string;
  label: string;
  desc: string;
}

export const SITE_OBJECTIVES: SiteObjectiveOption[] = [
  { id: 'apresentar_negocio', label: 'Apresentar o negócio', desc: 'Fortalecer autoridade e presença institucional da marca' },
  { id: 'receber_contatos', label: 'Receber contatos', desc: 'Canal direto para mensagens no WhatsApp e formulários' },
  { id: 'receber_agendamentos', label: 'Receber agendamentos', desc: 'Facilitar marcação de horários para clientes' },
  { id: 'receber_pedidos', label: 'Receber pedidos', desc: 'Cardápio ou catálogo com envio direto de pedidos' },
  { id: 'vender_produtos', label: 'Vender produtos', desc: 'Vitrine comercial com direcionamento para compra' },
  { id: 'captar_leads', label: 'Captar leads', desc: 'Formulários estratégicos para geração de oportunidades' },
  { id: 'apresentar_portfolio', label: 'Apresentar portfólio', desc: 'Galeria visual com fotos de trabalhos e projetos' },
  { id: 'solicitacoes_orcamento', label: 'Receber solicitações de orçamento', desc: 'Coleta de requisitos para propostas comerciais' },
];

// 5 Estilos Visuais Canônicos Oficiais (Regra 10)
export interface VisualStyleOption {
  id: string;
  label: string;
  desc: string;
}

export const VISUAL_STYLES: VisualStyleOption[] = [
  { id: 'Moderno', label: 'Moderno', desc: 'Visual atual com tipografia limpa e espaçamentos equilibrados' },
  { id: 'Minimalista', label: 'Minimalista', desc: 'Design direto ao ponto, foco no conteúdo essencial e sem excessos' },
  { id: 'Elegante', label: 'Elegante', desc: 'Harmonia visual sofisticada com acabamentos sutis' },
  { id: 'Luxuoso', label: 'Luxuoso', desc: 'Padrão premium com contrastes nobres e refinamento estético' },
  { id: 'Criativo', label: 'Criativo', desc: 'Layout marcante com personalidade autoral e dinâmica diferenciada' },
];

export type BriefingStep = 1 | 2 | 3 | 4 | 5 | 6;

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
  const { language } = useTranslation();

  const plans = getNexawebPlans(language);
  const portfolioProjects = getPortfolioProjects(language);

  // Fluxo progressivo oficial em 6 etapas:
  // 1: Ponto de Partida & Origem
  // 2: Informações Principais & Objetivo
  // 3: Necessidades do Negócio & Segmento
  // 4: Funcionalidades do Projeto
  // 5: Visual, Conteúdo & Arquivos
  // 6: Resumo & Envio Oficial
  const [currentStep, setCurrentStep] = useState<BriefingStep>(1);

  // Modo de início da Etapa 1: 'amostra' | 'propria' | 'plano'
  const [startMode, setStartMode] = useState<'amostra' | 'propria' | 'plano'>(() => {
    if (initialModel) return 'amostra';
    if (initialPlan) return 'plano';
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

  // --- ETAPA 2: INFORMAÇÕES PRINCIPAIS & OBJETIVO ---
  const [businessName, setBusinessName] = useState('');
  const [siteObjective, setSiteObjective] = useState<string>(''); // Regra 7: Não selecionado automaticamente!
  const [siteLanguage, setSiteLanguage] = useState<WebsiteLanguage>(
    initialWebsiteLanguage ||
      (language === 'pt-PT'
        ? 'pt-PT'
        : language === 'en'
        ? 'en'
        : language === 'es'
        ? 'es'
        : language === 'fr'
        ? 'fr'
        : 'pt-BR')
  );
  const [businessLocation, setBusinessLocation] = useState(''); // Regra 8: Opcional
  const [businessBranches, setBusinessBranches] = useState(''); // Regra 8: Opcional
  const [googleMapsLink, setGoogleMapsLink] = useState(''); // Regra 8: Opcional

  // --- ETAPA 3: NECESSIDADES DO NEGÓCIO & SEGMENTO ---
  const [selectedPrimaryOptions, setSelectedPrimaryOptions] = useState<string[]>([]);
  const [selectedSecondaryOptions, setSelectedSecondaryOptions] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [operatingSchedule, setOperatingSchedule] = useState(''); // Regra 8: Opcional
  const [teamDescription, setTeamDescription] = useState(''); // Regra 8: Opcional
  const [freeServicesText, setFreeServicesText] = useState('');

  // --- ETAPA 4: FUNCIONALIDADES AVANÇADAS DO PROJETO ---
  const [selectedAdvancedFeatures, setSelectedAdvancedFeatures] = useState<string[]>([]);
  const [featureLimitMessage, setFeatureLimitMessage] = useState<string | null>(null);

  // Limite oficial de funcionalidades avançadas do plano selecionado (0 / 3 / 5 / 8)
  const advancedFeaturesLimit = useMemo(() => {
    return getPlanAdvancedFeaturesLimit(selectedPlan);
  }, [selectedPlan]);

  // Funcionalidades agrupadas pelas 13 categorias filtradas para o segmento atual e plano ativo
  const groupedAdvancedFeatures = useMemo(() => {
    return getAdvancedFeaturesGroupedBySegment(selectedSegment, selectedPlan);
  }, [selectedSegment, selectedPlan]);

  // Ajusta seleção caso o usuário troque para um plano com limite menor
  useEffect(() => {
    const limit = getPlanAdvancedFeaturesLimit(selectedPlan);
    setSelectedAdvancedFeatures((prev) => {
      if (prev.length > limit) {
        return prev.slice(0, limit);
      }
      return prev;
    });
    setFeatureLimitMessage(null);
  }, [selectedPlan]);

  // --- ETAPA 5: VISUAL, CONTEÚDO & ARQUIVOS ---
  const [visualStyle, setVisualStyle] = useState<string>('Moderno'); // Regra 10: 5 estilos canônicos
  const [colorMode, setColorMode] = useState<'suggest' | 'brand' | 'custom'>('suggest');
  const [customColorDetails, setCustomColorDetails] = useState('');
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [customProjectIdea, setCustomProjectIdea] = useState(''); // Regra 11: Descrição livre
  const [customReferenceLink, setCustomReferenceLink] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // Regra 12: Até 6 arquivos
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  // --- ETAPA 6: RESUMO & ENVIO OFICIAL ---
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
    setSelectedPrimaryOptions((prev) => (prev.length > 0 ? prev : config.primaryOptions.slice(0, 3)));
    setSelectedSecondaryOptions((prev) => (prev.length > 0 ? prev : config.secondaryOptions.slice(0, 2)));
    setSelectedFeatures((prev) => (prev.length > 0 ? prev : config.features.slice(0, 2)));
  }, [selectedSegment]);

  // Suporte ao teclado virtual Android: assegura que qualquer campo focado permaneça visível sem cortes
  const isKeyboardOpenRef = useRef<boolean>(false);
  const scrollPosBeforeKeyboardRef = useRef<number>(0);

  const scrollActiveFieldIntoView = useCallback((el: HTMLElement) => {
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const headerHeight = 64; // altura do cabeçalho fixo no topo
    const bottomPadding = 24;

    // Se o elemento estiver abaixo da área visível ou escondido atrás do cabeçalho
    if (rect.bottom > viewportHeight - bottomPadding || rect.top < headerHeight + 10) {
      const currentScroll = window.scrollY;
      const targetScroll = currentScroll + rect.top - headerHeight - 16;
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, []);

  const handleFormFocusCapture = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      if (!isKeyboardOpenRef.current) {
        scrollPosBeforeKeyboardRef.current = window.scrollY;
      }
      setTimeout(() => {
        scrollActiveFieldIntoView(target);
      }, 250);
    }
  }, [scrollActiveFieldIntoView]);

  // Monitora redimensionamento da viewport física (abertura/fechamento de teclado no Android)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;

    const handleViewportResize = () => {
      const windowHeight = window.innerHeight;
      const currentHeight = vv.height;
      const isKeyboardNowOpen = windowHeight - currentHeight > 150;

      if (isKeyboardNowOpen) {
        if (!isKeyboardOpenRef.current) {
          scrollPosBeforeKeyboardRef.current = window.scrollY;
          isKeyboardOpenRef.current = true;
        }
        const activeEl = document.activeElement;
        if (
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          activeEl instanceof HTMLSelectElement
        ) {
          setTimeout(() => {
            scrollActiveFieldIntoView(activeEl);
          }, 80);
        }
      } else {
        if (isKeyboardOpenRef.current) {
          isKeyboardOpenRef.current = false;
        }
      }
    };

    vv.addEventListener('resize', handleViewportResize);
    return () => {
      vv.removeEventListener('resize', handleViewportResize);
    };
  }, [scrollActiveFieldIntoView]);

  // Se inicializado com modelo específico ou plano específico
  useEffect(() => {
    if (initialModel) {
      setSelectedModel(initialModel);
      setStartMode('amostra');
      const mapped = normalizeSegmentKey(initialModel);
      setSelectedSegment(mapped);
      const proj = portfolioProjects.find((p) => p.titulo === initialModel);
      if (proj?.planoId) {
        setSelectedPlan(proj.planoId);
      }
    } else if (initialPlan) {
      setSelectedPlan(initialPlan);
      setStartMode('plano');
    }
  }, [initialModel, initialPlan, portfolioProjects]);

  // Carrega rascunho salvo do armazenamento local
  useEffect(() => {
    async function loadDraft() {
      try {
        const draft = getBriefingDraftSync(selectedPlan) || (await getBriefingDraft(selectedPlan));
        if (draft) {
          if (draft.businessName && !businessName) setBusinessName(draft.businessName);
          if (draft.siteObjective && !siteObjective) setSiteObjective(draft.siteObjective);
          if (draft.businessLocation && !businessLocation) setBusinessLocation(draft.businessLocation);
          if (draft.googleMapsLink && !googleMapsLink) setGoogleMapsLink(draft.googleMapsLink);
          if (draft.visualStyle && !visualStyle) setVisualStyle(draft.visualStyle);
          if (draft.contactName && !contactName) setContactName(draft.contactName);
          if (draft.contactPhone && !contactPhone) setContactPhone(draft.contactPhone);
          if (draft.contactEmail && !contactEmail) setContactEmail(draft.contactEmail);
          if (draft.selectedAdvancedFeatures && selectedAdvancedFeatures.length === 0) {
            setSelectedAdvancedFeatures(draft.selectedAdvancedFeatures);
          }
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
        siteObjective,
        businessLocation,
        googleMapsLink,
        visualStyle,
        contactName,
        contactPhone,
        contactEmail,
        specificNotes,
        selectedSegment,
        selectedAdvancedFeatures,
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [
    selectedPlan,
    businessName,
    siteObjective,
    businessLocation,
    googleMapsLink,
    visualStyle,
    contactName,
    contactPhone,
    contactEmail,
    specificNotes,
    selectedSegment,
    selectedAdvancedFeatures,
  ]);

  // Sincroniza coordenação de passo com o componente pai (App.tsx / Header / Botão voltar físico)
  useEffect(() => {
    if (onStepChange) {
      // Na etapa 1 não permite recuar etapa interna (conforme Regra 4)
      const canGoBackStep = currentStep > 1;
      const goBackStep = () => {
        setStepError(null);
        setCurrentStep((prev) => (Math.max(1, prev - 1) as BriefingStep));
      };
      onStepChange(currentStep, canGoBackStep, goBackStep);
    }
  }, [currentStep, onStepChange]);

  // Plano ativo
  const activePlanObj = useMemo(() => {
    return plans.find((p) => p.id === selectedPlan) || plans[1];
  }, [plans, selectedPlan]);

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

  // Alterna seleção de funcionalidade avançada respeitando os limites do plano
  const handleToggleAdvancedFeature = (feature: AdvancedFeatureItem) => {
    setFeatureLimitMessage(null);
    const isAlreadySelected = selectedAdvancedFeatures.includes(feature.id);

    if (isAlreadySelected) {
      // Sempre permite desmarcar uma opção selecionada
      setSelectedAdvancedFeatures((prev) => prev.filter((id) => id !== feature.id));
      return;
    }

    // Essencial tem limite 0
    if (advancedFeaturesLimit === 0) {
      setFeatureLimitMessage(
        'O plano Essencial possui escopo fechado (0 funcionalidades avançadas). Para incluir funcionalidades avançadas, selecione o plano Profissional (até 5), Personalizado (até 3) ou Premium (até 8).'
      );
      return;
    }

    // Bloqueia nova seleção ao atingir o limite
    if (selectedAdvancedFeatures.length >= advancedFeaturesLimit) {
      setFeatureLimitMessage(
        `Limite de ${advancedFeaturesLimit} funcionalidades avançadas atingido para o plano ${activePlanObj.nome}. Desmarque uma opção para escolher outra.`
      );
      return;
    }

    setSelectedAdvancedFeatures((prev) => [...prev, feature.id]);
  };

  // Validação progressiva e avanço de etapa
  const handleNextStep = () => {
    setStepError(null);

    // Etapa 1: Ponto de partida
    if (currentStep === 1) {
      if (startMode === 'amostra' && !selectedModel) {
        setStepError('Por favor, selecione uma das demonstrações abaixo para continuar.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 2: Informações Principais & Objetivo (Regras 6, 7 e 8)
    if (currentStep === 2) {
      if (!businessName.trim()) {
        setStepError('Por favor, informe o Nome do seu negócio ou projeto para avançar.');
        return;
      }
      if (!siteObjective) {
        setStepError('Por favor, selecione o Objetivo Principal do site para prosseguir.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 3: Necessidades do Negócio
    if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 4: Funcionalidades
    if (currentStep === 4) {
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 5: Visual & Contato
    if (currentStep === 5) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setStepError('Por favor, preencha o Nome do responsável e o WhatsApp de contato para revisar o briefing.');
        return;
      }
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 6: Envio oficial
    if (currentStep === 6) {
      handleSubmitProject();
    }
  };

  // Retorno de etapa (Regra 4: preserva estritamente todos os dados)
  const handlePrevStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (Math.max(1, prev - 1) as BriefingStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onBack) {
        onBack();
      } else {
        onNavigate('home');
      }
    }
  };

  // Rótulos claros para o botão de ação principal
  const getNextButtonLabel = () => {
    if (currentStep === 1) return 'Continuar para Informações';
    if (currentStep === 2) return 'Avançar para Necessidades';
    if (currentStep === 3) return 'Avançar para Funcionalidades';
    if (currentStep === 4) return 'Avançar para Visual & Contato';
    if (currentStep === 5) return 'Revisar Briefing Completo';
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
    } else {
      lines.push('🎯 *Ponto de Partida:* Escolha direta de plano');
    }

    lines.push(`🏢 *Nome do Negócio:* ${businessName || 'A definir'}`);
    lines.push(`🏷️ *Segmento Identificado:* ${segmentConfig.icon} ${segmentConfig.name}`);

    if (siteObjective) {
      const objItem = SITE_OBJECTIVES.find((o) => o.id === siteObjective);
      lines.push(`🎯 *Objetivo Principal do Site:* ${objItem ? objItem.label : siteObjective}`);
    }

    lines.push(`🌐 *Idioma do Site:* ${siteLanguage}`);

    if (businessLocation) {
      lines.push(`📍 *Localização / Região:* ${businessLocation}`);
    }
    if (businessBranches) {
      lines.push(`🏢 *Unidades / Filiais:* ${businessBranches}`);
    }
    if (googleMapsLink) {
      lines.push(`🗺️ *Google Maps:* ${googleMapsLink}`);
    }

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

    if (selectedAdvancedFeatures.length > 0) {
      lines.push('');
      lines.push(`🚀 *Funcionalidades Avançadas Selecionadas (${selectedAdvancedFeatures.length} de ${advancedFeaturesLimit}):*`);
      selectedAdvancedFeatures.forEach((featId) => {
        const feat = findAdvancedFeatureById(featId);
        if (feat) {
          const complexTag = feat.isComplex ? ' [Avançado / avaliação]' : '';
          lines.push(`  • ${feat.nome} (${feat.categoria})${complexTag}`);
        }
      });
      const hasComplex = selectedAdvancedFeatures.some((id) => findAdvancedFeatureById(id)?.isComplex);
      if (hasComplex) {
        lines.push('  ℹ️ *Nota:* Itens com [Avançado / avaliação] têm disponibilidade e viabilidade confirmadas durante a análise técnica da proposta.');
      }
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

    lines.push('');
    lines.push(`🎨 *Estilo Visual:* ${visualStyle}`);
    lines.push(
      colorMode === 'suggest'
        ? '🎨 *Identidade Visual:* Sugestão NexaWeb (Harmonia visual)'
        : colorMode === 'brand'
        ? `🎨 *Cores da Marca:* ${customColorDetails || 'Cores da identidade visual existente'}`
        : `🎨 *Cores Escolhidas:* ${customColorDetails || 'Tons específicos indicados'}`
    );

    if (customProjectIdea) {
      lines.push(`💡 *Descrição / Ideia do Projeto:* ${customProjectIdea}`);
    }
    if (customReferenceLink) {
      lines.push(`🔗 *Link de Referência:* ${customReferenceLink}`);
    }

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
        recursosSelecionados: [
          ...selectedPrimaryOptions,
          ...selectedSecondaryOptions,
          ...selectedFeatures,
          ...selectedAdvancedFeatures,
        ],
        orcamentoEstimado: activePlanObj.preco,
        briefingSummary: summary,
        origem: 'NexaWeb App · Parte 6',
      });

      if (res.success && res.projectId) {
        if (attachedFiles.length > 0) {
          try {
            await uploadBriefingImages(res.projectId, attachedFiles);
          } catch {
            // Continua mesmo se upload falhar
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
          // fallback silencioso
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
    <div
      onFocusCapture={handleFormFocusCapture}
      className="space-y-4 pb-8 sm:pb-12 animate-in fade-in duration-150 overflow-x-hidden w-full min-w-0"
    >
      {/* ============================================================== */}
      {/* 1. INDICADOR DE PROGRESSO DISCRETO E REAL (01 a 06)            */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Botão Voltar: em etapas > 1 volta para a etapa anterior; na etapa 1 volta para o contexto anterior */}
            {(currentStep > 1 || onBack) && (
              <button
                type="button"
                onClick={currentStep > 1 ? handlePrevStep : onBack}
                className="min-h-[44px] min-w-[44px] -ml-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
                aria-label="←"
                title="←"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
            )}
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
              Etapa {currentStep} de 6
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {currentStep === 1 && 'Ponto de Partida & Origem'}
              {currentStep === 2 && 'Informações Principais & Objetivo'}
              {currentStep === 3 && `Necessidades · ${segmentConfig.name}`}
              {currentStep === 4 && 'Funcionalidades do Projeto'}
              {currentStep === 5 && 'Visual, Conteúdo & Arquivos'}
              {currentStep === 6 && 'Revisão & Envio do Projeto'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 font-bold shrink-0">
            {activePlanObj.preco}
          </span>
        </div>

        {/* Barra de Progresso Real */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* Indicador Visual das Etapas (Informativo, sem duplicar ação de retorno) */}
        <div className="grid grid-cols-6 gap-1 text-center" aria-label="Progresso das etapas">
          {[
            { step: 1, label: '01 Início' },
            { step: 2, label: '02 Negócio' },
            { step: 3, label: '03 Escopo' },
            { step: 4, label: '04 Recursos' },
            { step: 5, label: '05 Visual' },
            { step: 6, label: '06 Envio' },
          ].map((item) => (
            <div
              key={item.step}
              className={`min-h-[34px] flex items-center justify-center py-1 px-0.5 rounded-lg text-[9.5px] sm:text-[10px] font-bold select-none ${
                currentStep === item.step
                  ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/40 shadow-sm'
                  : item.step < currentStep
                  ? 'bg-slate-950/80 text-slate-400 border border-slate-800/60'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              <span className="truncate">{item.label}</span>
            </div>
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
      {/* ETAPA 1: PONTO DE PARTIDA & ORIGEM (3 OPÇÕES CANÔNICAS)        */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Como você deseja começar seu site?
            </h2>
            <p className="text-xs text-slate-300">
              Escolha uma das 3 opções simples para dar início ao seu projeto:
            </p>
          </div>

          {/* 3 Opções de Entrada Canônicas (Regra 1) */}
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

          {/* Subfluxo 1: Amostra */}
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

          {/* Subfluxo 2: Ideia própria / Sob medida */}
          {startMode === 'propria' && (
            <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
              <div className="border-b border-slate-800/80 pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Projeto Sob Medida
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  Estruture sua ideia do zero. Selecione o segmento e defina sua proposta:
                </p>
              </div>

              {/* Seletor do Segmento do Negócio - Visual Mobile Moderno */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Qual é o segmento principal do seu negócio?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(CANONICAL_SEGMENTS).map((seg) => {
                    const isSelected = selectedSegment === seg.segmentKey;
                    return (
                      <button
                        key={seg.segmentKey}
                        type="button"
                        onClick={() => setSelectedSegment(seg.segmentKey)}
                        className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-indigo-950/60 border-cyan-500/80 ring-1 ring-cyan-500/30 text-white shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {/* Ícone discreto em container próprio */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-500/30'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                          aria-hidden="true"
                        >
                          <span>{seg.icon}</span>
                        </div>

                        {/* Área própria para o texto (pode ocupar até 2 linhas, sem cortar, sem sobreposição) */}
                        <div className="flex-1 min-w-0 pr-1">
                          <span className="text-xs font-semibold block leading-tight text-slate-200 line-clamp-2">
                            {seg.name}
                          </span>
                        </div>

                        {/* Controle de seleção alinhado e discreto */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                              : 'border-slate-700 bg-slate-900/60'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
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
                    <span className="block text-[10px] text-slate-500">Mais recursos e autoridade</span>
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
                    <span className="block text-[10px] text-slate-500">Escopo dependente do projeto</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subfluxo 3: Escolher direto um dos 4 planos */}
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

              {/* Grid dos 4 Planos Oficiais */}
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
                          “{p.tagline}”
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

          {/* Botão de Avançar da Etapa 1 (Regra 4: NA ETAPA 1 NÃO MOSTRAR BOTÃO DE VOLTAR) */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[48px] w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 2: INFORMAÇÕES PRINCIPAIS & OBJETIVO                     */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Informações Principais
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Plano {activePlanObj.nome}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Identificação & Propósito do Projeto
            </h2>
            <p className="text-[11px] text-slate-400">
              Defina o nome, objetivo principal e detalhes operacionais do seu negócio.
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

            {/* 2. Objetivo Principal do Site (Regra 7: O usuário escolhe, não auto-selecionado) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                  2. Objetivo Principal do Site *
                </label>
                <span className="text-[10px] text-slate-400">Selecione uma opção</span>
              </div>
              <p className="text-[10.5px] text-slate-400">
                Qual é a prioridade número 1 do site para o seu negócio?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {SITE_OBJECTIVES.map((obj) => {
                  const isChecked = siteObjective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => {
                        setSiteObjective(obj.id);
                        if (stepError) setStepError(null);
                      }}
                      className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${
                        isChecked
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-1.5">
                        <span className="text-xs font-bold block leading-snug">
                          {obj.label}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5 line-clamp-2">
                          {obj.desc}
                        </span>
                      </div>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                            : 'border-slate-700 bg-slate-900/60'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Idioma do Futuro Site */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                3. Idioma do Futuro Site
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

            {/* 4. Informações do Negócio / Região (Regra 8: Opcionais) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  4. Localização ou Região Atendida (opcional)
                </label>
                <input
                  type="text"
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                  placeholder="Ex: São Paulo - SP, Brasil e exterior, ou Atendimento 100% online..."
                  className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Unidades / Filiais (opcional)
                  </label>
                  <input
                    type="text"
                    value={businessBranches}
                    onChange={(e) => setBusinessBranches(e.target.value)}
                    placeholder="Ex: 1 sede física, Matriz e filial..."
                    className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Google Maps / Link (opcional)
                  </label>
                  <input
                    type="url"
                    value={googleMapsLink}
                    onChange={(e) => setGoogleMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Avanço da Etapa 2 (O único controle de retorno nesta tela é o botão ← no cabeçalho) */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 3: NECESSIDADES DO NEGÓCIO & SEGMENTO                    */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Escopo do Segmento
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {segmentConfig.name}
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
            {/* Opção Primária do Segmento */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                1. {segmentConfig.primaryOptionsLabel}
              </label>
              <p className="text-[10.5px] text-slate-400">
                Selecione as opções que farão parte da estrutura do site:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {segmentConfig.primaryOptions.map((opt) => {
                  const isChecked = selectedPrimaryOptions.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => togglePrimaryOption(opt)}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
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

            {/* Opção Secundária do Segmento */}
            {segmentConfig.secondaryOptions.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  2. {segmentConfig.secondaryOptionsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {segmentConfig.secondaryOptions.map((opt) => {
                    const isChecked = selectedSecondaryOptions.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleSecondaryOption(opt)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
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

            {/* Diferenciais Básicos da Estrutura */}
            {segmentConfig.features.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  3. {segmentConfig.featuresLabel}
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {segmentConfig.features.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
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

            {/* Horários & Atendimento */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                4. Horários de Funcionamento ou Atendimento (opcional)
              </label>
              <input
                type="text"
                value={operatingSchedule}
                onChange={(e) => setOperatingSchedule(e.target.value)}
                placeholder={segmentConfig.schedulePlaceholder}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Equipe / Profissionais */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                5. Equipe / Professores / Atendimento (opcional)
              </label>
              <input
                type="text"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder={segmentConfig.teamPlaceholder}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Detalhes Adicionais dos Serviços */}
            <div>
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                6. Detalhes Adicionais dos Serviços ou Produtos (opcional)
              </label>
              <textarea
                value={freeServicesText}
                onChange={(e) => setFreeServicesText(e.target.value)}
                rows={3}
                placeholder={segmentConfig.defaultServicesPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Botão de Avanço da Etapa 3 */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 4: FUNCIONALIDADES DO PROJETO (LIMITES 0 / 3 / 5 / 8)     */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Recursos Avançados
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Plano {activePlanObj.nome}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Funcionalidades Adicionais do Projeto
            </h2>
            <p className="text-[11px] text-slate-400">
              Selecione as funcionalidades que farão parte do escopo da proposta.
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
            {/* Header com Contador Oficial (Regra 6) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-bold text-white block">
                  Seleção de Funcionalidades
                </span>
                <span className="text-[10.5px] text-slate-400">
                  Limite correspondente ao Plano {activePlanObj.nome}
                </span>
              </div>

              {/* Contador Oficial */}
              <div className="self-start sm:self-auto">
                <div
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    advancedFeaturesLimit === 0
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : selectedAdvancedFeatures.length >= advancedFeaturesLimit
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'bg-slate-950 text-cyan-400 border-slate-800'
                  }`}
                >
                  <span>
                    {selectedAdvancedFeatures.length} de {advancedFeaturesLimit} selecionadas
                  </span>
                </div>
              </div>
            </div>

            {/* Aviso para o Plano Essencial */}
            {advancedFeaturesLimit === 0 && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-[11px] text-blue-300 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>Plano Essencial · Escopo Fechado (0 funcionalidades avançadas)</span>
                </p>
                <p className="text-slate-300 leading-relaxed pl-5.5">
                  O Plano Essencial já inclui a apresentação completa do negócio, páginas essenciais, WhatsApp e SEO básico. Para selecionar funcionalidades adicionais, escolha o Plano Profissional (até 5), Personalizado (até 3) ou Premium (até 8).
                </p>
              </div>
            )}

            {/* Alerta de Limite Atingido */}
            {featureLimitMessage && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="leading-tight">{featureLimitMessage}</span>
              </div>
            )}

            {/* Categorias Dinâmicas (Regra 8: Apenas categorias com itens para o segmento) */}
            <div className="space-y-3 pt-1">
              {groupedAdvancedFeatures.map(({ category, items }) => (
                <div
                  key={category}
                  className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>{category}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {items.length} {items.length === 1 ? 'opção' : 'opções'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((feat) => {
                      const isChecked = selectedAdvancedFeatures.includes(feat.id);
                      const isLimitReached =
                        !isChecked &&
                        (advancedFeaturesLimit === 0 ||
                          selectedAdvancedFeatures.length >= advancedFeaturesLimit);

                      return (
                        <div
                          key={feat.id}
                          onClick={() => handleToggleAdvancedFeature(feat)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between ${
                            isChecked
                              ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                              : isLimitReached
                              ? 'bg-slate-950/50 border-slate-850 opacity-65 hover:opacity-85'
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <span className="text-xs font-bold leading-snug">
                                {feat.nome}
                              </span>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
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

                          {/* Tag Oficial de Complexidade (Regra 7) */}
                          {feat.isComplex && (
                            <div className="pt-2 mt-1.5 border-t border-slate-800/50 flex flex-col gap-0.5">
                              <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9.5px] font-bold">
                                <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                <span>Avançado / avaliação</span>
                              </div>
                              <span className="text-[9px] text-amber-400/75 leading-tight">
                                Disponibilidade conforme análise de viabilidade do projeto.
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
          </div>

          {/* Botão de Avanço da Etapa 4 */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 5: VISUAL, CONTEÚDO & ARQUIVOS                           */}
      {/* ============================================================== */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Identidade & Arquivos
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Plano {activePlanObj.nome}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Visual, Inspiração & Contato
            </h2>
            <p className="text-[11px] text-slate-400">
              Escolha a estética desejada, anexe seus arquivos e informe os dados de contato.
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            {/* 1. Estilo Visual do Site (Regra 10: 5 estilos canônicos) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                1. Estilo Visual Desejado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {VISUAL_STYLES.map((st) => {
                  const isChecked = visualStyle === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setVisualStyle(st.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between ${
                        isChecked
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{st.label}</span>
                        {isChecked && (
                          <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight">
                        {st.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Cores & Identidade Visual */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
                2. Paleta de Cores
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setColorMode('suggest')}
                  className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
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
                  className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
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
                  className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
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

            {/* 3. Descrição Livre / Inspirações (Regra 11) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
                3. Descrição Livre & Particularidades do Projeto (opcional)
              </label>
              <textarea
                value={customProjectIdea}
                onChange={(e) => setCustomProjectIdea(e.target.value)}
                rows={3}
                placeholder="Conte com suas palavras o que você imagina para o site, diferenciais ou pontos essenciais que não foram abordados..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />

              <div>
                <span className="text-[10.5px] text-slate-400 block mb-1">
                  Link de Referência ou Inspiração (opcional):
                </span>
                <input
                  type="url"
                  value={customReferenceLink}
                  onChange={(e) => setCustomReferenceLink(e.target.value)}
                  placeholder="https://exemplo.com.br"
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* 4. Anexos / Arquivos (Regra 12: Até 6 arquivos) */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                4. Logo & Fotos do Negócio (até 6 arquivos)
              </label>
              <ImageUploadField
                files={attachedFiles}
                onChange={setAttachedFiles}
                maxFiles={6}
              />
            </div>

            {/* 5. Dados do Responsável pelo Projeto */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                5. Dados do Responsável
              </label>

              <div>
                <span className="text-[10.5px] text-slate-300 block mb-1">Seu Nome Completo *</span>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  placeholder="Ex: João da Silva"
                  className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10.5px] text-slate-300 block mb-1">WhatsApp para Contato *</span>
                  <input
                    type="tel"
                    inputMode="tel"
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
                  <span className="text-[10.5px] text-slate-300 block mb-1">E-mail (opcional)</span>
                  <input
                    type="email"
                    inputMode="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Ex: contato@empresa.com.br"
                    className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10.5px] text-slate-300 block mb-1">Observações Finais (opcional)</span>
                <textarea
                  value={specificNotes}
                  onChange={(e) => setSpecificNotes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Preferência de horário para contato ou detalhes adicionais..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Botão de Avanço da Etapa 5 */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{getNextButtonLabel()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 6: RESUMO & ENVIO OFICIAL (REGRA 13 & 14)                 */}
      {/* ============================================================== */}
      {currentStep === 6 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Revisão Final do Briefing
            </h2>
            <p className="text-xs text-slate-300">
              Confira os dados organizados do seu projeto antes do envio oficial:
            </p>
          </div>

          {/* Card Resumo Estruturado com Ações Rápidas de Edição */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm text-xs">
            {/* Bloco 1: Plano & Origem */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Plano Selecionado
                </span>
                <span className="text-sm font-bold text-white">
                  Plano {activePlanObj.nome}
                </span>
                <span className="text-[10.5px] text-slate-400 block mt-0.5">
                  Prazo previsto: {activePlanObj.prazo}
                </span>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {activePlanObj.preco}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                  title="Editar plano"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bloco 2: Negócio & Objetivo */}
            <div className="space-y-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Dados do Negócio
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Editar
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Negócio / Empresa:</span>
                <span className="font-bold text-white text-right">{businessName}</span>
              </div>

              {siteObjective && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Objetivo Principal:</span>
                  <span className="font-semibold text-cyan-300 text-right">
                    {SITE_OBJECTIVES.find((o) => o.id === siteObjective)?.label || siteObjective}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Segmento:</span>
                <span className="text-white text-right font-medium">
                  {segmentConfig.icon} {segmentConfig.name}
                </span>
              </div>

              {selectedModel && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Amostra de Referência:</span>
                  <span className="text-white text-right">{selectedModel}</span>
                </div>
              )}

              {businessLocation && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Localização / Região:</span>
                  <span className="text-white text-right">{businessLocation}</span>
                </div>
              )}
            </div>

            {/* Bloco 3: Escopo do Segmento */}
            <div className="space-y-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Escopo & Necessidades
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Editar
                </button>
              </div>

              {selectedPrimaryOptions.length > 0 && (
                <div>
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
                <div className="pt-1">
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
            </div>

            {/* Bloco 4: Funcionalidades Avançadas */}
            <div className="space-y-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Funcionalidades ({selectedAdvancedFeatures.length} de {advancedFeaturesLimit})
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Editar
                </button>
              </div>

              {selectedAdvancedFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedAdvancedFeatures.map((featId) => {
                    const feat = findAdvancedFeatureById(featId);
                    return (
                      <span
                        key={featId}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 border border-slate-800 flex items-center gap-1"
                      >
                        <span>{feat ? feat.nome : featId}</span>
                        {feat?.isComplex && (
                          <span className="text-[8.5px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            avaliação
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 italic block">
                  {advancedFeaturesLimit === 0
                    ? 'Plano Essencial · Escopo fechado'
                    : 'Nenhuma funcionalidade adicional selecionada'}
                </span>
              )}
            </div>

            {/* Bloco 5: Visual, Conteúdo & Contato */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Visual, Arquivos & Contato
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Editar
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estilo Visual:</span>
                <span className="text-white text-right font-medium">{visualStyle}</span>
              </div>

              {customProjectIdea && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Descrição Livre:</span>
                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    {customProjectIdea}
                  </p>
                </div>
              )}

              {attachedFiles.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Arquivos anexados:</span>
                  <span className="font-mono text-cyan-300">{attachedFiles.length} foto(s)/logo</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-slate-400">Responsável:</span>
                <span className="font-bold text-white text-right">{contactName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono text-cyan-300 text-right">{contactPhone}</span>
              </div>

              {contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">E-mail:</span>
                  <span className="text-white text-right">{contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Feedback de Sucesso no Envio */}
          {submissionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Briefing Registrado com Sucesso!</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {submissionSuccess.message}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-400">Protocolo do Projeto:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {submissionSuccess.projectId}
                </span>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>Acompanhar na Área do Cliente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="min-h-[44px] py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          )}

          {/* Erro de Envio com Opção de Protocolo Offline */}
          {submissionError && !submissionSuccess && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Erro ao enviar proposta online</span>
              </div>
              <p className="text-xs text-slate-300">
                {submissionError}
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSubmitProject}
                  disabled={isSubmitting}
                  className="min-h-[42px] flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Tentar Novamente</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateOfflineProtocol}
                  className="min-h-[42px] flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Salvar Offline com Protocolo</span>
                </button>
              </div>
            </div>
          )}

          {/* Botões de Ação da Etapa 6 (Copiar e Enviar) */}
          {!submissionSuccess && (
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleSubmitProject}
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registrando seu projeto...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Briefing Oficial</span>
                  </>
                )}
              </button>

              {/* Botão para Copiar Briefing Formatado */}
              <button
                type="button"
                onClick={handleCopyBriefing}
                className="min-h-[44px] w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar resumo formatado para o WhatsApp'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
