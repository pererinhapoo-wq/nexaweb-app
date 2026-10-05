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
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface PortfolioScreenProps {
  onSelectProjectForBriefing?: (projectTitle: string) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectProjectForBriefing
}) => {
  const { language, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeDemo, setActiveDemo] = useState<PortfolioProject | null>(null);

  const categories = getPortfolioCategories(language);
  const projects = getPortfolioProjects(language);

  // Trava de scroll no corpo da página quando o modal estiver aberto
  useEffect(() => {
    if (activeDemo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Suporte para o botão voltar do Android fechar o modal
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

  const filteredProjects =
    selectedCategory === 'todos'
      ? projects
      : projects.filter((p) => p.categoria === selectedCategory);

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
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

      {/* Horizontal Category Filter */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-1.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-150 shadow-sm"
          >
            {/* Visual Header Banner */}
            <div
              className={`h-24 bg-gradient-to-r ${project.corDestaque} p-4 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                  {categories.find((c) => c.id === project.categoria)?.nome || project.categoria}
                </span>
                <span className="text-[11px] text-white/90 font-medium">
                  NexaWeb
                </span>
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
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Open Demonstration Button */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDemo(project)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>{t.portfolio.detailsBtn}</span>
                </button>

                <a
                  href={project.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700 transition-colors flex items-center justify-center"
                  title={t.portfolio.openDirect}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
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
            className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
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
              <button
                type="button"
                onClick={() => setActiveDemo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                aria-label={t.portfolio.close}
              >
                <X className="w-5 h-5" />
              </button>
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
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40 transition-all text-center"
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
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-950"
                  >
                    <span>{t.portfolio.wantThisModel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveDemo(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors text-center"
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
