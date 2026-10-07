import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ViewTab } from '../types';
import {
  Home,
  Sparkles,
  Briefcase,
  Layers,
  Users,
  UserCheck,
  MessageSquare,
  HelpCircle,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  onOpenContact: () => void;
}

const DRAWER_WIDTH = 280; // largura confortável de referência do drawer em px

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  currentTab,
  onNavigate,
  onOpenContact,
}) => {
  const { t, language } = useTranslation();

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Guarda posição de scroll para garantir que a tela nunca pule para o topo ao fechar o menu
  const scrollPosRef = useRef<number>(0);

  // Estado interno para visibilidade no DOM durante animações
  const [isRendered, setIsRendered] = useState<boolean>(isOpen);

  // Refs de rastreamento de toque em tempo real (0ms lag, 60-120fps suave no Galaxy A20)
  const isDraggingRef = useRef<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(-DRAWER_WIDTH);
  const isHorizontalGestureRef = useRef<boolean | null>(null);

  // Preserva scroll e controla renderização sem causar salto de layout ou scroll
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      setIsRendered(true);
    } else {
      timer = setTimeout(() => {
        if (!isOpen && !isDraggingRef.current) {
          setIsRendered(false);
        }
      }, 250);
      // Restaura de forma instantânea a posição de rolagem caso o navegador tenha alterado
      if (scrollPosRef.current > 0) {
        window.scrollTo({ top: scrollPosRef.current, behavior: 'instant' as ScrollBehavior });
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // Suporte a tecla Escape sem poluir o histórico do navegador nem disparar popstate fantasma
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sincroniza posição visual com a prop isOpen quando não estiver arrastando
  useEffect(() => {
    if (isDraggingRef.current) return;

    if (isOpen) {
      if (drawerRef.current) {
        drawerRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        drawerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = 'opacity 0.22s ease-out';
        backdropRef.current.style.opacity = '1';
        backdropRef.current.style.pointerEvents = 'auto';
      }
      currentTranslateRef.current = 0;
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        drawerRef.current.style.transform = 'translate3d(-100%, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = 'opacity 0.22s ease-out';
        backdropRef.current.style.opacity = '0';
        backdropRef.current.style.pointerEvents = 'none';
      }
      currentTranslateRef.current = -DRAWER_WIDTH;
    }
  }, [isOpen]);

  // Handler de navegação ao clicar em um item
  const handleSelectTab = useCallback(
    (tab: ViewTab) => {
      onClose();
      // Não aciona navegação se já estiver na mesma aba para não disparar scroll(0) ou reload
      if (tab !== currentTab) {
        onNavigate(tab);
      }
    },
    [currentTab, onClose, onNavigate]
  );

  // =========================================================================
  // GESTO DE ABRIR (Arrasto da borda esquerda para a direita)
  // =========================================================================
  const handleEdgeTouchStart = (e: React.TouchEvent) => {
    if (isOpen || e.touches.length !== 1) return;

    setIsRendered(true);
    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isHorizontalGestureRef.current = null;

    if (drawerRef.current) {
      drawerRef.current.style.transition = 'none';
      drawerRef.current.style.transform = `translate3d(-${DRAWER_WIDTH}px, 0, 0)`;
    }
    if (backdropRef.current) {
      backdropRef.current.style.transition = 'none';
      backdropRef.current.style.opacity = '0';
      backdropRef.current.style.pointerEvents = 'auto';
    }
  };

  const handleEdgeTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Detecta intenção do gesto (horizontal vs vertical)
    if (isHorizontalGestureRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalGestureRef.current = deltaX > 0 && deltaX > Math.abs(deltaY) * 0.8;
        if (!isHorizontalGestureRef.current) {
          isDraggingRef.current = false;
          return;
        }
      } else {
        return;
      }
    }

    if (!isHorizontalGestureRef.current) return;

    // Acompanha diretamente o dedo em tempo real
    const clampedDeltaX = Math.max(0, Math.min(deltaX, DRAWER_WIDTH));
    const translate = -DRAWER_WIDTH + clampedDeltaX;
    currentTranslateRef.current = translate;

    const progress = clampedDeltaX / DRAWER_WIDTH;

    if (drawerRef.current) {
      drawerRef.current.style.transform = `translate3d(${translate}px, 0, 0)`;
    }
    if (backdropRef.current) {
      backdropRef.current.style.opacity = `${progress}`;
    }
  };

  const handleEdgeTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = deltaX / Math.max(elapsed, 1);

    // Reativa transição fluida para ancorar
    if (drawerRef.current) {
      drawerRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (backdropRef.current) {
      backdropRef.current.style.transition = 'opacity 0.22s ease-out';
    }

    // Abre se arrastou mais de 35% da largura ou deu um flick rápido para a direita
    const shouldOpen = deltaX > DRAWER_WIDTH * 0.35 || (velocity > 0.35 && deltaX > 35);

    if (shouldOpen) {
      if (drawerRef.current) {
        drawerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '1';
        backdropRef.current.style.pointerEvents = 'auto';
      }
      currentTranslateRef.current = 0;
      onOpen?.();
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transform = 'translate3d(-100%, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '0';
        backdropRef.current.style.pointerEvents = 'none';
      }
      currentTranslateRef.current = -DRAWER_WIDTH;
      setIsRendered(false);
      onClose();
    }
  };

  // =========================================================================
  // GESTO DE FECHAR (Arrasto de volta para a esquerda quando aberto)
  // =========================================================================
  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || e.touches.length !== 1) return;

    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isHorizontalGestureRef.current = null;

    if (drawerRef.current) {
      drawerRef.current.style.transition = 'none';
    }
    if (backdropRef.current) {
      backdropRef.current.style.transition = 'none';
    }
  };

  const handleDrawerTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    if (isHorizontalGestureRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalGestureRef.current = deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) * 0.8;
        if (!isHorizontalGestureRef.current) {
          isDraggingRef.current = false;
          return;
        }
      } else {
        return;
      }
    }

    if (!isHorizontalGestureRef.current) return;

    // Move acompanhando o dedo para a esquerda
    const clampedDeltaX = Math.min(0, Math.max(deltaX, -DRAWER_WIDTH));
    currentTranslateRef.current = clampedDeltaX;

    const progress = Math.max(0, 1 + clampedDeltaX / DRAWER_WIDTH);

    if (drawerRef.current) {
      drawerRef.current.style.transform = `translate3d(${clampedDeltaX}px, 0, 0)`;
    }
    if (backdropRef.current) {
      backdropRef.current.style.opacity = `${progress}`;
    }
  };

  const handleDrawerTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = deltaX / Math.max(elapsed, 1);

    if (drawerRef.current) {
      drawerRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (backdropRef.current) {
      backdropRef.current.style.transition = 'opacity 0.22s ease-out';
    }

    // Fecha se arrastou mais de 25% para a esquerda ou deu flick rápido
    const shouldClose = deltaX < -DRAWER_WIDTH * 0.25 || (velocity < -0.35 && deltaX < -25);

    if (shouldClose) {
      if (drawerRef.current) {
        drawerRef.current.style.transform = 'translate3d(-100%, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '0';
        backdropRef.current.style.pointerEvents = 'none';
      }
      currentTranslateRef.current = -DRAWER_WIDTH;
      onClose();
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = '1';
        backdropRef.current.style.pointerEvents = 'auto';
      }
      currentTranslateRef.current = 0;
    }
  };

  // =========================================================================
  // ITENS OFICIAIS EXATOS DA PARTE 3 (Sem inventar itens novos)
  // =========================================================================
  const navigationItems = [
    {
      id: 'home',
      label: t.nav.home,
      icon: Home,
      action: () => handleSelectTab('home'),
      isActive: currentTab === 'home',
    },
    {
      id: 'project',
      label: language === 'en' ? 'Create website' : language === 'es' ? 'Crear sitio' : language === 'fr' ? 'Créer un site' : 'Criar site',
      icon: Sparkles,
      action: () => handleSelectTab('project'),
      isActive: currentTab === 'project',
    },
    {
      id: 'portfolio',
      label: t.nav.portfolio,
      icon: Briefcase,
      action: () => handleSelectTab('portfolio'),
      isActive: currentTab === 'portfolio',
    },
    {
      id: 'services',
      label: t.nav.services,
      icon: Layers,
      action: () => handleSelectTab('services'),
      isActive: currentTab === 'services',
    },
    {
      id: 'portal',
      label: t.nav.client,
      icon: UserCheck,
      action: () => handleSelectTab('portal'),
      isActive: currentTab === 'portal',
    },
    {
      id: 'leads',
      label: language === 'en' ? 'My leads' : language === 'es' ? 'Mis leads' : language === 'fr' ? 'Mes pistes' : 'Meus leads',
      icon: Users,
      action: () => handleSelectTab('admin'),
      isActive: currentTab === 'admin',
    },
    {
      id: 'feedback',
      label: language === 'en' ? 'Feedback' : 'Feedback',
      icon: MessageSquare,
      action: () => {
        onClose();
        onOpenContact();
      },
      isActive: false,
    },
    {
      id: 'help',
      label: language === 'en' ? 'Help' : language === 'es' ? 'Ayuda' : language === 'fr' ? 'Aide' : 'Ajuda',
      icon: HelpCircle,
      action: () => {
        onClose();
        onOpenContact();
      },
      isActive: false,
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      action: () => handleSelectTab('settings'),
      isActive: currentTab === 'settings',
    },
  ];

  return (
    <>
      {/* 1. Zona de captura na borda esquerda abaixo do header (não sobrepõe o botão do menu ☰ nem interfere no header) */}
      {!isOpen && (
        <div
          onTouchStart={handleEdgeTouchStart}
          onTouchMove={handleEdgeTouchMove}
          onTouchEnd={handleEdgeTouchEnd}
          className="fixed top-16 left-0 bottom-0 w-6 z-30 touch-pan-y"
          style={{ width: '26px' }}
          aria-hidden="true"
        />
      )}

      {/* 2. Container do Drawer e Backdrop (com overflow-hidden sem permitir scroll horizontal) */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity ${
          isOpen || isDraggingRef.current
            ? 'visible'
            : isRendered
            ? 'visible pointer-events-none'
            : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop discreto sem blur pesado com transparência garantida em qualquer tema */}
        <div
          ref={backdropRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute inset-0 drawer-scrim"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.62)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            willChange: 'opacity',
          }}
          aria-hidden="true"
        />

        {/* 3. Painel do Menu Lateral Ancorado Estritamente na Esquerda */}
        <div
          ref={drawerRef}
          onTouchStart={handleDrawerTouchStart}
          onTouchMove={handleDrawerTouchMove}
          onTouchEnd={handleDrawerTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Menu Principal"
          className="absolute top-0 bottom-0 left-0 w-[275px] max-w-[80vw] sm:w-[290px] h-full bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar z-10 overscroll-contain drawer-panel"
          style={{
            transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)',
            willChange: 'transform',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Menu */}
          <div className="p-3.5 border-b border-slate-800/70 flex items-center justify-between shrink-0 bg-slate-900/95 drawer-header">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-sm shadow-indigo-500/20 shrink-0 flex items-center justify-center">
                <span className="font-mono font-black text-[11px] text-slate-950">N</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white drawer-title">Nexa</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    App
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {language === 'en' ? 'Main Navigation' : language === 'es' ? 'Navegación Principal' : language === 'fr' ? 'Navigation Principale' : 'Navegação Principal'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors active:scale-95 cursor-pointer drawer-close-btn"
              aria-label={t.portfolio?.close || (language === 'en' ? 'Close menu' : 'Fechar menu')}
              title={t.portfolio?.close || (language === 'en' ? 'Close menu' : 'Fechar menu')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de Navegação com 10 Itens Oficiais e Touch Targets Confortáveis */}
          <div className="p-2.5 space-y-0.5 flex-1 overflow-y-auto no-scrollbar">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className={`min-h-[44px] w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[12.5px] font-medium transition-all active:scale-[0.98] cursor-pointer ${
                    item.isActive
                      ? 'bg-indigo-600/15 text-cyan-300 border border-indigo-500/30 shadow-xs font-semibold drawer-item-active'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent drawer-item-inactive'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={item.isActive ? 'text-cyan-400 drawer-icon-active' : 'text-slate-400'}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 shrink-0 drawer-dot-active" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer do Menu */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0 drawer-footer">
            <p className="text-center text-[10px] font-medium text-slate-500">
              {language === 'en' ? 'NexaWeb App · Professional websites' : 'NexaWeb App · Sites profissionais'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
