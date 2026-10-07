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
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/60 px-2 py-1 safe-area-pb shadow-lg"
      aria-label="Navegação inferior"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onNavigate(item.tab)}
              className="min-h-[46px] max-h-[50px] w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 ease-out active:scale-[0.93] cursor-pointer group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Contêiner do ícone com indicador de estado ativo sutil e elegante */}
              <div
                className={`px-3 py-1 rounded-full flex items-center justify-center transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 dark:text-cyan-300 border border-indigo-500/25 nav-pill-active'
                    : 'text-slate-400 hover:text-slate-200 dark:text-slate-400 group-hover:text-slate-300'
                }`}
              >
                <div className="w-[19px] h-[19px] flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              {/* Rótulo pequeno, alinhado e perfeitamente legível */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full leading-none transition-colors duration-150 ${
                  isActive
                    ? 'text-indigo-400 dark:text-cyan-300 font-semibold nav-label-active'
                    : 'text-slate-400 dark:text-slate-400 font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
