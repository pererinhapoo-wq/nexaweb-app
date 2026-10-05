import React, { useState } from 'react';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import {
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  Eye,
} from 'lucide-react';

export const PortfolioScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeDemo, setActiveDemo] = useState<PortfolioProject | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const filteredProjects =
    selectedCategory === 'todos'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.categoria === selectedCategory);

  const handleCopyDemoLink = async (project: PortfolioProject) => {
    const textToCopy = `Confira esse modelo de demonstração desenvolvido pela NexaWeb para ${project.segmentoAlvo}: ${project.titulo} (${project.linkDemo || 'https://nexaweb.digital'})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Portfólio & Demonstrações
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            NexaWeb
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Modelos de alta conversão prontos para apresentar aos leads durante a abordagem.
        </p>
      </div>

      {/* Horizontal Category Filter */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-1.5">
        {PORTFOLIO_CATEGORIES.map((cat) => {
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
                  {PORTFOLIO_CATEGORIES.find((c) => c.id === project.categoria)?.nome || project.categoria}
                </span>
                <span className="text-[11px] text-white/80 font-medium">
                  NexaWeb Demo
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight relative z-10 drop-shadow-sm">
                {project.titulo}
              </h3>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.descricaoCurta}
              </p>

              {/* Target Segment */}
              <div className="text-[11px] text-indigo-300 font-medium bg-indigo-950/30 border border-indigo-900/40 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Foco: {project.segmentoAlvo}</span>
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
                  onClick={() => setActiveDemo(project)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Abrir Demonstração</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Demonstration Modal */}
      {activeDemo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">
                    Demonstração Interativa
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Apresentação para prospecção de clientes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDemo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 bg-slate-900 rounded-md px-2 py-0.5 text-[10px] text-slate-400 font-mono text-center truncate">
                    {activeDemo.linkDemo || 'nexaweb.digital/demo'}
                  </div>
                </div>

                {/* Simulated Web Page Content */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${activeDemo.corDestaque} text-white`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                      Preview ao Vivo
                    </span>
                    <h4 className="text-lg font-extrabold mt-0.5">
                      {activeDemo.titulo}
                    </h4>
                    <p className="text-xs opacity-90 mt-1">
                      {activeDemo.descricaoCompleta}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      Principais Recursos Inclusos:
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

              {/* Client pitch helper */}
              <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3.5 space-y-1.5">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Dica de Abordagem para este nicho
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mostre esta demonstração quando o lead tiver dúvidas sobre como será a velocidade, a elegância ou o funcionamento do WhatsApp direto.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleCopyDemoLink(activeDemo)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs border transition-all ${
                    linkCopied
                      ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                  }`}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link e Apresentação Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Apresentação da Demo para Enviar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveDemo(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors text-center"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
