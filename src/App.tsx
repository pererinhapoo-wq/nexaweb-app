import React, { useState, useEffect, useCallback } from 'react';
import { ViewTab } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { ProjectScreen } from './components/ProjectScreen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedPlanForProject, setSelectedPlanForProject] = useState<string>('profissional');
  const [selectedModelForProject, setSelectedModelForProject] = useState<string | undefined>(undefined);

  // Inicialização nativa segura (Status Bar e Splash Screen do Android)
  useEffect(() => {
    async function initNativePlatform() {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#020617' });
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
  }, []);

  // Suporte aprimorado ao botão físico/gestual de voltar do Android
  const handleAndroidBack = useCallback(() => {
    // Se a aba atual não for 'home', volta suavemente para 'home'
    if (currentTab !== 'home') {
      setCurrentTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTab]);

  useEffect(() => {
    const handleBackButtonEvent = () => {
      // Se não há modal ativo na história do browser, navega internamente
      if (!window.history.state?.modalOpen) {
        handleAndroidBack();
      }
    };

    document.addEventListener('backbutton', handleBackButtonEvent);
    return () => {
      document.removeEventListener('backbutton', handleBackButtonEvent);
    };
  }, [handleAndroidBack]);

  // Handlers de navegação cruzada inteligente
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header oficial da NexaWeb com seletor de idioma PT/EN */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* Área de conteúdo principal */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6">
        {currentTab === 'home' && (
          <HomeScreen onNavigate={handleNavigate} />
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
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Navegação inferior (Início, Serviços, Portfólio, Projeto) */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
