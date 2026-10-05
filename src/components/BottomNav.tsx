import React from 'react';
import { ViewTab } from '../types';
import { Home, Layers, Briefcase, Sparkles, Settings } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
}) => {
  const { t } = useTranslation();

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'home',
      label: t.nav.home,
      icon: <Home className="w-5 h-5" />,
    },
    {
      tab: 'services',
      label: t.nav.services,
      icon: <Layers className="w-5 h-5" />,
    },
    {
      tab: 'portfolio',
      label: t.nav.portfolio,
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      tab: 'project',
      label: t.nav.project,
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      tab: 'settings',
      label: t.nav.settings,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-1 py-1.5 safe-area-pb transition-colors duration-200">
      <div className="max-w-lg mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`min-h-[48px] relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-[0.92] ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                {item.icon}
              </div>
              <span className={`text-[10px] mt-1 truncate max-w-full leading-none ${isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shadow-sm shadow-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
