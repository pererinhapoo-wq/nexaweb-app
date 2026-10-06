import React, { useEffect } from 'react';
import { ViewTab } from '../types';
import {
  Home,
  Layers,
  Briefcase,
  Sparkles,
  UserCheck,
  Shield,
  Settings,
  ExternalLink,
  MessageCircle,
  X,
  Instagram,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  onOpenContact: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  onOpenContact,
}) => {
  const { t } = useTranslation();

  // Scroll lock suave e seguro sem resetar a posição do scroll da página
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTab = (tab: ViewTab) => {
    onClose();
    onNavigate(tab);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de Navegação"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xs sm:max-w-sm h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">NexaWeb</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  App
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Central do Aplicativo</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fechar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 space-y-5 flex-1">
          {/* 1. Navegação Principal */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Principal
            </span>

            {[
              { tab: 'home' as ViewTab, label: 'Início', icon: <Home className="w-4 h-4" /> },
              { tab: 'services' as ViewTab, label: 'Serviços & Planos', icon: <Layers className="w-4 h-4" /> },
              { tab: 'portfolio' as ViewTab, label: 'Portfólio de Demos', icon: <Briefcase className="w-4 h-4" /> },
              { tab: 'project' as ViewTab, label: 'Iniciar Projeto / Briefing', icon: <Sparkles className="w-4 h-4" /> },
            ].map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => handleSelectTab(item.tab)}
                  className={`min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
          </div>

          {/* Divisor */}
          <div className="h-px bg-slate-800/80 my-1" />

          {/* 2. Área do Cliente & Admin */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Área do Cliente & Gestão
            </span>

            <button
              type="button"
              onClick={() => handleSelectTab('portal')}
              className={`min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'portal'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <span>Área do Cliente</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Portal
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('admin')}
              className={`min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'admin'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-400">
                  <Shield className="w-4 h-4" />
                </span>
                <span>Admin NexaWeb</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Acesso
              </span>
            </button>
          </div>

          {/* Divisor */}
          <div className="h-px bg-slate-800/80 my-1" />

          {/* 3. Configurações & Contatos Oficiais */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Suporte & Ajustes
            </span>

            <button
              type="button"
              onClick={() => handleSelectTab('settings')}
              className={`min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'settings'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-indigo-400">
                  <Settings className="w-4 h-4" />
                </span>
                <span>Configurações (Tema / Idioma)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <span>Falar com a NexaWeb</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <a
              href="https://nexaweeb.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">
                  <ExternalLink className="w-4 h-4" />
                </span>
                <span>Conhecer a NexaWeb (Site)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Drawer Footer com Links Oficiais */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://www.instagram.com/nexaw1/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-slate-300 text-xs font-semibold transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@nexaw1</span>
            </a>

            <a
              href="mailto:nexaweeb@gmail.com"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 text-xs font-semibold transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">E-mail</span>
            </a>
          </div>

          <div className="text-center text-[10px] text-slate-500">
            NexaWeb App · Sites profissionais
          </div>
        </div>
      </div>
    </div>
  );
};
