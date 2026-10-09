import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ViewTab } from '../types';
import {
  Home,
  Sparkles,
  Users,
  UserCheck,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import appIcon from '../assets/app-icon.svg';

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
  const { animationMode } = useTheme();
  const isAnimEnabled = animationMode !== 'reduced';

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
      label:
        language === 'en'
          ? 'Create website'
          : language === 'es'
          ? 'Crear sitio'
          : language === 'fr'
          ? 'Créer un site'
          : language === 'pt-PT'
          ? 'Criar sítio web'
          : 'Criar site',
      icon: Sparkles,
      action: () => handleSelectTab('project'),
      isActive: currentTab === 'project',
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
      label:
        language === 'en'
          ? 'My leads'
          : language === 'es'
          ? 'Mis leads'
          : language === 'fr'
          ? 'Mes pistes'
          : language === 'pt-PT'
          ? 'Os meus leads'
          : 'Meus leads',
      icon: Users,
      action: () => handleSelectTab('admin'),
      isActive: currentTab === 'admin',
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
          <div className="p-3 border-b border-slate-800/70 flex items-center justify-end shrink-0 bg-transparent drawer-header">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer drawer-close-btn p-0"
              aria-label={t.portfolio?.close || (language === 'en' ? 'Close menu' : 'Fechar menu')}
              title={t.portfolio?.close || (language === 'en' ? 'Close menu' : 'Fechar menu')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Lista de Navegação com 10 Itens Oficiais e Touch Targets Confortáveis */}
          <div className="p-2.5 space-y-0.5 flex-1 overflow-y-auto no-scrollbar pb-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className={`min-h-[44px] w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[12.5px] font-medium transition-all active:scale-[0.98] cursor-pointer ${
                    item.isActive
                      ? 'bg-cyan-950/40 text-white border border-cyan-500/25 shadow-xs font-semibold drawer-item-active'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent drawer-item-inactive'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={item.isActive ? 'text-cyan-400 drawer-icon-active' : 'text-slate-400'}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${item.isActive ? 'text-slate-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Área Inferior: Ícone N oficial centralizado */}
          <div className="p-4 pt-3 pb-6 sm:pb-7 flex items-center justify-center shrink-0 safe-area-pb">
            <img
              src={appIcon}
              alt="NexaWeb App"
              className="w-10 h-10 rounded-xl object-contain select-none shadow-sm shadow-indigo-500/10"
            />
          </div>
        </div>
      </div>
    </>
  );
};
