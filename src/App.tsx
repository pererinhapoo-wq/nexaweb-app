import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ViewTab,
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
import { AppDrawer } from './components/AppDrawer';
import { ContactModal } from './components/ContactModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RecommendationModal } from './components/RecommendationModal';
import { LanguageModal } from './components/LanguageModal';
import { IntroSplash } from './components/IntroSplash';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import {
  isOnboardingCompleted,
  setOnboardingCompleted,
  getSavedOnboardingAnswers,
  saveOnboardingAnswers,
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

  // Refs para coordenação com etapas internas do wizard de briefing (ProjectScreen)
  const projectStepRef = useRef<number>(1);
  const projectStepBackRef = useRef<(() => void) | null>(null);
  const canStepBackInProjectRef = useRef<boolean>(false);

  // Estados dos Modais & Drawer
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

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

  // Verificação de primeira abertura e carregamento de respostas salvas
  useEffect(() => {
    async function checkFirstOpenAndLoadRecommendation() {
      try {
        const completed = await isOnboardingCompleted();
        if (!completed) {
          setIsOnboardingOpen(true);
        } else {
          const savedAnswers = await getSavedOnboardingAnswers();
          if (savedAnswers) {
            const rec = calculateRecommendation(savedAnswers, language, t);
            setRecommendation(rec);
            setSavedWebsiteLanguage(savedAnswers.websiteLanguage);
          }
        }
      } catch {
        // Fallback gracioso
      }
    }

    checkFirstOpenAndLoadRecommendation();
  }, [language, t]);

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
      }
    ) => {
      // Se saindo do criador de projetos, reseta refs de wizard
      if (tab !== 'project') {
        projectStepRef.current = 1;
        projectStepBackRef.current = null;
        canStepBackInProjectRef.current = false;
      }

      if (options?.selectedPlan !== undefined) {
        setSavedPlan(options.selectedPlan);
      } else if (tab === 'project') {
        setSavedPlan(undefined);
      }
      if (options?.modelApproach) setSavedModelApproach(options.modelApproach);
      if (options?.selectedWebsiteLanguage) setSavedWebsiteLanguage(options.selectedWebsiteLanguage);

      setHistory((prev) => {
        // Ao navegar para a home sem detalhe ou resetando raiz (ex.: toque no BottomNav Início):
        if (
          tab === 'home' &&
          (options?.resetToRoot || (!options?.projectDetail && !options?.selectedPlan && !options?.selectedModel))
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
          selectedPlan: options?.selectedPlan !== undefined ? options.selectedPlan : current?.selectedPlan,
          selectedModel: options?.selectedModel !== undefined ? options.selectedModel : undefined,
          modelApproach:
            options?.modelApproach !== undefined ? options.modelApproach : current?.modelApproach,
          selectedWebsiteLanguage:
            options?.selectedWebsiteLanguage !== undefined
              ? options.selectedWebsiteLanguage
              : current?.selectedWebsiteLanguage,
        };

        // Não empilha duplicata se o destino for estritamente idêntico ao topo atual
        if (
          current &&
          current.tab === nextEntry.tab &&
          current.projectDetail?.id === nextEntry.projectDetail?.id &&
          current.selectedPlan === nextEntry.selectedPlan &&
          current.selectedModel === nextEntry.selectedModel &&
          current.modelApproach === nextEntry.modelApproach
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
            prevEntry.modelApproach === nextEntry.modelApproach
          ) {
            return prev.slice(0, prev.length - 1);
          }
        }

        // Se for troca direta de aba de menu principal (sem contexto/plano/modelo específico)
        // e a aba já existe na pilha, trunca até ela para evitar ciclos infinitos entre abas
        if (!options?.projectDetail && !options?.selectedModel && !options?.selectedPlan) {
          const existingIndex = prev.findIndex((e) => e.tab === tab && !e.projectDetail);
          if (existingIndex !== -1 && existingIndex > 0) {
            return [...prev.slice(0, existingIndex), nextEntry];
          }
        }

        return [...prev, nextEntry];
      });

      // Registra histórico no navegador para suporte ao botão voltar físico e gestual do Android
      try {
        window.history.pushState({ appTab: tab }, '');
      } catch {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Suporte aprimorado e intuitivo ao botão físico/gestual de voltar do Android
  const handleAndroidBack = useCallback(() => {
    // 1. Modais têm prioridade máxima de fechamento
    if (isContactOpen) {
      setIsContactOpen(false);
      return;
    }
    if (isLanguageModalOpen) {
      setIsLanguageModalOpen(false);
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
    isContactOpen,
    isLanguageModalOpen,
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
      if (isContactOpen) {
        setIsContactOpen(false);
        return;
      }
      if (isLanguageModalOpen) {
        setIsLanguageModalOpen(false);
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
      // 3. Se o estado do popstate for da mesma aba atual, não desempilha a tela
      if (e?.state?.appTab && e.state.appTab === currentTab) {
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
    isContactOpen,
    isLanguageModalOpen,
    isOnboardingOpen,
    isRecommendationOpen,
    isMenuOpen,
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

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        resolvedTheme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Intro splash suave e não intrusiva */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Header oficial Nexa */}
      <Header onOpenMenu={() => setIsMenuOpen(true)} />

      {/* Área de conteúdo principal com transição suave entre telas */}
      <main
        className={`flex-1 max-w-3xl w-full mx-auto px-4 pt-4 sm:pt-6 ${
          isBottomNavVisible ? 'pb-20 sm:pb-24' : 'pb-6 sm:pb-8'
        }`}
      >
        <div
          key={selectedProjectDetail ? `detail-${selectedProjectDetail.id}` : currentTab}
          className="animate-in fade-in slide-in-from-bottom-1 duration-150 ease-out will-change-transform"
        >
          {selectedProjectDetail ? (
            <ProjectDetailScreen
              project={selectedProjectDetail}
              onBack={handleGoBack}
              onStartBriefing={(proj, approach) => {
                navigateTo('project', {
                  selectedModel: proj.titulo,
                  selectedPlan: proj.planoId || undefined,
                  modelApproach: approach,
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

              {currentTab === 'services' && (
                <ServicesScreen
                  selectedPlan={currentEntry.selectedPlan}
                  onSelectPlan={(planId) => {
                    setSavedPlan(planId);
                  }}
                  onContinueToBriefing={(planId) => {
                    setSavedPlan(planId);
                    navigateTo('project', { selectedPlan: planId });
                  }}
                  onNavigate={handleNavigate}
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
                  onBack={handleGoBack}
                  onStepChange={(step, canGoBackStep, goBackStep) => {
                    projectStepRef.current = step;
                    canStepBackInProjectRef.current = canGoBackStep;
                    projectStepBackRef.current = goBackStep;
                  }}
                />
              )}

              {currentTab === 'portal' && (
                <PortalScreen onNavigate={handleNavigate} />
              )}

              {currentTab === 'admin' && <AdminScreen onBack={handleGoBack} />}

              {currentTab === 'settings' && (
                <SettingsScreen
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                  onBack={handleGoBack}
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

      {/* Modal de Idioma compartilhado */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
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
