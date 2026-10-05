import React from 'react';
import { ViewTab } from '../types';
import { Home, Search, Users, Briefcase } from 'lucide-react';

interface BottomNavProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  leadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  leadCount,
}) => {
  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'home',
      label: 'Início',
      icon: <Home className="w-5 h-5" />,
    },
    {
      tab: 'find',
      label: 'Encontrar',
      icon: <Search className="w-5 h-5" />,
    },
    {
      tab: 'leads',
      label: 'Meus Leads',
      icon: <Users className="w-5 h-5" />,
      badge: leadCount > 0 ? leadCount : undefined,
    },
    {
      tab: 'portfolio',
      label: 'Portfólio',
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border border-slate-900">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
