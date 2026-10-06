import React, { useState, useEffect, useCallback } from 'react';
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

  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedPlanForProject, setSelectedPlanForProject] = useState<string>('profissional');
  const [selectedModelForProject, setSelectedModelForProject] = useState<string | undefined>(undefined);
  const [selectedWebsiteLanguageForProject, setSelectedWebsiteLanguageForProject] = useState<WebsiteLanguage | undefined>(undefined);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<PortfolioProject | null>(null);

  // Estados dos Modais & Drawer
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

  // Inicialização nativa segura (Status Bar e Splash Screen do Android)
  useEffect(() => {
    async function initNativePlatform() {
      try {
        await StatusBar.setStyle({ style: resolvedTheme === 'dark' ? Style.Dark : Style.Light });
        await StatusBar.setBackgroundColor({ color: resolvedTheme === 'dark' ? '#020617' : '#f8fafc' });
      } catch {
        // Ignorado em ambiente web
      }

      try {
        await SplashScreen.hide();
      } catch {
        // Ignorado em ambiente web
      }
    }

    initNativePlatform();
  }, [resolvedTheme]);

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
            setSelectedWebsiteLanguageForProject(savedAnswers.websiteLanguage);
          }
        }
      } catch {
        // Fallback gracioso
      }
    }

    checkFirstOpenAndLoadRecommendation();
  }, [language, t]);

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

    // 2. Se estiver vendo detalhes de um projeto, volta para a lista
    if (selectedProjectDetail) {
      setSelectedProjectDetail(null);
      return;
    }

    // 3. Se o Menu lateral/drawer estiver aberto: fecha o menu
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    // 4. Se estiver em tela interna (Portal, Admin, Configurações, etc.): volta para Início
    if (currentTab !== 'home') {
      setCurrentTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [
    selectedProjectDetail,
    currentTab,
    isMenuOpen,
    isContactOpen,
    isOnboardingOpen,
    isRecommendationOpen,
    isLanguageModalOpen,
  ]);

  useEffect(() => {
    const handleBackButtonEvent = () => {
      handleAndroidBack();
    };

    document.addEventListener('backbutton', handleBackButtonEvent);
    return () => {
      document.removeEventListener('backbutton', handleBackButtonEvent);
    };
  }, [handleAndroidBack]);

  // Gesto nativo de swipe da esquerda para a direita para abrir o menu lateral
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Inicia nos primeiros 50px da borda esquerda e desliza mais de 45px para a direita horizontalmente
      if (startX <= 50 && deltaX > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Handlers de Onboarding e Recomendação
  const handleOnboardingComplete = async (answers: OnboardingAnswers) => {
    await saveOnboardingAnswers(answers);
    await setOnboardingCompleted(true);

    const rec = calculateRecommendation(answers, language, t);
    setRecommendation(rec);

    setSelectedPlanForProject(rec.planId);
    if (rec.projectTitle) {
      setSelectedModelForProject(rec.projectTitle);
    }
    setSelectedWebsiteLanguageForProject(answers.websiteLanguage);

    setIsOnboardingOpen(false);
    setIsRecommendationOpen(true);
  };

  const handleStartProjectFromRecommendation = (rec: ProjectRecommendation) => {
    setSelectedPlanForProject(rec.planId);
    if (rec.projectTitle) {
      setSelectedModelForProject(rec.projectTitle);
    }
    setIsRecommendationOpen(false);
    setCurrentTab('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePlanFromRecommendation = (planId: string) => {
    setSelectedPlanForProject(planId);
    setIsRecommendationOpen(false);
    setCurrentTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPortfolio = () => {
    setIsRecommendationOpen(false);
    setCurrentTab('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRedoOnboarding = () => {
    setIsRecommendationOpen(false);
    setIsOnboardingOpen(true);
  };

  // Handlers de navegação cruzada
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanForProject(planId);
    setCurrentTab('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProjectForBriefing = (projectTitle: string) => {
    setSelectedModelForProject(projectTitle);
    setCurrentTab('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: ViewTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        resolvedTheme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Intro splash suave e não intrusiva */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Header oficial da NexaWeb */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setSelectedProjectDetail(null);
          handleNavigate(tab);
        }}
        onOpenMenu={() => setIsMenuOpen(true)}
        title={selectedProjectDetail ? selectedProjectDetail.titulo : undefined}
        onBack={selectedProjectDetail ? () => setSelectedProjectDetail(null) : undefined}
      />

      {/* Área de conteúdo principal com transição suave entre telas */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6">
        <div
          key={selectedProjectDetail ? `detail-${selectedProjectDetail.id}` : currentTab}
          className="animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {selectedProjectDetail ? (
            <ProjectDetailScreen
              project={selectedProjectDetail}
              onBack={() => setSelectedProjectDetail(null)}
              onStartBriefing={(proj) => {
                setSelectedProjectDetail(null);
                setSelectedModelForProject(proj.titulo);
                if (proj.planoId) {
                  setSelectedPlanForProject(proj.planoId);
                }
                setCurrentTab('project');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  onNavigate={handleNavigate}
                  recommendation={recommendation}
                  onOpenRecommendation={() => setIsRecommendationOpen(true)}
                  onSelectProject={(project) => setSelectedProjectDetail(project)}
                  onSelectPlan={handleSelectPlan}
                  onOpenContact={() => setIsContactOpen(true)}
                />
              )}

              {currentTab === 'services' && (
                <ServicesScreen
                  onSelectPlan={handleSelectPlan}
                  onNavigate={handleNavigate}
                  onSelectProjectForBriefing={handleSelectProjectForBriefing}
                />
              )}

              {currentTab === 'portfolio' && (
                <PortfolioScreen
                  onSelectProject={(project) => setSelectedProjectDetail(project)}
                  onSelectProjectForBriefing={handleSelectProjectForBriefing}
                />
              )}

              {currentTab === 'project' && (
                <ProjectScreen
                  initialPlan={selectedPlanForProject}
                  initialModel={selectedModelForProject}
                  initialWebsiteLanguage={selectedWebsiteLanguageForProject}
                  onNavigate={handleNavigate}
                />
              )}

              {currentTab === 'portal' && <PortalScreen />}

              {currentTab === 'admin' && <AdminScreen />}

              {currentTab === 'settings' && (
                <SettingsScreen
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Navegação inferior estritamente simples (Início, Serviços, Portfólio, Projeto) */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          setSelectedProjectDetail(null);
          handleNavigate(tab);
        }}
      />

      {/* Menu Drawer lateral/sheet com todas as áreas */}
      <AppDrawer
        isOpen={isMenuOpen}
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
