import React from 'react';
import { ViewTab, Lead } from '../types';
import { Search, Users, Briefcase, Plus, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ALL_STATUSES, STATUS_CONFIG } from '../utils/statusConfig';

interface HomeScreenProps {
  onNavigate: (tab: ViewTab) => void;
  leads: Lead[];
  onOpenNewLeadModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  leads,
  onOpenNewLeadModal,
}) => {
  const statusCounts = ALL_STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter((l) => l.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const fechadosCount = statusCounts['Fechado'] || 0;
  const interessadosCount = statusCounts['Interessado'] || 0;
  const contatadosCount = statusCounts['Contatado'] || 0;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 p-5 shadow-xl shadow-indigo-950/30">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            NexaWeb Prospecção V1
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            NexaWeb App
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
            Painel interno para organizar empresas, contatos de prospecção, mensagens de abordagem e demonstrações.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Total Leads</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{leads.length}</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-emerald-900/30 text-center">
              <span className="text-[11px] text-emerald-400 font-medium block">Interessados</span>
              <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{interessadosCount}</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-green-900/40 text-center">
              <span className="text-[11px] text-green-400 font-medium block">Fechados</span>
              <span className="text-xl font-bold text-green-300 mt-0.5 block">{fechadosCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3 Action Buttons as required */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-3">
          Acesso Rápido
        </h2>

        <div className="space-y-3">
          {/* 1. Encontrar Clientes */}
          <button
            onClick={() => onNavigate('find')}
            className="w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all duration-150 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    Encontrar clientes
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Radar
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pesquise por cidade e segmento para prospecção
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* 2. Meus Leads */}
          <button
            onClick={() => onNavigate('leads')}
            className="w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all duration-150 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    Meus leads
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pipeline por status, contatos e mensagens personalizadas
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* 3. Portfólio */}
          <button
            onClick={() => onNavigate('portfolio')}
            className="w-full text-left group relative flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all duration-150 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    Portfólio
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Demonstrações
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Projetos de demonstração organizados por categoria
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Quick Add CTA & Funnel distribution */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Funil de Prospecção
          </span>
          <button
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo lead
          </button>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
            {ALL_STATUSES.map((st) => {
              const count = statusCounts[st] || 0;
              const meta = STATUS_CONFIG[st];
              return (
                <div
                  key={st}
                  onClick={() => onNavigate('leads')}
                  role="button"
                  tabIndex={0}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                    <span className="text-xs text-slate-300">{st}</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-slate-800/60 px-1.5 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Contatados: {contatadosCount}
            </span>
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fechados: {fechadosCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
