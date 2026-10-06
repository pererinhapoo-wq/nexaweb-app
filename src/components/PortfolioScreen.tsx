import React, { useState, useMemo } from 'react';
import { getPortfolioProjects } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import { ProjectCardImage } from './ProjectCardImage';
import { Search, X, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface PortfolioScreenProps {
  onSelectProject?: (project: PortfolioProject) => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
  initialPlanFilter?: PlanFilter;
  onPlanFilterChange?: (plan: PlanFilter) => void;
  initialSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

type PlanFilter = 'todas' | 'essencial' | 'profissional' | 'premium';

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectProject,
  initialPlanFilter = 'todas',
  onPlanFilterChange,
  initialSearchQuery = '',
  onSearchQueryChange,
}) => {
  const { language } = useTranslation();

  const [selectedPlan, setSelectedPlan] = useState<PlanFilter>(initialPlanFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  // Lista oficial e imutável de demonstrações cadastradas
  const allProjects = useMemo(() => getPortfolioProjects(language), [language]);

  // Filtros de Planos Oficiais: Todas, Essencial, Profissional, Premium (sem Personalizado)
  const planTabs: { id: PlanFilter; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'todas', label: 'Todas', count: allProjects.length },
      {
        id: 'essencial',
        label: 'Essencial',
        count: allProjects.filter((p) => p.planoId === 'essencial').length,
      },
      {
        id: 'profissional',
        label: 'Profissional',
        count: allProjects.filter((p) => p.planoId === 'profissional').length,
      },
      {
        id: 'premium',
        label: 'Premium',
        count: allProjects.filter((p) => p.planoId === 'premium').length,
      },
    ];
  }, [allProjects]);

  // Filtragem rápida e inteligente por plano + texto de busca
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // 1. Filtro por plano
      if (selectedPlan !== 'todas' && project.planoId !== selectedPlan) {
        return false;
      }

      // 2. Busca textual (nome, segmento, categoria, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = project.titulo.toLowerCase().includes(query);
        const matchSegment = project.segmentoAlvo.toLowerCase().includes(query);
        const matchCategory = project.categoria.toLowerCase().includes(query);
        const matchTags = project.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchTitle || matchSegment || matchCategory || matchTags;
      }

      return true;
    });
  }, [allProjects, selectedPlan, searchQuery]);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      {/* 1. Cabeçalho Compacto & Contador Real */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Vitrine de Demonstrações</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Exibindo <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> de{' '}
            <span className="text-slate-300 font-semibold">{allProjects.length}</span> demonstrações
          </p>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
          Oficiais
        </span>
      </div>

      {/* 2. Barra de Busca Simples & Ágil */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            onSearchQueryChange?.(val);
          }}
          placeholder="Buscar projeto, segmento ou nicho..."
          className="min-h-[44px] w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/70 transition-colors shadow-sm"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSearchQueryChange?.('');
            }}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-slate-400 hover:text-white absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Limpar busca"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Filtros Oficiais por Planos (Todas, Essencial, Profissional, Premium) */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
        {planTabs.map((tab) => {
          const isSelected = selectedPlan === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedPlan(tab.id);
                onPlanFilterChange?.(tab.id);
              }}
              className={`min-h-[42px] py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center active:scale-[0.98] ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <span className="text-[11px] sm:text-xs leading-none truncate max-w-full">
                {tab.label}
              </span>
              <span
                className={`text-[9px] font-mono mt-1 ${
                  isSelected ? 'text-cyan-200 font-bold' : 'text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Lista / Grid de Projetos: Cada Card Inteiro é Clicável */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Nenhum projeto encontrado</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Não encontramos demonstrações com os termos pesquisados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPlan('todas');
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProjects.map((project) => {
              const planBadge = project.planoId ? `PLANO ${project.planoId.toUpperCase()}` : undefined;

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-150 shadow-sm cursor-pointer active:scale-[0.985] group flex flex-col justify-between"
                >
                  <div>
                    {/* Imagem Proporcional com Captura Real e Fallback Elegante */}
                    <ProjectCardImage
                      project={project}
                      aspectRatio="card"
                      badge={planBadge}
                    />

                    {/* Informações Visuais Compactas */}
                    <div className="p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-semibold text-cyan-400 uppercase tracking-wider truncate max-w-[140px]">
                          {project.categoria}
                        </span>
                        <span className="font-mono text-slate-500 shrink-0">
                          {project.planoId?.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {project.titulo}
                      </h3>

                      <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                        {project.segmentoAlvo}
                      </p>
                    </div>
                  </div>

                  {/* Rodapé do Card: Ação visual integrada indicando toque */}
                  <div className="px-3.5 py-2.5 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-[10.5px] text-slate-400 group-hover:text-slate-300 font-medium">
                      Ver detalhes do projeto
                    </span>
                    <span className="font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
