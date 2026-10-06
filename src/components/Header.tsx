import React from 'react';
import { ViewTab } from '../types';
import { ArrowLeft, Sparkles, Menu } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  onOpenMenu: () => void;
  title?: string;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenMenu,
  title,
  onBack,
  canGoBack,
}) => {
  const { t } = useTranslation();

  const getScreenTitle = (): string => {
    if (title) return title;
    switch (currentTab) {
      case 'services':
        return 'Serviços & Planos';
      case 'portfolio':
        return 'Demonstrações';
      case 'project':
        return 'Briefing Oficial';
      case 'portal':
        return 'Área do Cliente';
      case 'admin':
        return 'Painel da Equipe';
      case 'settings':
        return 'Configurações';
      default:
        return 'NexaWeb';
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('home');
    }
  };

  const isHome = currentTab === 'home' && !title && !canGoBack;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2.5 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Marca (Home) ou [← Voltar] + Título da Tela */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {!isHome ? (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[44px] min-w-[44px] px-2.5 py-2 -ml-1 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 active:scale-95"
              title="Voltar"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
              <span className="hidden xs:inline">Voltar</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
              {isHome ? 'NexaWeb' : getScreenTitle()}
            </h1>
            {isHome && (
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 truncate">
                Criação de Sites Profissionais
              </p>
            )}
          </div>
        </div>

        {/* Lado Direito: Apenas Menu Hamburger Limpo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80 transition-all active:scale-95 shadow-sm"
            aria-label="Abrir Menu Lateral"
            title="Menu"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
