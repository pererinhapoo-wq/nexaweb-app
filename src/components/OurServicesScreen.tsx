import React, { useState, useMemo } from 'react';
import { ViewTab, PortfolioProject } from '../types';
import { OUR_SERVICES, OurServiceItem, ServiceAvailability } from '../data/ourServicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import { BackButton } from './BackButton';
import {
  Share2,
  Layout,
  Briefcase,
  Calendar,
  ShoppingBag,
  Camera,
  Ticket,
  Building2,
  UtensilsCrossed,
  MessageSquareQuote,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface OurServicesScreenProps {
  onBack: () => void;
  onNavigate: (tab: ViewTab, options?: any) => void;
  onSelectProject: (project: PortfolioProject) => void;
  onOpenContact: () => void;
  selectedServiceId?: string | null;
  onSelectService?: (serviceId: string | null) => void;
}

// Mapeamento dinâmico de ícones Lucide para cada serviço
const iconMap: Record<string, React.ElementType> = {
  Share2,
  Layout,
  Briefcase,
  Calendar,
  ShoppingBag,
  Camera,
  Ticket,
  Building2,
  UtensilsCrossed,
  MessageSquareQuote,
  Layers,
};

export const OurServicesScreen: React.FC<OurServicesScreenProps> = ({
  onBack,
  onNavigate,
  onSelectProject,
  onOpenContact,
  selectedServiceId: propSelectedServiceId,
  onSelectService: propOnSelectService,
}) => {
  // Estado local sincronizável para navegação de detalhes do serviço
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const activeServiceId = propSelectedServiceId !== undefined ? propSelectedServiceId : internalSelectedId;

  const handleSelectService = (id: string | null) => {
    if (propOnSelectService) {
      propOnSelectService(id);
    } else {
      setInternalSelectedId(id);
    }
  };

  // Filtro de lista
  const [filter, setFilter] = useState<'todos' | 'disponivel' | 'em_breve'>('todos');

  // Todos os projetos para resolução das demonstrações oficiais
  const allProjects = useMemo(() => getPortfolioProjects('pt-BR'), []);

  // Serviço ativo se selecionado
  const activeService = useMemo(() => {
    if (!activeServiceId) return null;
    return OUR_SERVICES.find((s) => s.id === activeServiceId) || null;
  }, [activeServiceId]);

  // Lista filtrada
  const filteredServices = useMemo(() => {
    if (filter === 'todos') return OUR_SERVICES;
    if (filter === 'disponivel') return OUR_SERVICES.filter((s) => s.status === 'disponivel');
    return OUR_SERVICES.filter((s) => s.status !== 'disponivel');
  }, [filter]);

  // Handler para iniciar o briefing a partir de um serviço disponível
  const handleStartService = (service: OurServiceItem) => {
    onNavigate('project', {
      selectedPlan: service.planoSugerido || 'profissional',
      selectedSegment: service.segmentKey,
    });
  };

  // Badge de disponibilidade visual padronizado
  const renderStatusBadge = (status: ServiceAvailability, label: string) => {
    if (status === 'disponivel') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {label}
        </span>
      );
    }
    if (status === 'em_desenvolvimento') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Clock className="w-2.5 h-2.5" />
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
        <Sparkles className="w-2.5 h-2.5" />
        {label}
      </span>
    );
  };

  // =========================================================================
  // TELA DE DETALHES DO SERVIÇO ESCOLHIDO
  // =========================================================================
  if (activeService) {
    const IconComponent = iconMap[activeService.iconeNome] || Layers;
    const relatedDemo = activeService.demoProjectId
      ? allProjects.find((p) => p.id === activeService.demoProjectId)
      : null;

    return (
      <div className="space-y-3.5 pb-6 animate-in fade-in duration-150">
        {/* Barra superior com botão Voltar sozinho na linha superior alinhado à esquerda */}
        <div className="flex items-center pt-1.5 sm:pt-2">
          <BackButton
            onClick={() => handleSelectService(null)}
            label="Voltar para serviços"
            className="!justify-start -ml-1.5"
          />
        </div>

        {/* Cabeçalho do Serviço */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeService.titulo}
                </h1>
                {renderStatusBadge(activeService.status, activeService.statusLabel)}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {activeService.descricao}
              </p>
            </div>
          </div>
        </section>

        {/* Finalidade do Tipo de Site */}
        <section className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Finalidade do Projeto
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeService.finalidade}
          </p>
        </section>

        {/* Recursos & O que está incluso no escopo */}
        <section className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            O que está contemplado
          </h2>
          <div className="space-y-2">
            {activeService.recursos.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bloco de Ações e Disponibilidade */}
        <section className="space-y-2.5 pt-1">
          {activeService.status === 'disponivel' ? (
            <>
              {/* Botão Principal: Criar Site */}
              <button
                type="button"
                onClick={() => handleStartService(activeService)}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/40 border border-indigo-400/25 flex items-center justify-center gap-2 active:scale-[0.985] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Criar meu site neste modelo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Botão Secundário: Ver demonstração se houver no portfólio */}
              {relatedDemo && (
                <button
                  type="button"
                  onClick={() => onSelectProject(relatedDemo)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.985] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver demonstração real ({relatedDemo.titulo})</span>
                </button>
              )}
            </>
          ) : (
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">
                    {activeService.status === 'em_desenvolvimento'
                      ? 'Modelo em fase de desenvolvimento'
                      : 'Lançamento planejado para breve'}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {activeService.observacaoDisponibilidade ||
                      'Nossa equipe está finalizando os padrões visuais e técnicos para este tipo de site.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenContact}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.985] transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Falar com a NexaWeb sobre este serviço</span>
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  // =========================================================================
  // LISTA PRINCIPAL DE SERVIÇOS ("NOSSOS SERVIÇOS")
  // =========================================================================
  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-150">
      {/* 1. TOPO COM BOTÃO VOLTAR E TÍTULO */}
      <div className="space-y-1 pt-1.5 sm:pt-2">
        <div className="flex items-center">
          <BackButton
            onClick={onBack}
            label="Voltar ao início"
            className="!justify-start -ml-1.5"
          />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Nossos serviços</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              10 soluções
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Conheça as soluções de páginas e sites profissionais criados pela NexaWeb.
          </p>
        </div>
      </div>

      {/* 2. CHIPS DE FILTRO DISCRETOS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            filter === 'todos'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Todos ({OUR_SERVICES.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('disponivel')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            filter === 'disponivel'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Disponíveis ({OUR_SERVICES.filter((s) => s.status === 'disponivel').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('em_breve')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            filter === 'em_breve'
              ? 'bg-indigo-500 text-white font-bold shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Em breve ({OUR_SERVICES.filter((s) => s.status !== 'disponivel').length})
        </button>
      </div>

      {/* 3. GRID DE CARTÕES ORGANIZADOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {filteredServices.map((service) => {
          const IconComponent = iconMap[service.iconeNome] || Layers;
          const isAvailable = service.status === 'disponivel';

          return (
            <div
              key={service.id}
              onClick={() => handleSelectService(service.id)}
              className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer active:scale-[0.985] group flex flex-col justify-between space-y-2.5 press-card shadow-sm"
            >
              <div>
                {/* Cabeçalho do Card com Ícone e Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAvailable
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {renderStatusBadge(service.status, service.statusLabel)}
                </div>

                {/* Título e Descrição */}
                <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {service.titulo}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {service.descricao}
                </p>
              </div>

              {/* Rodapé com indicação de toque */}
              <div className="pt-1.5 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500">
                <span>Toque para ver detalhes</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Conhecer <ArrowRight className="w-3 h-3 inline" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
