import React, { useState, useMemo } from 'react';
import { getPortfolioProjects, getPortfolioCategories } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import { ProjectCardImage } from './ProjectCardImage';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
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

// Card de projeto na vitrine redesenhado para visual moderno, compacto e sem botões internos
const PortfolioProjectCard = React.memo<{
  project: PortfolioProject;
  onSelectProject?: (project: PortfolioProject) => void;
}>(({ project, onSelectProject }) => {
  const planBadge = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

  return (
    <div
      onClick={() => onSelectProject?.(project)}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-slate-700 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.985] group"
    >
      <div>
        {/* Imagem Real do Segmento com badge e suporte a múltiplos ângulos */}
        <ProjectCardImage
          project={project}
          aspectRatio="card"
          badge={planBadge}
        />

        {/* Informações Visuais Compactas do Projeto */}
        <div className="p-3 sm:p-3.5 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="font-bold text-cyan-400 uppercase tracking-wider truncate">
              {project.categoria}
            </span>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
              {planBadge}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {project.titulo}
          </h3>

          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {project.descricaoCurta}
          </p>
        </div>
      </div>
    </div>
  );
});

PortfolioProjectCard.displayName = 'PortfolioProjectCard';

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectProject,
  initialPlanFilter = 'todas',
  onPlanFilterChange,
  initialSearchQuery = '',
}) => {
  const { language } = useTranslation();

  // Estados locais para filtragem veloz e sem re-renderizar a árvore inteira do app
  const [selectedPlan, setSelectedPlan] = useState<PlanFilter>(initialPlanFilter);
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [isSegmentFilterModalOpen, setIsSegmentFilterModalOpen] = useState<boolean>(false);

  // Lista oficial de demonstrações
  const allProjects = useMemo(() => getPortfolioProjects(language), [language]);
  const allCategories = useMemo(() => getPortfolioCategories(language), [language]);

  // Filtros de Planos Principais: Todos, Essencial, Profissional, Premium
  const planTabs: { id: PlanFilter; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'todas', label: 'Todos', count: allProjects.length },
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

  // Filtragem leve e instantânea enquanto digita
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // 1. Filtro por plano
      if (selectedPlan !== 'todas' && project.planoId !== selectedPlan) {
        return false;
      }

      // 2. Filtro por segmento
      if (selectedSegment !== 'todos' && project.categoria !== selectedSegment) {
        return false;
      }

      // 3. Busca textual: nome do projeto, segmento, categoria ou plano
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = project.titulo.toLowerCase().includes(query);
        const matchSegment = project.segmentoAlvo.toLowerCase().includes(query);
        const matchCategory = project.categoria.toLowerCase().includes(query);
        const matchPlan = project.planoId?.toLowerCase().includes(query);
        const matchTags = project.tags.some((tag) => tag.toLowerCase().includes(query));

        return matchTitle || matchSegment || matchCategory || matchPlan || matchTags;
      }

      return true;
    });
  }, [allProjects, selectedPlan, selectedSegment, searchQuery]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedPlan('todas');
    setSelectedSegment('todos');
    onPlanFilterChange?.('todas');
  };

  const activeSegmentCategory = allCategories.find((c) => c.id === selectedSegment);

  return (
    <div className="space-y-3.5 pb-24 animate-in fade-in duration-150">
      {/* 1. Cabeçalho Compacto */}
      <section className="pt-0.5">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Portfólio NexaWeb
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Explore nossos projetos e encontre o estilo ideal para o seu negócio.
        </p>
      </section>

      {/* 2. Barra de Pesquisa Compacta */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar projeto, segmento ou categoria"
          className="min-h-[42px] w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/70 transition-colors shadow-sm"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-slate-400 hover:text-white absolute right-1 top-1/2 -translate-y-1/2 rounded-lg"
            title="Limpar pesquisa"
            aria-label="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Filtros Principais Compactos (Todos, Essencial, Profissional, Premium) + Botão Filtros */}
      <div className="flex items-center gap-2">
        {/* Tabs compactas de planos */}
        <div className="flex-1 grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
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
                className={`py-1.5 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center active:scale-[0.98] ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium'
                }`}
              >
                <span className="text-[11px] leading-tight truncate max-w-full">
                  {tab.label}
                </span>
                <span
                  className={`text-[8.5px] font-mono leading-none mt-0.5 ${
                    isSelected ? 'text-cyan-200 font-bold' : 'text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Botão compacto "Filtros" de segmentos */}
        <button
          type="button"
          onClick={() => setIsSegmentFilterModalOpen(true)}
          className={`min-h-[44px] px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 transition-all active:scale-[0.98] ${
            selectedSegment !== 'todos'
              ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
          title="Filtrar por segmento"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filtros</span>
          {selectedSegment !== 'todos' && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Pill de segmento ativo quando selecionado */}
      {selectedSegment !== 'todos' && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Segmento:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
            {activeSegmentCategory?.nome || selectedSegment}
            <button
              type="button"
              onClick={() => setSelectedSegment('todos')}
              className="p-0.5 hover:text-white"
              aria-label="Remover filtro de segmento"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* 4. Contador de Resultados & Limpar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-0.5">
        <span className="font-semibold text-slate-300">
          {filteredProjects.length === 1
            ? '1 projeto encontrado'
            : `${filteredProjects.length} projetos encontrados`}
        </span>

        {(searchQuery || selectedPlan !== 'todas' || selectedSegment !== 'todos') && (
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* 5. Lista / Grid dos Cards dos Projetos (Card Inteiro Clicável, Sem Botões Internos) */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Não encontramos projetos para essa pesquisa.
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Tente buscar por outro termo ou limpe os filtros para ver todas as demonstrações.
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors"
            >
              Limpar pesquisa e filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProjects.map((project) => (
              <PortfolioProjectCard
                key={project.id}
                project={project}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Compacto de Seleção de Segmento */}
      {isSegmentFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsSegmentFilterModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Filtrar por Segmento</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSegmentFilterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Fechar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {allCategories.map((cat) => {
                const count =
                  cat.id === 'todos'
                    ? allProjects.length
                    : allProjects.filter((p) => p.categoria === cat.id).length;

                if (cat.id !== 'todos' && count === 0) return null;

                const isSelected = selectedSegment === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedSegment(cat.id);
                      setIsSegmentFilterModalOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-white font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{cat.nome}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">
                        {count}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedSegment('todos');
                  setIsSegmentFilterModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Limpar segmento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
