import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getPortfolioProjects, getPortfolioCategories } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import { ProjectCardImage } from './ProjectCardImage';
import { Search, X, SlidersHorizontal, Check, ArrowLeft, ChevronDown } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface PortfolioScreenProps {
  onSelectProject?: (project: PortfolioProject) => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
  onBack?: () => void;
  initialPlanFilter?: PlanFilter;
  onPlanFilterChange?: (plan: PlanFilter) => void;
  initialSegmentFilter?: string;
  onSegmentFilterChange?: (segment: string) => void;
  initialSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

type PlanFilter = 'todas' | 'essencial' | 'profissional' | 'premium';

// Card de projeto na vitrine redesenhado para visual moderno, compacto e sem botões internos
const PortfolioProjectCard = React.memo<{
  project: PortfolioProject;
  categoryLabel: string;
  onSelectProject?: (project: PortfolioProject) => void;
  priority?: boolean;
}>(({ project, categoryLabel, onSelectProject, priority }) => {
  const planBadge = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

  return (
    <div
      onClick={() => onSelectProject?.(project)}
      className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.985] group"
    >
      <div>
        {/* Imagem Real do Segmento com badge e suporte a múltiplos ângulos */}
        <ProjectCardImage
          project={project}
          aspectRatio="card"
          badge={planBadge}
          priority={priority}
        />

        {/* Informações Visuais Compactas do Projeto */}
        <div className="p-2.5 sm:p-3 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[9.5px]">
            <span className="font-bold text-cyan-400 uppercase tracking-wider truncate">
              {categoryLabel || project.categoria}
            </span>
            <span className="font-mono text-[8.5px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
              {planBadge}
            </span>
          </div>

          <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {project.titulo}
          </h3>

          <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
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
  onBack,
  initialPlanFilter = 'todas',
  onPlanFilterChange,
  initialSegmentFilter = 'todos',
  onSegmentFilterChange,
  initialSearchQuery = '',
  onSearchQueryChange,
}) => {
  const { language, t } = useTranslation();

  // Estados locais para filtragem veloz e sem re-renderizar a árvore inteira do app
  const [selectedPlan, setSelectedPlan] = useState<PlanFilter>(initialPlanFilter);
  const [selectedSegment, setSelectedSegment] = useState<string>(initialSegmentFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Sincroniza estados com props quando alternar abas
  useEffect(() => {
    if (initialPlanFilter) setSelectedPlan(initialPlanFilter);
  }, [initialPlanFilter]);

  useEffect(() => {
    if (initialSegmentFilter !== undefined) setSelectedSegment(initialSegmentFilter);
  }, [initialSegmentFilter]);

  useEffect(() => {
    if (initialSearchQuery !== undefined) setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleToggleFilter = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFilterDropdownOpen((prev) => !prev);
  };

  const handleCloseFilter = () => {
    setIsFilterDropdownOpen(false);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedSegment(catId);
    onSegmentFilterChange?.(catId);
    setIsFilterDropdownOpen(false);
  };

  const handleClearSegment = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedSegment('todos');
    onSegmentFilterChange?.('todos');
  };

  // Fecha dropdown com tecla Escape ou toque/clique fora
  useEffect(() => {
    if (!isFilterDropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterDropdownOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Lista oficial de demonstrações
  const allProjects = useMemo(() => getPortfolioProjects(language), [language]);
  const allCategories = useMemo(() => getPortfolioCategories(language), [language]);

  // Filtros de Planos Principais: Todos, Essencial, Profissional, Premium
  const planTabs: { id: PlanFilter; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'todas', label: t.portfolio.allCategories || (language === 'en' ? 'All' : 'Todos'), count: allProjects.length },
      {
        id: 'essencial',
        label: t.services.essentialBadge || 'Essencial',
        count: allProjects.filter((p) => p.planoId === 'essencial').length,
      },
      {
        id: 'profissional',
        label: t.services.featuredBadge || 'Profissional',
        count: allProjects.filter((p) => p.planoId === 'profissional').length,
      },
      {
        id: 'premium',
        label: 'Premium',
        count: allProjects.filter((p) => p.planoId === 'premium').length,
      },
    ];
  }, [allProjects, language, t]);

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

  // Mapeamento id -> nome legível para badges de segmento
  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    allCategories.forEach((c) => map.set(c.id, c.nome));
    return map;
  }, [allCategories]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    onSearchQueryChange?.('');
    setSelectedPlan('todas');
    onPlanFilterChange?.('todas');
    setSelectedSegment('todos');
    onSegmentFilterChange?.('todos');
  };

  const activeSegmentCategory = allCategories.find((c) => c.id === selectedSegment);

  return (
    <div className="space-y-3.5 pb-4 animate-in fade-in duration-150">
      {/* 1. Cabeçalho Compacto */}
      <section className="pt-0 flex items-center gap-2.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 min-h-[36px] min-w-[36px] -ml-0.5 rounded-lg bg-slate-900 border border-slate-800/80 hover:bg-slate-850 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
            aria-label="←"
            title="←"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {t.portfolio.title}
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {t.portfolio.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Barra de Pesquisa Compacta */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearchQueryChange?.(e.target.value);
          }}
          placeholder={t.portfolio.searchPlaceholder}
          className="min-h-[38px] w-full bg-slate-900 border border-slate-800/80 rounded-xl pl-8.5 pr-8.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/70 transition-colors shadow-sm"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSearchQueryChange?.('');
            }}
            className="w-8 h-8 min-h-[32px] min-w-[32px] flex items-center justify-center p-1.5 text-slate-400 hover:text-white absolute right-1 top-1/2 -translate-y-1/2 rounded-lg"
            title={language === 'en' ? 'Clear search' : 'Limpar pesquisa'}
            aria-label={language === 'en' ? 'Clear search' : 'Limpar pesquisa'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Filtros de Planos (Todos, Essencial, Profissional, Premium) */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
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
              className={`py-1.5 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center active:scale-[0.98] cursor-pointer ${
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

      {/* 4. Controle "Selecione filtro" de Categorias / Segmentos */}
      <div className="relative z-30" ref={dropdownContainerRef}>
        <button
          type="button"
          onClick={handleToggleFilter}
          aria-haspopup="listbox"
          aria-expanded={isFilterDropdownOpen}
          aria-label={language === 'en' ? 'Select filter' : 'Selecione filtro'}
          title={language === 'en' ? 'Select filter' : 'Selecione filtro'}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all active:scale-[0.99] cursor-pointer shadow-sm select-none ${
            selectedSegment !== 'todos'
              ? 'bg-cyan-500/15 border-cyan-500/50 text-white ring-1 ring-cyan-500/30 pr-16'
              : isFilterDropdownOpen
                ? 'bg-slate-900 border-cyan-500/50 text-white ring-1 ring-cyan-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400 shrink-0 text-[11px] font-semibold uppercase tracking-wider">
              {language === 'en' ? 'Category:' : 'Categoria:'}
            </span>
            <span className={`truncate text-xs font-semibold ${selectedSegment !== 'todos' ? 'text-cyan-300' : 'text-slate-200'}`}>
              {selectedSegment !== 'todos'
                ? activeSegmentCategory?.nome || selectedSegment
                : (language === 'en' ? 'Select filter' : 'Selecione filtro')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {selectedSegment === 'todos' && (
              <span className="text-[10px] text-slate-500 font-mono">
                {allCategories.length} {language === 'en' ? 'options' : 'opções'}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isFilterDropdownOpen ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {selectedSegment !== 'todos' && (
          <button
            type="button"
            onClick={handleClearSegment}
            className="absolute right-8 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-20"
            title={language === 'en' ? 'Clear filter' : 'Limpar filtro'}
            aria-label={language === 'en' ? 'Clear filter' : 'Limpar filtro'}
          >
            <X className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        )}

        {/* NOVO SELETOR COMPACTO: Popup suspenso flutuante logo abaixo do controle */}
        {isFilterDropdownOpen && (
          <>
            {/* Backdrop invisível para fechar ao clicar fora */}
            <div
              className="fixed inset-0 z-30 bg-transparent"
              onClick={handleCloseFilter}
              aria-hidden="true"
            />

            {/* Popup compacto com sombra sutil e borda arredondada */}
            <div
              role="listbox"
              aria-label={language === 'en' ? 'Select filter' : 'Selecione filtro'}
              className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-2xl bg-slate-900/98 backdrop-blur-md border border-slate-700/80 shadow-2xl shadow-black/80 p-1.5 space-y-1 max-h-[300px] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150 origin-top"
            >
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
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                        : 'border border-transparent text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">
                      {cat.id === 'todos'
                        ? (language === 'en' ? 'All Categories (Show All)' : 'Todos os Segmentos (Ver Todos)')
                        : cat.nome}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">
                        {count}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

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
              {t.portfolio.noResultsTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {t.portfolio.noResultsDesc}
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors"
            >
              {t.portfolio.clearSearch || (language === 'en' ? 'Clear search and filters' : 'Limpar pesquisa e filtros')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProjects.map((project, idx) => (
              <PortfolioProjectCard
                key={project.id}
                project={project}
                categoryLabel={categoryNameMap.get(project.categoria) || project.categoria}
                onSelectProject={onSelectProject}
                priority={idx < 2}
              />
            ))}
          </div>
        )}
      </div>


    </div>
  );
};
