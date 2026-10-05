import React, { useState, useEffect } from 'react';
import { getPortfolioCategories, getPortfolioProjects } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import {
  ExternalLink,
  CheckCircle2,
  Sparkles,
  X,
  Smartphone,
  Eye,
  ArrowRight,
  Search,
  Heart,
  Share2,
  Check,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { getFavoriteProjects, toggleFavoriteProject } from '../utils/storage';

interface PortfolioScreenProps {
  onSelectProjectForBriefing?: (projectTitle: string) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectProjectForBriefing
}) => {
  const { language, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeDemo, setActiveDemo] = useState<PortfolioProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = getPortfolioCategories(language);
  const projects = getPortfolioProjects(language);

  // Carrega favoritos salvos localmente
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favs = await getFavoriteProjects();
        setFavorites(favs);
      } catch {
        // Fallback
      }
    }
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await toggleFavoriteProject(projectId);
    setFavorites(updated);
  };

  const handleShare = async (project: PortfolioProject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const shareData = {
      title: project.titulo,
      text: `${project.titulo} — NexaWeb Apps`,
      url: project.linkDemo,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Usuário cancelou ou navegador não completou o share nativo
      }
    }

    // Fallback: copia para a área de transferência
    try {
      await navigator.clipboard.writeText(project.linkDemo);
      setCopiedId(project.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Ignora falha de permissão de clipboard
    }
  };

  // Trava de scroll no corpo da página quando o modal estiver aberto
  useEffect(() => {
    if (activeDemo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handlePopState = () => {
        setActiveDemo(null);
      };

      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [activeDemo]);

  // Filtragem composta: categoria + busca textual + favoritos
  const filteredProjects = projects.filter((project) => {
    // 1. Categoria
    if (selectedCategory !== 'todos' && project.categoria !== selectedCategory) {
      return false;
    }

    // 2. Favoritos
    if (showOnlyFavorites && !favorites.includes(project.id)) {
      return false;
    }

    // 3. Busca textual
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = project.titulo.toLowerCase().includes(query);
      const matchDesc = project.descricaoCurta.toLowerCase().includes(query);
      const matchSegment = project.segmentoAlvo.toLowerCase().includes(query);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(query));
      const matchRecursos = project.recursos.some((r) => r.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchSegment || matchTags || matchRecursos;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {t.portfolio.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {t.portfolio.badge}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {t.portfolio.subtitle}
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.portfolio.searchPlaceholder}
          className="min-h-[44px] w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md hover:bg-slate-800 transition-colors"
            title={t.portfolio.clearSearch}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtros Horizontais com Botão Favoritos */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-1.5">
        {/* Botão de Favoritos */}
        <button
          type="button"
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-[0.98] ${
            showOnlyFavorites
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 border border-slate-800'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current text-white' : 'text-rose-400'}`} />
          <span>{t.portfolio.favoritesOnly}</span>
          {favorites.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {favorites.length}
            </span>
          )}
        </button>

        {/* Categorias */}
        {categories.map((cat) => {
          const isSelected = !showOnlyFavorites && selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setShowOnlyFavorites(false);
                setSelectedCategory(cat.id);
              }}
              className={`min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-850 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.nome}
            </button>
          );
        })}
      </div>

      {/* Feedback de link copiado no compartilhamento */}
      {copiedId && (
        <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{t.portfolio.shareSuccess}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-3">
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
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setShowOnlyFavorites(false);
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors"
            >
              {t.portfolio.clearSearch}
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isFav = favorites.includes(project.id);

            return (
              <div
                key={project.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-150 shadow-sm"
              >
                {/* Visual Header Banner com Proporção Estável */}
                <div
                  className={`h-24 bg-gradient-to-r ${project.corDestaque} p-4 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                      {categories.find((c) => c.id === project.categoria)?.nome || project.categoria}
                    </span>

                    {/* Ações de Favoritar e Compartilhar no Header do Card */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(project.id, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                          isFav
                            ? 'bg-rose-600 text-white'
                            : 'bg-black/30 hover:bg-black/50 text-white/90'
                        }`}
                        title={isFav ? t.portfolio.removeFromFavorites : t.portfolio.addToFavorites}
                        aria-label={isFav ? t.portfolio.removeFromFavorites : t.portfolio.addToFavorites}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShare(project, e)}
                        className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white/90 backdrop-blur-md transition-all"
                        title={t.portfolio.share}
                        aria-label={t.portfolio.share}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight relative z-10 drop-shadow-sm truncate">
                    {project.titulo}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.descricaoCurta}
                  </p>

                  {/* Target Segment */}
                  <div className="text-[11px] text-cyan-300 font-medium bg-cyan-950/30 border border-cyan-900/40 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{t.portfolio.idealFor} {project.segmentoAlvo}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons com Área de Toque Confortável */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveDemo(project)}
                      className="min-h-[44px] flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all active:scale-[0.98]"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>{t.portfolio.detailsBtn}</span>
                    </button>

                    <a
                      href={project.linkDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 transition-all flex items-center justify-center active:scale-[0.98]"
                      title={t.portfolio.openDirect}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Demonstration Modal */}
      {activeDemo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDemo(null);
          }}
        >
          <div
            className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-white truncate">
                    {activeDemo.titulo}
                  </h2>
                  <p className="text-[11px] text-slate-400 truncate">
                    {t.portfolio.modalSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(activeDemo.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.includes(activeDemo.id)
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={favorites.includes(activeDemo.id) ? t.portfolio.removeFromFavorites : t.portfolio.addToFavorites}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(activeDemo.id) ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(activeDemo)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title={t.portfolio.share}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDemo(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label={t.portfolio.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Simulated Device Preview Screen */}
              <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                {/* Browser bar */}
                <div className="bg-slate-800/90 px-3 py-2 border-b border-slate-700/80 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 bg-slate-900 rounded-md px-2 py-0.5 text-[10px] text-slate-400 font-mono text-center truncate">
                    {activeDemo.linkDemo}
                  </div>
                </div>

                {/* Simulated Web Page Content */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${activeDemo.corDestaque} text-white`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                      Preview
                    </span>
                    <h4 className="text-lg font-extrabold mt-0.5">
                      {activeDemo.titulo}
                    </h4>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                      {activeDemo.descricaoCompleta}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      {t.portfolio.modalIncluded}
                    </span>
                    {activeDemo.recursos.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={activeDemo.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40 transition-all text-center active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.portfolio.openInBrowser}</span>
                </a>

                {onSelectProjectForBriefing && (
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeDemo.titulo;
                      setActiveDemo(null);
                      onSelectProjectForBriefing(title);
                    }}
                    className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-950 active:scale-[0.98]"
                  >
                    <span>{t.portfolio.wantThisModel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveDemo(null)}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors text-center"
                >
                  {t.portfolio.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
