import React, { useRef } from 'react';
import { ViewTab } from '../types';
import { Home, Layers, Briefcase, UserCheck } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
}

const TABS: ViewTab[] = ['home', 'services', 'portfolio', 'portal'];

export const BottomNav: React.FC<BottomNavProps> = React.memo(({
  currentTab,
  onNavigate,
}) => {
  const { t } = useTranslation();

  // Refs para gesto horizontal seguro restrito à barra inferior
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  // Gesto horizontal seguro restrito à superfície da barra inferior
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length !== 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current);
    const duration = Date.now() - touchStartTimeRef.current;

    // Apenas aciona se o movimento horizontal for claro, rápido (<450ms) e seguro
    if (duration < 450 && Math.abs(deltaX) > 48 && Math.abs(deltaX) > deltaY * 1.6) {
      const currentIndex = TABS.indexOf(currentTab);
      if (currentIndex !== -1) {
        if (deltaX < 0 && currentIndex < TABS.length - 1) {
          // Deslize para esquerda -> próxima aba
          onNavigate(TABS[currentIndex + 1]);
        } else if (deltaX > 0 && currentIndex > 0) {
          // Deslize para direita -> aba anterior
          onNavigate(TABS[currentIndex - 1]);
        }
      }
    }
  };

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
      tab: 'portal',
      label: t.nav.client,
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-sm border-t border-slate-800/80 px-2 py-1.5 safe-area-pb shadow-lg"
      aria-label="Navegação inferior"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`min-h-[48px] relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-100 ease-out active:scale-[0.92] ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                {item.icon}
              </div>
              <span className={`text-[10.5px] mt-1 truncate max-w-full leading-none transition-colors duration-100 ${isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400'}`}>
                {item.label}
              </span>
              <div className="h-2 flex items-center justify-center">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400 animate-in zoom-in-75 duration-100" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
