import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ViewTab,
  SettingsSubView,
  OnboardingAnswers,
  ProjectRecommendation,
  WebsiteLanguage,
  PortfolioProject,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { ProjectScreen } from './components/ProjectScreen';
import { ProjectDetailScreen } from './components/ProjectDetailScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PortalScreen } from './components/PortalScreen';
import { AdminScreen } from './components/AdminScreen';
import { OurServicesScreen } from './components/OurServicesScreen';
import { AppDrawer } from './components/AppDrawer';
import { ContactModal } from './components/ContactModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RecommendationModal } from './components/RecommendationModal';
import { BriefingDraftModal } from './components/BriefingDraftModal';
import { IntroSplash } from './components/IntroSplash';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import {
  setOnboardingCompleted,
  getSavedOnboardingAnswers,
  saveOnboardingAnswers,
  findExistingBriefingDraft,
  findExistingBriefingDraftSync,
  hasMeaningfulDraftData,
  clearBriefingDraft,
  clearAllBriefingDrafts,
  BriefingDraftData,
} from './utils/storage';
import { calculateRecommendation } from './utils/recommendationEngine';
import { getPortfolioProjects } from './data/portfolioData';

interface HistoryEntry {
  tab: ViewTab;
  projectDetail: PortfolioProject | null;
  selectedPlan?: string;
  selectedModel?: string;
  selectedWebsiteLanguage?: WebsiteLanguage;
  modelApproach?: 'exact' | 'inspiration';
  scrollY?: number;
  settingsSubView?: SettingsSubView;
  selectedOurServiceId?: string | null;
}

function AppContent() {
  const { language, t } = useTranslation();
  const { resolvedTheme } = useTheme();

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('nexaweb_intro_shown');
    } catch {
      return true;
    }
  });

  // Pilha de histórico de navegação real do aplicativo
  const [history, setHistory] = useState<HistoryEntry[]>([
    { tab: 'home', projectDetail: null },
  ]);

  // Estados padrão salvos para inicializações (sem forçar plano por padrão)
  const [savedPlan, setSavedPlan] = useState<string | undefined>(undefined);
  const [savedModel, setSavedModel] = useState<string | undefined>(undefined);
  const [savedModelApproach, setSavedModelApproach] = useState<'exact' | 'inspiration'>('exact');
  const [savedWebsiteLanguage, setSavedWebsiteLanguage] = useState<WebsiteLanguage | undefined>(undefined);

  // Preservação de estado da Vitrine de Demonstrações (Filtro, Segmento, Busca e Rolagem)
  const [portfolioPlanFilter, setPortfolioPlanFilter] = useState<
    'todas' | 'essencial' | 'profissional' | 'premium'
  >('todas');
  const [portfolioSegmentFilter, setPortfolioSegmentFilter] = useState<string>('todos');
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState('');
  const portfolioScrollPosRef = useRef(0);
  const ourServicesScrollPosRef = useRef(0);

  // Derivação estrita do estado da tela ativa a partir do topo do histórico
  const currentEntry = history[history.length - 1] || { tab: 'home', projectDetail: null };
  const currentTab = currentEntry.tab;
  const selectedProjectDetail = currentEntry.projectDetail || null;
  const selectedPlanForProject = currentEntry.selectedPlan;
  const selectedModelForProject =
    currentEntry.selectedModel !== undefined ? currentEntry.selectedModel : undefined;
  const selectedModelApproachForProject =
    currentEntry.modelApproach || savedModelApproach;
  const selectedWebsiteLanguageForProject =
    currentEntry.selectedWebsiteLanguage || savedWebsiteLanguage;
  const currentSettingsSubView = currentEntry.settingsSubView;
  const selectedOurServiceId = currentEntry.selectedOurServiceId || null;

  const activeScreenId = selectedProjectDetail
    ? `detail-${selectedProjectDetail.id}`
    : currentTab === 'settings' && currentSettingsSubView
    ? `settings-${currentSettingsSubView}`
    : currentTab === 'our-services' && selectedOurServiceId
    ? `our-service-${selectedOurServiceId}`
    : currentTab;

  // Reset global e determinístico de rolagem ao navegar para uma NOVA TELA
  // Garante que qualquer nova tela sempre inicie no topo após o React renderizar o DOM
  useEffect(() => {
    // Exceção estrita de restauração do Portfólio e Nossos Serviços:
    // Ao fechar detalhes com posição salva na vitrine/lista,
    // não reseta para o topo para permitir a restauração exata da posição da lista
    if (!selectedProjectDetail && portfolioScrollPosRef.current > 0) {
      return;
    }
    if (currentTab === 'our-services' && !selectedOurServiceId && ourServicesScrollPosRef.current > 0) {
      return;
    }

    if (typeof window === 'undefined') return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }

    if (document.body) {
      document.body.scrollTop = 0;
    }

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }

      if (document.body) {
        document.body.scrollTop = 0;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeScreenId, selectedProjectDetail, currentTab, selectedOurServiceId]);

  // Restaura posição da lista ao fechar detalhes (sem conflito com smooth scroll)
  useEffect(() => {
    if (!selectedProjectDetail && portfolioScrollPosRef.current > 0) {
      const savedPos = portfolioScrollPosRef.current;
      portfolioScrollPosRef.current = 0;
      const timer = setTimeout(() => {
        window.scrollTo({ top: savedPos, behavior: 'instant' as ScrollBehavior });
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [selectedProjectDetail]);

  // Restaura posição da lista de Nossos Serviços ao fechar detalhes de um serviço
  useEffect(() => {
    if (currentTab === 'our-services' && !selectedOurServiceId && ourServicesScrollPosRef.current > 0) {
      const savedPos = ourServicesScrollPosRef.current;
      ourServicesScrollPosRef.current = 0;
      const timer = setTimeout(() => {
        window.scrollTo({ top: savedPos, behavior: 'instant' as ScrollBehavior });
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentTab, selectedOurServiceId]);

  // Refs para coordenação com etapas internas do wizard de briefing (ProjectScreen)
  const projectStepRef = useRef<number>(1);
  const projectStepBackRef = useRef<(() => void) | null>(null);
  const canStepBackInProjectRef = useRef<boolean>(false);

  // Estados dos Modais & Drawer
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

  // Modal de Rascunho de Briefing em Andamento (Continuar ou Fechar)
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [existingDraftInfo, setExistingDraftInfo] = useState<{
    planId: string;
    draft: BriefingDraftData;
  } | null>(null);
  const [shouldRestoreDraft, setShouldRestoreDraft] = useState<boolean>(false);
  const [isDraftPendingConfirmation, setIsDraftPendingConfirmation] = useState<boolean>(false);
  const [draftResetSignal, setDraftResetSignal] = useState<number>(0);
  const hasCheckedStartupDraftRef = useRef<boolean>(false);
  const hasDraftBeenDecidedRef = useRef<boolean>(false);

  // Notificação de estado de aprovação/sucesso do briefing ativo
  const [isBriefingApproved, setIsBriefingApproved] = useState<boolean>(false);

  // Detecção de teclado virtual Android para ocultação garantida da BottomNav sobre formulários
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const isOpen = window.innerHeight - vv.height > 150;
      setIsKeyboardOpen(isOpen);
    };

    vv.addEventListener('resize', handleResize);
    return () => vv.removeEventListener('resize', handleResize);
  }, []);

  // Esconde splash screen uma única vez ao montar (ThemeContext gerencia a StatusBar)
  useEffect(() => {
    SplashScreen.hide().catch(() => {});
  }, []);

  // Carregamento de respostas salvas sem bloqueio de entrada na Home
  useEffect(() => {
    async function loadSavedRecommendation() {
      try {
        const savedAnswers = await getSavedOnboardingAnswers();
        if (savedAnswers) {
          const rec = calculateRecommendation(savedAnswers, language, t);
          setRecommendation(rec);
          setSavedWebsiteLanguage(savedAnswers.websiteLanguage);
        }
      } catch {
        // Fallback gracioso
      }
    }

    loadSavedRecommendation();
  }, [language, t]);

  // Verificação de rascunho de Briefing salvo na abertura/reabertura do aplicativo
  useEffect(() => {
    if (hasCheckedStartupDraftRef.current) return;
    hasCheckedStartupDraftRef.current = true;

    async function checkStartupDraft() {
      try {
        const found = await findExistingBriefingDraft();
        if (found && hasMeaningfulDraftData(found.draft)) {
          setExistingDraftInfo(found);
          setIsDraftModalOpen(true);
        }
      } catch {
        // Fallback silencioso
      }
    }

    checkStartupDraft();
  }, []);

  // Bloco 3.6 — Verificação e confirmação ao ENTRAR no Briefing
  useEffect(() => {
    if (currentTab !== 'project') {
      // Quando sai do Briefing, reseta a decisão para que uma nova entrada valide novamente
      hasDraftBeenDecidedRef.current = false;
      setIsDraftPendingConfirmation(false);
      setShouldRestoreDraft(false);
      return;
    }

    // Se a decisão já foi tomada nesta entrada no Briefing, não abre o modal novamente
    if (hasDraftBeenDecidedRef.current) {
      return;
    }

    async function checkDraftOnEnter() {
      try {
        const planToCheck = selectedPlanForProject || savedPlan;
        const found =
          findExistingBriefingDraftSync(planToCheck) ||
          (await findExistingBriefingDraft(planToCheck));

        if (found && hasMeaningfulDraftData(found.draft)) {
          setExistingDraftInfo(found);
          setIsDraftPendingConfirmation(true);
          setIsDraftModalOpen(true);
        } else {
          setIsDraftPendingConfirmation(false);
        }
      } catch {
        setIsDraftPendingConfirmation(false);
      }
    }

    checkDraftOnEnter();
  }, [currentTab, selectedPlanForProject, savedPlan]);

  // Função central de avanço de navegação com registro de histórico real
  const navigateTo = useCallback(
    (
      tab: ViewTab,
      options?: {
        projectDetail?: PortfolioProject | null;
        selectedPlan?: string;
        selectedModel?: string;
        selectedWebsiteLanguage?: WebsiteLanguage;
        modelApproach?: 'exact' | 'inspiration';
        resetToRoot?: boolean;
        settingsSubView?: SettingsSubView;
        selectedOurServiceId?: string | null;
      }
    ) => {
      // Se saindo do criador de projetos, reseta refs de wizard
      if (tab !== 'project') {
        projectStepRef.current = 1;
        projectStepBackRef.current = null;
        canStepBackInProjectRef.current = false;
      }

      // Bloco 3.6 — Ao navegar para o Briefing a partir de outra aba
      if (tab === 'project' && !hasDraftBeenDecidedRef.current) {
        const planToCheck = options?.selectedPlan || savedPlan;
        const syncDraft = findExistingBriefingDraftSync(planToCheck);
        if (syncDraft && hasMeaningfulDraftData(syncDraft.draft)) {
          setExistingDraftInfo(syncDraft);
          setIsDraftPendingConfirmation(true);
          setIsDraftModalOpen(true);
        }
      }

      if (options?.selectedPlan !== undefined) {
        setSavedPlan(options.selectedPlan);
      }
      if (options?.modelApproach) setSavedModelApproach(options.modelApproach);
      if (options?.selectedWebsiteLanguage) setSavedWebsiteLanguage(options.selectedWebsiteLanguage);

      setHistory((prev) => {
        // Ao navegar para a home sem detalhe ou resetando raiz (ex.: toque no BottomNav Início):
        if (
          tab === 'home' &&
          (options?.resetToRoot || (!options?.projectDetail && !options?.selectedPlan && !options?.selectedModel && !options?.settingsSubView && !options?.selectedOurServiceId))
        ) {
          return [{ tab: 'home', projectDetail: null }];
        }

        const current = prev[prev.length - 1];
        if (current) {
          current.scrollY = window.scrollY;
        }

        const nextEntry: HistoryEntry = {
          tab,
          projectDetail: options?.projectDetail !== undefined ? options.projectDetail : null,
          selectedPlan:
            options?.selectedPlan !== undefined
              ? options.selectedPlan
              : current?.selectedPlan,
          selectedModel: options?.selectedModel !== undefined ? options.selectedModel : undefined,
          modelApproach:
            options?.modelApproach !== undefined ? options.modelApproach : current?.modelApproach,
          selectedWebsiteLanguage:
            options?.selectedWebsiteLanguage !== undefined
              ? options.selectedWebsiteLanguage
              : current?.selectedWebsiteLanguage,
          settingsSubView: options?.settingsSubView,
          selectedOurServiceId: options?.selectedOurServiceId !== undefined ? options.selectedOurServiceId : undefined,
        };

        // Não empilha duplicata se o destino for estritamente idêntico ao topo atual
        if (
          current &&
          current.tab === nextEntry.tab &&
          current.projectDetail?.id === nextEntry.projectDetail?.id &&
          current.selectedPlan === nextEntry.selectedPlan &&
          current.selectedModel === nextEntry.selectedModel &&
          current.modelApproach === nextEntry.modelApproach &&
          current.settingsSubView === nextEntry.settingsSubView &&
          current.selectedOurServiceId === nextEntry.selectedOurServiceId
        ) {
          return prev;
        }

        // Prevenção de loop A -> B -> A:
        // Se a tela destino for idêntica à tela imediatamente anterior, remove o topo atual
        if (prev.length >= 2) {
          const prevEntry = prev[prev.length - 2];
          if (
            prevEntry.tab === nextEntry.tab &&
            prevEntry.projectDetail?.id === nextEntry.projectDetail?.id &&
            prevEntry.selectedPlan === nextEntry.selectedPlan &&
            prevEntry.selectedModel === nextEntry.selectedModel &&
            prevEntry.modelApproach === nextEntry.modelApproach &&
            prevEntry.settingsSubView === nextEntry.settingsSubView &&
            prevEntry.selectedOurServiceId === nextEntry.selectedOurServiceId
          ) {
            return prev.slice(0, prev.length - 1);
          }
        }

        // Se for troca direta de aba de menu principal (sem contexto/plano/modelo específico)
        // e a aba já existe na pilha, trunca até ela para evitar ciclos infinitos entre abas
        if (!options?.projectDetail && !options?.selectedModel && !options?.selectedPlan && !options?.settingsSubView && !options?.selectedOurServiceId) {
          const existingIndex = prev.findIndex((e) => e.tab === tab && !e.projectDetail && !e.settingsSubView && !e.selectedOurServiceId);
          if (existingIndex !== -1 && existingIndex > 0) {
            return [...prev.slice(0, existingIndex), nextEntry];
          }
        }

        return [...prev, nextEntry];
      });

      // Registra histórico no navegador para suporte ao botão voltar físico e gestual do Android
      try {
        window.history.pushState(
          {
            appTab: tab,
            settingsSubView: options?.settingsSubView,
            selectedOurServiceId: options?.selectedOurServiceId,
          },
          ''
        );
      } catch {}
    },
    []
  );

  // Lógica unificada do botão Voltar (visual e nativo Android)
  const handleGoBack = useCallback(() => {
    // 1. Se estiver no wizard de projeto e além da etapa 1, recua a etapa interna
    if (currentTab === 'project' && canStepBackInProjectRef.current && projectStepBackRef.current) {
      projectStepBackRef.current();
      return;
    }

    let targetScrollY: number | undefined;

    // 2. Desempilha o histórico de navegação
    setHistory((prev) => {
      if (prev.length > 1) {
        targetScrollY = prev[prev.length - 2]?.scrollY;
        return prev.slice(0, prev.length - 1);
      }
      // Se estiver em detalhes de serviço em entrada única, retorna para a lista de serviços:
      if (prev.length === 1 && prev[0].tab === 'our-services' && prev[0].selectedOurServiceId) {
        return [{ tab: 'our-services', projectDetail: null, selectedOurServiceId: undefined }];
      }
      // Se só houver 1 tela e não for home, vai para a home
      if (prev.length === 1 && prev[0].tab !== 'home') {
        return [{ tab: 'home', projectDetail: null }];
      }
      return prev;
    });

    // Se estiver saindo de detalhe de projeto com posição salva, restaura sem scroll jump
    if (targetScrollY !== undefined && targetScrollY > 0) {
      setTimeout(() => {
        window.scrollTo({ top: targetScrollY, behavior: 'instant' as ScrollBehavior });
      }, 15);
    }
  }, [currentTab]);

  // Ação de saída do Briefing (botão superior do cabeçalho / topo do formulário):
  // Desempilha para a tela de origem (Serviços se veio de Serviços, ou Home se veio de Home)
  const handleExitProject = useCallback(() => {
    setIsBriefingApproved(false);
    setHistory((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return [{ tab: 'home', projectDetail: null }];
    });
  }, []);

  // Ação específica do botão superior do cabeçalho:
  // No Briefing (currentTab === 'project'): desempilha para a tela de origem
  // Em Nossos Serviços com serviço aberto: retorna para a lista de serviços
  // Nas demais telas: executa o desempilhamento padrão (handleGoBack)
  const handleHeaderBack = useCallback(() => {
    if (currentTab === 'project') {
      handleExitProject();
      return;
    }
    if (currentTab === 'our-services' && selectedOurServiceId) {
      setHistory((prev) => {
        if (
          prev.length > 1 &&
          prev[prev.length - 2]?.tab === 'our-services' &&
          !prev[prev.length - 2]?.selectedOurServiceId
        ) {
          return prev.slice(0, prev.length - 1);
        }
        const withoutService = prev.filter(
          (e) => !(e.tab === 'our-services' && e.selectedOurServiceId)
        );
        return [
          ...withoutService,
          { tab: 'our-services', projectDetail: null, selectedOurServiceId: undefined },
        ];
      });
      return;
    }
    handleGoBack();
  }, [currentTab, handleExitProject, handleGoBack, selectedOurServiceId]);

  // Suporte aprimorado e intuitivo ao botão físico/gestual de voltar do Android
  const handleAndroidBack = useCallback(() => {
    // 1. Modais têm prioridade máxima de fechamento
    if (isDraftModalOpen) {
      handleDiscardDraft();
      return;
    }
    if (isContactOpen) {
      setIsContactOpen(false);
      return;
    }
    if (isOnboardingOpen) {
      setIsOnboardingOpen(false);
      return;
    }
    if (isRecommendationOpen) {
      setIsRecommendationOpen(false);
      return;
    }

    // 2. Se o Menu lateral/drawer estiver aberto: fecha o menu
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    // 3. Executa a exata mesma lógica do botão Voltar visual
    handleGoBack();
  }, [
    isDraftModalOpen,
    isContactOpen,
    isOnboardingOpen,
    isRecommendationOpen,
    isMenuOpen,
    handleGoBack,
  ]);

  useEffect(() => {
    const handleBackButtonEvent = () => {
      handleAndroidBack();
    };

    const handlePopStateEvent = (e: PopStateEvent) => {
      // 1. Se o menu lateral (Drawer) estiver aberto, fecha apenas o Drawer sem trocar de tela
      if (isMenuOpen) {
        setIsMenuOpen(false);
        return;
      }
      // 2. Modais têm prioridade de fechamento isolado
      if (isDraftModalOpen) {
        handleDiscardDraft();
        return;
      }
      if (isContactOpen) {
        setIsContactOpen(false);
        return;
      }
      if (isOnboardingOpen) {
        setIsOnboardingOpen(false);
        return;
      }
      if (isRecommendationOpen) {
        setIsRecommendationOpen(false);
        return;
      }
      // 3. Se o estado do popstate for da mesma aba e subtela atual, não desempilha a tela
      if (
        e?.state?.appTab &&
        e.state.appTab === currentTab &&
        e.state.settingsSubView === currentSettingsSubView &&
        e.state.selectedOurServiceId === selectedOurServiceId
      ) {
        return;
      }
      handleGoBack();
    };

    document.addEventListener('backbutton', handleBackButtonEvent);
    window.addEventListener('popstate', handlePopStateEvent);
    return () => {
      document.removeEventListener('backbutton', handleBackButtonEvent);
      window.removeEventListener('popstate', handlePopStateEvent);
    };
  }, [
    handleAndroidBack,
    handleGoBack,
    isDraftModalOpen,
    isContactOpen,
    isOnboardingOpen,
    isRecommendationOpen,
    isMenuOpen,
    currentTab,
    currentSettingsSubView,
    selectedOurServiceId,
  ]);

  // Handlers de Onboarding e Recomendação
  const handleOnboardingComplete = async (answers: OnboardingAnswers) => {
    await saveOnboardingAnswers(answers);
    await setOnboardingCompleted(true);

    const rec = calculateRecommendation(answers, language, t);
    setRecommendation(rec);

    setSavedPlan(rec.planId);
    if (rec.projectTitle) {
      setSavedModel(rec.projectTitle);
    }
    setSavedWebsiteLanguage(answers.websiteLanguage);

    setIsOnboardingOpen(false);
    setIsRecommendationOpen(true);
  };

  const handleStartProjectFromRecommendation = (rec: ProjectRecommendation) => {
    setIsRecommendationOpen(false);
    navigateTo('project', {
      selectedPlan: rec.planId,
      selectedModel: rec.projectTitle || undefined,
    });
  };

  const handleExplorePlanFromRecommendation = (planId: string) => {
    setIsRecommendationOpen(false);
    navigateTo('services', { selectedPlan: planId });
  };

  const handleNavigateToPortfolio = () => {
    setIsRecommendationOpen(false);
    navigateTo('portfolio');
  };

  const handleRedoOnboarding = () => {
    setIsRecommendationOpen(false);
    setIsOnboardingOpen(true);
  };

  // Handlers do Modal de Rascunho de Briefing
  const handleContinueDraft = () => {
    setIsDraftModalOpen(false);
    hasDraftBeenDecidedRef.current = true;
    setIsDraftPendingConfirmation(false);
    setShouldRestoreDraft(true);
    if (existingDraftInfo) {
      navigateTo('project', {
        selectedPlan: existingDraftInfo.draft.selectedPlan || existingDraftInfo.planId,
        selectedModel: existingDraftInfo.draft.selectedModel,
        modelApproach: existingDraftInfo.draft.modelApproach,
      });
    } else {
      navigateTo('project');
    }
  };

  const handleDiscardDraft = async () => {
    setIsDraftModalOpen(false);
    hasDraftBeenDecidedRef.current = true;
    setIsDraftPendingConfirmation(false);
    setShouldRestoreDraft(false);
    if (existingDraftInfo) {
      await clearBriefingDraft(existingDraftInfo.planId);
      if (
        existingDraftInfo.draft.selectedPlan &&
        existingDraftInfo.draft.selectedPlan !== existingDraftInfo.planId
      ) {
        await clearBriefingDraft(existingDraftInfo.draft.selectedPlan);
      }
    }
    await clearAllBriefingDrafts();
    setExistingDraftInfo(null);
    setDraftResetSignal((prev) => prev + 1);
  };

  // Handlers de navegação cruzada
  const handleSelectPlan = (planId: string) => {
    navigateTo('project', { selectedPlan: planId });
  };

  const handleSelectProjectForBriefing = (projectTitle: string) => {
    const allProjs = getPortfolioProjects(language);
    const proj = allProjs.find((p) => p.titulo === projectTitle);
    navigateTo('project', {
      selectedModel: projectTitle,
      selectedPlan: proj?.planoId || selectedPlanForProject,
    });
  };

  const handleSelectProject = (project: PortfolioProject) => {
    portfolioScrollPosRef.current = window.scrollY;
    navigateTo(currentTab, { projectDetail: project });
  };

  const handleNavigate = (tab: ViewTab) => {
    if (tab === currentTab) {
      // 1. Rola suavemente para o topo da tela atual
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 2. Se houver um detalhe aberto (ex: detalhe de projeto), reseta para a raiz da aba
      if (selectedProjectDetail) {
        setHistory((prev) => prev.filter((e) => !e.projectDetail));
      }
      return;
    }
    navigateTo(tab);
  };

  // Determina se a Bottom Navigation deve estar visível:
  // Somente nas 4 telas principais (Início, Serviços, Portfólio, Cliente), oculta em telas internas e fluxos
  const isMainTab =
    currentTab === 'home' ||
    currentTab === 'services' ||
    currentTab === 'portfolio' ||
    currentTab === 'portal';

  const isBottomNavVisible =
    !selectedProjectDetail &&
    !isKeyboardOpen &&
    isMainTab;

  // Exceção de flex-1 estritamente restrita à tela final de aprovação do Briefing e Configurações
  const isApprovalScreenActive = currentTab === 'project' && isBriefingApproved;
  const isSettingsActive = currentTab === 'settings';

  return (
    <div
      className={`${
        isApprovalScreenActive ? 'min-h-0' : 'min-h-screen'
      } flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        resolvedTheme === 'light'
          ? 'bg-slate-50 text-slate-900'
          : resolvedTheme === 'dark'
          ? 'bg-black text-white'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Intro splash suave e não intrusiva */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Header oficial Nexa (menu lateral + botão voltar posicionado no cabeçalho fixo quando aplicável) */}
      {currentTab !== 'settings' && (
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          showMenu={
            currentTab !== 'project' &&
            currentTab !== 'admin' &&
            currentTab !== 'portfolio' &&
            currentTab !== 'portal' &&
            currentTab !== 'services' &&
            currentTab !== 'our-services' &&
            !selectedProjectDetail
          }
          onBack={handleHeaderBack}
          showBackButton={Boolean(
            selectedProjectDetail ||
            currentTab === 'admin'
          )}
        />
      )}

      {/* Área de conteúdo principal com transição suave entre telas */}
      <main
        className={`${
          isApprovalScreenActive || isSettingsActive ? 'flex-none' : 'flex-1'
        } max-w-3xl w-full mx-auto px-4 pt-1 sm:pt-2 ${
          isSettingsActive
            ? 'pb-6 safe-area-pb'
            : isBottomNavVisible
            ? 'pb-16 sm:pb-16'
            : 'pb-3 sm:pb-4'
        }`}
      >
        <div
          key={
            selectedProjectDetail
              ? `detail-${selectedProjectDetail.id}`
              : currentTab === 'our-services' && selectedOurServiceId
              ? `our-service-${selectedOurServiceId}`
              : currentTab
          }
          className="animate-in fade-in slide-in-from-bottom-1 duration-150 ease-out will-change-transform"
        >
          {selectedProjectDetail ? (
            <ProjectDetailScreen
              project={selectedProjectDetail}
              onBack={handleGoBack}
              onStartBriefing={(proj) => {
                navigateTo('project', {
                  selectedPlan: proj.planoId || undefined,
                });
              }}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  onNavigate={handleNavigate}
                  recommendation={recommendation}
                  onOpenRecommendation={() => setIsRecommendationOpen(true)}
                  onSelectProject={handleSelectProject}
                  onSelectPlan={handleSelectPlan}
                  onOpenContact={() => setIsContactOpen(true)}
                  onStartQuiz={() => setIsOnboardingOpen(true)}
                />
              )}

              {currentTab === 'our-services' && (
                <OurServicesScreen
                  onBack={handleGoBack}
                  onNavigate={navigateTo}
                  onSelectProject={handleSelectProject}
                  onOpenContact={() => setIsContactOpen(true)}
                  selectedServiceId={selectedOurServiceId}
                  onSelectService={(serviceId) => {
                    if (serviceId) {
                      ourServicesScrollPosRef.current = window.scrollY;
                      navigateTo('our-services', { selectedOurServiceId: serviceId });
                    } else {
                      handleGoBack();
                    }
                  }}
                />
              )}

              {currentTab === 'services' && (
                <ServicesScreen
                  onSelectPlan={handleSelectPlan}
                  onContinueToBriefing={(planId) => {
                    navigateTo('project', { selectedPlan: planId });
                  }}
                  onNavigate={handleNavigate}
                  onBack={handleGoBack}
                  onSelectProject={handleSelectProject}
                  onSelectProjectForBriefing={handleSelectProjectForBriefing}
                />
              )}

              {currentTab === 'portfolio' && (
                <PortfolioScreen
                  onSelectProject={handleSelectProject}
                  onSelectProjectForBriefing={handleSelectProjectForBriefing}
                  initialPlanFilter={portfolioPlanFilter}
                  onPlanFilterChange={setPortfolioPlanFilter}
                  initialSegmentFilter={portfolioSegmentFilter}
                  onSegmentFilterChange={setPortfolioSegmentFilter}
                  initialSearchQuery={portfolioSearchQuery}
                  onSearchQueryChange={setPortfolioSearchQuery}
                />
              )}

              {currentTab === 'project' && (
                <ProjectScreen
                  initialPlan={selectedPlanForProject}
                  initialModel={selectedModelForProject}
                  initialModelApproach={selectedModelApproachForProject}
                  initialWebsiteLanguage={selectedWebsiteLanguageForProject}
                  onNavigate={handleNavigate}
                  onBack={handleExitProject}
                  onStepChange={(step, canGoBackStep, goBackStep) => {
                    projectStepRef.current = step;
                    canStepBackInProjectRef.current = canGoBackStep;
                    projectStepBackRef.current = goBackStep;
                  }}
                  onApprovalStateChange={setIsBriefingApproved}
                  shouldRestoreDraft={shouldRestoreDraft}
                  onDraftRestored={() => setShouldRestoreDraft(false)}
                  isDraftPendingConfirmation={isDraftPendingConfirmation}
                  confirmedDraft={existingDraftInfo?.draft}
                  resetSignal={draftResetSignal}
                />
              )}

              {currentTab === 'portal' && (
                <PortalScreen onNavigate={handleNavigate} />
              )}

              {currentTab === 'admin' && <AdminScreen onBack={handleGoBack} />}

              {currentTab === 'settings' && (
                <SettingsScreen
                  activeSubView={currentSettingsSubView}
                  onNavigateSubView={(subView) =>
                    navigateTo('settings', { settingsSubView: subView })
                  }
                  onBack={handleGoBack}
                  onOpenContact={() => setIsContactOpen(true)}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Navegação inferior estritamente nos 4 destinos principais */}
      {isBottomNavVisible && (
        <BottomNav
          currentTab={currentTab}
          onNavigate={handleNavigate}
        />
      )}

      {/* Menu Drawer lateral/sheet ancorado estritamente na esquerda com gesto de borda */}
      <AppDrawer
        isOpen={isMenuOpen}
        onOpen={() => setIsMenuOpen(true)}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Modal Falar com a NexaWeb */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Modal de Onboarding */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Modal de Recomendação Personalizada */}
      <RecommendationModal
        isOpen={isRecommendationOpen}
        recommendation={recommendation}
        onClose={() => setIsRecommendationOpen(false)}
        onStartProject={handleStartProjectFromRecommendation}
        onExplorePlan={handleExplorePlanFromRecommendation}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onRedo={handleRedoOnboarding}
      />

      {/* Modal de Confirmação de Rascunho de Briefing em Andamento */}
      <BriefingDraftModal
        isOpen={isDraftModalOpen}
        onContinue={handleContinueDraft}
        onDiscard={handleDiscardDraft}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
