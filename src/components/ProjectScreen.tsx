import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ViewTab, WebsiteLanguage, PortfolioProject } from '../types';
import { getNexawebPlans, NexawebPlan } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
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
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

// Importações dos Componentes Modulares de Etapas do Briefing Oficial (Etapa 6)
import { BriefingStepHeader } from './briefing/BriefingStepHeader';
import { Step1Origin } from './briefing/Step1Origin';
import { Step2MainInfo } from './briefing/Step2MainInfo';
import { Step3Segment } from './briefing/Step3Segment';
import { Step4Needs } from './briefing/Step4Needs';
import { Step5Features } from './briefing/Step5Features';
import { Step6Visual } from './briefing/Step6Visual';
import { Step7Content } from './briefing/Step7Content';
import { Step8Files } from './briefing/Step8Files';
import { Step9Summary } from './briefing/Step9Summary';
import {
  BriefingStep,
  SITE_OBJECTIVES,
  VISUAL_STYLES,
  SiteObjectiveOption,
  VisualStyleOption,
} from './briefing/briefingTypes';

// Re-exportações para compatibilidade
export { SITE_OBJECTIVES, VISUAL_STYLES };
export type { BriefingStep, SiteObjectiveOption, VisualStyleOption };

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

  // Fluxo oficial progressivo em 9 etapas:
  // 1: Tipo / Origem (Amostra / Ideia própria / Escolher plano)
  // 2: Informações Principais (Nome do negócio, Objetivo do site, Idioma, Localização, Filiais, Maps)
  // 3: Segmento (Nicho de atuação compacto e app-like)
  // 4: Necessidades (Conteúdo/escopo específico do segmento)
  // 5: Funcionalidades (Recursos avançados com limites 0 / 3 / 5 / 8 do plano)
  // 6: Visual (5 estilos canônicos & paleta de cores)
  // 7: Conteúdo & Inspirações (Ideias livres, link referência e contatos do responsável)
  // 8: Arquivos (Até 6 arquivos: logo e fotos)
  // 9: Resumo & Envio (Revisão estruturada com atalhos de edição e envio oficial)
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

  // Plano selecionado (inicia vazio caso nenhum plano tenha sido passado como ponto de partida)
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || '');

  // Segmento dinâmico selecionado: inicia vazio para o usuário escolher
  const [selectedSegment, setSelectedSegment] = useState<string>(() => {
    if (initialModel) return normalizeSegmentKey(initialModel);
    return '';
  });

  // Filtro de amostras por categoria na Etapa 1
  const [sampleFilter, setSampleFilter] = useState<string>('todos');

  // Configuração ativa do segmento dinâmico
  const segmentConfig = useMemo(() => {
    return getSegmentConfig(selectedSegment);
  }, [selectedSegment]);

  // --- ETAPA 2: INFORMAÇÕES PRINCIPAIS & OBJETIVO ---
  const [businessName, setBusinessName] = useState('');
  const [siteObjective, setSiteObjective] = useState<string>('');
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
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessBranches, setBusinessBranches] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');

  // --- ETAPA 4: NECESSIDADES DO NEGÓCIO & SEGMENTO ---
  const [selectedPrimaryOptions, setSelectedPrimaryOptions] = useState<string[]>([]);
  const [selectedSecondaryOptions, setSelectedSecondaryOptions] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [operatingSchedule, setOperatingSchedule] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [freeServicesText, setFreeServicesText] = useState('');

  // --- ETAPA 5: FUNCIONALIDADES AVANÇADAS DO PROJETO ---
  const [selectedAdvancedFeatures, setSelectedAdvancedFeatures] = useState<string[]>([]);
  const [featureLimitMessage, setFeatureLimitMessage] = useState<string | null>(null);

  // Limite oficial de funcionalidades avançadas do plano selecionado (0 / 3 / 5 / 8)
  const advancedFeaturesLimit = useMemo(() => {
    const activePlanId = selectedPlan || initialPlan;
    if (!activePlanId) return 0;
    return getPlanAdvancedFeaturesLimit(activePlanId);
  }, [selectedPlan, initialPlan]);

  // Funcionalidades agrupadas pelas 13 categorias filtradas para o segmento atual e plano ativo
  const groupedAdvancedFeatures = useMemo(() => {
    const activePlanId = selectedPlan || initialPlan;
    return getAdvancedFeaturesGroupedBySegment(
      selectedSegment,
      activePlanId || 'profissional'
    );
  }, [selectedSegment, selectedPlan, initialPlan]);

  // Ajusta seleção caso o usuário troque para um plano com limite menor
  useEffect(() => {
    const activePlanId = selectedPlan || initialPlan;
    if (!activePlanId) return;
    const limit = getPlanAdvancedFeaturesLimit(activePlanId);
    setSelectedAdvancedFeatures((prev) => {
      if (prev.length > limit) {
        return prev.slice(0, limit);
      }
      return prev;
    });
    setFeatureLimitMessage(null);
  }, [selectedPlan, initialPlan]);

  // --- ETAPA 6: VISUAL ---
  const [visualStyle, setVisualStyle] = useState<string>('');
  const [colorMode, setColorMode] = useState<'suggest' | 'brand' | 'custom' | ''>('');
  const [customColorDetails, setCustomColorDetails] = useState('');

  // --- ETAPA 7: CONTEÚDO, INSPIRAÇÕES & CONTATO ---
  const [customProjectIdea, setCustomProjectIdea] = useState('');
  const [customReferenceLink, setCustomReferenceLink] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  // --- ETAPA 8: ARQUIVOS (Até 6 arquivos) ---
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- ETAPA 9: RESUMO & ENVIO OFICIAL ---
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

  // Limpa seleções de nicho caso o usuário altere o segmento explicitamente na Etapa 3
  const prevSegmentRef = useRef(selectedSegment);
  useEffect(() => {
    if (prevSegmentRef.current && prevSegmentRef.current !== selectedSegment) {
      setSelectedPrimaryOptions([]);
      setSelectedSecondaryOptions([]);
      setSelectedFeatures([]);
    }
    prevSegmentRef.current = selectedSegment;
  }, [selectedSegment]);

  // Suporte ao teclado virtual Android: assegura que qualquer campo focado permaneça visível sem cortes
  const isKeyboardOpenRef = useRef<boolean>(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const scrollPosBeforeKeyboardRef = useRef<number>(0);

  const scrollActiveFieldIntoView = useCallback((el: HTMLElement) => {
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const headerHeight = 70; // altura do cabeçalho fixo no topo
    const bottomPadding = 30;

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
          setIsKeyboardOpen(true);
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
          setIsKeyboardOpen(false);
          // Nota crítica: NÃO forçar scroll to top! Mantém posição do usuário estável.
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

  const [hasSavedDraftData, setHasSavedDraftData] = useState<boolean>(false);

  // Carrega rascunho salvo do armazenamento local
  useEffect(() => {
    async function loadDraft() {
      const planToLoad = selectedPlan || initialPlan;
      if (!planToLoad) return;
      try {
        const draft = getBriefingDraftSync(planToLoad) || (await getBriefingDraft(planToLoad));
        if (draft) {
          const hasData = Boolean(
            draft.businessName ||
              draft.siteObjective ||
              draft.selectedSegment ||
              draft.visualStyle ||
              draft.contactName ||
              (draft.selectedAdvancedFeatures && draft.selectedAdvancedFeatures.length > 0) ||
              (draft.selectedFeatureIds && draft.selectedFeatureIds.length > 0)
          );
          setHasSavedDraftData(hasData);

          if (draft.businessName && !businessName) setBusinessName(draft.businessName);
          if (draft.siteObjective && !siteObjective) setSiteObjective(draft.siteObjective);
          if (draft.selectedSegment && !selectedSegment) setSelectedSegment(draft.selectedSegment);
          if (draft.businessLocation && !businessLocation) setBusinessLocation(draft.businessLocation);
          if (draft.googleMapsLink && !googleMapsLink) setGoogleMapsLink(draft.googleMapsLink);
          if (draft.visualStyle && !visualStyle) setVisualStyle(draft.visualStyle);
          if (draft.contactName && !contactName) setContactName(draft.contactName);
          if (draft.contactPhone && !contactPhone) setContactPhone(draft.contactPhone);
          if (draft.contactEmail && !contactEmail) setContactEmail(draft.contactEmail);
        }
      } catch {
        // Fallback silencioso
      }
    }
    loadDraft();
  }, [selectedPlan, initialPlan]);

  // Salva rascunho automaticamente SOMENTE após interação real do usuário
  useEffect(() => {
    const hasUserMadeAnyChoice = Boolean(
      businessName.trim() ||
        siteObjective ||
        selectedSegment ||
        selectedPrimaryOptions.length > 0 ||
        selectedSecondaryOptions.length > 0 ||
        selectedFeatures.length > 0 ||
        selectedAdvancedFeatures.length > 0 ||
        visualStyle ||
        colorMode ||
        contactName.trim() ||
        contactPhone.trim()
    );

    if (!hasUserMadeAnyChoice) return;
    const planToSave = selectedPlan || initialPlan;
    if (!planToSave) return;

    const timer = setTimeout(() => {
      saveBriefingDraft(planToSave, {
        selectedPlan: planToSave,
        businessName,
        siteObjective,
        selectedSegment,
        businessLocation,
        googleMapsLink,
        selectedFeatureIds: selectedFeatures,
        selectedAdvancedFeatures,
        visualStyle,
        contactName,
        contactPhone,
        contactEmail,
        updatedAt: Date.now(),
      }).catch(() => {});
    }, 600);

    return () => clearTimeout(timer);
  }, [
    selectedPlan,
    initialPlan,
    businessName,
    siteObjective,
    selectedSegment,
    businessLocation,
    googleMapsLink,
    selectedFeatures,
    selectedAdvancedFeatures,
    visualStyle,
    colorMode,
    contactName,
    contactPhone,
    contactEmail,
  ]);

  // Reinicia o briefing do zero e limpa qualquer rascunho persistido
  const handleResetBriefing = useCallback(async () => {
    await clearBriefingDraft(selectedPlan);
    setHasSavedDraftData(false);
    setCurrentStep(1);
    setSelectedModel('');
    setBusinessName('');
    setSiteObjective('');
    setBusinessLocation('');
    setBusinessBranches('');
    setGoogleMapsLink('');
    setSelectedSegment('');
    setSelectedPrimaryOptions([]);
    setSelectedSecondaryOptions([]);
    setSelectedFeatures([]);
    setSelectedAdvancedFeatures([]);
    setOperatingSchedule('');
    setTeamDescription('');
    setFreeServicesText('');
    setVisualStyle('');
    setColorMode('');
    setCustomColorDetails('');
    setCustomProjectIdea('');
    setCustomReferenceLink('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setSpecificNotes('');
    setAttachedFiles([]);
    setStepError(null);
  }, [selectedPlan]);

  // Retorno de etapa unificado
  const handlePrevStep = useCallback(() => {
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
  }, [currentStep, onBack, onNavigate]);

  // Sincroniza passo interno e botão voltar físico/norteador com App.tsx
  useEffect(() => {
    if (onStepChange) {
      const canGoBackStep = currentStep > 1;
      const goBackStep = () => {
        setStepError(null);
        setCurrentStep((prev) => (Math.max(1, prev - 1) as BriefingStep));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      onStepChange(currentStep, canGoBackStep, goBackStep);
    }
  }, [currentStep, onStepChange]);

  // Plano ativo
  const activePlanObj: NexawebPlan = useMemo(() => {
    const targetPlan = (selectedPlan || initialPlan || '').toLowerCase().trim();
    const found = plans.find((p) => p.id.toLowerCase() === targetPlan);
    if (found) return found;
    return plans.find((p) => p.id === 'profissional') || plans[1] || plans[0];
  }, [plans, selectedPlan, initialPlan]);

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
        'O plano Essencial possui escopo fechado (0 funcionalidades avançadas). Para incluir funcionalidades adicionais, selecione o plano Profissional (até 5), Personalizado (até 3) ou Premium (até 8).'
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
      if (startMode === 'plano' && !selectedPlan) {
        setStepError('Por favor, selecione um dos 4 planos oficiais para continuar.');
        return;
      }
      if (startMode === 'propria' && !selectedPlan) {
        setSelectedPlan('personalizado');
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 2: Informações Principais & Objetivo
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

    // Etapa 3: Segmento
    if (currentStep === 3) {
      if (!selectedSegment) {
        setStepError('Por favor, selecione o Segmento de atuação do seu negócio para prosseguir.');
        return;
      }
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 4: Necessidades
    if (currentStep === 4) {
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 5: Funcionalidades
    if (currentStep === 5) {
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 6: Visual
    if (currentStep === 6) {
      if (!visualStyle) {
        setStepError('Por favor, selecione o Estilo Visual desejado para o seu site.');
        return;
      }
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 7: Conteúdo & Contato
    if (currentStep === 7) {
      if (!contactName.trim() || !contactPhone.trim()) {
        setStepError('Por favor, preencha o Nome do responsável e o WhatsApp de contato para prosseguir.');
        return;
      }
      setCurrentStep(8);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 8: Arquivos
    if (currentStep === 8) {
      setCurrentStep(9);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Etapa 9: Envio oficial
    if (currentStep === 9) {
      handleSubmitProject();
    }
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

    if (visualStyle) {
      lines.push('');
      lines.push(`🎨 *Estilo Visual:* ${visualStyle}`);
    }
    if (colorMode) {
      lines.push(
        colorMode === 'suggest'
          ? '🎨 *Identidade Visual:* Sugestão NexaWeb (Harmonia visual)'
          : colorMode === 'brand'
          ? `🎨 *Cores da Marca:* ${customColorDetails || 'Cores da identidade visual existente'}`
          : `🎨 *Cores Escolhidas:* ${customColorDetails || 'Tons específicos indicados'}`
      );
    }

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
        origem: 'NexaWeb App · Etapa 6',
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

  const handleEditStep = (step: number) => {
    setStepError(null);
    setCurrentStep(step as BriefingStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onFocusCapture={handleFormFocusCapture}
      className={`space-y-3.5 ${
        isKeyboardOpen ? 'pb-72' : 'pb-3 sm:pb-4'
      } animate-in fade-in duration-150 overflow-x-hidden w-full min-w-0 transition-[padding] duration-150`}
    >
      {/* Cabeçalho Progressivo com Indicador Discreto (Etapa X de 9) */}
      <BriefingStepHeader
        currentStep={currentStep}
        totalSteps={9}
        planName={selectedPlan || initialPlan ? activePlanObj.nome : ''}
        planPrice={selectedPlan || initialPlan ? activePlanObj.preco : ''}
        canGoBack={true}
        onBackAction={onBack || (() => onNavigate('home'))}
      />

      {/* Alerta de Validação de Etapa */}
      {stepError && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* ETAPA 1: TIPO / ORIGEM */}
      {currentStep === 1 && (
        <Step1Origin
          startMode={startMode}
          setStartMode={setStartMode}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          modelApproach={modelApproach}
          setModelApproach={setModelApproach}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          activePlanObj={activePlanObj}
          plans={plans}
          filteredDemos={filteredDemos}
          sampleFilter={sampleFilter}
          setSampleFilter={setSampleFilter}
          selectedProjectObj={selectedProjectObj}
          handleSelectDemo={handleSelectDemo}
          hasInitialPlan={Boolean(initialPlan && selectedPlan)}
          hasSavedData={hasSavedDraftData}
          onResetBriefing={handleResetBriefing}
          onNext={handleNextStep}
        />
      )}

      {/* ETAPA 2: INFORMAÇÕES PRINCIPAIS & OBJETIVO */}
      {currentStep === 2 && (
        <Step2MainInfo
          businessName={businessName}
          setBusinessName={setBusinessName}
          siteObjective={siteObjective}
          setSiteObjective={setSiteObjective}
          siteLanguage={siteLanguage}
          setSiteLanguage={setSiteLanguage}
          businessLocation={businessLocation}
          setBusinessLocation={setBusinessLocation}
          businessBranches={businessBranches}
          setBusinessBranches={setBusinessBranches}
          googleMapsLink={googleMapsLink}
          setGoogleMapsLink={setGoogleMapsLink}
          planName={activePlanObj.nome}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onClearError={() => setStepError(null)}
        />
      )}

      {/* ETAPA 3: SEGMENTO */}
      {currentStep === 3 && (
        <Step3Segment
          selectedSegment={selectedSegment}
          onSelectSegment={setSelectedSegment}
          segmentConfig={segmentConfig}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* ETAPA 4: NECESSIDADES DO NEGÓCIO */}
      {currentStep === 4 && (
        <Step4Needs
          segmentConfig={segmentConfig}
          selectedPrimaryOptions={selectedPrimaryOptions}
          togglePrimaryOption={togglePrimaryOption}
          selectedSecondaryOptions={selectedSecondaryOptions}
          toggleSecondaryOption={toggleSecondaryOption}
          selectedFeatures={selectedFeatures}
          toggleFeature={toggleFeature}
          operatingSchedule={operatingSchedule}
          setOperatingSchedule={setOperatingSchedule}
          teamDescription={teamDescription}
          setTeamDescription={setTeamDescription}
          freeServicesText={freeServicesText}
          setFreeServicesText={setFreeServicesText}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* ETAPA 5: FUNCIONALIDADES */}
      {currentStep === 5 && (
        <Step5Features
          planName={activePlanObj.nome}
          advancedFeaturesLimit={advancedFeaturesLimit}
          selectedAdvancedFeatures={selectedAdvancedFeatures}
          groupedAdvancedFeatures={groupedAdvancedFeatures}
          featureLimitMessage={featureLimitMessage}
          handleToggleAdvancedFeature={handleToggleAdvancedFeature}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* ETAPA 6: VISUAL */}
      {currentStep === 6 && (
        <Step6Visual
          visualStyle={visualStyle}
          setVisualStyle={setVisualStyle}
          colorMode={colorMode}
          setColorMode={setColorMode}
          customColorDetails={customColorDetails}
          setCustomColorDetails={setCustomColorDetails}
          planName={activePlanObj.nome}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* ETAPA 7: CONTEÚDO & INSPIRAÇÕES */}
      {currentStep === 7 && (
        <Step7Content
          customProjectIdea={customProjectIdea}
          setCustomProjectIdea={setCustomProjectIdea}
          customReferenceLink={customReferenceLink}
          setCustomReferenceLink={setCustomReferenceLink}
          contactName={contactName}
          setContactName={setContactName}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          specificNotes={specificNotes}
          setSpecificNotes={setSpecificNotes}
          planName={activePlanObj.nome}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onClearError={() => setStepError(null)}
        />
      )}

      {/* ETAPA 8: ARQUIVOS */}
      {currentStep === 8 && (
        <Step8Files
          attachedFiles={attachedFiles}
          setAttachedFiles={setAttachedFiles}
          planName={activePlanObj.nome}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {/* ETAPA 9: RESUMO & ENVIO */}
      {currentStep === 9 && (
        <Step9Summary
          activePlanObj={activePlanObj}
          startMode={startMode}
          selectedModel={selectedModel}
          modelApproach={modelApproach}
          businessName={businessName}
          siteObjective={siteObjective}
          businessLocation={businessLocation}
          businessBranches={businessBranches}
          googleMapsLink={googleMapsLink}
          segmentConfig={segmentConfig}
          selectedPrimaryOptions={selectedPrimaryOptions}
          selectedSecondaryOptions={selectedSecondaryOptions}
          selectedFeatures={selectedFeatures}
          operatingSchedule={operatingSchedule}
          teamDescription={teamDescription}
          freeServicesText={freeServicesText}
          selectedAdvancedFeatures={selectedAdvancedFeatures}
          advancedFeaturesLimit={advancedFeaturesLimit}
          visualStyle={visualStyle}
          colorMode={colorMode}
          customColorDetails={customColorDetails}
          customProjectIdea={customProjectIdea}
          customReferenceLink={customReferenceLink}
          contactName={contactName}
          contactPhone={contactPhone}
          contactEmail={contactEmail}
          specificNotes={specificNotes}
          attachedFiles={attachedFiles}
          isSubmitting={isSubmitting}
          submissionSuccess={submissionSuccess}
          submissionError={submissionError}
          copied={copied}
          onSubmit={handleSubmitProject}
          onCopy={handleCopyBriefing}
          onRetry={handleSubmitProject}
          onOfflineProtocol={handleGenerateOfflineProtocol}
          onEditStep={handleEditStep}
          onNavigate={onNavigate}
          onResetBriefing={handleResetBriefing}
        />
      )}
    </div>
  );
};
