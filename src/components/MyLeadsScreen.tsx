import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus } from '../types';
import { ALL_STATUSES, STATUS_CONFIG } from '../utils/statusConfig';
import { cleanWhatsAppNumber } from '../utils/messageGenerator';
import {
  Users,
  Plus,
  Search,
  Filter,
  MapPin,
  Briefcase,
  Phone,
  ChevronRight,
  UserX,
  Send,
} from 'lucide-react';

interface MyLeadsScreenProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
}

export const MyLeadsScreen: React.FC<MyLeadsScreenProps> = ({
  leads,
  onSelectLead,
  onOpenNewLeadModal,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: leads.length };
    ALL_STATUSES.forEach((st) => {
      counts[st] = leads.filter((l) => l.status === st).length;
    });
    return counts;
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchStatus =
        selectedStatus === 'todos' || lead.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lead.nomeEmpresa.toLowerCase().includes(q) ||
        lead.segmento.toLowerCase().includes(q) ||
        lead.cidade.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [leads, selectedStatus, searchQuery]);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Meus Leads
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {leads.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie o progresso e contatos das empresas prospectadas
          </p>
        </div>

        {/* Botão Novo Lead */}
        <button
          onClick={onOpenNewLeadModal}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por empresa, segmento ou cidade..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Horizontal Status Filter Tabs */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-1.5">
        <button
          onClick={() => setSelectedStatus('todos')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedStatus === 'todos'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 border border-slate-800'
          }`}
        >
          <span>Todos</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedStatus === 'todos'
                ? 'bg-indigo-800 text-indigo-100'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {statusCounts.todos || 0}
          </span>
        </button>

        {ALL_STATUSES.map((st) => {
          const isSelected = selectedStatus === st;
          const meta = STATUS_CONFIG[st];
          const count = statusCounts[st] || 0;

          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? `${meta.badgeClass} ring-1 ring-indigo-500/30`
                  : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 border border-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
              <span>{st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-900/60 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leads List */}
      {filteredLeads.length > 0 ? (
        <div className="space-y-2.5">
          {filteredLeads.map((lead) => {
            const meta = STATUS_CONFIG[lead.status];
            const cleanPhone = cleanWhatsAppNumber(lead.whatsapp);

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                role="button"
                tabIndex={0}
                className="group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors truncate">
                        {lead.nomeEmpresa}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${meta.badgeClass}`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-300">
                        <Briefcase className="w-3 h-3 text-indigo-400" />
                        {lead.segmento}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {lead.cidade}
                      </span>
                    </div>

                    {lead.observacoes && (
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">
                        "{lead.observacoes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <div className="p-1.5 text-slate-500 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            {searchQuery ? (
              <Search className="w-6 h-6 text-slate-400" />
            ) : (
              <Users className="w-6 h-6 text-indigo-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {searchQuery
                ? 'Nenhum lead encontrado para a busca'
                : selectedStatus !== 'todos'
                ? `Nenhum lead com o status "${selectedStatus}"`
                : 'Nenhum lead cadastrado ainda'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Tente buscar com outro termo ou limpe os filtros de pesquisa.'
                : 'Cadastre suas primeiras empresas prospectadas para acompanhar contatos e propostas.'}
            </p>
          </div>

          <button
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Lead</span>
          </button>
        </div>
      )}
    </div>
  );
};
