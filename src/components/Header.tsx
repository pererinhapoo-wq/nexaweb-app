import React from 'react';
import { ViewTab } from '../types';
import { Globe, ArrowLeft, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  leadCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, leadCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {currentTab !== 'home' ? (
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Voltar ao início"
              aria-label="Voltar para a tela inicial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                NexaWeb
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  App V1
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Prospecção & Leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {leadCount > 0 && (
            <button
              onClick={() => onNavigate('leads')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{leadCount}</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">leads</span>
            </button>
          )}

          <div className="hidden xs:flex items-center gap-1 text-[11px] font-medium text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Interno</span>
          </div>
        </div>
      </div>
    </header>
  );
};
