import React, { useState, useEffect, useCallback } from 'react';
import {
  ViewTab,
  OnboardingAnswers,
  ProjectRecommendation,
  WebsiteLanguage,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { ProjectScreen } from './components/ProjectScreen';
import { SettingsScreen } from './components/SettingsScreen';
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

  // Estados dos Modais
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
          // Primeira abertura: exibe experiência inicial com escolha de idioma após a intro
          setIsOnboardingOpen(true);
        } else {
          // Já completou antes: recupera respostas para montar a recomendação ativa
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

  // Suporte aprimorado ao botão físico/gestual de voltar do Android
  const handleAndroidBack = useCallback(() => {
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
    if (currentTab !== 'home') {
      setCurrentTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTab, isOnboardingOpen, isRecommendationOpen, isLanguageModalOpen]);

  useEffect(() => {
    const handleBackButtonEvent = () => {
      if (!window.history.state?.modalOpen && !window.history.state?.onboardingOpen && !window.history.state?.recommendationOpen) {
        handleAndroidBack();
      }
    };

    document.addEventListener('backbutton', handleBackButtonEvent);
    return () => {
      document.removeEventListener('backbutton', handleBackButtonEvent);
    };
  }, [handleAndroidBack]);

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

      {/* Header oficial da NexaWeb com seletor discreto de idioma e botão personalizar */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Área de conteúdo principal */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            recommendation={recommendation}
            onOpenRecommendation={() => setIsRecommendationOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesScreen
            onSelectPlan={handleSelectPlan}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioScreen
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

        {currentTab === 'settings' && (
          <SettingsScreen
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          />
        )}
      </main>

      {/* Navegação inferior (Início, Serviços, Portfólio, Projeto, Configurações) */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* Modal de Onboarding com seleção de idioma inicial, 5 perguntas e revisão */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Modal de Recomendação Personalizada com justificativas, alternativa e demos relacionadas */}
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
